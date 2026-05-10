"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft, CheckCircle2, FileText, Download, Eye,
    Calendar, Building2, UserCircle2,
    Activity, DollarSign, Stethoscope, Briefcase, MapPin,
    Clock, X, ShieldCheck, Wallet, Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/DataTable';
import { useSingleCommission, useMarkCommissionPaid } from '@/hooks/admin/commissions';
import Loader from '@/components/loader';
import toast from 'react-hot-toast';

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
            <h2 className="text-xl font-bold text-white">Commission Not Found</h2>
            <p className="text-gray-400">The record you are looking for does not exist or has been removed.</p>
            <button onClick={() => router.back()} className="px-6 py-2 bg-[#1E293B] text-white rounded-lg hover:bg-[#334155] transition-colors">Go Back</button>
        </div>
    );

    const sale = commission.sale;
    const status = commission.status.toUpperCase();
    const primaryRep = sale?.representatives?.users?.find((u: any) => u.assignRole === 'primary');
    const assistRep = sale?.representatives?.users?.find((u: any) => u.assignRole === 'assist');

    const handleMarkAsPaid = async () => {
        const res = await markCommissionPaid(id);
        if (res?.success) {
            toast.success('Commission marked as paid successfully');
            setShowPaidModal(false);
            refetch();
        } else {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in zoom-in duration-500">

            {/* HEADER SECTION */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#151B2B] p-5 rounded-xl border border-[#1E293B] shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#1E293B] hover:bg-[#334155] rounded-lg transition-colors cursor-pointer group"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white tracking-tight">Commission #{sale?.saleId}</h1>
                            <span className={cn(
                                "px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-widest",
                                status === 'PAID' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                    "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            )}>
                                {status}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                            Commission ID: <span className="text-gray-400">{commission._id}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {status !== 'PAID' && (
                        <button
                            onClick={() => setShowPaidModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-[#0B101E] hover:bg-emerald-400 rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Mark as Paid</span>
                        </button>
                    )}
                </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#151B2B] border border-[#1E293B] p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                            <DollarSign className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Sale</span>
                    </div>
                    <p className="text-xl font-black text-white">${sale?.billing?.totalAmount?.toLocaleString() || '0.00'}</p>
                </div>
                <div className="bg-[#151B2B] border border-[#1E293B] p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <Wallet className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Commission Pool</span>
                    </div>
                    <p className="text-xl font-black text-emerald-400">${sale?.representatives?.totalCommission?.toLocaleString() || '0.00'}</p>
                </div>
                <div className="bg-[#151B2B] border border-[#1E293B] p-4 rounded-xl border-t-2 border-t-[#00E5FF]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Share</span>
                    </div>
                    <p className="text-xl font-black text-white">${sale?.representatives?.myCommission?.toLocaleString() || '0.00'}</p>
                </div>
                <div className="bg-[#151B2B] border border-[#1E293B] p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                            <Receipt className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vendor Payout</span>
                    </div>
                    <p className="text-xl font-black text-white">${sale?.billing?.vendorPayment?.toLocaleString() || '0.00'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">

                    {/* REPRESENTATIVE INFO */}
                    <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-6">
                        <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <UserCircle2 className="h-4 w-4 text-[#00E5FF]" />
                            Representatives Involvement
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#0B101E] rounded-xl border border-[#1E293B] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Rep</span>
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">Role: Primary</span>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#00E5FF]">
                                        <UserCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">
                                            Not Assigned
                                            {/* {
                                                typeof primaryRep?.representative === 'object' ? primaryRep.representative.fullName : 'Not Assigned'
                                            } */}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-medium">
                                            Rep ID: {' '}
                                            {
                                                typeof primaryRep?.representative === 'object' ? primaryRep.representative._id : 'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
                                    <span className="text-xs text-gray-400">Commission Rate</span>
                                    <span className="text-sm font-bold text-[#00E5FF]">{primaryRep?.commissionRate || 0}%</span>
                                </div>
                            </div>

                            <div className="bg-[#0B101E] rounded-xl border border-[#1E293B] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assist Rep</span>
                                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded uppercase">Role: Assist</span>
                                </div>
                                {assistRep ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-full bg-[#1E293B] flex items-center justify-center text-purple-400">
                                                <UserCircle2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    Not Assigned
                                                    {/* {
                                                        typeof assistRep.representative === 'object' ? assistRep.representative.fullName : 'Not Assigned'
                                                    } */}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-medium">
                                                    Rep ID: N/A
                                                    {/* {
                                                        typeof assistRep.representative === 'object' ? assistRep.representative._id : 'N/A'
                                                    } */}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
                                            <span className="text-xs text-gray-400">Commission Rate</span>
                                            <span className="text-sm font-bold text-purple-400">{assistRep.commissionRate || 0}%</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-24 opacity-40">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">No Assist Representative</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SALE OVERVIEW */}
                    <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-6">
                        <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#00E5FF]" />
                            Sale Details Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#0B101E] rounded-lg border border-[#1E293B] text-[#00E5FF]">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Procedure Date</p>
                                        <p className="text-sm font-bold text-white">{sale?.procedureDate ? new Date(sale.procedureDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#0B101E] rounded-lg border border-[#1E293B] text-emerald-400">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Sale Type</p>
                                        <p className="text-sm font-bold text-white uppercase">{sale?.salesType || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#0B101E] rounded-lg border border-[#1E293B] text-purple-400">
                                        <Stethoscope className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Physician</p>
                                        <p className="text-sm font-bold text-white">
                                            {
                                                typeof sale?.physician === 'object' ? sale.physician.fullName : 'N/A'
                                            }
                                        </p>
                                        <p className="text-[10px] text-gray-500 uppercase font-medium">{sale?.physician?.specialty || ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#0B101E] rounded-lg border border-[#1E293B] text-amber-500">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Facility / Hospital</p>
                                        <p className="text-sm font-bold text-white line-clamp-1">{sale?.facility?.address || 'N/A'}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Contact: {sale?.facility?.contacts || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT LIST */}
                    <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-6">
                        <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-[#00E5FF]" />
                            Inventory & Products Involved
                        </h2>
                        <div className="space-y-3">
                            {sale?.inventoryProducts?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-[#0B101E] border border-[#1E293B] rounded-xl hover:border-[#334155] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-[#151B2B] flex items-center justify-center text-[#00E5FF] border border-[#1E293B]">
                                            <span className="text-xs font-black">#{idx + 1}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{item.productType}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-tight font-medium">Product ID: {item.product}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500/5 text-emerald-500 text-[10px] font-black border border-emerald-500/10 rounded-lg">LINKED</span>
                                </div>
                            ))}
                            {(!sale?.inventoryProducts || sale.inventoryProducts.length === 0) && (
                                <div className="text-center py-8 opacity-40">
                                    <p className="text-sm text-gray-500 italic">No products associated with this sale</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                    {/* QUICK BILLING */}
                    <div className="bg-gradient-to-br from-[#1E293B] to-[#151B2B] rounded-xl border border-[#334155] p-5 shadow-lg">
                        <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-[#00E5FF]" />
                            Billing Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">PO Number</span>
                                <span className="text-xs text-white font-black">{sale?.billing?.purchaseOrderNumber || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Invoice No</span>
                                <span className="text-xs text-[#00E5FF] font-black">{sale?.invoice?.invoiceNumber || 'PENDING'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Invoice Date</span>
                                <span className="text-xs text-white font-bold">{sale?.invoice?.invoiceDate ? new Date(sale.invoice.invoiceDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="h-px bg-[#334155] w-full" />
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Commission Status</span>
                                <span className={cn(
                                    "text-[10px] font-black px-2 py-0.5 rounded",
                                    status === 'PAID' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-500"
                                )}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* AUDIT TRAIL */}
                    <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
                        <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#00E5FF]" />
                            Transaction Log
                        </h2>
                        <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px before:h-full before:w-0.5 before:bg-[#1E293B]">
                            <div className="relative flex items-start gap-4">
                                <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#151B2B] shrink-0 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                                <div className="ml-6">
                                    <p className="text-xs font-bold text-white">Commission Created</p>
                                    <p className="text-[10px] text-gray-500 mt-1">{commission.createdAt ? new Date(commission.createdAt).toLocaleString() : 'N/A'}</p>
                                </div>
                            </div>

                            {status === 'PAID' ? (
                                <div className="relative flex items-start gap-4">
                                    <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#151B2B] shrink-0 bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                                        <ShieldCheck className="h-3 w-3 text-[#0B101E]" />
                                    </div>
                                    <div className="ml-6">
                                        <p className="text-xs font-bold text-white">Payment Finalized</p>
                                        <p className="text-[10px] text-gray-500 mt-1">{commission.updatedAt ? new Date(commission.updatedAt).toLocaleString() : 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative flex items-start gap-4 opacity-50">
                                    <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#151B2B] shrink-0 bg-[#1E293B]">
                                        <Clock className="h-3 w-3 text-gray-500" />
                                    </div>
                                    <div className="ml-6">
                                        <p className="text-xs font-bold text-gray-500 italic uppercase tracking-tighter">Waiting for payout...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ATTACHMENTS */}
                    <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
                        <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#00E5FF]" />
                            Linked Documents
                        </h2>
                        <div className="space-y-3">
                            {sale?.attachments?.map((url: string, idx: number) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-[#0B101E] border border-[#1E293B] rounded-xl group hover:border-[#00E5FF] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#00E5FF]/5 text-[#00E5FF] rounded-lg group-hover:bg-[#00E5FF]/10 transition-colors">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-300 truncate max-w-[150px]">{url.split('/').pop() || `File_${idx + 1}`}</span>
                                    </div>
                                    <Download className="h-4 w-4 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
                                </a>
                            ))}
                            {(!sale?.attachments || sale.attachments.length === 0) && (
                                <div className="text-center py-6 opacity-30">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">No attachments</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CONFIRM PAID MODAL */}
            {showPaidModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#151B2B] border border-[#1E293B] rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 shadow-2xl">
                        <div className="p-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Confirm Payout</h3>
                            <p className="text-sm text-gray-400 mb-6 font-medium">
                                Are you sure you want to mark this commission as paid? This action will update the representative's balance and finalize the transaction record.
                            </p>
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowPaidModal(false)}
                                    className="flex-1 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkAsPaid}
                                    disabled={isMarkingPaid}
                                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0B101E] rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isMarkingPaid ? (
                                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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