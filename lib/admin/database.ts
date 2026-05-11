import { readFile } from "node:fs/promises";
import path from "node:path";

import { db } from "@/lib/db";

const SCALAR_TYPES = new Set([
  "String",
  "Int",
  "BigInt",
  "Float",
  "Decimal",
  "Boolean",
  "DateTime",
  "Json",
  "Bytes",
]);

export type DatabaseField = {
  name: string;
  type: string;
  isList: boolean;
  isRequired: boolean;
  isScalar: boolean;
  isId: boolean;
  isUnique: boolean;
  hasDefault: boolean;
  isUpdatedAt: boolean;
};

export type DatabaseModel = {
  name: string;
  delegateName: string;
  fields: DatabaseField[];
  primaryKey: string[];
  uniqueKeys: string[][];
};

export type SerializedRow = Record<string, string | number | boolean | null>;

export type TableData = {
  rows: SerializedRow[];
  totalCount: number;
  error?: string;
};

function toDelegateName(modelName: string) {
  return modelName.charAt(0).toLowerCase() + modelName.slice(1);
}

function parseFieldList(value: string) {
  const match = value.match(/\[([^\]]+)\]/);

  if (!match) {
    return [];
  }

  return match[1]
    .split(",")
    .map((field) => field.trim().replace(/["']/g, ""))
    .filter(Boolean);
}

function stripLineComment(line: string) {
  const commentStart = line.indexOf("//");
  return commentStart === -1 ? line : line.slice(0, commentStart);
}

export async function getDatabaseModels(): Promise<DatabaseModel[]> {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  const schema = await readFile(schemaPath, "utf8");
  const enumNames = new Set(
    [...schema.matchAll(/enum\s+(\w+)\s*\{/g)].map((match) => match[1]),
  );
  const models: DatabaseModel[] = [];

  for (const match of schema.matchAll(/model\s+(\w+)\s*\{([\s\S]*?)\n\}/g)) {
    const [, modelName, body] = match;
    const fields: DatabaseField[] = [];
    const primaryKey: string[] = [];
    const uniqueKeys: string[][] = [];

    for (const rawLine of body.split("\n")) {
      const line = stripLineComment(rawLine).trim();

      if (!line || line.startsWith("///")) {
        continue;
      }

      if (line.startsWith("@@id")) {
        primaryKey.push(...parseFieldList(line));
        continue;
      }

      if (line.startsWith("@@unique")) {
        const key = parseFieldList(line);
        if (key.length > 0) {
          uniqueKeys.push(key);
        }
        continue;
      }

      if (line.startsWith("@@")) {
        continue;
      }

      const parts = line.split(/\s+/);
      const [name, rawType] = parts;

      if (!name || !rawType) {
        continue;
      }

      const isList = rawType.endsWith("[]");
      const isRequired = !rawType.includes("?") && !isList;
      const type = rawType.replace("[]", "").replace("?", "");
      const attributes = parts.slice(2).join(" ");
      const isId = attributes.includes("@id");
      const isUnique = attributes.includes("@unique");

      if (isId) {
        primaryKey.push(name);
      }

      if (isUnique) {
        uniqueKeys.push([name]);
      }

      fields.push({
        name,
        type,
        isList,
        isRequired,
        isScalar: SCALAR_TYPES.has(type) || enumNames.has(type),
        isId,
        isUnique,
        hasDefault: attributes.includes("@default"),
        isUpdatedAt: attributes.includes("@updatedAt"),
      });
    }

    models.push({
      name: modelName,
      delegateName: toDelegateName(modelName),
      fields,
      primaryKey,
      uniqueKeys,
    });
  }

  return models;
}

export function getScalarFields(model: DatabaseModel) {
  return model.fields.filter((field) => field.isScalar && !field.isList);
}

export function getEditableFields(model: DatabaseModel) {
  return getScalarFields(model).filter(
    (field) => !field.isUpdatedAt,
  );
}

export function getModelKey(model: DatabaseModel) {
  if (model.primaryKey.length > 0) {
    return model.primaryKey;
  }

  return model.uniqueKeys[0] ?? [];
}

export function getModelByName(models: DatabaseModel[], modelName?: string) {
  return (
    models.find((model) => model.name === modelName) ??
    models.find((model) => getModelKey(model).length > 0) ??
    models[0]
  );
}

function getDelegate(model: DatabaseModel) {
  const delegate = (db as unknown as Record<string, unknown>)[model.delegateName];

  if (!delegate || typeof delegate !== "object") {
    throw new Error(`Prisma delegate not found for model "${model.name}".`);
  }

  return delegate as {
    count: () => Promise<number>;
    findMany: (args: unknown) => Promise<Record<string, unknown>[]>;
    update: (args: unknown) => Promise<unknown>;
  };
}

function serializeValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && "toString" in value) {
    const text = value.toString();
    if (text !== "[object Object]") {
      return text;
    }
  }

  return JSON.stringify(value);
}

export function serializeRow(row: Record<string, unknown>, model: DatabaseModel) {
  return Object.fromEntries(
    getScalarFields(model).map((field) => [field.name, serializeValue(row[field.name])]),
  ) as SerializedRow;
}

export function getRowKey(row: SerializedRow, model: DatabaseModel) {
  return Object.fromEntries(
    getModelKey(model).map((fieldName) => [fieldName, row[fieldName]]),
  );
}

export async function getTableData(model: DatabaseModel): Promise<TableData> {
  try {
    const delegate = getDelegate(model);
    const scalarFields = getScalarFields(model);
    const keyFields = getModelKey(model);
    const orderFields = keyFields.length > 0 ? keyFields : scalarFields.slice(0, 1).map((field) => field.name);
    const [rows, totalCount] = await Promise.all([
      delegate.findMany({
        take: 100,
        select: Object.fromEntries(scalarFields.map((field) => [field.name, true])),
        ...(orderFields.length > 0
          ? { orderBy: orderFields.map((fieldName) => ({ [fieldName]: "asc" })) }
          : {}),
      }),
      delegate.count(),
    ]);

    return {
      rows: rows.map((row) => serializeRow(row, model)),
      totalCount,
    };
  } catch (error) {
    return {
      rows: [],
      totalCount: 0,
      error: error instanceof Error ? error.message : "Unable to load table data.",
    };
  }
}

export function parseFieldValue(field: DatabaseField, value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value : "";

  if (text === "" && !field.isRequired) {
    return null;
  }

  if (field.type === "Int") {
    return Number.parseInt(text, 10);
  }

  if (field.type === "BigInt") {
    return BigInt(text);
  }

  if (field.type === "Float" || field.type === "Decimal") {
    return Number.parseFloat(text);
  }

  if (field.type === "Boolean") {
    return text === "true";
  }

  if (field.type === "DateTime") {
    return new Date(text);
  }

  if (field.type === "Json") {
    return text === "" ? null : JSON.parse(text);
  }

  return text;
}

export function buildWhereInput(model: DatabaseModel, rawKey: Record<string, unknown>) {
  const keyFields = getModelKey(model);

  if (keyFields.length === 0) {
    throw new Error(`Model "${model.name}" does not have an id or unique key.`);
  }

  const fieldMap = new Map(model.fields.map((field) => [field.name, field]));
  const keyValues = Object.fromEntries(
    keyFields.map((fieldName) => {
      const field = fieldMap.get(fieldName);

      if (!field) {
        throw new Error(`Key field "${fieldName}" was not found on "${model.name}".`);
      }

      return [fieldName, parseFieldValue(field, String(rawKey[fieldName] ?? ""))];
    }),
  );

  if (keyFields.length === 1) {
    return keyValues;
  }

  return {
    [keyFields.join("_")]: keyValues,
  };
}

export async function updateDatabaseRow(
  model: DatabaseModel,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
) {
  const delegate = getDelegate(model);

  await delegate.update({
    where,
    data,
  });
}
