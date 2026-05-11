"use client"

import { signIn } from "next-auth/react"
import LoginModal from "../_components/loginModal"

export default function LoginPage() {
    async function credentialsAction(formData: FormData) {
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
        })
    }

    return (
        <LoginModal />
    )
}