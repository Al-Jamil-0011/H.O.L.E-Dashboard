"use client";

import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft, CheckCircle2, FileText, Download,
    Calendar, Building2, UserCircle2,
    Activity, DollarSign, Stethoscope, Briefcase,
    Clock, ShieldCheck, Wallet, Receipt
} from 'lucide-react';
import { cn, customToast } from '@/lib/utils';
import { useSingleCommission, useMarkCommissionPaid } from '@/hooks/admin/commissions';
import Loader from '@/components/loader';
import { useState } from 'react';

export default function CommissionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { commission, loading: commissionLoading, refetch } = useSingleCommission(id);
    const { markCommissionPaid, loading: isMarkingPaid } = useMarkCommissionPaid();

    const [showPaidModal, setShowPaidModal] = useState(false);

    if (commissionLoading) {
        return (
            <div className="flex items-center justify-center w-full h-[60vh]">
                <Loader size={32} text="Fetching commission data..." />
            </div>
        );
    }

    if (!commission) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                <Activity className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Commission Not Found</h2>
            <p className="text-muted-foreground">The record you are looking for does not exist or has been removed.</p>
            <button onClick={() => router.back()} className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">Go Back</button>
        </div>
    );

    const sale = commission.sale;
    const status = commission.status.toUpperCase();
    const primaryRep = sale?.representatives?.users?.find((u: any) => u.assignRole === 'primary');
    const assistRep = sale?.representatives?.users?.find((u: any) => u.assignRole === 'assist');

    const handleMarkAsPaid = async () => {
        const res = await markCommissionPaid(id);
        if (res?.success) {
            customToast.success('Commission marked as paid successfully');
            setShowPaidModal(false);
            refetch();
        } else {
            customToast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in zoom-in duration-500">

            {/* HEADER SECTION */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-5 rounded-xl border border-border dark:shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer group"
                    >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-foreground tracking-tight">Commission #{sale?.saleId}</h1>
                            <span className={cn(
                                "px-2 py-0.5 text-[10px] font-medium rounded uppercase tracking-widest",
                                status === 'PAID' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                    "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            )}>
                                {status}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                            Commission ID: <span className="text-muted-foreground/80">{commission._id}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {status !== 'PAID' && (
                        <button
                            onClick={() => setShowPaidModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white dark:text-[#0B101E] hover:bg-emerald-400 rounded-lg transition-all text-sm font-medium dark:shadow-md dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Mark as Paid</span>
                        </button>
                    )}
                </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl dark:shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <DollarSign className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Sale</span>
                    </div>
                    <p className="text-xl font-medium text-foreground">${sale?.billing?.totalAmount?.toLocaleString() || '0.00'}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl dark:shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                            <Wallet className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Commission Pool</span>
                    </div>
                    <p className="text-xl font-medium text-emerald-500">${sale?.representatives?.totalCommission?.toLocaleString() || '0.00'}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl border-t-2 border-t-primary dark:shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Share</span>
                    </div>
                    <p className="text-xl font-medium text-foreground">${sale?.representatives?.myCommission?.toLocaleString() || '0.00'}</p>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl dark:shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                            <Receipt className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vendor Payout</span>
                    </div>
                    <p className="text-xl font-medium text-foreground">${sale?.billing?.vendorPayment?.toLocaleString() || '0.00'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">

                    {/* REPRESENTATIVE INFO */}
                    <div className="bg-card rounded-xl border border-border p-6 dark:shadow-sm">
                        <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                            <UserCircle2 className="h-4 w-4 text-primary" />
                            Representatives Involvement
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-muted/30 rounded-xl border border-border p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Rep</span>
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded uppercase">Role: Primary</span>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-primary">
                                        <UserCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            Not Assigned
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            Rep ID: {' '}
                                            {
                                                typeof primaryRep?.representative === 'object' ? (primaryRep?.representative as any)?._id : 'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <span className="text-xs text-muted-foreground">Commission Rate</span>
                                    <span className="text-sm font-bold text-primary">{primaryRep?.commissionRate || 0}%</span>
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-xl border border-border p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assist Rep</span>
                                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[10px] font-bold rounded uppercase">Role: Assist</span>
                                </div>
                                {assistRep ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-purple-500">
                                                <UserCircle2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Not Assigned
                                                </p>
                                                <p className="text-[10px] text-muted-foreground font-medium">
                                                    Rep ID: N/A
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-border">
                                            <span className="text-xs text-muted-foreground">Commission Rate</span>
                                            <span className="text-sm font-bold text-purple-500">{assistRep.commissionRate || 0}%</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-24 opacity-40">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">No Assist Representative</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SALE OVERVIEW */}
                    <div className="bg-card rounded-xl border border-border p-6 dark:shadow-sm">
                        <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Sale Details Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg border border-border text-primary">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Procedure Date</p>
                                        <p className="text-sm font-bold text-foreground">{sale?.procedureDate ? new Date(sale.procedureDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg border border-border text-emerald-500">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Sale Type</p>
                                        <p className="text-sm font-bold text-foreground uppercase">{sale?.salesType || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg border border-border text-purple-500">
                                        <Stethoscope className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Physician</p>
                                        <p className="text-sm font-bold text-foreground">
                                            {
                                                typeof sale?.physician === 'object' ? sale.physician.fullName : 'N/A'
                                            }
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{sale?.physician?.specialty || ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-lg border border-border text-amber-500">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Facility / Hospital</p>
                                        <p className="text-sm font-bold text-foreground line-clamp-1">{sale?.facility?.address || 'N/A'}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">Contact: {sale?.facility?.contacts || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT LIST */}
                    <div className="bg-card rounded-xl border border-border p-6 dark:shadow-sm">
                        <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Inventory & Products Involved
                        </h2>
                        <div className="space-y-3">
                            {sale?.inventoryProducts?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-card flex items-center justify-center text-primary border border-border">
                                            <span className="text-xs font-medium">#{idx + 1}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{item.productType}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">Product ID: {typeof item.product === 'object' ? (item.product?.systemType || item.product?.serialNumber || item.product?._id) : item.product}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500/5 text-emerald-500 text-[10px] font-medium border border-emerald-500/10 rounded-lg">LINKED</span>
                                </div>
                            ))}
                            {(!sale?.inventoryProducts || sale.inventoryProducts.length === 0) && (
                                <div className="text-center py-8 opacity-40">
                                    <p className="text-sm text-muted-foreground italic">No products associated with this sale</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                    {/* QUICK BILLING */}
                    <div className="bg-gradient-to-br from-card to-background rounded-xl border border-border p-5 dark:shadow-lg">
                        <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-primary" />
                            Billing Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase">PO Number</span>
                                <span className="text-xs text-foreground font-medium">{sale?.billing?.purchaseOrderNumber || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase">Invoice No</span>
                                <span className="text-xs text-primary font-medium">{sale?.invoice?.invoiceNumber || 'PENDING'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase">Invoice Date</span>
                                <span className="text-xs text-foreground font-bold">{sale?.invoice?.invoiceDate ? new Date(sale.invoice.invoiceDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="h-px bg-border w-full" />
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase">Commission Status</span>
                                <span className={cn(
                                    "text-[10px] font-medium px-2 py-0.5 rounded",
                                    status === 'PAID' ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
                                )}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* AUDIT TRAIL */}
                    <div className="bg-card rounded-xl border border-border p-5 dark:shadow-sm">
                        <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Transaction Log
                        </h2>
                        <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px before:h-full before:w-0.5 before:bg-muted">
                            <div className="relative flex items-start gap-4">
                                <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-card shrink-0 bg-emerald-500 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                                <div className="ml-6">
                                    <p className="text-xs font-bold text-foreground">Commission Created</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">{commission.createdAt ? new Date(commission.createdAt).toLocaleString() : 'N/A'}</p>
                                </div>
                            </div>

                            {status === 'PAID' ? (
                                <div className="relative flex items-start gap-4">
                                    <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-card shrink-0 bg-primary dark:shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                                        <ShieldCheck className="h-3 w-3 text-background" />
                                    </div>
                                    <div className="ml-6">
                                        <p className="text-xs font-bold text-foreground">Payment Finalized</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{commission.updatedAt ? new Date(commission.updatedAt).toLocaleString() : 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative flex items-start gap-4 opacity-50">
                                    <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-card shrink-0 bg-muted">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="ml-6">
                                        <p className="text-xs font-bold text-muted-foreground italic uppercase tracking-tighter">Waiting for payout...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ATTACHMENTS */}
                    <div className="bg-card rounded-xl border border-border p-5 dark:shadow-sm">
                        <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Linked Documents
                        </h2>
                        <div className="space-y-3">
                            {sale?.attachments?.map((url: string, idx: number) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl group hover:border-primary transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/5 text-primary rounded-lg group-hover:bg-primary/10 transition-colors">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="text-[11px] font-bold text-foreground/80 truncate max-w-[150px]">{url.split('/').pop() || `File_${idx + 1}`}</span>
                                    </div>
                                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                            ))}
                            {(!sale?.attachments || sale.attachments.length === 0) && (
                                <div className="text-center py-6 opacity-30">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">No attachments</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CONFIRM PAID MODAL */}
            {showPaidModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 shadow-xl dark:shadow-2xl">
                        <div className="p-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Confirm Payout</h3>
                            <p className="text-sm text-muted-foreground mb-6 font-medium">
                                Are you sure you want to mark this commission as paid? This action will update the representative&apos;s balance and finalize the transaction record.
                            </p>
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowPaidModal(false)}
                                    className="flex-1 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkAsPaid}
                                    disabled={isMarkingPaid}
                                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white dark:text-[#0B101E] rounded-lg text-sm font-medium transition-all shadow-md dark:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isMarkingPaid ? (
                                        <div className="h-4 w-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                                    ) : <CheckCircle2 className="h-4 w-4" />}
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}