"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, CheckCircle2, FileText, Download, Eye, Plus,
  MessageSquare, Building2, UserCircle2,
  Activity, DollarSign, Stethoscope, Briefcase, MapPin,
  AlertCircle, UploadCloud, Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSingleSale, useUpdateSale, useUpdateSaleStatus } from '@/hooks/admin/sales';
import Loader from '@/components/loader';
import toast from 'react-hot-toast';
import Image from "next/image";


export default function SaleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [saleStatus, setSaleStatus] = useState("");
  const [showRepNote, setShowRepNote] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);


  const { sale, loading: salesLoading, refetch } = useSingleSale(params.id as string);
  const { updateSaleStatus, loading: isUpdatingStatus } = useUpdateSaleStatus();
  const { updateSale } = useUpdateSale();

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

  // const primaryRep = sale.representatives?.users?.find((u: any) => u.assignRole === 'primary');
  // const assistRep = sale.representatives?.users?.find((u: any) => u.assignRole === 'assist');

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-5 rounded-xl border border-border dark:shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors group cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground tracking-tight">Sale #{sale.saleId}</h1>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-medium rounded uppercase tracking-widest",
                saleStatus === 'APPROVED' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  saleStatus === 'PENDING' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              )}>
                {saleStatus}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
              Transaction ID: <span className="text-muted-foreground/80">{sale._id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRepNote(true)}
            className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors text-sm font-medium border border-border cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Rep Note</span>
          </button>

          <button
            onClick={() => {
              document.getElementById('admin-note-section')?.scrollIntoView({ behavior: 'smooth' });
              document.getElementById('admin-note-input')?.focus();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors text-sm font-medium border border-border cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Note</span>
          </button>

          {saleStatus !== 'APPROVED' && (
            <button
              onClick={() => setShowApproveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-background hover:opacity-90 rounded-lg transition-all text-sm font-medium dark:shadow-[0_0_15px_rgba(var(--primary),0.3)] cursor-pointer disabled:opacity-50"
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
          <div className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border border-border text-primary">
                {sale?.createdBy?.profileUrl ? (
                  <Image
                    src={sale.createdBy.profileUrl}
                    alt={sale.createdBy.fullName || 'User'}
                    width={48}
                    height={48}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Created by</p>
                <p className="text-base font-bold text-foreground">
                  {sale?.createdBy?.fullName || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Sale Type</p>
                <span className="text-xs font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded border border-primary/10">{sale.salesType}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Procedure Date</p>
                <p className="text-sm font-bold text-foreground">{sale.procedureDate ? new Date(sale.procedureDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* 2. SHIPMENT & FACILITY INFO */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Shipment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">Physician</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 border border-border">
                    {sale.physician?.profileUrl ? (
                      <Image
                        src={sale.physician.profileUrl}
                        width={0}
                        height={0}
                        className="h-full w-full rounded object-cover" alt="" />
                    ) : (
                      <Stethoscope className="h-5 w-5 text-purple-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{sale.physician?.fullName || 'N/A'}</p>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase truncate">{sale.physician?.specialty || 'General'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">Hospital / Facility</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 border border-border">
                    <Building2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{sale.facility?.address || 'N/A'}</p>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase truncate">{sale.facility?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">Workflow Status</p>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-10 w-10 rounded flex items-center justify-center shrink-0 border",
                    saleStatus === 'APPROVED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                  )}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground uppercase">{sale.status}</p>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase">Last Updated: {sale.updatedAt ? new Date(sale.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IMPLANT & BILLING */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Implant & Billing
            </h2>

            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                <div className="p-4">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Vendor / Partner</p>
                  <div className="flex items-center gap-2">
                    {typeof sale.billing?.vendor === 'object' && sale.billing.vendor.profileUrl && (
                      <Image
                        src={sale.billing.vendor.profileUrl}
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full"
                        alt="vendor-image" />
                    )}
                    <p className="text-sm font-bold text-foreground">{typeof sale.billing?.vendor === 'object' ? sale.billing.vendor.name : 'N/A'}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Purchase Order (PO)</p>
                  <p className="text-sm font-bold text-foreground">{sale.billing?.purchaseOrderNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-4">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Bill</p>
                  <p className="text-xl font-medium text-foreground">${sale.billing?.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-4 bg-emerald-500/5">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Commission Pool</p>
                  <p className="text-xl font-medium text-emerald-500">${sale.representatives?.totalCommission?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-emerald-500/70 font-medium mt-1 uppercase">Total pool for all reps</p>
                </div>
              </div>
            </div>
          </div>

          {/*  INVENTORY ITEMS */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Inventory Item List
            </h2>

            <div className="space-y-2">
              {visibleInventoryProducts?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.productType}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Product Ref: {typeof item.product === 'object' ? (item.product?.systemType || item.product?.serialNumber || item.product?._id) : item.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase">Processed</span>
                  </div>
                </div>
              ))}

              {(!visibleInventoryProducts || visibleInventoryProducts.length === 0) && (
                <div className="text-center py-6 opacity-40">
                  <p className="text-xs font-bold text-muted-foreground">No inventory products linked</p>
                </div>
              )}
            </div>

            {(sale.inventoryProducts?.length ?? 0) > 4 && (
              <button
                onClick={() => setShowAllItems((prev) => !prev)}
                className="w-full mt-4 py-2.5 bg-muted border border-border hover:bg-muted/80 rounded-lg text-xs font-medium text-primary transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {showAllItems ? (
                  <>Show Less Items</>
                ) : (
                  <>View All {(sale.inventoryProducts?.length ?? 0)} Items</>
                )}
              </button>
            )}
          </div>

          {/* ADMIN NOTE SECTION */}
          <div id="admin-note-section" className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Finance Review Feedback
              </h2>
              {
                sale?.feedbackNotes && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                    <CheckCircle2 className="h-3 w-3" />
                    Feedback Delivered
                  </div>
                )
              }
            </div>

            <div className="bg-background rounded-xl border border-border p-4 space-y-4">
              <textarea
                id="admin-note-input"
                className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none h-28"
                placeholder="Enter internal notes or feedback for the sales representative..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2 max-w-[60%]">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Confidential Note</p>
                    <p className="text-[9px] text-muted-foreground/70">These comments are visible to the representative and logged for compliance.</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmitNote}
                  disabled={isSubmittingNote}
                  className="px-6 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer bg-primary text-background hover:opacity-90 dark:shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmittingNote && <div className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin" />}
                  {sale?.feedbackNotes ? 'Update Feedback' : 'Send Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR (1/3 width) */}
        <div className="space-y-6">

          {/* 5. REPRESENTATIVE SPLIT */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <UserCircle2 className="h-4 w-4 text-primary" />
              Commission Split
            </h2>

            <div className="space-y-3">
              {sale.representatives?.users?.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold border",
                      user.assignRole === 'primary' ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                    )}>
                      {user.assignRole === 'primary' ? 'PRI' : 'AST'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate max-w-[120px]">
                        {user.representative?.fullName || 'Unknown'}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">{user.assignRole}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{user.commissionRate}%</p>
                    <p className="text-[9px] text-emerald-500 font-bold">${user.commission?.toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Finance Allocation</span>
                  <span className="text-lg font-medium text-emerald-500">${sale.representatives?.myCommission?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-[9px] text-muted-foreground/60 italic leading-tight">
                  Net profit share after vendor payouts and operational costs.
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-primary" />
              Documents & Files
            </h2>

            <div className="space-y-3">
              {sale.files?.map((fileUrl, idx) => {
                const fileName = fileUrl.split('/').pop() || `Attachment_${idx + 1}`;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded bg-muted text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-foreground truncate max-w-[140px]">{fileName}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Linked Asset</p>
                      </div>
                    </div>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                );
              })}

              {(!sale.files || sale.files.length === 0) && (
                <div className="text-center py-8 bg-background/50 rounded-lg border border-dashed border-border opacity-60">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No documents attached</p>
                </div>
              )}
            </div>
          </div>

          {/* 7. QUICK STATS */}
          <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/20 p-5">
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Settlement Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">Invoicing</span>
                <span className={cn(
                  "px-2 py-0.5 text-[9px] font-bold rounded",
                  sale.invoice?.status === 'paid' ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                )}>
                  {sale.invoice?.status === 'paid' ? 'SETTLED' : 'OPEN BILL'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">Invoice Ref</span>
                <span className="text-[11px] text-foreground font-bold tracking-tighter">{sale.invoice?.invoiceNumber || 'NOT GENERATED'}</span>
              </div>
              <div className="h-px bg-border/50 w-full" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">Vendor Payout</span>
                <span className="text-[13px] text-primary font-medium tracking-tight">${sale.billing?.vendorPayment?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 8. AUDIT TRAIL / ACTIVITY TIMELINE */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Audit Log
            </h2>

            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-muted">
              <div className="relative flex items-start">
                <div className="absolute left-[-22px] flex items-center justify-center w-6 h-6 rounded-full border-2 border-card shrink-0 bg-emerald-500 dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-3 w-3 text-background" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground">Transaction Created</p>
                  <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                    Initiated by {sale.createdBy?.fullName || 'System'}<br />
                    {sale.createdAt ? new Date(sale.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>

              <div className="relative flex items-start opacity-60">
                <div className="absolute left-[-22px] flex items-center justify-center w-6 h-6 rounded-full border-2 border-card shrink-0 bg-muted">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Review</p>
                  <p className="text-[9px] text-muted-foreground font-medium">Awaiting finance department approval</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTIONS FOR APPROVAL */}
      {
        saleStatus !== 'APPROVED' && (
          <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-background/80 backdrop-blur-md border-t border-border p-4 flex items-center justify-end gap-4 z-40">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-8 py-2.5 text-sm font-medium text-background bg-primary hover:opacity-90 rounded-lg transition-all dark:shadow-[0_0_15px_rgba(var(--primary),0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
            <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 dark:shadow-2xl">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Rep Note
                </h3>
                <button
                  onClick={() => setShowRepNote(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-background rounded-xl border border-border p-5">
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    {sale?.repNotes || "No specific notes provided by the representative for this sale."}
                  </p>
                </div>
                <button
                  onClick={() => setShowRepNote(false)}
                  className="w-full mt-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-medium transition-colors cursor-pointer"
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
            <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 dark:shadow-2xl">
              <div className="p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 dark:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Approve Sale</h3>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  Are you sure you want to approve sale <span className="text-foreground font-bold">{sale.saleId}</span>?<br />
                  This action will finalize the commission and move it to the Finance module for settlement.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isUpdatingStatus}
                    className="flex-1 py-3 bg-primary hover:opacity-90 text-background rounded-xl text-sm font-medium transition-all dark:shadow-[0_0_15px_rgba(var(--primary),0.3)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdatingStatus && <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />}
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
