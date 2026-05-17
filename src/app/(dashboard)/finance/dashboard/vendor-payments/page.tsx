"use client";

import { useState, useMemo } from 'react';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useVendorPayments, useVendorPaymentsSummary } from '@/hooks/admin/vendor-payment';
import { Download, FileText } from 'lucide-react';
import { ConfirmPaymentModal } from '@/components/modals/ConfirmPaymentModal';
import { CommonFilterPill, VendorPaymentStatCard } from '@/components/stats-card';

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
              className="px-3 py-1.5 text-[10px] font-medium text-white dark:text-[#0B101E] bg-primary rounded-lg hover:bg-primary/90 cursor-pointer"
            >
              Pay Now
            </button>
          ) : (
            <button className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground border border-[var(--border)] rounded-lg hover:text-foreground hover:bg-white/5 transition-all flex items-center gap-1.5 uppercase">
              <FileText className="w-3 h-3" />
              Receipt
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-700 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Vendor Payments
          </h1>
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            Manage implant costs, authorized supply payments, and track vendor disbursement statuses across all active sales.
          </p>
        </div>
        <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer flex items-center gap-2">
          <Download className="w-3.5 h-3.5" />
          EXPORT
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <VendorPaymentStatCard
          title="TOTAL PAID"
          value={summary?.totalPaid?.amount}
          trend={`${summary?.totalPaid?.count || 0} disbursements`}
          topBorderColor="border-t-[#00E5FF]"
          loading={summaryLoading}
        />
        <VendorPaymentStatCard
          title="PENDING"
          value={summary?.totalPending?.amount}
          trend={`${summary?.totalPending?.count || 0} pending`}
          trendColor="text-amber-500"
          topBorderColor="border-t-amber-500"
          loading={summaryLoading}
        />
        <VendorPaymentStatCard
          title="OVERDUE"
          value={summary?.totalOverdue?.amount}
          trend={`${summary?.totalOverdue?.count || 0} overdue`}
          trendColor="text-rose-500"
          topBorderColor="border-t-rose-500"
          loading={summaryLoading}
        />
        <VendorPaymentStatCard
          title="THIS MONTH"
          value={summary?.thisMonth?.amount}
          trend={`${summary?.thisMonth?.count || 0} items`}
          topBorderColor="border-t-emerald-500"
          loading={summaryLoading}
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] dark:shadow-xl dark:shadow-black/5 transition-all overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 border-b border-[var(--border)] bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h2 className="text-base font-bold text-foreground">Payment Records</h2>
            <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {meta?.totalResult || 0} TOTAL
            </span>
          </div>
          <div className="flex items-center gap-2 p-1">
            <CommonFilterPill
              text="All"
              active={filter === 'All'}
              onClick={() => setFilter('All')}
            />
            <CommonFilterPill
              text="Paid"
              active={filter === 'Paid'}
              color="text-emerald-400 hover:bg-emerald-500/10"
              activeColor="bg-emerald-500 text-white dark:text-black"
              onClick={() => setFilter('Paid')}
            />
            <CommonFilterPill
              text="Pending"
              active={filter === 'Pending'}
              color="text-amber-500 hover:bg-amber-500/10"
              activeColor="bg-amber-500 text-white dark:text-black"
              onClick={() => setFilter('Pending')}
            />
            <CommonFilterPill
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

