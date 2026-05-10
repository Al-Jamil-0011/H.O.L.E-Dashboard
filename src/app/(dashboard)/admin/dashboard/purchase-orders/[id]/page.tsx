"use client";

import React from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Download, FileText,
  MapPin, Stethoscope, Briefcase, CheckCircle2, Clock,
  ExternalLink, Building2, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useSinglePurchaseOrder } from '@/hooks/admin/purchase-order';
import Loader from '@/components/loader';

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { purchaseOrder, loading: isLoading, error } = useSinglePurchaseOrder(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader size={32} text="Fetching order details..." />
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
          <Activity className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-gray-400">The purchase order you are looking for does not exist.</p>
        <Link href="/admin/dashboard/purchase-orders" className="px-6 py-2 bg-[#1E293B] text-white rounded-lg hover:bg-[#334155] transition-colors">Go Back</Link>
      </div>
    );
  }

  const isBulkBio = purchaseOrder.orderType === 'bulkBioOrder';
  const surgery = typeof purchaseOrder.surgery === 'object' ? purchaseOrder.surgery : null;
  const facility = typeof purchaseOrder.facility === 'object' ? purchaseOrder.facility : null;

  const productColumns = [
    { header: "PRODUCT NAME", accessorKey: "productName" as const, className: "font-semibold text-foreground" },
    { header: "PRODUCT ID", accessorKey: "productId" as const, className: "text-muted-foreground font-mono" },
    { 
      header: "ITEMS", 
      render: (item: any) => (
        <span className="text-muted-foreground">{item.listOfItems?.length || 0} items</span>
      ) 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">

      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/dashboard/purchase-orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest mb-3 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Purchase Order #{purchaseOrder.purchaseOrderNumber}</h1>
            <StatusBadge 
              status={purchaseOrder.status} 
              type={purchaseOrder.status === 'complete' ? 'success' : purchaseOrder.status === 'open' ? 'warning' : 'error'} 
            />
            <span className={cn(
              "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
              isBulkBio
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            )}>
              {isBulkBio ? 'Bulk Bio Order' : 'Standard Order'}
            </span>
          </div>
        </div>
        <ToolButton icon={<Download className="w-8 h-4" />} label="Export" />
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">

        {/* LEFT MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-6">

          {/* HERO SUMMARY CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden flex flex-col relative group">
            <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop")' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent" />
            </div>

            <div className="p-6 md:p-8 pt-0 relative z-10 -mt-10">
              <div className="flex items-end justify-between mb-8">
                <div className="h-20 w-20 rounded-2xl bg-[var(--background)] border-4 border-[var(--card)] flex items-center justify-center shadow-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total PO Amount</p>
                  <p className="text-3xl font-black text-primary tracking-tight">${purchaseOrder.totalAmount?.toLocaleString() || '0.00'}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">
                {isBulkBio ? 'Bulk Bio Stock Resupply' : 'Standard Case Supply'}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <SummarySpec icon={<MapPin />} label="Facility" value={facility?.address || 'N/A'} />
                <SummarySpec icon={<Stethoscope />} label="Surgeon" value={surgery?.info?.fullName || 'N/A'} />
                <SummarySpec icon={<Briefcase />} label="Vendor" value={purchaseOrder.sendMailToVendor?.name || 'N/A'} />
                <SummarySpec icon={<Clock />} label="Sub/Date" value={purchaseOrder.procedureDate ? new Date(purchaseOrder.procedureDate).toLocaleDateString() : 'N/A'} />
              </div>
            </div>
          </div>

          {/* PRODUCT LIST TABLE */}
          {purchaseOrder.products && purchaseOrder.products.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Line Items
                </h3>
              </div>

              <DataTable data={purchaseOrder.products} columns={productColumns} className="rounded-none border-0" />

              <div className="p-6 bg-[var(--muted)] border-t border-[var(--border)] flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${purchaseOrder.totalAmount?.toLocaleString() || '0.00'}</span>
                  </div>
                  <div className="pt-3 border-t border-[var(--border)] flex justify-between text-sm font-black text-foreground">
                    <span>Total Amount</span>
                    <span className="text-primary">${purchaseOrder.totalAmount?.toLocaleString() || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENTS SECTION */}
          {purchaseOrder.documents && purchaseOrder.documents.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6">
                <FileText className="w-4 h-4 text-primary" /> Associated Documents
              </h3>
              <div className="grid gap-3">
                {purchaseOrder.documents.map((doc: string, idx: number) => (
                  <div key={idx} className="group flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--border)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-[var(--border)] rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">{doc.split('/').pop()}</p>
                        <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                          Document File
                        </p>
                      </div>
                    </div>
                    <a 
                      href={doc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted-foreground bg-[var(--card)] rounded-lg border border-[var(--border)] hover:text-foreground hover:border-gray-500 transition-colors"
                    >
                      Preview <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>


        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">

          {/* QUICK SUMMARY MINI CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-5">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Revenue</span>
                <span className="text-sm font-black text-foreground">${purchaseOrder.totalAmount?.toLocaleString() || '0.00'}</span>
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Final Value</span>
                <span className="text-xl font-black text-primary">${purchaseOrder.totalAmount?.toLocaleString() || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* TIMELINE CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6">
            <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-6">Status Timeline</h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--primary)] before:to-[var(--border)]">
              <TimelineStep 
                title="PO Created" 
                date={purchaseOrder.createdAt ? new Date(purchaseOrder.createdAt).toLocaleString() : 'N/A'} 
                active 
                completed 
              />
              <TimelineStep 
                title="Sent to Vendor" 
                date={purchaseOrder.isSentToVendor ? 'Completed' : 'Pending'} 
                active={purchaseOrder.isSentToVendor} 
                completed={purchaseOrder.isSentToVendor} 
              />
              <TimelineStep 
                title="Final Status" 
                date={purchaseOrder.status.toUpperCase()} 
                active={purchaseOrder.status === 'complete'} 
                completed={purchaseOrder.status === 'complete'} 
                isCurrent={purchaseOrder.status !== 'complete'}
              />
            </div>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6 space-y-3">
            <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Quick Actions</h3>

            <ActionBtn icon={<Building2 />} label="Facility Info" />
            <ActionBtn icon={<Clock />} label="Update Timeline" />
            <ActionBtn icon={<CheckCircle2 />} label="Approve Payout" highlight />
          </div>

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// HELPER COMPONENTS
// -------------------------------------------------------------

function ToolButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground bg-[var(--card)]  cursor-pointer rounded-lg border border-[var(--border)] hover:text-foreground transition-colors bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20">
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SummarySpec({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-[var(--background)] text-muted-foreground border border-[var(--border)] rounded-lg">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-xs font-semibold text-foreground whitespace-nowrap">{value}</p>
      </div>
    </div>
  );
}

function TimelineStep({ title, date, active, completed, isCurrent }: { title: string, date: string, active: boolean, completed: boolean, isCurrent?: boolean }) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      {/* Icon Node */}
      <div className={cn(
        "flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10",
        completed ? "bg-primary border-[var(--primary)]" : isCurrent ? "bg-[var(--background)] border-[var(--primary)]" : "bg-[var(--border)] border-[var(--border)]"
      )}>
        {completed && <CheckCircle2 className="w-3 h-3 text-[var(--background)]" />}
        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
      </div>
      {/* Content */}
      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] pl-3 md:pl-0 md:group-odd:text-right md:group-even:text-left">
        <h4 className={cn("text-sm font-bold", active ? "text-foreground" : "text-muted-foreground")}>{title}</h4>
        <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mt-1">{date}</p>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, highlight }: { icon: React.ReactNode, label: string, highlight?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-xs font-bold",
      highlight
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer"
        : "bg-[var(--background)] border-[var(--border)] text-muted-foreground hover:text-foreground hover:border-[var(--border)]"
    )}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
      {label}
    </button>
  );
}
