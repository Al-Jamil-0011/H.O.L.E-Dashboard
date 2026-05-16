"use client";

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useVendorPayments, useVendorPaymentsSummary } from '@/hooks/admin/vendor-payment';
import { Landmark, Download, Search, FileText } from 'lucide-react';
import { ConfirmPaymentModal } from '@/components/modals/ConfirmPaymentModal';

export default function VendorPaymentsPage() {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    _id: string;
    vendorName: string;
    invoiceNumber: string;
    amount: number;
  } | null>(null);

  const { summary, loading: summaryLoading } = useVendorPaymentsSummary();
  const { payments, loading, error, meta, query, setQuery, refetch } = useVendorPayments();

  const filteredData = useMemo(() => {
    return payments.filter(item => {
      if (filter === 'All') return true;
      if (filter === 'Paid') return item.paymentStatus === 'paid';
      if (filter === 'Pending') return item.paymentStatus === 'pending';
      if (filter === 'Overdue') return item.paymentStatus === 'failed'; // Assuming failed/overdue
      return true;
    });
  }, [payments, filter]);

  const handlePayNow = (item: any) => {
    setSelectedPayment({
      _id: item._id,
      vendorName: item.vendor.name,
      invoiceNumber: item.invoiceNumber,
      amount: item.vendorPayment
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: "VENDOR",
      className: "font-semibold text-foreground",
      render: (item: any) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] border border-primary/20">
            {item?.vendor?.name?.charAt(0) || 'V'}
          </div>
          <span>{item?.vendor?.name}</span>
        </div>
      )
    },
    {
      header: "INVOICE #",
      className: "text-muted-foreground font-mono text-[11px]",
      render: (item: any) => <span>{item.invoiceNumber}</span>
    },
    {
      header: "SALE ID",
      className: "text-blue-400 font-medium",
      render: (item: any) => <span>{item.saleId}</span>
    },
    {
      header: "TOTAL AMOUNT",
      render: (item: any) => (
        <span className="font-mono text-foreground opacity-80">
          ${(item.totalAmount || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: "VENDOR PAYMENT",
      className: "text-amber-500 font-bold",
      render: (item: any) => (
        <span className="font-mono">
          ${(item.vendorPayment || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: "STATUS",
      render: (item: any) => {
        const status = item.paymentStatus as string;
        let type: "success" | "warning" | "error" = "success";
        if (status === 'pending') type = 'warning';
        if (status === 'failed') type = 'error';
        return <StatusBadge status={status?.toUpperCase()} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.paymentStatus === 'pending' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePayNow(item);
              }}
              className="px-3 py-1.5 text-[10px] font-black text-[#0B101E] bg-primary rounded-lg hover:bg-primary/90 cursor-pointer"
            >
              Pay Now
            </button>
          ) : (
            <button className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground border border-[var(--border)] rounded-lg hover:text-foreground hover:bg-white/5 transition-all flex items-center gap-1.5 uppercase">
              <FileText className="w-3 h-3" />
              Receipt
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Vendor Payments
          </h1>
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            Manage implant costs, authorized supply payments, and track vendor disbursement statuses across all active sales.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-foreground bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] transition-all hover:bg-amber-500/5 group w-max cursor-pointer">
          <Download className="w-3.5 h-3.5" />
          EXPORT
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TOTAL PAID"
          value={summary?.totalPaid?.amount}
          trend={`${summary?.totalPaid?.count || 0} disbursements`}
          topBorderColor="border-t-[#00E5FF]"
          loading={summaryLoading}
        />
        <StatCard
          title="PENDING"
          value={summary?.totalPending?.amount}
          trend={`${summary?.totalPending?.count || 0} pending`}
          trendColor="text-amber-500"
          topBorderColor="border-t-amber-500"
          loading={summaryLoading}
        />
        <StatCard
          title="OVERDUE"
          value={summary?.totalOverdue?.amount}
          trend={`${summary?.totalOverdue?.count || 0} overdue`}
          trendColor="text-rose-500"
          topBorderColor="border-t-rose-500"
          loading={summaryLoading}
        />
        <StatCard
          title="THIS MONTH"
          value={summary?.thisMonth?.amount}
          trend={`${summary?.thisMonth?.count || 0} items`}
          topBorderColor="border-t-emerald-500"
          loading={summaryLoading}
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/5 transition-all overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 border-b border-[var(--border)] bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h2 className="text-base font-black text-foreground tracking-tight uppercase">Payment Records</h2>
            <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {meta?.totalResult || 0} TOTAL
            </span>
          </div>
          <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-xl border border-[var(--border)]">
            <FilterPill
              text="All"
              active={filter === 'All'}
              onClick={() => setFilter('All')}
            />
            <FilterPill
              text="Paid"
              active={filter === 'Paid'}
              color="text-emerald-400 hover:bg-emerald-500/10"
              activeColor="bg-emerald-500 text-white dark:text-black"
              onClick={() => setFilter('Paid')}
            />
            <FilterPill
              text="Pending"
              active={filter === 'Pending'}
              color="text-amber-500 hover:bg-amber-500/10"
              activeColor="bg-amber-500 text-white dark:text-black"
              onClick={() => setFilter('Pending')}
            />
            <FilterPill
              text="Overdue"
              active={filter === 'Overdue'}
              color="text-rose-500 hover:bg-rose-500/10"
              activeColor="bg-rose-500 text-white dark:text-black"
              onClick={() => setFilter('Overdue')}
            />
          </div>
        </div>
        <div className="flex-1 px-6 pb-6 pt-2">
          <DataTable
            data={filteredData}
            columns={columns}
            loading={loading}
            onRowClick={() => { }}
          />
        </div>
      </div>

      <ConfirmPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentData={selectedPayment}
        onConfirm={() => {
          // In a real app, we would refetch here
          // refetch();
        }}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  loading,
  trendColor = "text-[#00E5FF]",
  topBorderColor,
}: {
  title: string;
  value?: string | number;
  trend: string;
  loading?: boolean;
  trendColor?: string;
  topBorderColor: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02] hover:-translate-y-1 duration-300",
        topBorderColor
      )}
    >
      <h3 className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60">
        {title}
      </h3>

      <div className="mt-4">
        {loading ? (
          <>
            <div className="h-8 w-28 bg-muted/50 rounded-md animate-pulse" />
            <div className="mt-2 h-3 w-20 bg-muted/40 rounded animate-pulse" />
          </>
        ) : (
          <>
            <div className="text-3xl font-black tracking-tight text-foreground flex items-baseline gap-1">
              $ {(value || 0).toLocaleString()}
            </div>

            <p className={cn("mt-2 text-[10px] font-bold uppercase tracking-wider", trendColor)}>
              {trend}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function FilterPill({ text, active, onClick, color, activeColor }: { text: string, active: boolean, onClick: () => void, color?: string, activeColor?: string }) {
  const baseClasses = "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-[var(--border)] transition-all cursor-pointer";

  if (active) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColor || "bg-[var(--border)] text-foreground border-[var(--border)]")}>
        {text}
      </button>
    );
  }

  if (color) {
    return (
      <button onClick={onClick} className={cn(baseClasses, color, "hover:opacity-80")}>
        {text}
      </button>
    )
  }

  return (
    <button onClick={onClick} className={cn(baseClasses, "text-muted-foreground hover:text-foreground hover:bg-[var(--border)]/50")}>
      {text}
    </button>
  )
}


