"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AnimatedButton } from "@/components/button/animatedButton";
import { AnimatedLink } from "@/components/text/animatedLink";
import { AnimatedTextField } from "@/components/text/animatedTextField";
import { AnimatedCard, InfoItem } from "@/components/utils/animatedCard";
import { AnimatedSeparator } from "@/components/utils/animatedSeparator";
import { AuthHeader, AuthLogo } from "@/components/utils/authUI";
import { useRouter } from "next/navigation";

// TODO: Create/adjust these paths to match your login validation and server action
import { loginSchema } from "@/lib/auth/validator"; 
import { loginUser } from "@/actions/auth/login";

export default function LoginPage() {
    const router = useRouter();

    // 1. State Management
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [infoItems, setInfoItems] = useState<InfoItem[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 2. Submit Handler
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors({}); // Reset previous validation errors
        setInfoItems([]); // Clear previous global alert items

        const formData = {
            email,
            password,
        };

        // Validate using Zod's safeParse
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors: { [key: string]: string } = {};

            result.error.issues.forEach((issue) => {
                const key = issue.path?.[0] as string | undefined;
                if (key) {
                    console.log(`Validation error on ${key}: ${issue.message}`);
                    formattedErrors[key] = issue.message;
                }
            });

            setErrors(formattedErrors);
            setIsLoading(false);
            return;
        }

        // If client-side validation passes, proceed with API submission
        try {
            // Replace with your actual authentication logic/session setup
            const response = await loginUser(result.data);
            
            if (response?.error) {
                // If your action returns an expected error object instead of throwing
                setInfoItems([{ error: response.error }]);
            } else {
                setInfoItems([{ success: "Successfully logged in! Redirecting..." }]);
                setTimeout(() => {
                    router.push("/dashboard"); // Adjust landing page path as needed
                }, 1500);
            }
        } catch (apiError) {
            setInfoItems([
                { error: "Invalid credentials or server error occurred." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            {/* Background Decor*/}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
            </div>

            <AnimatedCard 
                maxWidth="440px" 
                padding="lg" 
                items={infoItems}
            >
                <AuthLogo />
                <AuthHeader title="Welcome Back" subtitle="Access your academic preparation dashboard" />

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <AnimatedTextField 
                        label="Email" 
                        type="email" 
                        sizeConfig="md"
                        value={email}
                        setValue={setEmail}
                        error={errors.email}
                        onChange={() => setErrors(prev => ({ ...prev, email: "" }))}
                        placeholder="name@example.com"
                    />
                    
                    <div className="space-y-1">
                        <AnimatedTextField 
                            label="Password" 
                            type="password" 
                            sizeConfig="md"
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                            onChange={() => setErrors(prev => ({ ...prev, password: "" }))}
                            placeholder="••••••••"
                        />
                        <AnimatedLink 
                            className="text-sm text-primary hover:underline" 
                            text="Forgot your password?" 
                            align="right" 
                            disableAnimation={true} 
                            onClick={() => router.push("/auth/forgot-password")}
                        />
                    </div>

                    <div className="pt-2">
                        <AnimatedButton 
                            label="Sign In" 
                            className="w-full" 
                            isLoading={isLoading}
                            icon={<ChevronRight size={18} />}
                        />
                    </div>
                </form>

                <AnimatedSeparator text="or" />

                <div className="grid grid-cols-2 gap-4">
                    <AnimatedButton variant="outline" label="Google" />
                    <AnimatedButton variant="outline" label="Apple" />
                </div>

                <AnimatedLink
                    prefixText="Don't have an account?"
                    text="Start your journey"
                    align="center"
                    className="mt-8"
                    onClick={() => {
                        router.push("/auth/signup");
                    }}
                />
            </AnimatedCard>
        </div>
    );
}