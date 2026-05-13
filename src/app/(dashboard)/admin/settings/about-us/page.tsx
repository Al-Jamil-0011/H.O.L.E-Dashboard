'use client';

import Loader from '@/components/loader';
import { useAboutUs } from '@/hooks/settings';
import Link from 'next/link';
import { FaRegEdit } from 'react-icons/fa';


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
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground">About Us</h1>
                    <Link href="/admin/settings/about-us/edit">
                        <button className="flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground px-4 py-1 rounded text-black hover:bg-primary/90 transition-[0.3s]">
                            <FaRegEdit />
                            <p>Edit</p>
                        </button>
                    </Link>
                </div>
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