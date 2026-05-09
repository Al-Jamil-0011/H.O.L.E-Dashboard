"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ChevronLeft, Download, Printer, Share2, Edit, FileText,
  MapPin, User, Stethoscope, Briefcase, CheckCircle2, Clock,
  Mail, MessageSquare, DollarSign, ExternalLink, Building2
} from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Knee Implant Advanced System 2x', qty: 2, price: '$2,400.00', total: '$4,800.00' },
  { id: 2, name: 'Bone Cement Standard (Pack of 5)', qty: 1, price: '$450.00', total: '$450.00' },
  { id: 3, name: 'Surgical Toolkit Disposable', qty: 3, price: '$50.00', total: '$150.00' },
];

const MOCK_DOCS = [
  { id: 1, name: 'PO_Invoice_88234.pdf', type: 'PDF', size: '2.4 MB', date: 'Feb 15, 2026' },
  { id: 2, name: 'Surgeon_Consult_Notes.docx', type: 'DOCX', size: '1.1 MB', date: 'Feb 14, 2026' },
  { id: 3, name: 'Shipping_Receipt_FedEx.pdf', type: 'PDF', size: '850 KB', date: 'Feb 16, 2026' }
];

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  // In a real app, this would be fetched from the database based on the ID.
  // Using a mock mapping to match the parent table's `category`:
  const isStandardOrder = ['ABC56789', 'DEF98765', 'GHI12345'].includes(id);
  const isBulkBio = !isStandardOrder;

  const productColumns = [
    { header: "PRODUCT NAME", accessorKey: "name" as const, className: "font-semibold text-foreground" },
    { header: "QTY", accessorKey: "qty" as const, className: "text-muted-foreground font-mono" },
    { header: "UNIT PRICE", accessorKey: "price" as const, className: "text-muted-foreground font-mono" },
    { header: "TOTAL", accessorKey: "total" as const, className: "text-primary font-bold font-mono tracking-wider" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">

      {/* ------------------------------------------------------------- */}
      {/* HEADER & BREADCRUMB */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/dashboard/purchase-orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest mb-3 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Purchase Order #{id}</h1>
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Paid / Complete
            </span>
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
        <ToolButton icon={<Download className="w-8 h-4" />} label="PDF" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GRID LAYOUT: 70% LEFT / 30% RIGHT STRATEGY */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">

        {/* ========================================================= */}
        {/* LEFT MAIN CONTENT (70%) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1) HERO SUMMARY CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden flex flex-col relative group">
            {/* Hospital Banner Image Placeholder */}
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
                  <p className="text-3xl font-black text-primary tracking-tight">$5,400.00</p>
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Advanced Orthopedic Resupply</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <SummarySpec icon={<MapPin />} label="Facility" value="City Hospital Network" />
                <SummarySpec icon={<Stethoscope />} label="Surgeon" value="Dr. Robert Smith" />
                <SummarySpec icon={<Briefcase />} label="Vendor" value="MedTech Supply Inc." />
                <SummarySpec icon={<Clock />} label="Sub/Date" value="Feb 15, 2026" />
              </div>
            </div>
          </div>

          {/* 2) PRODUCT LIST TABLE (ONLY FOR BULK BIO) */}
          {isBulkBio && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Line Items
                </h3>
              </div>

              <DataTable data={MOCK_PRODUCTS} columns={productColumns} className="rounded-none border-0" />

              {/* Subtotal Row */}
              <div className="p-6 bg-[var(--muted)] border-t border-[var(--border)] flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Subtotal</span>
                    <span>$5,400.00</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>Shipping & Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="pt-3 border-t border-[var(--border)] flex justify-between text-sm font-black text-foreground">
                    <span>Total Amount</span>
                    <span className="text-primary">$5,400.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3) DOCUMENTS SECTION */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6">
              <FileText className="w-4 h-4 text-primary" /> Associated Documents
            </h3>
            <div className="grid gap-3">
              {MOCK_DOCS.map((doc) => (
                <div key={doc.id} className="group flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--border)] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[var(--border)] rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground mb-0.5">{doc.name}</p>
                      <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                        {doc.type} • {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted-foreground bg-[var(--card)] rounded-lg border border-[var(--border)] hover:text-foreground hover:border-gray-500 transition-colors">
                    Preview <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>


        {/* ========================================================= */}
        {/* RIGHT SIDEBAR (30%) STICKY */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">

          {/* QUICK SUMMARY MINI CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-5">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Revenue</span>
                <span className="text-sm font-black text-foreground">$5,400.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-500">Commission (10%)</span>
                <span className="text-sm font-black text-emerald-500">+$540.00</span>
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Final Deposit</span>
                <span className="text-xl font-black text-primary">$4,860.00</span>
              </div>
            </div>
          </div>

          {/* TIMELINE CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6">
            <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-6">Status Timeline</h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--primary)] before:to-[var(--border)]">
              <TimelineStep title="PO Created" date="Feb 15, 2026 • 09:30 AM" active completed />
              <TimelineStep title="Sent to Vendor" date="Feb 15, 2026 • 11:45 AM" active completed />
              <TimelineStep title="Vendor Accepted" date="Feb 16, 2026 • 02:15 PM" active completed />
              <TimelineStep title="Payment Processed" date="Feb 18, 2026 • 10:00 AM" active completed={false} isCurrent />
              <TimelineStep title="Commission Distributed" date="Pending" active={false} completed={false} />
            </div>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6 space-y-3">
            <h3 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Quick Actions</h3>

            <ActionBtn icon={<Mail />} label="Email Vendor" />
            <ActionBtn icon={<MessageSquare />} label="Message Surgeon rep" />
            <ActionBtn icon={<CheckCircle2 />} label="Mark Commission Paid" highlight />
            <ActionBtn icon={<Download />} label="Download CSV Export" />
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
