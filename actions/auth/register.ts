"use server";

import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/auth/validator";
import { db } from "@/lib/db";
import * as z from "zod";


export async function registerUser(userData: z.infer<typeof signupSchema>) {

    // Validate the form data using the Zod schema
    const result = signupSchema.safeParse({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        birthDate: userData.birthDate,
        gender: userData.gender,
    });

    if (!result.success) {
        // Handle validation errors (you can throw an error or return a response)
        const errors = result.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
        }));
        console.log("Validation errors:", errors);
        throw new Error("Validation failed");
    }

    const hashedPassword = await hashPassword(userData.password);

    // If validation is successful, create the user in the database
    const user = await db.user.create({
        data: {
            fullName: userData.fullName,
            email: userData.email,
            password: hashedPassword.password,
            birthDate: new Date(userData.birthDate),
            gender: userData.gender,
        },
    });

    return user;
}