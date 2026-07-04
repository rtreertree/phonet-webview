import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db"
import { getUserFromDB } from "@/lib/auth/user"
import { verifyPassword } from "@/lib/auth/password"

const isDevelopment = process.env.NODE_ENV !== "production";

export const isAuthjsEnabled = () => process.env.AUTHJS_ENABLED === "true" || isDevelopment;

export const { auth, signIn, signOut, handlers } = NextAuth({
    trustHost: true,
    secret: process.env.AUTH_SECRET || "dev-secret-change-me",
    adapter: PrismaAdapter(db),
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                console.log(credentials)
                const user = await getUserFromDB(credentials?.email as string);
                if (!user) return null;
                const isValid = user && await verifyPassword(credentials?.password as string, user.password);
                if (!isValid) return null;
                return user
            },
        }),
    ],
})