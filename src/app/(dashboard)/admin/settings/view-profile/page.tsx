"use client";

import { useState, useMemo } from "react";
import { useMyProfile } from "@/hooks/admin/users";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { EditProfileModal } from "@/components/modals/EditProfileModal";

function toLabel(value?: string | null) {
    if (!value) return "N/A";
    return value;
}

function formatDate(value?: string | null) {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function ViewProfilePage() {
    const { profile, loading, error, refetch } = useMyProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fullName = profile?.fullName ?? "";

    const initials = useMemo(() => {
        if (!fullName) return "U";
        return fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase())
            .join("");
    }, [fullName]);

    const coordinates =
        profile?.location?.coordinates &&
            profile.location.coordinates.length === 2
            ? `${profile.location.coordinates[1]}, ${profile.location.coordinates[0]}`
            : "N/A";

    if (loading) {
        return (
            <div className="space-y-4">
                <h1 className="title">View Profile</h1>
                <div className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                    <div className="h-6 w-44 rounded bg-muted mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-14 rounded-lg bg-muted" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <h1 className="title">View Profile</h1>
                <div className="rounded-xl border border-red-300 bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                        onClick={refetch}
                        className="mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="space-y-4">
                <h1 className="title">View Profile</h1>
                <div className="rounded-xl border border-border bg-card p-6">
                    <p className="text-sm text-muted-foreground">Profile data not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="title">View Profile</h1>
                    <p className="text-xs text-muted-foreground">Access and manage your personal information, account details, and activity overview from one place.</p>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 dark:bg-muted/30">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-border">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {
                                profile.profileUrl ? (
                                    <div className="h-14 w-14 rounded-full">
                                        <Image
                                            src={profile.profileUrl}
                                            alt="Profile"
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                                        {initials}
                                    </div>
                                )
                            }
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute -bottom-2.5 right-0 h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                            >
                                <FaRegEdit className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">{toLabel(profile.fullName)}</h2>
                            <p className="text-sm text-muted-foreground">{toLabel(profile.email)}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                            {toLabel(profile.role)}
                        </span>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${profile.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                                }`}
                        >
                            {toLabel(profile.status)}
                        </span>
                    </div>
                </div>

                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Phone Number" value={toLabel(profile.phoneNumber)} />
                    <InfoItem label="Territory" value={toLabel(profile.territory)} />
                    <InfoItem label="Address" value={toLabel(profile.address)} />
                    <InfoItem label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                    <InfoItem label="Joining Date" value={formatDate(profile.createdAt)} />
                    <InfoItem label="Last Login" value={formatDate(profile.lastLoginAt)} />
                    <InfoItem label="Coordinates" value={coordinates} />
                </div>
            </div>

            {profile && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    profile={profile}
                    onSuccess={refetch}
                />
            )}
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground break-words">{value}</p>
        </div>
    );
}