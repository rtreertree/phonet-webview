"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AnimatedButton } from "@/components/button/animatedButton";
import { AnimatedTextField } from "@/components/text/animatedTextField";
import { AnimatedCard, InfoItem } from "@/components/utils/animatedCard";
import { AnimatedSeparator } from "@/components/utils/animatedSeparator";
import { AnimatedLink } from "@/components/text/animatedLink";
import { AnimatedSelect } from "@/components/utils/animatedSelect";
import { AnimatedDateSelector } from "@/components/utils/animatedDateSelector";
import { useRouter } from 'next/navigation';

import { signupSchema } from "@/lib/auth/validator"; // Adjust path as needed
import { registerUser } from "@/actions/auth/register";

export default function RegisterPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [infoItems, setInfoItems] = useState<InfoItem[]>([]);
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const genderOptions = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Non-binary", value: "non-binary" },
        { label: "Prefer not to say", value: "private" },
    ];

    // 2. Updated Submit Handler
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors({}); // Reset previous errors

        const formData = {
            fullName,
            birthDate,
            gender,
            email,
            password,
        };

        // Validate using safeParse so it doesn't throw a runtime exception
        const result = signupSchema.safeParse(formData);

        if (!result.success) {
            // Flatten errors into a flat key-value pair format { fieldName: message }
            const formattedErrors: { [key: string]: string } = {};

            // Zod exposes validation issues via `error.issues`
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

        // If validation passes, proceed with API submission
        try {
            await registerUser(result.data);
            setInfoItems([{ success: "Registration successful! Redirecting to login..." }]);
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (apiError) {
            setInfoItems([
                { error: "Error occurred while registering" }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
            </div>

            <AnimatedCard maxWidth="500px" padding="lg" items={infoItems}
                title={
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
                        <p className="text-muted-foreground mt-2">Join our academic community today</p>
                    </div>
                }
            >


                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatedTextField
                        label="Full Name"
                        placeholder="Boonyapa Kuttikay"
                        error={errors.fullName}
                        value={fullName}
                        setValue={setFullName}
                        onChange={() => setErrors(prev => ({ ...prev, fullName: "" }))}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <AnimatedDateSelector
                            label="Date of Birth"
                            sizeConfig="md"
                            value={birthDate}
                            setValue={setBirthDate}
                            onChange={() => setErrors(prev => ({ ...prev, birthDate: "" }))}
                            error={errors.birthDate}
                        />
                        <AnimatedSelect
                            label="Gender"
                            placeholder="Select"
                            options={genderOptions}
                            value={gender}
                            onChange={(value) => {
                                setGender(value);
                                setErrors(prev => ({ ...prev, gender: "" }));
                            }}
                            sizeConfig="md"
                            error={errors.gender}
                        />
                    </div>

                    <AnimatedTextField
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        error={errors.email}
                        value={email}
                        setValue={setEmail}
                        onChange={() => setErrors(prev => ({ ...prev, email: "" }))}
                    />

                    <AnimatedTextField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password}
                        value={password}
                        setValue={setPassword}
                        onChange={() => setErrors(prev => ({ ...prev, password: "" }))}
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

                <div className="mt-8 flex flex-col items-center gap-4">
                    <AnimatedLink
                        prefixText="Already have an account?"
                        text="Sign in here"
                        align="center"
                        onClick={() => router.push("/auth/login")}
                    />
                </div>
            </AnimatedCard>
        </div>
    );
}