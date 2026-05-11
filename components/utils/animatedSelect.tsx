"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type FieldSize = "sm" | "md" | "lg";

interface AnimatedSelectProps {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    sizeConfig?: FieldSize;
    error?: string;
    placeholder?: string;
    className?: string;
}

export const AnimatedSelect = ({
    label,
    options,
    value,
    onChange,
    sizeConfig = "md",
    error,
    placeholder = "Select...",
    className = "",
}: AnimatedSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const scales = {
        sm: { container: "px-3 py-2 rounded-xl", label: "text-[9px]", text: "text-sm", error: "text-[10px] mt-1", menu: "top-[110%]" },
        md: { container: "px-4 py-3 rounded-2xl", label: "text-[10px]", text: "text-[15px]", error: "text-[11px] mt-1.5", menu: "top-[105%]" },
        lg: { container: "px-5 py-4 rounded-[20px]", label: "text-xs", text: "text-lg", error: "text-sm mt-2", menu: "top-[102%]" },
    };

    const currentScale = scales[sizeConfig];
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={containerRef} className={`group flex flex-col w-full relative ${className}`}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative flex flex-col border transition-all duration-300 ease-out cursor-pointer
                    ${currentScale.container}
                    ${error 
                        ? "border-red-500 bg-red-500/5 ring-4 ring-red-500/10 animate-field-error" 
                        : isOpen
                            ? "border-primary bg-background/80 ring-4 ring-primary/10 -translate-y-1 shadow-lg"
                            : "border-input bg-background/50 hover:border-primary/40"
                    }
                `}
            >
                <label className={`
                    font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer
                    ${currentScale.label}
                    ${error ? "text-red-500" : isOpen ? "text-primary" : "text-muted-foreground/50"}
                `}>
                    {label}
                </label>

                <div className={`flex items-center justify-between mt-1 ${currentScale.text}`}>
                    <span className={!selectedOption ? "text-muted-foreground/30" : "text-foreground font-medium"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground/50"}`} />
                </div>

                {/* Bottom Highlight Bar */}
                <div className={`
                    absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-all duration-700
                    ${error ? "bg-red-500 w-[60%] opacity-100" : "bg-primary w-0 opacity-0"}
                    ${isOpen && !error ? "w-1/3 opacity-100" : ""}
                `} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`
                    absolute left-0 z-[100] w-full bg-card/95 border border-border backdrop-blur-xl
                    rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200
                    ${currentScale.menu}
                `}>
                    <div className="max-h-[200px] overflow-y-auto py-2">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    px-5 py-2.5 text-sm transition-colors cursor-pointer
                                    hover:bg-primary/10 hover:text-primary
                                    ${value === option.value ? "bg-primary/5 text-primary font-bold" : "text-foreground/70"}
                                `}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            <div className="relative overflow-hidden">
                <p className={`
                    font-semibold text-red-500 transition-all duration-500 ease-out flex items-center gap-1
                    ${currentScale.error}
                    ${error ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 h-0"}
                `}>
                    {error && <><span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />{error}</>}
                </p>
            </div>
        </div>
    );
};