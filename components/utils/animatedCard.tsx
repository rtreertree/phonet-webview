"use client";

import React from "react";

type CardPadding = "none" | "sm" | "md" | "lg";

export type InfoItem = Record<string, string>;

interface AnimatedCardProps {
    title?: React.ReactNode;
    items?: InfoItem[];
    children?: React.ReactNode;
    padding?: CardPadding;
    maxWidth?: string;
    className?: string;
    /** CSS animation-delay string, e.g. "0.2s" */
    delay?: string;
}

const paddingMap: Record<CardPadding, string> = {
    none: "p-0",
    sm: "p-4",
    md: "p-8",
    lg: "p-10",
};

/**
 * Item type → Tailwind classes built exclusively from CSS variable-backed tokens.
 * All color values come from --color-* tokens defined in global.css; no raw
 * Tailwind color names (red-*, blue-*, etc.) are used here.
 */
const itemTypeStyles: Record<string, { container: string; dot: string; dotStyle: React.CSSProperties }> = {
    error: {
        container: "border",
        dot: "rounded-full h-2 w-2",
        dotStyle: {
            backgroundColor: "var(--color-danger)",
            boxShadow: "0 0 8px var(--color-danger-glow)",
        },
    },
    info: {
        container: "border",
        dot: "rounded-full h-2 w-2",
        dotStyle: {
            backgroundColor: "var(--color-info)",
            boxShadow: "0 0 8px var(--color-info-glow)",
        },
    },
    success: {
        container: "border",
        dot: "rounded-full h-2 w-2",
        dotStyle: {
            backgroundColor: "var(--color-success)",
            boxShadow: "0 0 8px var(--color-success-glow)",
        },
    },
    default: {
        container: "border",
        dot: "rounded-full h-2 w-2",
        dotStyle: {
            backgroundColor: "var(--color-neutral-foreground)",
        },
    },
};

const itemContainerStyle: Record<string, React.CSSProperties> = {
    error:   { backgroundColor: "var(--color-danger-subtle)",  borderColor: "var(--color-danger-border)",  color: "var(--color-danger-foreground)"  },
    info:    { backgroundColor: "var(--color-info-subtle)",    borderColor: "var(--color-info-border)",    color: "var(--color-info-foreground)"    },
    success: { backgroundColor: "var(--color-success-subtle)", borderColor: "var(--color-success-border)", color: "var(--color-success-foreground)" },
    default: { backgroundColor: "var(--color-neutral-subtle)", borderColor: "var(--color-neutral-border)", color: "var(--color-neutral-foreground)" },
};

export const AnimatedCard = ({
    title,
    items = [],
    children,
    padding = "md",
    maxWidth = "460px",
    className = "",
    delay = "0s",
}: AnimatedCardProps) => {
    return (
        <div
            style={{ maxWidth, animationDelay: delay }}
            className={`
                animate-float-in relative z-10 w-full
                rounded-[28px] border border-border
                bg-card/80 backdrop-blur-xl shadow-2xl
                transition-all duration-500
                ${paddingMap[padding]}
                ${className}
            `}
        >
            {/* Inner ring overlay — primary-foreground at low opacity adapts to any theme */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-primary-foreground/10" />

            <div className="relative z-10 flex flex-col gap-4">
                {/* 1. Title slot */}
                {title && (
                    <div className="w-full">
                        {title}
                    </div>
                )}

                {/* 2. Dynamic info list */}
                {items.length > 0 && (
                    <div className="flex flex-col gap-2.5 transition-all duration-300">
                        {items.map((item, index) => {
                            const type = Object.keys(item)[0] || "default";
                            const message = item[type];
                            const styleConfig = itemTypeStyles[type] ?? itemTypeStyles.default;
                            const containerStyle = itemContainerStyle[type] ?? itemContainerStyle.default;

                            return (
                                <div
                                    key={`${type}-${message}-${index}`}
                                    style={containerStyle}
                                    className={`
                                        animate-item-reveal
                                        flex items-center gap-3 px-4 py-3
                                        rounded-xl backdrop-blur-md
                                        text-sm font-medium tracking-wide
                                        transition-all duration-300
                                        ${styleConfig.container}
                                    `}
                                >
                                    <span
                                        className={styleConfig.dot}
                                        style={styleConfig.dotStyle}
                                    />
                                    <span className="flex-1">{message}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 3. Arbitrary children */}
                {children && (
                    <div className="w-full flex flex-col gap-2">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};