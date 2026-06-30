'use client';

import Loader from '@/components/loader';
import 'suneditor/dist/css/suneditor.min.css';
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
        <div className="bg-background text-foreground pb-10">
            <div className="space-y-5">
                <h1 className="title">Terms of Service</h1>
                <p className="text-xs text-muted-foreground mt-1">
                    View and manage the rules, conditions, and legal agreements that govern the use of your platform and services.
                </p>

                <div className="relative overflow-hidden rounded-xl border border-border p-6 md:p-10 bg-card">
                    {/* The class 'sun-editor-editable' is mandatory for SunEditor HTML content to render its styles */}
                    <div
                        className="sun-editor-editable !p-0 !bg-transparent"
                        dangerouslySetInnerHTML={{ __html: terms[0]?.content ?? "" }}
                    />
                </div>
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
    );
}