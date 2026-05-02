"use server";

import { db } from "@/lib/db";

export async function getUsers() {
    const users = await db.user.findMany();

    return users;
}
export async function addUser(name: string) {
    const user = await db.user.create({
        data: {
            name: name,
            email: `${name.toLocaleLowerCase()}@example.com`
        }
    });

    return user;
}