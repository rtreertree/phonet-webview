"use client";

import React, { useState, useEffect } from "react";

type FieldSize = "sm" | "md" | "lg";

interface AnimatedTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    sizeConfig?: FieldSize;
    error?: string;
}

export const AnimatedTextField = ({
    label,
    id,
    sizeConfig = "md",
    error,
    className = "",
    ...props
}: AnimatedTextFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    // Trigger shake animation whenever a new error message arrives
    useEffect(() => {
        if (error) {
            setShouldShake(true);
            const timer = setTimeout(() => setShouldShake(false), 400);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const scales = {
        sm: { container: "px-3 py-2 rounded-xl", label: "text-[9px]", input: "text-sm", error: "text-[10px] mt-1" },
        md: { container: "px-4 py-3 rounded-2xl", label: "text-[10px]", input: "text-[15px]", error: "text-[11px] mt-1.5" },
        lg: { container: "px-5 py-4 rounded-[20px]", label: "text-xs", input: "text-lg", error: "text-sm mt-2" },
    };

    const currentScale = scales[sizeConfig];

    return (
        <div className={`group flex flex-col w-full ${className}`}>
            <div
                className={`
                    relative flex flex-col border transition-all duration-300 ease-out
                    ${currentScale.container}
                    ${shouldShake ? "animate-field-error" : ""}
                    ${error 
                        ? "border-red-500 bg-red-500/5 ring-4 ring-red-500/10" 
                        : isFocused
                            ? "border-primary bg-background/80 ring-4 ring-primary/10 -translate-y-1 shadow-lg"
                            : "border-input bg-background/50 hover:border-primary/40"
                    }
                `}
            >
                {/* The Label */}
                <label
                    htmlFor={id}
                    className={`
                        font-bold uppercase tracking-[0.15em] transition-all duration-300
                        ${currentScale.label}
                        ${error ? "text-red-500" : isFocused ? "text-primary" : "text-muted-foreground/50"}
                    `}
                >
                    {label}
                </label>

                {/* The Input */}
                <input
                    {...props}
                    id={id}
                    onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                    className={`
                        w-full bg-transparent font-medium text-foreground outline-none 
                        placeholder:text-muted-foreground/30 transition-all duration-300
                        ${currentScale.input}
                        ${error ? "text-red-600" : ""}
                        mt-1
                    `}
                />

                {/* Animated Bottom Bar (Stays red if error exists) */}
                <div
                    className={`
                        absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-all duration-700
                        ${error ? "bg-red-500 w-[60%] opacity-100" : "bg-primary w-0 opacity-0"}
                        ${isFocused && !error ? "w-1/3 opacity-100" : ""}
                    `}
                />
            </div>

            {/* Error Message with Slide + Fade */}
            <div className="relative overflow-hidden">
                <p className={`
                    font-semibold text-red-500 transition-all duration-500 ease-out
                    flex items-center gap-1
                    ${currentScale.error}
                    ${error ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 h-0"}
                `}>
                    {error && (
                        <>
                           <span className="inline-block w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                           {error}
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};