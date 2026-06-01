"use server";

import { signIn } from "@/auth";

import { loginSchema } from "@/lib/auth/validator";
import { AuthError } from "next-auth";
import * as z from "zod";

export const loginUser = async (values: z.infer<typeof loginSchema>) => {

    const validatedField = loginSchema.safeParse(values);
    if (!validatedField.success) {
        return { "error" : "Invalid field" };
    }

    const { email, password } = validatedField.data;
    try {
        await signIn("credentials", { email, password, redirectTo: "/home" });
        return { success: `Successfully signed in!` };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { "error" : "Invalid credentials!" };
                default:
                    return { "error" : "Something went wrong! 'login.tsx' error" };
            }
        }

        throw error;
    }
};