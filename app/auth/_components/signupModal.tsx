"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import { AnimatedButton } from "@/components/button/animatedButton";
import { AnimatedLink } from "@/components/text/animatedLink";
import { AnimatedTextField } from "@/components/text/animatedTextField";
import { AnimatedCard } from "@/components/utils/animatedCard";
import { AnimatedSeparator } from "@/components/utils/animatedSeparator";
import { AuthHeader, AuthLogo } from "@/components/utils/authUI";
import { AnimatedSelect } from "@/components/utils/animatedSelect";

import { useRouter } from 'next/navigation'

export default function RegisterPage() {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [gender, setGender] = useState("");

    const genderOptions = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Non-binary", value: "non-binary" },
        { label: "Prefer not to say", value: "private" },
    ];

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock validation logic
        setTimeout(() => {
            setErrors({
                email: "This email is already registered",
                password: "Password is too weak"
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            {/* Background Decor*/}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
            </div>

            <AnimatedCard maxWidth="500px" padding="lg">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
                    <p className="text-muted-foreground mt-2">Join our academic community today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Full Name */}
                    <AnimatedTextField
                        label="Full Name"
                        placeholder="Boonyapa Kuttikay"
                        error={errors.fullName}
                        onChange={() => setErrors({ ...errors, fullName: "" })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        {/* Age */}
                        <AnimatedTextField
                            label="Age"
                            type="number"
                            placeholder="21"
                            error={errors.age}
                        />
                        {/* Gender - Using text for simplicity, or "list" for suggestions */}
                        <AnimatedSelect
                            label="Gender"
                            placeholder="Select"
                            options={genderOptions}
                            value={gender}
                            onChange={setGender}
                            sizeConfig="md"
                            error={errors.gender}
                        />
                    </div>

                    {/* Email */}
                    <AnimatedTextField
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        error={errors.email}
                        onChange={() => setErrors({ ...errors, email: "" })}
                    />

                    {/* Password */}
                    <AnimatedTextField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password}
                        onChange={() => setErrors({ ...errors, password: "" })}
                    />

                    <div className="pt-2">
                        <AnimatedButton
                            label="Create Account"
                            className="w-full"
                            isLoading={isLoading}
                            icon={<ChevronRight size={18} />}
                        />
                    </div>
                </form>

                <AnimatedSeparator text="or register with" />

                <div className="grid grid-cols-2 gap-3">
                    <AnimatedButton variant="outline" label="Google" sizeConfig="sm" />
                    <AnimatedButton variant="outline" label="Microsoft" sizeConfig="sm" />
                </div>

                {/* Footer Link */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    <AnimatedLink
                        prefixText="Already have an account?"
                        text="Sign in here"
                        align="center"
                        onClick={() => {
                            // redirect to login page logic here
                            router.push("/auth/login");
                        }}
                    />
                </div>
            </AnimatedCard>
        </div>
    );
}