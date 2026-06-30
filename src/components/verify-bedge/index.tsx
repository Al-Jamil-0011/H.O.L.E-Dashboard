"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, ShieldAlert } from "lucide-react";

type VerifyBadgeProps = {
    isVerified: boolean | undefined;
    showLabel?: boolean;
    size?: "sm" | "md";
    className?: string;
};

export function VerifyBadge({
    isVerified,
    showLabel = false,
    size = "md",
    className,
}: VerifyBadgeProps) {
    const isSmall = size === "sm";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-md font-bold  border",
                isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
                isVerified
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20",
                className
            )}
        >
            {isVerified ? (
                <CheckCircle2 className={cn(isSmall ? "h-3 w-3" : "h-3.5 w-3.5")} />
            ) : (
                <ShieldAlert className={cn(isSmall ? "h-3 w-3" : "h-3.5 w-3.5")} />
            )}

            {showLabel && (
                <span>{isVerified ? "Verified" : "Unverified"}</span>
            )}
        </span>
    );
}