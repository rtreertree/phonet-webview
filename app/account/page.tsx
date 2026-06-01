"use client";

import { AnimatedCard } from "@/components/utils/animatedCard";
import { AccountModal } from "./_components/accountModal";

export default function AccountPage() {
    return (
        <AccountModal isOpen={true} onClose={() => {}} />
    )
}