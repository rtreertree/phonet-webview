"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { AnimatedCard } from "@/components/utils/animatedCard";
import { AnimatedTextField } from "@/components/text/animatedTextField";
import { AnimatedSelect } from "@/components/utils/animatedSelect";
import { AnimatedButton } from "@/components/button/animatedButton";
import { AnimatedLink } from "@/components/text/animatedLink";
import { AnimatedSeparator } from "@/components/utils/animatedSeparator";
import { AnimatedSkeleton } from "@/components/utils/animatedSkeleton";
import { AnimatedDateSelector } from "@/components/utils/animatedDateSelector";
import { AnimatedToggle } from "@/components/button/animatedToggle";
import { getAccountSettings, updateAccountSettings } from "@/actions/auth/account";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SettingsState {
    username: string;
    setUsername: (v: string) => void;
    birthDate: string;
    setBirthDate: React.Dispatch<React.SetStateAction<string>>;
    englishLevel: string;
    setEnglishLevel: (v: string) => void;
    gender: string;
    setGender: (v: string) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (v: boolean) => void;
    theme: string;
    setTheme: (v: string) => void;
    currentPassword: string;
    setCurrentPassword: (v: string) => void;
    newPassword: string;
    setNewPassword: (v: string) => void;
}

interface PageProps {
    state: SettingsState;
    isLoading: boolean;
    isSaving: boolean;
}

// ---------------------------------------------------------------------------
// Server-backed account helpers
// ---------------------------------------------------------------------------

const fetchAccountData = async (): Promise<Omit<SettingsState,
    | "setUsername" | "setBirthDate" | "setEnglishLevel"
    | "setGender" | "setNotificationsEnabled" | "setTheme"
    | "setCurrentPassword" | "setNewPassword"
>> => {
    const data = await getAccountSettings();

    if (!data) {
        return {
            username: "",
            birthDate: "",
            englishLevel: "",
            gender: "undisclosed",
            notificationsEnabled: true,
            theme: "system",
            currentPassword: "",
            newPassword: "",
        };
    }

    return {
        username: data.fullName,
        birthDate: data.birthDate,
        englishLevel: data.englishLevel,
        gender: data.gender,
        notificationsEnabled: data.notificationsEnabled,
        theme: data.themePreference,
        currentPassword: "",
        newPassword: "",
    };
};

const saveAccountData = async (data: ReturnType<typeof buildPayload>) => {
    await updateAccountSettings({
        fullName: data.username,
        birthDate: data.birthDate,
        englishLevel: data.englishLevel,
        gender: data.gender,
        notificationsEnabled: data.notificationsEnabled,
        themePreference: data.theme,
    });
};

const buildPayload = (state: SettingsState) => ({
    username: state.username,
    birthDate: state.birthDate,
    englishLevel: state.englishLevel,
    gender: state.gender,
    notificationsEnabled: state.notificationsEnabled,
    theme: state.theme,
    currentPassword: state.currentPassword,
    newPassword: state.newPassword,
});

// ---------------------------------------------------------------------------
// Page components — proper React components (PascalCase) so React correctly
// tracks their fiber tree even when isLoading causes conditional rendering
// inside them (early-return skeleton swap in AnimatedTextField et al.).
//
// Using plain render functions (content: () => JSX) caused React's
// "Expected static flag was missing" error because React saw what looked like
// a component changing its element type between renders.
// ---------------------------------------------------------------------------

const ProfilePage = ({ state, isLoading, isSaving }: PageProps) => (
    <div className="flex flex-col gap-5 p-1 pb-2">
        <AnimatedTextField
            label="Username"
            value={state.username}
            onChange={(e) => state.setUsername(e.target.value)}
            disabled={isSaving}
            isLoading={isLoading}
        />
        <AnimatedDateSelector
            label="Date of Birth"
            value={state.birthDate}
            setValue={state.setBirthDate}
            disabled={isSaving}
            isLoading={isLoading}
        />
        {isLoading ? (
            <AnimatedSkeleton type="field" sizeConfig="md" className="w-full" />
        ) : (
            <div className="flex flex-col w-full">
                <label className="font-bold uppercase tracking-[0.15em] text-[10px] text-muted-foreground/50">
                    English Level (A1–C2)
                </label>
                <div className="mt-1 px-4 py-3 rounded-2xl border border-input bg-background/50 text-foreground font-medium">
                    B2 — Upper Intermediate
                </div>
            </div>
        )}
        <AnimatedSelect
            label="Gender"
            value={state.gender}
            onChange={state.setGender}
            disabled={isSaving}
            isLoading={isLoading}
            options={[
                { label: "Male",              value: "male"        },
                { label: "Female",            value: "female"      },
                { label: "Non-binary",        value: "non-binary"  },
                { label: "Prefer not to say", value: "undisclosed" },
            ]}
        />
        <AnimatedToggle
            label="Enable Notifications"
            description="Receive updates, reminders, and alerts"
            checked={state.notificationsEnabled}
            onCheckedChange={state.setNotificationsEnabled}
            sizeConfig="md"
            disabled={isSaving}
            isSkeleton={isLoading}
        />
    </div>
);

const PreferencesPage = ({ state, isLoading, isSaving }: PageProps) => (
    <div className="flex flex-col gap-5 p-1 pb-2">
        <AnimatedSelect
            label="Theme Preference"
            value={state.theme}
            onChange={state.setTheme}
            disabled={isSaving}
            isLoading={isLoading}
            options={[
                { label: "Light Mode",     value: "light"  },
                { label: "Dark Mode",      value: "dark"   },
                { label: "System Default", value: "system" },
            ]}
        />
    </div>
);

const SecurityPage = ({ state, isLoading, isSaving }: PageProps) => (
    <div className="flex flex-col gap-5 p-1 pb-2">
        <AnimatedTextField
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={state.currentPassword}
            onChange={(e) => state.setCurrentPassword(e.target.value)}
            disabled={isSaving}
            isLoading={isLoading}
        />
        <AnimatedTextField
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={state.newPassword}
            onChange={(e) => state.setNewPassword(e.target.value)}
            disabled={isSaving}
            isLoading={isLoading}
        />
        <div className="pt-1">
            <AnimatedLink
                text="Enable Two-Factor Authentication (2FA)"
                onClick={() => alert("Setup 2FA link clicked!")}
                weight="medium"
                disableAnimation={isSaving}
                isLoading={isLoading}
            />
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Page registry — add entries here to extend the modal, no other changes needed
// ---------------------------------------------------------------------------

const SETTINGS_PAGES = [
    { key: "profile",     label: "My Profile",  Page: ProfilePage     },
    { key: "preferences", label: "Preferences", Page: PreferencesPage },
    { key: "security",    label: "Security",    Page: SecurityPage     },
] as const;

type PageKey = typeof SETTINGS_PAGES[number]["key"];

// ---------------------------------------------------------------------------
// State hook
// ---------------------------------------------------------------------------

const useSettingsState = (): SettingsState => {
    const [username, setUsername] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [englishLevel, setEnglishLevel] = useState("");
    const [gender, setGender] = useState("");
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [theme, setTheme] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    return {
        username, setUsername,
        birthDate, setBirthDate,
        englishLevel, setEnglishLevel,
        gender, setGender,
        notificationsEnabled, setNotificationsEnabled,
        theme, setTheme,
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
    };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
    const [activeKey, setActiveKey] = useState<PageKey>(SETTINGS_PAGES[0].key);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const state = useSettingsState();

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchAccountData();
            state.setUsername(data.username);
            state.setBirthDate(data.birthDate);
            state.setEnglishLevel(data.englishLevel);
            state.setGender(data.gender);
            state.setNotificationsEnabled(data.notificationsEnabled);
            state.setTheme(data.theme);
            state.setCurrentPassword(data.currentPassword);
            state.setNewPassword(data.newPassword);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setActiveKey(SETTINGS_PAGES[0].key);
            loadData();
        }
    }, [isOpen]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveAccountData(buildPayload(state));
            onClose();
        } catch (error) {
            console.error("Failed to save account settings", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const { Page } = SETTINGS_PAGES.find((p) => p.key === activeKey) ?? SETTINGS_PAGES[0];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-md p-4"
            onClick={!isSaving ? onClose : undefined}
        >
            <div
                className="w-full"
                style={{ maxWidth: "680px" }}
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatedCard padding="none" maxWidth="680px" className="w-full">
                    <div className="flex flex-col h-[520px] p-8">

                        {/* Title */}
                        <div className="flex items-center justify-between pb-2 w-full shrink-0">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Account Settings
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Manage your profile info and options
                                </p>
                            </div>
                            <button
                                onClick={!isSaving ? onClose : undefined}
                                disabled={isSaving}
                                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col md:flex-row gap-6 mt-4 flex-1 min-h-0">

                            {/* Sidebar nav */}
                            <nav className="flex md:flex-col gap-1 w-full md:w-1/4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0">
                                {SETTINGS_PAGES.map(({ key, label }) => {
                                    const isActive = key === activeKey;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => !isSaving && !isLoading && setActiveKey(key)}
                                            disabled={isSaving || isLoading}
                                            className={`
                                                relative px-4 py-2.5 rounded-xl text-sm text-left whitespace-nowrap
                                                transition-colors duration-200 disabled:cursor-not-allowed
                                                ${isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                                }
                                                ${(isSaving || isLoading) && !isActive ? "opacity-50" : ""}
                                            `}
                                        >
                                            <span className={`transition-opacity duration-150 font-medium ${isActive ? "opacity-0" : "opacity-100"}`}>
                                                {label}
                                            </span>
                                            <span className={`absolute inset-0 flex items-center px-4 transition-opacity duration-150 font-semibold ${isActive ? "opacity-100" : "opacity-0"}`}>
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Right column */}
                            <div className="flex-1 flex flex-col min-w-0 min-h-0">

                                {/* Scrollable content */}
                                <div className="content-scroll flex-1 min-h-0 overflow-y-auto pr-1 relative">
                                    {/* Saving overlay */}
                                    {isSaving && (
                                        <div className="absolute inset-0 z-10 rounded-xl flex items-center justify-center bg-card/60 backdrop-blur-[2px]">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2
                                                    className="w-7 h-7 animate-spin"
                                                    style={{ color: "var(--color-primary)" }}
                                                />
                                                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                                                    Saving…
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`transition-opacity duration-300 ${isSaving ? "opacity-30 pointer-events-none select-none" : "opacity-100"}`}>
                                        <Page state={state} isLoading={isLoading} isSaving={isSaving} />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="pt-4 shrink-0">
                                    <AnimatedSeparator className="opacity-30" sizeConfig="sm" />
                                    <div className="flex items-center justify-end gap-3 pt-1">
                                        <AnimatedButton
                                            label="Cancel"
                                            variant="outline"
                                            sizeConfig="sm"
                                            onClick={onClose}
                                            disabled={isSaving || isLoading}
                                            isSkeleton={isLoading}
                                        />
                                        <AnimatedButton
                                            label="Save Changes"
                                            variant="primary"
                                            sizeConfig="sm"
                                            onClick={handleSave}
                                            isLoading={isSaving}
                                            disabled={isLoading}
                                            isSkeleton={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
};