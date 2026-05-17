'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/loader';
import { useTerms, useUpdateTermService } from '@/hooks/settings';
import toast from 'react-hot-toast';

// Import SunEditor CSS
import 'suneditor/dist/css/suneditor.min.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// Dynamically import SunEditor to avoid SSR issues
const SunEditor = dynamic(() => import('suneditor-react'), {
    ssr: false,
});

export default function EditAboutUsPage() {
    const { updateTerm } = useUpdateTermService();
    const { terms, loading, refetch } = useTerms();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Set initial content when data is loaded
    useEffect(() => {
        if (terms && terms.length > 0 && !content) {
            setContent(terms[0].content || '');
        }
    }, [terms, content]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size={40} text='Loading Terms of Service...' />
            </div>
        )
    }

    const handleSave = async () => {
        if (!terms || terms.length === 0) return;

        setIsSaving(true);
        const toastId = toast.loading('Saving changes...');

        try {
            const res = await updateTerm(terms[0]._id!, { content });
            if (res) {
                toast.success('Terms of Service updated successfully', { id: toastId });
                refetch();
                router.push('/admin/settings/terms-of-service');
            } else {
                toast.error('Failed to update Terms of Service', { id: toastId });
            }
        } catch (err) {
            toast.error('An error occurred while saving', { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-background text-foreground space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-5 rounded-xl border border-border dark:shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full dark:bg-[#1E293B] text-gray-400 hover:text-white dark:hover:bg-[#334155] transition-colors cursor-pointer hover:bg-primary/10"
                    >
                        <ArrowLeft className="h-5 w-5 text-primary" />
                    </button> <div>
                        <h1 className="text-2xl font-bold text-foreground">Edit Terms of Service</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage the content shown on the public Terms of Service page</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-background px-8 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 dark:shadow-lg dark:shadow-primary/20 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center text-sm"
                >
                    {isSaving && <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card dark:shadow-md transition-all">
                <SunEditor
                    setContents={content}
                    onChange={setContent}
                    setOptions={{
                        height: 'auto',
                        minHeight: '500px',
                        width: '100%',
                        buttonList: [
                            ['undo', 'redo'],
                            ['font', 'fontSize', 'formatBlock'],
                            ['paragraphStyle', 'blockquote'],
                            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                            ['fontColor', 'hiliteColor', 'textStyle'],
                            ['removeFormat'],
                            ['outdent', 'indent'],
                            ['align', 'horizontalRule', 'list', 'lineHeight'],
                            ['table', 'link', 'image', 'video'],
                            ['fullScreen', 'showBlocks', 'codeView'],
                            ['preview', 'print'],
                        ],
                    }}
                    lang="en"
                />
            </div>

            {/* Custom Styles to make SunEditor respect our design system and theme */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .sun-editor {
                    background-color: var(--card) !important;
                    color: var(--foreground) !important;
                    border: none !important;
                    font-family: inherit !important;
                }
                .sun-editor .se-toolbar {
                    background-color: var(--muted) !important;
                    outline: 1px solid var(--border) !important;
                    border: none !important;
                }
                .sun-editor .se-resizing-bar {
                    background-color: var(--muted) !important;
                    border-top: 1px solid var(--border) !important;
                }
                .sun-editor .se-btn:enabled:hover, 
                .sun-editor .se-btn:enabled:focus,
                .sun-editor .se-btn-module-border {
                    background-color: var(--card) !important;
                    border-color: var(--border) !important;
                }
                .sun-editor .se-btn:enabled.active {
                   background-color: var(--primary) !important;
                   color: var(--background) !important;
                }
                .sun-editor .se-list-layer,
                .sun-editor .se-selector-list,
                .sun-editor .se-menu-list {
                    background-color: var(--card) !important;
                    border: 1px solid var(--border) !important;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
                    color: var(--foreground) !important;
                }
                .sun-editor .se-btn-list:hover {
                    background-color: var(--muted) !important;
                    color: var(--foreground) !important;
                }
                .sun-editor-editable {
                    background-color: var(--card) !important;
                    color: var(--foreground) !important;
                    padding: 2rem !important;
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    min-height: 500px !important;
                }
                /* Dark mode specific tweaks */
                .dark .sun-editor .se-btn:enabled {
                    color: var(--muted-foreground) !important;
                }
                .dark .sun-editor .se-btn:enabled:hover {
                    color: var(--foreground) !important;
                }
                .dark .sun-editor .se-svg,
                .dark .sun-editor .se-btn-expand .se-svg {
                    fill: var(--muted-foreground) !important;
                }
                .dark .sun-editor .se-btn:enabled:hover .se-svg {
                    fill: var(--foreground) !important;
                }
                .sun-editor .se-dialog-content {
                    background-color: var(--card) !important;
                    border: 1px solid var(--border) !important;
                    color: var(--foreground) !important;
                }
                .sun-editor .se-dialog-header {
                    border-bottom: 1px solid var(--border) !important;
                    background-color: var(--muted) !important;
                }
                .sun-editor .se-dialog-footer {
                    border-top: 1px solid var(--border) !important;
                }
                .sun-editor input, .sun-editor select, .sun-editor textarea {
                    background-color: var(--background) !important;
                    border: 1px solid var(--border) !important;
                    color: var(--foreground) !important;
                }
            `}} />
        </div>
    );
}