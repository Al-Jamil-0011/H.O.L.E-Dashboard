'use client';

import Loader from '@/components/loader';
import { useAboutUs } from '@/hooks/settings';


export default function AboutUsPage() {
    const { abouts, loading } = useAboutUs();

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size={40} text='Loading about us...' />
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground">
            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-foreground">About Us</h1>
                <div className="relative overflow-hidden rounded border border-border p-4">
                    <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: abouts[0]?.content ?? "" }}
                    />
                </div>
            </div>
        </div>
    );
}