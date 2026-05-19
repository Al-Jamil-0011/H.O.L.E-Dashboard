"use client";

import { useState } from 'react';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useInvoices, useInvoiceSummary } from '@/hooks/finance/invoice-management';
import { CommonFilterPill, DashboardStatCard } from '@/components/stats-card';
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  Receipt,
} from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function InvoicesPage() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { summary: invoiceSummary, loading: invoiceLoading, refetch: refetchInvoiceSummary } = useInvoiceSummary();

  const { invoices, loading: salesLoading, setQuery, meta, refetch } = useInvoices();

  const handleFilterChange = (status: string) => {
    setFilter(status);
    setQuery(prev => ({
      ...prev,
      page: 1,
      status: status === 'All' ? undefined : status.toLowerCase() as any
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setQuery(prev => ({
      ...prev,
      page: 1,
      searchTerm: value
    }));
  };

  const columns = [
    {
      header: "INVOICE ID",
      className: "font-semibold text-primary",
      render: (item: any) => {
        const val = item.invoice?.invoiceNumber;
        return <span className="font-semibold text-primary tracking-wide">{val || 'N/A'}</span>;
      }
    },
    {
      header: "SALE ID",
      className: "font-medium text-foreground",
      render: (item: any) => {
        const val = typeof item.saleId === 'object' ? (item.saleId?.saleId || item.saleId?._id || '') : item.saleId;
        return <span className="font-mono text-foreground">#{String(val || '')}</span>;
      }
    },
    {
      header: "HOSPITAL",
      render: (item: any) => {
        const facility = item.facility;
        const name = facility?.name || 'N/A';
        const address = facility?.address || 'N/A';
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground truncate max-w-[160px]" title={name}>
              {name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[160px]" title={address}>
              {address}
            </span>
          </div>
        );
      }
    },
    {
      header: "DUE DATE",
      render: (item: any) => {
        const dateVal = item.dueDate || item.invoice?.invoiceDate || item.procedureDate || item.createdAt;
        return (
          <span className="font-medium text-foreground">
            {dateVal ? dayjs(dateVal).format("MMM DD, YYYY") : 'N/A'}
          </span>
        );
      }
    },
    {
      header: "REP",
      render: (item: any) => {
        const primaryRep = item.representatives?.users?.find((u: any) => u.assignRole === 'primary')?.representative;
        const name = typeof primaryRep === 'object' ? primaryRep?.fullName : (item.createdBy?.fullName || 'N/A');
        const email = typeof primaryRep === 'object' ? primaryRep?.email : (item.createdBy?.email || '');
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground truncate max-w-[120px]">{name}</span>
            {email && <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{email}</span>}
          </div>
        );
      }
    },
    {
      header: "DOCTOR",
      render: (item: any) => {
        const doc = item.physician;
        const name = typeof doc?.fullName === 'string' ? doc.fullName : 'N/A';
        const specialty = typeof doc?.specialty === 'string' ? doc.specialty : '';
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground truncate max-w-[120px]">{name}</span>
            {specialty && <span className="text-[10px] text-muted-foreground capitalize truncate max-w-[120px]">{specialty}</span>}
          </div>
        );
      }
    },
    {
      header: "AMOUNT",
      render: (item: any) => {
        const amount = typeof item.billing?.totalAmount === 'object' ? 0 : Number(item.billing?.totalAmount || 0);
        return <span className="text-primary font-bold">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
      }
    },
    {
      header: "COMMISSION",
      render: (item: any) => {
        const comm = typeof item.representatives?.totalCommission === 'object' ? 0 : Number(item.representatives?.totalCommission || 0);
        return <span className="text-emerald-500 font-bold">${comm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
      }
    },
    {
      header: "STATUS",
      render: (item: any) => {
        const status = (item.invoice?.status || item.status || 'UNKNOWN').toUpperCase();
        let type: "success" | "warning" | "error" = "success";
        if (status === 'PENDING' || status === 'UNPAID') type = 'warning';
        if (status === 'REJECTED' || status === 'OVERDUE') type = 'error';
        return <StatusBadge status={status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: any) => {
        return (
          <Link href={`/finance/dashboard/invoices/${item._id}`}>
            <button
              className="px-3 py-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors cursor-pointer">
              Details
            </button>
          </Link>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Invoice Management
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            Real-time hospital invoice generation, status tracking, and facility communications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              refetch();
              refetchInvoiceSummary();
            }}
            className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer group flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 group-hover:rotate-180 duration-500" />
            Refresh
          </button>
          <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer group flex items-center gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Dynamic Statistics Panel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="TOTAL INVOICED VOLUME"
          value={`$${(invoiceSummary?.totalVolume || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="Total amount"
          trendType="neutral"
          topBorderColor="border-t-primary"
          loading={invoiceLoading}
        />

        <DashboardStatCard
          title="REP COMMISSIONS"
          value={`$${(invoiceSummary?.totalCommissions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="Total payout accrued"
          trendType="neutral"
          topBorderColor="border-t-emerald-500"
          loading={invoiceLoading}
        />

        <DashboardStatCard
          title="PENDING INVOICES"
          value={String(invoiceSummary?.pendingCount || 0)}
          trend={(invoiceSummary?.pendingCount || 0) > 0 ? "Requires attention" : "No pending items"}
          trendType={(invoiceSummary?.pendingCount || 0) > 0 ? "down" : "up"}
          topBorderColor="border-t-amber-500"
          loading={invoiceLoading}
        />

        <DashboardStatCard
          title="SETTLED INVOICES"
          value={String(invoiceSummary?.paidCount || 0)}
          trend="Paid transactions"
          trendType="up"
          topBorderColor="border-t-cyan-400"
          loading={invoiceLoading}
        />
      </div>

      {/* Glassmorphic Data Table Card */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md dark:shadow-md transition-all overflow-hidden flex flex-col">
        {/* Table Filter and Action Header */}
        <div className="flex flex-col md:flex-row gap-4 p-5 pb-5 border-b border-border sm:flex-row sm:items-center sm:justify-between bg-muted/20">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              Invoice Records
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary">
                {meta ? meta.totalResult : invoices.length} overall
              </span>
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Browse invoices, download statement PDFs, or dispatch confirmation emails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md py-2 pl-9 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)] transition-colors"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 p-1 bg-background rounded-lg border border-border overflow-x-auto">
              <CommonFilterPill
                text="All"
                active={filter === 'All'} 
                onClick={() => handleFilterChange('All')}
              />
              <CommonFilterPill
                text="Paid"
                active={filter === 'Paid'}
                color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                activeColor="bg-emerald-500 text-background border-emerald-500"
                onClick={() => handleFilterChange('Paid')}
              />
              <CommonFilterPill
                text="Pending"
                active={filter === 'Pending'}
                color="bg-amber-500/10 text-amber-500 border-amber-500/20"
                activeColor="bg-amber-500 text-background border-amber-500"
                onClick={() => handleFilterChange('Pending')}
              />
              <CommonFilterPill
                text="Overdue"
                active={filter === 'Overdue'}
                color="bg-rose-500/10 text-rose-500 border-rose-500/20"
                activeColor="bg-rose-500 text-background border-rose-500"
                onClick={() => handleFilterChange('Overdue')}
              />
            </div>
          </div>
        </div>
        <DataTable
          data={invoices}
          className="!border-none !rounded-none"
          columns={columns}
          loading={salesLoading}
          onRowClick={() => { }}
          pagination={meta ? {
            currentPage: meta.currentPage,
            totalPage: meta.totalPage,
            totalResult: meta.totalResult,
            onPageChange: (page) => setQuery(prev => ({ ...prev, page }))
          } : undefined}
        />
      </div>
    </div>
  );
}
