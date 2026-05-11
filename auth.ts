import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db"


export const {auth, signIn, signOut, handlers} = NextAuth({
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

                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                if (
                    credentials.email === "test" &&
                    credentials.password === "password"
                ) {
                    return {
                        id: "1",
                        name: "Test User",
                        email: "test@test.com",
                    }
                }

                return null
            },
        }),
    ],
})