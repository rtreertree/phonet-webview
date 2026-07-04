"use server";

import { revalidatePath } from "next/cache";

import { auth, isAuthjsEnabled } from "@/auth";
import { db } from "@/lib/db";

export interface AccountSettingsPayload {
    fullName: string;
    birthDate?: string;
    englishLevel?: string;
    gender?: string;
    notificationsEnabled?: boolean;
    themePreference?: string;
}

export async function getAccountSettings() {
    const user = await getCurrentUserForAccount();

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        fullName: user.fullName ?? "",
        birthDate: user.birthDate ? user.birthDate.toISOString().slice(0, 10) : "",
        englishLevel: user.englishLevel?.toString() ?? "",
        gender: user.gender ?? "undisclosed",
        notificationsEnabled: user.enableNotifications,
        themePreference: user.themePreference ?? "system",
        email: user.email,
    };
}

export async function updateAccountSettings(payload: AccountSettingsPayload) {
    const user = await getCurrentUserForAccount();

    if (!user) {
        throw new Error("No authenticated user found for account update.");
    }

    const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
            fullName: payload.fullName,
            birthDate: payload.birthDate ? new Date(payload.birthDate) : undefined,
            englishLevel: payload.englishLevel ? Number(payload.englishLevel) : undefined,
            gender: payload.gender,
            enableNotifications: payload.notificationsEnabled,
            themePreference: payload.themePreference,
        },
    });

    revalidatePath("/account");

    return {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        birthDate: updatedUser.birthDate?.toISOString().slice(0, 10) ?? "",
        englishLevel: updatedUser.englishLevel?.toString() ?? "",
        gender: updatedUser.gender,
        notificationsEnabled: updatedUser.enableNotifications,
        themePreference: updatedUser.themePreference ?? "system",
        email: updatedUser.email,
    };
}

async function getCurrentUserForAccount() {
    const authSession = await auth();
    const sessionUser = authSession?.user as { id?: string; email?: string } | undefined;

    if (isAuthjsEnabled() && sessionUser?.email) {
        return db.user.findUnique({
            where: { email: sessionUser.email },
        });
    }

    const fallbackEmail = process.env.DEV_AUTH_USER_EMAIL;

    if (fallbackEmail) {
        return db.user.findUnique({
            where: { email: fallbackEmail },
        });
    }

    return db.user.findFirst();
}
