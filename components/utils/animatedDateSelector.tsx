"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import { AnimatedSkeleton } from "@/components/utils/animatedSkeleton";

type FieldSize = "sm" | "md" | "lg";

interface AnimatedDateSelectorProps {
    label: string;
    value: string; // Controlled value, expected format: "YYYY-MM-DD"
    setValue: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
    onChange?: (val: string) => void; // Optional side-effect handler (e.g. clear errors)
    sizeConfig?: FieldSize;
    error?: string;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

export const AnimatedDateSelector = ({
    label,
    value,
    setValue,
    onChange,
    sizeConfig = "md",
    error,
    disabled = false,
    isLoading = false,
    className = "",
}: AnimatedDateSelectorProps) => {
    // All hooks must be called before any conditional return (Rules of Hooks)
    const [isFocused, setIsFocused] = useState(false);
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);

    const uniqueId = useId();
    const dayInputId = `day-${uniqueId}`;

    // Refs track current sub-values to avoid stale closure comparisons in effects
    const dayRef2 = useRef(day);
    const monthRef2 = useRef(month);
    const yearRef2 = useRef(year);

    useEffect(() => { dayRef2.current = day; }, [day]);
    useEffect(() => { monthRef2.current = month; }, [month]);
    useEffect(() => { yearRef2.current = year; }, [year]);

    useEffect(() => {
        if (!value) {
            setDay("");
            setMonth("");
            setYear("");
            return;
        }
        const parts = value.split("-");
        if (parts.length === 3) {
            const [y, m, d] = parts;
            if (y !== yearRef2.current) setYear(y);
            if (m !== monthRef2.current) setMonth(m);
            if (d !== dayRef2.current) setDay(d);
        }
    }, [value]);

    if (isLoading) return <AnimatedSkeleton type="field" sizeConfig={sizeConfig} className={className} />;

    const updateParent = (newDay: string, newMonth: string, newYear: string) => {
        const finalValue = (!newDay && !newMonth && !newYear)
            ? ""
            : `${newYear}-${newMonth}-${newDay}`;
        setValue(finalValue);
        onChange?.(finalValue);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (val: string) => void,
        currentField: "day" | "month" | "year",
        nextRef?: React.RefObject<HTMLInputElement | null>,
        maxLength?: number
    ) => {
        let val = e.target.value.replace(/\D/g, "");
        if (maxLength && val.length > maxLength) val = val.slice(0, maxLength);

        setter(val);

        const nextDay   = currentField === "day"   ? val : dayRef2.current;
        const nextMonth = currentField === "month" ? val : monthRef2.current;
        const nextYear  = currentField === "year"  ? val : yearRef2.current;
        updateParent(nextDay, nextMonth, nextYear);

        if (nextRef && maxLength && val.length >= maxLength) {
            setTimeout(() => {
                nextRef.current?.focus();
                nextRef.current?.select();
            }, 0);
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        prevRef?: React.RefObject<HTMLInputElement | null>
    ) => {
        if (e.key === "Backspace" && prevRef) {
            const target = e.currentTarget;
            if (target.selectionStart === 0 && target.selectionEnd === 0) {
                e.preventDefault();
                prevRef.current?.focus();
                if (prevRef.current) {
                    const len = prevRef.current.value.length;
                    prevRef.current.setSelectionRange(len, len);
                }
            }
        }
    };

    const handleInputBlur = (
        val: string,
        setter: (val: string) => void,
        currentField: "day" | "month" | "year",
        expectedLength: number,
        maxConstraint?: number
    ) => {
        if (!val) return;
        let numericVal = parseInt(val, 10);
        if (maxConstraint && numericVal > maxConstraint) numericVal = maxConstraint;
        if (numericVal === 0) numericVal = 1;
        const stringVal = numericVal.toString().padStart(expectedLength, "0");
        setter(stringVal);

        const nextDay   = currentField === "day"   ? stringVal : dayRef2.current;
        const nextMonth = currentField === "month" ? stringVal : monthRef2.current;
        const nextYear  = currentField === "year"  ? stringVal : yearRef2.current;
        updateParent(nextDay, nextMonth, nextYear);
    };

    const handleContainerBlur = (e: React.FocusEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsFocused(false);
    };

    const scales = {
        sm: { container: "px-3 py-2 rounded-xl", label: "text-[9px]", text: "text-sm", error: "text-[10px] mt-1" },
        md: { container: "px-4 py-3 rounded-2xl", label: "text-[10px]", text: "text-[15px]", error: "text-[11px] mt-1.5" },
        lg: { container: "px-5 py-4 rounded-[20px]", label: "text-xs", text: "text-lg", error: "text-sm mt-2" },
    };

    const currentScale = scales[sizeConfig];
    const inputClasses = "bg-transparent outline-none text-foreground placeholder:text-muted-foreground/20 font-medium text-center w-full transition-colors caret-primary";

    return (
        <div className={`group flex flex-col w-full ${className}`}>
            <div
                onFocus={() => setIsFocused(true)}
                onBlur={handleContainerBlur}
                style={error ? {
                    borderColor: "var(--color-danger)",
                    backgroundColor: "var(--color-danger-subtle)",
                    boxShadow: "0 0 0 4px var(--color-danger-subtle)",
                } : undefined}
                className={`
                    relative flex flex-col border transition-all duration-300 ease-out
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    ${currentScale.container}
                    ${error
                        ? ""
                        : isFocused
                            ? "border-primary bg-background/80 ring-4 ring-primary/10 -translate-y-1 shadow-lg"
                            : "border-input bg-background/50 hover:border-primary/40"
                    }
                `}
            >
                <label
                    htmlFor={dayInputId}
                    style={error ? { color: "var(--color-danger)" } : undefined}
                    className={`
                        font-bold uppercase tracking-[0.15em] transition-all duration-300 select-none cursor-pointer
                        ${currentScale.label}
                        ${error ? "" : isFocused ? "text-primary" : "text-muted-foreground/50"}
                    `}
                >
                    {label}
                </label>

                <div className={`flex items-center mt-1 space-x-2 ${currentScale.text}`}>
                    <input
                        id={dayInputId}
                        ref={dayRef}
                        type="text"
                        inputMode="numeric"
                        placeholder="DD"
                        value={day}
                        disabled={disabled}
                        onChange={(e) => handleInputChange(e, setDay, "day", monthRef, 2)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        onBlur={() => handleInputBlur(day, setDay, "day", 2, 31)}
                        className={inputClasses}
                        aria-label={`${label} Day`}
                    />
                    <span className="text-muted-foreground/30 font-light select-none" aria-hidden="true">/</span>
                    <input
                        ref={monthRef}
                        type="text"
                        inputMode="numeric"
                        placeholder="MM"
                        value={month}
                        disabled={disabled}
                        onChange={(e) => handleInputChange(e, setMonth, "month", yearRef, 2)}
                        onKeyDown={(e) => handleKeyDown(e, dayRef)}
                        onBlur={() => handleInputBlur(month, setMonth, "month", 2, 12)}
                        className={inputClasses}
                        aria-label={`${label} Month`}
                    />
                    <span className="text-muted-foreground/30 font-light select-none" aria-hidden="true">/</span>
                    <input
                        ref={yearRef}
                        type="text"
                        inputMode="numeric"
                        placeholder="YYYY"
                        value={year}
                        disabled={disabled}
                        onChange={(e) => handleInputChange(e, setYear, "year", undefined, 4)}
                        onKeyDown={(e) => handleKeyDown(e, monthRef)}
                        onBlur={() => handleInputBlur(year, setYear, "year", 4)}
                        className={inputClasses}
                        aria-label={`${label} Year`}
                    />
                </div>

                {/* Bottom highlight bar */}
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
                    <div
                        style={{ color: "var(--color-danger)" }}
                        className={`font-semibold flex items-center gap-1 ${currentScale.error}`}
                    >
                        {error && (
                            <>
                                <span
                                    style={{ backgroundColor: "var(--color-danger)" }}
                                    className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                                />
                                {error}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};