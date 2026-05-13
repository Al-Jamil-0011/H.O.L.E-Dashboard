"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, CheckCircle2, FileText, Download, Eye, Plus,
  MessageSquare, Calendar, Building2, User, UserCircle2,
  Activity, DollarSign, Stethoscope, Briefcase, MapPin,
  AlertCircle, UploadCloud, Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/DataTable';
import { useSingleSale, useUpdateSale, useUpdateSaleStatus } from '@/hooks/admin/sales';
import Loader from '@/components/loader';
import toast from 'react-hot-toast';

// Mock Data
const saleDetails = {
  id: '#S-101',
  status: 'PENDING',
  type: 'Sold',
  rep: {
    name: 'Sarah Johnson',
    split: 30,
  },
  rep2: {
    name: 'Mike Chan',
    split: 70,
  },
  shipment: {
    physician: 'Dr. Sarah Jenkins',
    facility: 'Metropolitan General Hospital',
    procedureDate: '03/12/2026',
  },
  billing: {
    vendor: 'Med-Tech',
    poNumber: '12345',
    totalBill: 4200.00,
    commission: 420.00, // 10% of total
    commissionPercent: 10,
    commissionPool: 420.00, // Total to split
  },
  inventory: [
    { name: 'Tapered Stem - Size 4', sn: '002939-A', type: 'Implant' },
    { name: 'Acetabular Cup - 52mm', sn: 'TT3022-B', type: 'Tray' },
    { name: 'Bone Cement', sn: 'BC-9982', type: 'Bio' },
  ],
  documents: [
    { name: 'Packing Slip', type: 'pdf', size: '1.2 MB' },
    { name: 'PO_889_Final.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'Implant_Serial_Photo.jpg', type: 'image', size: '3.4 MB' },
  ],
  notes: {
    repNote: "Lunch meeting with Dr. Smith to discuss the new pharmaceutical lineup and distribution schedule for the downtown clinic. Procedure went smoothly, required an extra cup due to sizing issue during trial.",
  },
  auditTrail: [
    { label: 'Commission Calculated', by: 'System automated process', time: '10:45 AM', date: '03/15/2026', status: 'pending' },
    { label: 'Packing Slip Uploaded', by: 'David Miller', time: '09:20 AM', date: '03/15/2026', status: 'completed' },
    { label: 'Sale Record Created', by: 'Sarah Johnson', time: '08:00 AM', date: '03/15/2026', status: 'completed' },
  ]
};

export default function SaleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [saleStatus, setSaleStatus] = useState(saleDetails.status);
  const [showRepNote, setShowRepNote] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);


  const { sale, loading: salesLoading, refetch } = useSingleSale(params.id as string);
  const { updateSaleStatus, loading: isUpdatingStatus } = useUpdateSaleStatus();
  const { updateSale, loading: updateLoading, error: updateError } = useUpdateSale();

  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    setAdminNote(sale?.feedbackNotes || "");
    if (sale?.status) {
      setSaleStatus(sale.status.toUpperCase());
    }
  }, [sale?.feedbackNotes, sale?.status]);

  if (salesLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader size={32} text="Processing details..." />
      </div>
    );
  }

  if (!sale) return null;

  const visibleInventoryProducts = showAllItems
    ? sale.inventoryProducts
    : sale.inventoryProducts?.slice(0, 4);

  const primaryRep = sale.representatives?.users?.find((u: any) => u.assignRole === 'primary');
  const assistRep = sale.representatives?.users?.find((u: any) => u.assignRole === 'assist');

  const handleApprove = async () => {
    const promise = updateSaleStatus(sale._id, { status: 'approved' });
    toast.promise(promise, {
      loading: 'Approving sale...',
      success: () => {
        setShowApproveModal(false);
        refetch();
        return 'Sale approved successfully';
      },
      error: (err) => err?.message || 'Failed to approve sale'
    });
  };

  const handleSubmitNote = async () => {
    if (!adminNote.trim()) return;
    setIsSubmittingNote(true);
    const res = await updateSale(params.id as string, {
      feedbackNotes: adminNote,
    });

    if (res?.statusCode === 200) {
      refetch();
      toast.success("Feedback sent successfully!");
    }
    setIsSubmittingNote(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in zoom-in duration-500">

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#151B2B] p-5 rounded-xl border border-[#1E293B] shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-[#1E293B] hover:bg-[#334155] rounded-lg transition-colors group cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-primary" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">Sale #{sale.saleId}</h1>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-widest",
                saleStatus === 'APPROVED' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  saleStatus === 'PENDING' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              )}>
                {saleStatus}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              Transaction ID: <span className="text-gray-400">{sale._id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRepNote(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium border border-[#334155] cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Rep Note</span>
          </button>

          <button
            onClick={() => {
              document.getElementById('admin-note-section')?.scrollIntoView({ behavior: 'smooth' });
              document.getElementById('admin-note-input')?.focus();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium border border-[#334155] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Note</span>
          </button>

          {saleStatus !== 'APPROVED' && (
            <button
              onClick={() => setShowApproveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00E5FF] text-[#0B101E] hover:bg-cyan-400 rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer disabled:opacity-50"
              disabled={isUpdatingStatus}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve Sale</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        <div className="lg:col-span-2 space-y-6">

          {/*  SALE SUMMARY (TOP CARD) */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1E293B] to-[#0B101E] flex items-center justify-center border border-[#334155] text-[#00E5FF]">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Primary Representative</p>
                {/* <p className="text-base font-bold text-white">{
                  typeof primaryRep?.representative === 'object' ? primaryRep.representative.fullName : 'N/A'
                }</p> */}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sale Type</p>
                <span className="text-xs font-bold text-[#00E5FF] uppercase bg-[#00E5FF]/5 px-2 py-0.5 rounded border border-[#00E5FF]/10">{sale.salesType}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Procedure Date</p>
                <p className="text-sm font-bold text-white">{sale.procedureDate ? new Date(sale.procedureDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* 2. SHIPMENT & FACILITY INFO */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-6">
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#00E5FF]" />
              Shipment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0B101E] rounded-lg p-3 border border-[#1E293B]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Physician</p>
                {/* <div className="flex items-center gap-2">
                  <Stethoscope className="h-3 w-3 text-purple-400" />
                  {
                    sale.physician?.fullName ? (
                      <p className="text-xs font-bold text-white truncate">{sale.physician?.fullName || 'N/A'}</p>
                    ) : (
                      <p className="text-xs font-bold text-white truncate">N/A</p>
                    )
                  }

                </div> */}
              </div>

              <div className="bg-[#0B101E] rounded-lg p-3 border border-[#1E293B]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Hospital / Facility</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3 w-3 text-emerald-400" />
                  <p className="text-xs font-bold text-white truncate">{sale.facility?.address || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-[#0B101E] rounded-lg p-3 border border-[#1E293B]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <p className="text-xs font-bold text-white uppercase">{sale.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* IMPLANT & BILLING */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-6">
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#00E5FF]" />
              Implant & Billing
            </h2>

            <div className="bg-[#0B101E] rounded-xl border border-[#1E293B] overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-[#1E293B] border-b border-[#1E293B]">
                <div className="p-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Vendor / Partner</p>
                  <p className="text-sm font-bold text-white">{typeof sale.billing?.vendor === 'object' ? sale.billing.vendor.name : 'N/A'}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Purchase Order (PO)</p>
                  <p className="text-sm font-bold text-white">{sale.billing?.purchaseOrderNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-[#1E293B]">
                <div className="p-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Bill</p>
                  <p className="text-xl font-black text-white">${sale.billing?.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-4 bg-emerald-500/5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Commission Pool</p>
                  <p className="text-xl font-black text-emerald-400">${sale.representatives?.totalCommission?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-emerald-500/70 font-medium mt-1 uppercase">Total pool for all reps</p>
                </div>
              </div>
            </div>
          </div>

          {/*  INVENTORY ITEMS */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-6">
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#00E5FF]" />
              Inventory Item List
            </h2>

            <div className="space-y-2">
              {visibleInventoryProducts?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#0B101E] border border-[#1E293B] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-gray-400">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.productType}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Product ID: {item.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/5 px-2 py-0.5 rounded border border-[#00E5FF]/10">IN STOCK</span>
                  </div>
                </div>
              ))}

              {(!visibleInventoryProducts || visibleInventoryProducts.length === 0) && (
                <div className="text-center py-6 opacity-40">
                  <p className="text-xs font-bold text-gray-500">No inventory products linked</p>
                </div>
              )}
            </div>

            {(sale.inventoryProducts?.length ?? 0) > 4 && (
              <button
                onClick={() => setShowAllItems((prev) => !prev)}
                className="w-full mt-3 py-2 bg-[#0B101E] border border-[#1E293B] hover:bg-[#1E293B] rounded-lg text-xs font-bold text-[#00E5FF] transition-colors cursor-pointer"
              >
                {showAllItems ? "Show Less Items" : "View All Items"}
              </button>
            )}
          </div>

          {/* ADMIN NOTE SECTION */}
          <div id="admin-note-section" className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#00E5FF]" />
                Feedback & Comment
              </h2>
              {
                sale?.feedbackNotes && <h2 className="px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Already feedback is sent.
                </h2>
              }

            </div>

            <div className="bg-[#0B101E] rounded-xl border border-[#1E293B] p-4 space-y-4 mt-4">
              <textarea
                id="admin-note-input"
                className="w-full bg-[#151B2B] border border-[#1E293B] rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors resize-none h-24"
                placeholder="Leave a comment for the Rep..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2 max-w-[60%]">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">System Notice</p>
                    <p className="text-[10px] text-gray-500">Comments are logged in the permanent audit trail for this transaction.</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmitNote}
                  disabled={isSubmittingNote}
                  className="px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer bg-[#00E5FF] text-[#0B101E] hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                >

                  {isSubmittingNote ? 'Submitting...' : sale?.feedbackNotes ? 'Again Send' : 'Submit Note'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR (1/3 width) */}
        <div className="space-y-6">

          {/* 5. REPRESENTATIVE SPLIT */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white mb-4">Representative Split</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#0B101E] p-3 rounded-lg border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">1st</div>
                  {/* {
                    typeof primaryRep?.representative === 'object' ? (
                      <p className="text-xs font-bold text-white truncate max-w-[100px]">{primaryRep.representative.fullName}</p>
                    ) : (
                      <p className="text-xs font-bold text-white truncate max-w-[100px]">N/A</p>
                    )
                  } */}
                </div>
                <span className="text-sm font-bold text-gray-300">{primaryRep?.commissionRate}% Rate</span>
              </div>

              {assistRep && (
                <div className="flex items-center justify-between bg-[#0B101E] p-3 rounded-lg border border-[#1E293B]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-gray-400">2nd</div>
                    {/* {
                      typeof assistRep?.representative === 'object' ? (
                        <p className="text-xs font-bold text-white truncate max-w-[100px]">{assistRep.representative.fullName}</p>
                      ) : (
                        <p className="text-xs font-bold text-white truncate max-w-[100px]">N/A</p>
                      )
                    } */}
                  </div>
                  <span className="text-sm font-bold text-gray-300">{assistRep?.commissionRate}% Rate</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#1E293B]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-400">Your Commission Share</span>
                  <span className="text-lg font-black text-emerald-400">${sale.representatives?.myCommission?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-[9px] text-gray-500 italic">Auto-calculated based on region tier 2 and product margins.</p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white mb-4">Attachments</h2>

            {(sale?.attachments?.length ?? 0) > 0 && sale?.attachments?.map((item: string, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(item, "_blank");
                  }
                }}
                className="w-full p-2.5 mb-4 bg-[#0B101E] border border-amber-500/50 hover:border-amber-500 rounded-lg text-xs font-bold text-amber-500 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.1)] cursor-pointer">
                <FileText className="h-4 w-4" />
                {item.split("/").pop()}
              </button>
            ))}

            <div className="space-y-2">
              {sale.files?.map((fileUrl, idx) => {
                const fileName = fileUrl.split('/').pop() || `Attachment_${idx + 1}`;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0B101E] border border-[#1E293B] rounded-lg group hover:border-[#334155] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-300 truncate max-w-[120px]">{fileName}</p>
                    </div>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-[#00E5FF] transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                );
              })}

              {(!sale.files || sale.files.length === 0) && (
                <div className="text-center py-4 opacity-40">
                  <p className="text-[10px] font-bold text-gray-500">No documents found</p>
                </div>
              )}
            </div>
          </div>

          {/* 7. QUICK STATS */}
          <div className="bg-gradient-to-br from-[#00E5FF]/10 to-transparent rounded-xl border border-[#00E5FF]/20 p-5">
            <h2 className="text-sm font-black text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Payment Status</span>
                <span className="text-[11px] text-white font-bold">{sale.invoice?.status === 'paid' ? 'SETTLED' : 'PENDING'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Invoice No</span>
                <span className="text-[11px] text-white font-bold">{sale.invoice?.invoiceNumber || 'NOT GEN'}</span>
              </div>
              <div className="h-px bg-[#1E293B] w-full" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Final Vendor Payout</span>
                <span className="text-[11px] text-[#00E5FF] font-bold">${sale.billing?.vendorPayment?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 8. AUDIT TRAIL / ACTIVITY TIMELINE */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white mb-4">Audit Trail</h2>

            <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#1E293B]">
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#151B2B] shrink-0 bg-emerald-500">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
                <div className="ml-6 space-y-1">
                  <p className="text-xs font-bold text-white">Record Created</p>
                  <p className="text-[10px] text-gray-500 font-medium">By {sale.createdBy || 'System'} • {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>

              <div className="relative flex items-start gap-4 opacity-50">
                <div className="absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#151B2B] shrink-0 bg-[#1E293B]">
                  <Activity className="h-3 w-3 text-gray-500" />
                </div>
                <div className="ml-6 space-y-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Waiting for Approval</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTIONS FOR APPROVAL */}
      {
        saleStatus !== 'APPROVED' && (
          <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-[#0B101E]/80 backdrop-blur-md border-t border-[#1E293B] p-4 flex items-center justify-end gap-4 z-40">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-8 py-2.5 text-sm font-bold text-[#0B101E] bg-[#00E5FF] hover:bg-cyan-400 rounded-lg transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              disabled={isUpdatingStatus}
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve & Confirm Sale
            </button>
          </div>
        )
      }

      {/* REP NOTE MODAL */}
      {
        showRepNote && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#151B2B] border border-[#1E293B] rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
              <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#00E5FF]" />
                  Rep Note
                </h3>
                <button
                  onClick={() => setShowRepNote(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-[#0B101E] rounded-xl border border-[#1E293B] p-4">
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    {sale?.repNotes || "No specific notes provided by the representative for this sale."}
                  </p>
                </div>
                <button
                  onClick={() => setShowRepNote(false)}
                  className="w-full mt-5 py-2 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Close Note
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* APPROVE MODAL */}
      {
        showApproveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#151B2B] border border-[#1E293B] rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Approve Sale</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Are you sure you want to approve sale {sale.saleId}?
                  The commission will be moved to the Finance module.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-2.5 bg-[#00E5FF] hover:bg-cyan-400 text-[#0B101E] rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
                  >
                    Confirm Approval
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
