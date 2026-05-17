"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useAgingReports, useAgingReportSummary } from '@/hooks/finance/aging-report';
import { IAgingReport } from '@/hooks/finance/aging-report/interface';
import { Download } from 'lucide-react';
import { BucketStatsCard, CommonFilterPill } from '@/components/stats-card';

export default function AgingReportsPage() {
  const [filter, setFilter] = useState('All');

  const { summary, loading: isLoading } = useAgingReportSummary();

  const { agingReports, loading: isLoadingReports, meta, query, setQuery } = useAgingReports();

  const handleFilterChange = (status: string) => {
    setFilter(status);
    setQuery({
      ...query,
      status: status === 'All' ? "" : status,
      page: 1
    });
  };

  const columns = [
    {
      header: "INVOICE",
      render: (item: IAgingReport) => (
        <span className="font-medium text-foreground">
          {item.sale?.invoice?.invoiceNumber || "N/A"}
        </span>
      )
    },
    {
      header: "HOSPITAL",
      render: (item: IAgingReport) => item.sale?.facility?.name || "N/A"
    },
    {
      header: "AMOUNT",
      render: (item: IAgingReport) => (
        <span className="text-primary font-medium">
          ${item.sale?.invoice?.invoiceAmount?.toLocaleString() || "0"}
        </span>
      )
    },
    {
      header: "DAYS PENDING",
      render: (item: IAgingReport) => `${item.daysPending || 0} days`
    },
    {
      header: "STATUS",
      render: (item: IAgingReport) => {
        const status = item.status || "PENDING";
        let type: "success" | "warning" | "error" = "success";
        if (status === 'PENDING') type = 'warning';
        if (status === 'OVERDUE' || status === 'CRITICAL') type = 'error';
        return <StatusBadge status={status} type={type} />;
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Aging Report
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Overdue payment tracking and analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer flex items-center gap-2">
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <BucketStatsCard
          title="0-30 DAYS"
          amount={`$${summary?.zeroToThirty.amount.toLocaleString() || "0"}`}
          count={`${summary?.zeroToThirty.invoices || 0} Invoices`}
          borderColor="border-t-[#00E5FF]"
          textColor="text-primary"
          loading={isLoading}
        />
        <BucketStatsCard
          title="30-60 DAYS"
          amount={`$${summary?.thirtyToSixty.amount.toLocaleString() || "0"}`}
          count={`${summary?.thirtyToSixty.invoices || 0} Invoices`}
          borderColor="border-t-amber-500"
          textColor="text-amber-500"
          loading={isLoading}
        />
        <BucketStatsCard
          title="60-90 DAYS"
          amount={`$${summary?.sixtyToNinety.amount.toLocaleString() || "0"}`}
          count={`${summary?.sixtyToNinety.invoices || 0} Invoices`}
          borderColor="border-t-rose-400"
          textColor="text-rose-400"
          loading={isLoading}
        />
        <BucketStatsCard
          title="90+ DAYS"
          amount={`$${summary?.ninetyPlus.amount.toLocaleString() || "0"}`}
          count={`${summary?.ninetyPlus.invoices || 0} Invoices`}
          borderColor="border-t-rose-600"
          textColor="text-rose-600"
          loading={isLoading}
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] dark:shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-sm font-bold text-foreground">Aging Invoices</h2>
          <div className="flex gap-2 bg-[var(--background)] rounded-lg border border-border w-full sm:w-auto overflow-x-auto p-1">
            <CommonFilterPill
              text="All" active={filter === 'All'}
              onClick={() => handleFilterChange('All')}
            />
            <CommonFilterPill
              text="Pending"
              active={filter === 'pending'}
              color="bg-amber-500/20 text-amber-500"
              activeColor="bg-amber-500 text-[var(--background)]"
              onClick={() => handleFilterChange('pending')}
            />
            <CommonFilterPill
              text="Critical"
              active={filter === 'critical'}
              color="bg-rose-500/20 text-rose-500"
              activeColor="bg-rose-500 text-[var(--background)]"
              onClick={() => handleFilterChange('critical')}
            />
            <CommonFilterPill
              text="Overdue"
              active={filter === 'overdue'}
              color="bg-red-500/20 text-red-500"
              activeColor="bg-red-500 text-[var(--background)]"
              onClick={() => handleFilterChange('overdue')}
            />

          </div>
        </div>
        <DataTable
          data={agingReports}
          className='border-none rounded-none'
          columns={columns}
          loading={isLoadingReports}
          pagination={meta ? {
            currentPage: meta.currentPage,
            totalPage: meta.totalPage,
            totalResult: meta.totalResult,
            onPageChange: (page) => setQuery({ ...query, page })
          } : undefined}
        />
      </div>
    </div>
  );
}
