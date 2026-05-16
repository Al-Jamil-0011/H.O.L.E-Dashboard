"use client";

import { X, CheckCircle2, ChevronLeft, FileText, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSingleExpense, useUpdateExpenseStatus } from "@/hooks/admin/expense";
import Loader from "../loader";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { StatusBadge } from "../ui/DataTable";

export const ExpenseDetails = ({ expenseId }: { expenseId: string }) => {
    const { expense, loading, refetch } = useSingleExpense(expenseId);
    const { updateExpenseStatus, loading: isUpdating } = useUpdateExpenseStatus();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-[60vh]">
                <Loader size={32} text="Processing details..." />
            </div>
        );
    }

    if (!expense) return null;

    const handleApprove = async () => {
        const promise = updateExpenseStatus(expense._id, 'approved');
        toast.promise(promise, {
            loading: 'Approving expense...',
            success: () => {
                refetch();
                return 'Expense approved successfully';
            },
            error: (err) => err?.message || 'Failed to approve expense'
        });
    };

    const handleReject = async (reason: string = "No reason provided") => {
        const promise = updateExpenseStatus(expense._id, 'rejected', reason);
        toast.promise(promise, {
            loading: 'Rejecting expense...',
            success: () => {
                refetch();
                return 'Expense rejected';
            },
            error: (err) => err?.message || 'Failed to reject expense'
        });
    };

    const representative = typeof expense.representative === 'object' ? expense.representative : null;
    const physician = typeof expense.physician === 'object' ? expense.physician : null;
    const status = expense.status.toUpperCase();

    return (
        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">

            <div className="flex lg:items-center justify-between md:flex-row flex-col md:gap-0 gap-4 w-full">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => router.back()}
                        className="p-2 mt-1 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5 text-primary" />
                    </button>
                    <h1 className="text-lg font-bold text-foreground">Expense Details</h1>
                </div>
                {status === 'PENDING' && (
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleReject()}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-transparent border border-border hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 text-foreground rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <X className="h-4 w-4" /> Reject Expense
                        </button>
                        <button
                            onClick={() => handleApprove()}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-primary text-background rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all dark:shadow-lg hover:bg-primary/90 cursor-pointer disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-5 w-5" /> Approve & Confirm
                        </button>
                    </div>
                )}
            </div>



            <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 dark:shadow-sm">
                <div className="h-20 w-20 rounded-full bg-muted overflow-hidden shrink-0 border-2 border-border">
                    <Image
                        src={representative?.profileUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${representative?.fullName || 'user'}`}
                        alt="avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-foreground">{representative?.fullName || 'N/A'}</h3>
                        <StatusBadge status="representative" />
                    </div>
                    <p className="text-sm text-primary font-medium mt-1">{representative?.territory || 'No Territory Assigned'}</p>
                    <div className="flex items-center gap-4 mt-3">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Submitted: <span className="text-foreground/80 ml-1">{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}</span></p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Employee ID: <span className="text-foreground/80 ml-1">{representative?.employeeId || 'N/A'}</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between dark:shadow-sm">
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">TOTAL AMOUNT</p>
                    <p className="text-4xl font-black tracking-tight text-foreground">${expense.totalAmount?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">CURRENT STATUS</p>
                    <span className={cn(
                        "px-4 py-2 text-xs font-medium rounded-xl uppercase tracking-widest border dark:shadow-sm inline-block",
                        status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                            status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    )}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* EXPENSE DETAILS GRID */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Detailed Information</h3>
                    <div className="bg-card border border-border rounded-2xl divide-y divide-border dark:shadow-sm">
                        <div className="flex justify-between p-4 items-center">
                            <span className="text-xs text-muted-foreground font-medium">Physician / Client</span>
                            <span className="text-sm text-foreground font-bold">{physician?.fullName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between p-4 items-center">
                            <span className="text-xs text-muted-foreground font-medium">Category</span>
                            <span className="text-sm text-foreground font-bold">{expense.category}</span>
                        </div>
                        <div className="flex justify-between p-4 items-center">
                            <span className="text-xs text-muted-foreground font-medium">Date of Expense</span>
                            <span className="text-sm text-foreground font-bold">{expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between p-4 items-center">
                            <span className="text-xs text-muted-foreground font-medium">Paid Status</span>
                            <span className="text-sm text-foreground font-bold">{expense.isPaid ? 'Direct Pay' : 'Reimbursement'}</span>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION & REJECTION NOTE */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Explanation</h3>
                    <div className="bg-card border border-border rounded-2xl p-5 dark:shadow-sm min-h-[160px] flex flex-col justify-between">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {expense.description || 'No description provided.'}
                            </p>
                        </div>
                        {expense.rejectionNote && (
                            <div className="mt-6 pt-4 border-t border-border">
                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Rejection Reason</p>
                                <p className="text-sm text-rose-500/80 font-medium">{expense.rejectionNote}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Supporting Documents</h3>
                {expense.files && expense.files.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {expense.files.map((fileUrl, idx) => {
                            const fileName = fileUrl.split('/').pop() || `Document_${idx + 1}`;
                            const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                            return (
                                <div key={idx} className="flex flex-col bg-card border border-border rounded-2xl group hover:border-primary/50 transition-all overflow-hidden dark:shadow-sm">
                                    {isImage && (
                                        <div className="aspect-video w-full relative overflow-hidden bg-muted">
                                            <Image src={fileUrl} alt="attachment" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={cn(
                                                "p-2 rounded-lg flex items-center justify-center shrink-0",
                                                !isImage ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                                            )}>
                                                {!isImage ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-foreground pr-2 truncate group-hover:text-primary transition-colors">{fileName}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{!isImage ? 'PDF Document' : 'Image File'}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-9 w-9 rounded-full flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 transition-colors shrink-0"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center bg-card/50 border border-dashed border-border rounded-2xl opacity-60">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-bold text-muted-foreground">No attachments provided</p>
                    </div>
                )}
            </div>
        </div>
    );
};