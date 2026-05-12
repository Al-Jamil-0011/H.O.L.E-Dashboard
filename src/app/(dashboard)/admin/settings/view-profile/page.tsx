'use client';

import { useMyProfile } from "@/hooks/admin/users";

export default function ViewProfilePage() {
    const { profile, loading } = useMyProfile();
    console.log(profile, loading)
    return (
        <div className="">
            <h1 className="text-2xl font-bold text-foreground">View Profile</h1>
        </div>
    );
}