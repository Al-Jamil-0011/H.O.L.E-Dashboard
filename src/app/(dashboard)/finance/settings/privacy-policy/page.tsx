'use client';

import Loader from "@/components/loader";
import { usePrivacyPolicy } from "@/hooks/settings";


export default function PrivacyPolicyPage() {
    const { policies, loading } = usePrivacyPolicy();

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size={40} text='Loading privacy policy...' />
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground pb-10">
            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>

                <div className="relative overflow-hidden rounded border border-border p-4">
                    <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: policies[0]?.content ?? "" }}
                    />
                </div>
            </div>
        </div>
    );
}