"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { AnimatedSkeleton } from "@/components/utils/animatedSkeleton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToggleSize = "sm" | "md" | "lg";

interface AnimatedToggleProps {
    /** Current on/off state */
    checked: boolean;
    /** Fires with the next state when the user clicks */
    onCheckedChange: (checked: boolean) => void;
    /** Primary label shown on the left side of the row */
    label: string;
    /** Optional secondary description shown below the label */
    description?: string;
    sizeConfig?: ToggleSize;
    isLoading?: boolean;
    /** When true renders a skeleton placeholder instead of the toggle row */
    isSkeleton?: boolean;
    disabled?: boolean;
    className?: string;
}

// ---------------------------------------------------------------------------
// Size tokens
// ---------------------------------------------------------------------------

const ROW_SIZES: Record<ToggleSize, { row: string; label: string; description: string }> = {
    sm: { row: "px-3 py-2 rounded-xl",     label: "text-[9px]",  description: "text-[10px]" },
    md: { row: "px-4 py-3 rounded-2xl",    label: "text-[10px]", description: "text-xs"     },
    lg: { row: "px-5 py-4 rounded-[20px]", label: "text-xs",     description: "text-sm"     },
};

const PILL_SIZES: Record<ToggleSize, { track: string; thumb: string; offset: string; ring: string }> = {
    sm: { track: "w-8  h-[18px]", thumb: "w-3 h-3", offset: "translate-x-[14px]", ring: "focus-visible:ring-2" },
    md: { track: "w-11 h-6",      thumb: "w-4 h-4", offset: "translate-x-5",       ring: "focus-visible:ring-2" },
    lg: { track: "w-14 h-7",      thumb: "w-5 h-5", offset: "translate-x-7",       ring: "focus-visible:ring-2" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AnimatedToggle = ({
    checked,
    onCheckedChange,
    label,
    description,
    sizeConfig = "md",
    isLoading = false,
    isSkeleton = false,
    disabled = false,
    className = "",
}: AnimatedToggleProps) => {
    if (isSkeleton) return (
        <AnimatedSkeleton
            type="toggle"
            sizeConfig={sizeConfig}
            hasDescription={!!description}
            className={className}
        />
    );
    const isInactive = disabled || isLoading;
    const row  = ROW_SIZES[sizeConfig];
    const pill = PILL_SIZES[sizeConfig];

    return (
        /*
         * Outer row — matches the visual language of AnimatedTextField/AnimatedSelect:
         * same border, background, hover border, border-radius from sizeConfig.
         * Clicking anywhere on the row toggles the switch.
         */
        <div
            role="presentation"
            onClick={() => !isInactive && onCheckedChange(!checked)}
            className={`
                group flex items-center justify-between gap-4
                border border-input bg-background/50
                transition-all duration-300 ease-out
                ${row.row}
                ${isInactive
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:border-primary/40"
                }
                ${checked && !isInactive ? "border-primary/30 bg-primary/5" : ""}
                ${className}
            `}
        >
            {/* Left — label + description */}
            <div className="flex flex-col gap-0.5 select-none">
                <span className={`
                    font-bold uppercase tracking-[0.15em] transition-colors duration-300
                    ${row.label}
                    ${checked && !isInactive ? "text-primary" : "text-muted-foreground/50"}
                `}>
                    {label}
                </span>
                {description && (
                    <span className={`text-muted-foreground ${row.description}`}>
                        {description}
                    </span>
                )}
            </div>

            {/* Right — pill switch */}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={isInactive}
                /*
                 * stopPropagation so the pill click doesn't bubble to the row's
                 * onClick and fire onCheckedChange twice.
                 */
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isInactive) onCheckedChange(!checked);
                }}
                className={`
                    relative shrink-0 rounded-full border-2 outline-none
                    transition-colors duration-300 ease-out
                    ${pill.track}
                    ${pill.ring} focus-visible:ring-primary/50 focus-visible:ring-offset-1
                    ${checked
                        ? "bg-primary border-primary"
                        : "bg-muted border-input"
                    }
                    ${isInactive ? "cursor-not-allowed" : "cursor-pointer"}
                `}
            >
                {/* Thumb — slides or shows spinner */}
                <span
                    className={`
                        absolute top-[1px] left-[1px]
                        rounded-full bg-primary-foreground shadow-sm
                        flex items-center justify-center
                        transition-transform duration-300 ease-out
                        ${pill.thumb}
                        ${checked ? pill.offset : "translate-x-0"}
                    `}
                >
                    {/* Loading spinner inside the thumb */}
                    {isLoading && (
                        <Loader2 className="w-[60%] h-[60%] animate-spin text-primary" />
                    )}
                </span>
            </button>
        </div>
    );
};