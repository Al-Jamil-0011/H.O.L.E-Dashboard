'use client';

import Loader from '@/components/loader';
import { useTerms } from '@/hooks/settings';

export default function TermsOfServicePage() {
    const { terms, loading } = useTerms();

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size={40} text='Loading terms of service...' />
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground">
            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded border border-border p-4">
                    <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: terms[0]?.content ?? "" }}
                    />
                </div>
            </div>
        </div>
    );
}