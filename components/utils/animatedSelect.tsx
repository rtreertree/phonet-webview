"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ChevronDown } from "lucide-react";
import { AnimatedSkeleton } from "@/components/utils/animatedSkeleton";

type FieldSize = "sm" | "md" | "lg";

interface AnimatedSelectProps {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    sizeConfig?: FieldSize;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

interface DropdownRect {
    top: number;
    left: number;
    width: number;
}

export const AnimatedSelect = ({
    label,
    options,
    value,
    onChange,
    sizeConfig = "md",
    error,
    placeholder = "Select...",
    disabled = false,
    isLoading = false,
    className = "",
}: AnimatedSelectProps) => {
    // All hooks must be called before any conditional return (Rules of Hooks)
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownRect, setDropdownRect] = useState<DropdownRect | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const updateRect = () => {
        if (!triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        setDropdownRect({
            top: r.bottom + 8,
            left: r.left,
            width: r.width,
        });
    };

    const handleTriggerClick = () => {
        if (disabled) return;
        if (isOpen) {
            setIsOpen(false);
            return;
        }
        updateRect();
        setIsOpen(true);
    };

    // Reposition the portal on scroll/resize while open
    useEffect(() => {
        if (!isOpen) return;
        window.addEventListener("scroll", updateRect, true);
        window.addEventListener("resize", updateRect);
        return () => {
            window.removeEventListener("scroll", updateRect, true);
            window.removeEventListener("resize", updateRect);
        };
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (!triggerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    if (isLoading) return <AnimatedSkeleton type="select" sizeConfig={sizeConfig} className={className} />;

    const scales = {
        sm: { container: "px-3 py-2 rounded-xl", label: "text-[9px]", text: "text-sm", error: "text-[10px] mt-1" },
        md: { container: "px-4 py-3 rounded-2xl", label: "text-[10px]", text: "text-[15px]", error: "text-[11px] mt-1.5" },
        lg: { container: "px-5 py-4 rounded-[20px]", label: "text-xs", text: "text-lg", error: "text-sm mt-2" },
    };

    const currentScale = scales[sizeConfig];
    const selectedOption = options.find((opt) => opt.value === value);

    // Portal dropdown — position:fixed so it's never clipped by ancestor overflow
    const dropdownPortal =
        isOpen && dropdownRect
            ? ReactDOM.createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: "fixed",
                        top: dropdownRect.top,
                        left: dropdownRect.left,
                        width: dropdownRect.width,
                        zIndex: 9999,
                    }}
                    className="animate-dropdown-open bg-card border border-border backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="max-h-[200px] overflow-y-auto content-scroll py-2">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                // mousedown before outside-click handler so selection lands before close
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    px-5 py-2.5 text-sm transition-colors cursor-pointer
                                    hover:bg-primary/10 hover:text-primary
                                    ${value === option.value
                                        ? "bg-primary/5 text-primary font-bold"
                                        : "text-foreground/70"
                                    }
                                `}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )
            : null;

    return (
        <div className={`group flex flex-col w-full ${className}`}>
            {/* Trigger */}
            <div
                ref={triggerRef}
                onClick={handleTriggerClick}
                style={error ? {
                    borderColor: "var(--color-danger)",
                    backgroundColor: "var(--color-danger-subtle)",
                    boxShadow: "0 0 0 4px var(--color-danger-subtle)",
                } : undefined}
                className={`
                    relative flex flex-col border transition-all duration-300 ease-out
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${currentScale.container}
                    ${error
                        ? "animate-field-error"
                        : isOpen
                            ? "border-primary bg-background/80 ring-4 ring-primary/10 -translate-y-1 shadow-lg"
                            : "border-input bg-background/50 hover:border-primary/40"
                    }
                `}
            >
                <label
                    style={error ? { color: "var(--color-danger)" } : undefined}
                    className={`
                        font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer
                        ${currentScale.label}
                        ${error ? "" : isOpen ? "text-primary" : "text-muted-foreground/50"}
                    `}
                >
                    {label}
                </label>

                <div className={`flex items-center justify-between mt-1 ${currentScale.text}`}>
                    <span className={!selectedOption ? "text-muted-foreground/30" : "text-foreground font-medium"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground/50"}`} />
                </div>

                {/* Bottom highlight bar */}
                <div
                    style={error ? { backgroundColor: "var(--color-danger)" } : undefined}
                    className={`
                        absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-all duration-700
                        ${error ? "w-[60%] opacity-100" : "bg-primary w-0 opacity-0"}
                        ${isOpen && !error ? "bg-primary w-1/3 opacity-100" : ""}
                    `}
                />
            </div>

            {/* Portal dropdown */}
            {dropdownPortal}

            {/* Error message — grid-rows trick matches AnimatedTextField behaviour */}
            <div
                className={`
                    grid transition-all duration-300 ease-out
                    ${error ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                `}
            >
                <div className="overflow-hidden">
                    <p
                        style={{ color: "var(--color-danger)" }}
                        className={`font-semibold flex items-center gap-1 ${currentScale.error}`}
                    >
                        {error && (
                            <>
                                <span
                                    style={{ backgroundColor: "var(--color-danger)" }}
                                    className="w-1 h-1 rounded-full animate-pulse shrink-0"
                                />
                                {error}
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};