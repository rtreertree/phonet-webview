"use client";

/**
 * AnimatedSkeleton — single unified skeleton component for all UI component types.
 *
 * Usage mirrors the component it replaces:
 *   <AnimatedSkeleton type="field"  sizeConfig="md" />
 *   <AnimatedSkeleton type="button" sizeConfig="sm" variant="outline" />
 *   <AnimatedSkeleton type="toggle" sizeConfig="md" hasDescription />
 *   <AnimatedSkeleton type="select" sizeConfig="lg" />
 *   <AnimatedSkeleton type="link"   />
 *   <AnimatedSkeleton type="card"   width="460px" height="320px" />
 *
 * The shimmer travels left→right on a slight skew, matching the button shimmer
 * aesthetic used throughout the design system.
 */

import React from "react";

// ---------------------------------------------------------------------------
// Shared size tokens — kept in sync with each real component's own size map
// ---------------------------------------------------------------------------

type Size = "sm" | "md" | "lg";

/** Heights that exactly match each real component's rendered height per size */
const FIELD_HEIGHTS: Record<Size, string> = {
    sm: "h-[52px]",   // px-3 py-2  + label text-[9px] + input text-sm
    md: "h-[62px]",   // px-4 py-3  + label text-[10px] + input text-[15px]
    lg: "h-[74px]",   // px-5 py-4  + label text-xs + input text-lg
};

const FIELD_RADIUS: Record<Size, string> = {
    sm: "rounded-xl",
    md: "rounded-2xl",
    lg: "rounded-[20px]",
};

const BUTTON_HEIGHTS: Record<Size, string> = {
    sm: "h-9",
    md: "h-12",
    lg: "h-14",
};

const BUTTON_WIDTHS: Record<Size, string> = {
    sm: "w-24",
    md: "w-32",
    lg: "w-40",
};

const BUTTON_RADIUS: Record<Size, string> = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
};

const TOGGLE_ROW_PADDING: Record<Size, string> = {
    sm: "px-3 py-2 rounded-xl",
    md: "px-4 py-3 rounded-2xl",
    lg: "px-5 py-4 rounded-[20px]",
};

const TOGGLE_PILL: Record<Size, { track: string }> = {
    sm: { track: "w-8 h-[18px]" },
    md: { track: "w-11 h-6"    },
    lg: { track: "w-14 h-7"    },
};

const TOGGLE_LABEL_HEIGHT: Record<Size, string> = {
    sm: "h-2.5",
    md: "h-3",
    lg: "h-3.5",
};

const TOGGLE_DESC_HEIGHT: Record<Size, string> = {
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3",
};

// ---------------------------------------------------------------------------
// Shimmer — a single reusable travelling highlight
// ---------------------------------------------------------------------------

const Shimmer = () => (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
        <div
            className="
                absolute top-0 h-full w-[60%]
                bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent
                skew-x-[-20deg] animate-skeleton-shimmer
            "
        />
    </div>
);

// ---------------------------------------------------------------------------
// Base block — every skeleton shape is this div + Shimmer
// ---------------------------------------------------------------------------

const SkeletonBlock = ({
    className = "",
    style,
    children,
}: {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}) => (
    <div
        style={style}
        className={`
            relative overflow-hidden
            bg-muted border border-border
            ${className}
        `}
    >
        <Shimmer />
        {children}
    </div>
);

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

type SkeletonType = "field" | "button" | "toggle" | "select" | "link" | "card" | "separator";
type ButtonVariant = "primary" | "secondary" | "outline";

interface AnimatedSkeletonProps {
    type: SkeletonType;
    /** Matches sizeConfig on all real components */
    sizeConfig?: Size;
    /** button only — mirrors AnimatedButton's variant prop */
    variant?: ButtonVariant;
    /** toggle only — mirrors AnimatedToggle's description prop being set */
    hasDescription?: boolean;
    /** card / generic — explicit pixel/rem width override */
    width?: string;
    /** card / generic — explicit pixel/rem height override */
    height?: string;
    className?: string;
}

// ---------------------------------------------------------------------------
// Per-type skeleton renderers
// ---------------------------------------------------------------------------

const FieldSkeleton = ({ sizeConfig = "md", className = "" }: { sizeConfig?: Size; className?: string }) => (
    <SkeletonBlock className={`w-full flex flex-col justify-between ${FIELD_HEIGHTS[sizeConfig]} ${FIELD_RADIUS[sizeConfig]} p-3 ${className}`}>
        {/* Label line */}
        <div className="h-2 w-1/4 rounded-full bg-muted-foreground/20" />
        {/* Input line */}
        <div className="h-3 w-2/3 rounded-full bg-muted-foreground/15" />
    </SkeletonBlock>
);

const ButtonSkeleton = ({
    sizeConfig = "md",
    variant = "primary",
    className = "",
}: {
    sizeConfig?: Size;
    variant?: ButtonVariant;
    className?: string;
}) => {
    const variantStyle: React.CSSProperties =
        variant === "primary"
            ? { backgroundColor: "color-mix(in srgb, var(--color-primary) 30%, var(--color-muted))" }
            : {};

    return (
        <SkeletonBlock
            style={variantStyle}
            className={`
                ${BUTTON_HEIGHTS[sizeConfig]} ${BUTTON_WIDTHS[sizeConfig]} ${BUTTON_RADIUS[sizeConfig]}
                flex items-center justify-center
                ${variant === "outline" ? "bg-transparent" : ""}
                ${className}
            `}
        >
            <div className="h-3 w-16 rounded-full bg-muted-foreground/20" />
        </SkeletonBlock>
    );
};

const ToggleSkeleton = ({
    sizeConfig = "md",
    hasDescription = false,
    className = "",
}: {
    sizeConfig?: Size;
    hasDescription?: boolean;
    className?: string;
}) => {
    const pill = TOGGLE_PILL[sizeConfig];

    return (
        <SkeletonBlock className={`w-full flex items-center justify-between gap-4 ${TOGGLE_ROW_PADDING[sizeConfig]} ${className}`}>
            {/* Left side — label + optional description */}
            <div className="flex flex-col gap-1.5">
                <div className={`w-24 rounded-full bg-muted-foreground/20 ${TOGGLE_LABEL_HEIGHT[sizeConfig]}`} />
                {hasDescription && (
                    <div className={`w-36 rounded-full bg-muted-foreground/15 ${TOGGLE_DESC_HEIGHT[sizeConfig]}`} />
                )}
            </div>
            {/* Right side — pill track */}
            <div className={`shrink-0 rounded-full bg-muted-foreground/20 ${pill.track}`} />
        </SkeletonBlock>
    );
};

// Select is visually identical to a field (label + selected value row)
const SelectSkeleton = ({ sizeConfig = "md", className = "" }: { sizeConfig?: Size; className?: string }) => (
    <SkeletonBlock className={`w-full flex flex-col justify-between ${FIELD_HEIGHTS[sizeConfig]} ${FIELD_RADIUS[sizeConfig]} p-3 ${className}`}>
        <div className="h-2 w-1/4 rounded-full bg-muted-foreground/20" />
        <div className="flex items-center justify-between">
            <div className="h-3 w-1/2 rounded-full bg-muted-foreground/15" />
            {/* Chevron stub */}
            <div className="h-3 w-3 rounded bg-muted-foreground/15" />
        </div>
    </SkeletonBlock>
);

const LinkSkeleton = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative overflow-hidden h-3 w-40 rounded-full bg-muted">
            <Shimmer />
        </div>
    </div>
);

const CardSkeleton = ({
    width = "460px",
    height = "320px",
    className = "",
}: {
    width?: string;
    height?: string;
    className?: string;
}) => (
    <SkeletonBlock
        style={{ width, height, maxWidth: "100%" }}
        className={`rounded-[28px] flex flex-col gap-4 p-8 ${className}`}
    >
        {/* Title stub */}
        <div className="h-5 w-1/2 rounded-full bg-muted-foreground/20" />
        {/* Body lines */}
        <div className="flex flex-col gap-3 mt-2">
            <div className="h-3 w-full rounded-full bg-muted-foreground/15" />
            <div className="h-3 w-5/6 rounded-full bg-muted-foreground/15" />
            <div className="h-3 w-4/6 rounded-full bg-muted-foreground/15" />
        </div>
    </SkeletonBlock>
);

const SeparatorSkeleton = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-4 my-6 ${className}`}>
        <div className="relative overflow-hidden h-[1px] flex-1 bg-border rounded-full">
            <Shimmer />
        </div>
        <div className="relative overflow-hidden h-2.5 w-16 rounded-full bg-muted">
            <Shimmer />
        </div>
        <div className="relative overflow-hidden h-[1px] flex-1 bg-border rounded-full">
            <Shimmer />
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export const AnimatedSkeleton = ({
    type,
    sizeConfig = "md",
    variant = "primary",
    hasDescription = false,
    width,
    height,
    className = "",
}: AnimatedSkeletonProps) => {
    switch (type) {
        case "field":
            return <FieldSkeleton sizeConfig={sizeConfig} className={className} />;
        case "button":
            return <ButtonSkeleton sizeConfig={sizeConfig} variant={variant} className={className} />;
        case "toggle":
            return <ToggleSkeleton sizeConfig={sizeConfig} hasDescription={hasDescription} className={className} />;
        case "select":
            return <SelectSkeleton sizeConfig={sizeConfig} className={className} />;
        case "link":
            return <LinkSkeleton className={className} />;
        case "card":
            return <CardSkeleton width={width} height={height} className={className} />;
        case "separator":
            return <SeparatorSkeleton className={className} />;
        default:
            return null;
    }
};