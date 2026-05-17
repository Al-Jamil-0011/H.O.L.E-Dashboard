'use client';

import Loader from "@/components/loader";
import { usePrivacyPolicy } from "@/hooks/settings";
import Link from "next/link";
import { FaRegEdit } from "react-icons/fa";
import 'suneditor/dist/css/suneditor.min.css';

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
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="title">Privacy Policy</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Manage and update how user data is collected, used, and protected across your platform.
                        </p>
                    </div>
                    <Link href="/admin/settings/privacy-policy/edit">
                        <button className="flex items-center gap-2 cursor-pointer bg-primary text-background px-4 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 dark:shadow-lg dark:shadow-primary/20 text-sm font-medium">
                            <FaRegEdit />
                            <p>Edit</p>
                        </button>
                    </Link>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
                    <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: policies[0]?.content ?? "" }}
                    />
                </div>
                {/* Ensure the rich-text content respects the current theme colors as a fallback, but allows inline styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                .sun-editor-editable {
                    color: var(--foreground);
                    font-family: inherit;
                }
                .sun-editor-editable h1, 
                .sun-editor-editable h2, 
                .sun-editor-editable h3, 
                .sun-editor-editable h4, 
                .sun-editor-editable h5, 
                .sun-editor-editable h6 {
                    color: var(--foreground);
                }
                /* Use inherit to allow inline colors to work while defaulting to theme color */
                .sun-editor-editable p, .sun-editor-editable span {
                    color: inherit;
                }
                
                /* Standardize some basic HTML styles that might be reset by tailwind */
                .sun-editor-editable ul {
                    list-style-type: disc !important;
                    padding-left: 2rem !important;
                    margin: 1rem 0 !important;
                }
                .sun-editor-editable ol {
                    list-style-type: decimal !important;
                    padding-left: 2rem !important;
                    margin: 1rem 0 !important;
                }
                .sun-editor-editable blockquote {
                    border-left: 4px solid var(--border) !important;
                    padding-left: 1rem !important;
                    margin: 1rem 0 !important;
                    font-style: italic !important;
                    opacity: 0.8 !important;
                }
                .sun-editor-editable table {
                    border-collapse: collapse !important;
                    width: 100% !important;
                    margin: 1rem 0 !important;
                }
                .sun-editor-editable td, .sun-editor-editable th {
                    border: 1px solid var(--border) !important;
                    padding: 0.5rem !important;
                }
            `}} />
            </div>
        </div>
    );
}