"use client";

import React, { useState, useEffect } from "react";
import { AnimatedSkeleton } from "@/components/utils/animatedSkeleton";

type FieldSize = "sm" | "md" | "lg";

interface AnimatedTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    sizeConfig?: FieldSize;
    error?: string;
    isLoading?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
}

export const AnimatedTextField = ({
    label,
    id,
    sizeConfig = "md",
    error,
    isLoading = false,
    className = "",
    onChange,
    setValue,
    ...props
}: AnimatedTextFieldProps) => {
    // All hooks must be called before any conditional return (Rules of Hooks)
    const [isFocused, setIsFocused] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        if (error) {
            setShouldShake(true);
            const timer = setTimeout(() => setShouldShake(false), 400);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (isLoading) return <AnimatedSkeleton type="field" sizeConfig={sizeConfig} className={className} />;

    const scales = {
        sm: { container: "px-3 py-2 rounded-xl", label: "text-[9px]", input: "text-sm", error: "mt-1 text-[10px]" },
        md: { container: "px-4 py-3 rounded-2xl", label: "text-[10px]", input: "text-[15px]", error: "mt-1.5 text-[11px]" },
        lg: { container: "px-5 py-4 rounded-[20px]", label: "text-xs", input: "text-lg", error: "mt-2 text-sm" },
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        setValue?.(e.target.value);
    };

    const currentScale = scales[sizeConfig];

    return (
        <div className={`group flex flex-col w-full ${className}`}>
            <div
                style={error ? {
                    borderColor: "var(--color-danger)",
                    backgroundColor: "var(--color-danger-subtle)",
                    boxShadow: "0 0 0 4px var(--color-danger-subtle)",
                } : undefined}
                className={`
                    relative flex flex-col border transition-all duration-300 ease-out
                    ${currentScale.container}
                    ${shouldShake ? "animate-field-error" : ""}
                    ${error
                        ? ""
                        : isFocused
                            ? "border-primary bg-background/80 ring-4 ring-primary/10 -translate-y-1 shadow-lg"
                            : "border-input bg-background/50 hover:border-primary/40"
                    }
                `}
            >
                {/* Label */}
                <label
                    htmlFor={id}
                    style={error ? { color: "var(--color-danger)" } : undefined}
                    className={`
                        font-bold uppercase tracking-[0.15em] transition-all duration-300
                        ${currentScale.label}
                        ${error ? "" : isFocused ? "text-primary" : "text-muted-foreground/50"}
                    `}
                >
                    {label}
                </label>

                {/* Input */}
                <input
                    {...props}
                    id={id}
                    onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                    onChange={handleOnChange}
                    style={error ? { color: "var(--color-danger)" } : undefined}
                    className={`
                        w-full bg-transparent font-medium text-foreground outline-none
                        placeholder:text-muted-foreground/30 transition-all duration-300 mt-1
                        ${currentScale.input}
                        ${error ? "" : ""}
                    `}
                />

                {/* Animated bottom bar */}
                <div
                    style={error ? { backgroundColor: "var(--color-danger)" } : undefined}
                    className={`
                        absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-all duration-700
                        ${error ? "w-[60%] opacity-100" : "bg-primary w-0 opacity-0"}
                        ${isFocused && !error ? "bg-primary w-1/3 opacity-100" : ""}
                    `}
                />
            </div>

            {/* Error message — grid-rows trick for smooth height transition */}
            <div
                className={`
                    grid transition-all duration-300 ease-out
                    ${error ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                `}
            >
                <div className="overflow-hidden">
                    <p
                        style={{ color: "var(--color-danger)" }}
                        className={`font-semibold flex items-center gap-1.5 ${currentScale.error}`}
                    >
                        <span
                            style={{ backgroundColor: "var(--color-danger)" }}
                            className="inline-block w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                        />
                        {error}
                    </p>
                </div>
            </div>
        </div>
    );
};