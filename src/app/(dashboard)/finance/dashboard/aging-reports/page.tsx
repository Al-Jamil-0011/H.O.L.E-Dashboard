"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useAgingReports, useAgingReportSummary } from '@/hooks/finance/aging-report';
import { IAgingReport } from '@/hooks/finance/aging-report/interface';

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
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Aging Report
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Overdue payment tracking and analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded shadow-sm border border-[var(--border)] transition-colors hover:text-foreground">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <BucketCard
          title="0-30 DAYS"
          amount={`$${summary?.zeroToThirty.amount.toLocaleString() || "0"}`}
          count={`${summary?.zeroToThirty.invoices || 0} Invoices`}
          borderColor="border-t-[#00E5FF]"
          textColor="text-primary"
          loading={isLoading}
        />
        <BucketCard
          title="30-60 DAYS"
          amount={`$${summary?.thirtyToSixty.amount.toLocaleString() || "0"}`}
          count={`${summary?.thirtyToSixty.invoices || 0} Invoices`}
          borderColor="border-t-amber-500"
          textColor="text-amber-500"
          loading={isLoading}
        />
        <BucketCard
          title="60-90 DAYS"
          amount={`$${summary?.sixtyToNinety.amount.toLocaleString() || "0"}`}
          count={`${summary?.sixtyToNinety.invoices || 0} Invoices`}
          borderColor="border-t-rose-400"
          textColor="text-rose-400"
          loading={isLoading}
        />
        <BucketCard
          title="90+ DAYS"
          amount={`$${summary?.ninetyPlus.amount.toLocaleString() || "0"}`}
          count={`${summary?.ninetyPlus.invoices || 0} Invoices`}
          borderColor="border-t-rose-600"
          textColor="text-rose-600"
          loading={isLoading}
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">Aging Invoices</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => handleFilterChange('All')} />
            <FilterPill text="Pending" active={filter === 'Pending'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-[var(--background)]" onClick={() => handleFilterChange('pending')} />
            <FilterPill text="Critical" active={filter === 'Critical'} color="bg-rose-500/20 text-rose-500" activeColor="bg-rose-500 text-[var(--background)]" onClick={() => handleFilterChange('critical')} />
            <FilterPill text="Overdue" active={filter === 'Overdue'} color="bg-rose-400/20 text-rose-400" activeColor="bg-rose-400 text-[var(--background)]" onClick={() => handleFilterChange('overdue')} />

          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable
            data={agingReports}
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
    </div>
  );
}

function BucketCard({
  title,
  amount,
  count,
  borderColor,
  textColor,
  loading = false,
}: {
  title: string,
  amount: string,
  count: string,
  borderColor: string,
  textColor: string,
  loading?: boolean,
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]",
        borderColor
      )}
    >
      {loading ? (
        <>
          <div className="h-3 w-20 rounded bg-[var(--border)] animate-pulse" />

          <div className="mt-3 h-8 w-24 rounded bg-[var(--border)] animate-pulse" />

          <div className="mt-3 h-3 w-16 rounded bg-[var(--border)] animate-pulse" />
        </>
      ) : (
        <>
          <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {title}
          </h3>

          <div
            className={cn(
              "mt-2 text-3xl font-black tracking-tight",
              textColor
            )}
          >
            {amount}
          </div>

          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
            {count}
          </p>
        </>
      )}
    </div>
  );
}

function FilterPill({ text, active, onClick, color, activeColor }: { text: string, active: boolean, onClick: () => void, color?: string, activeColor?: string }) {
  const baseClasses = "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-[var(--border)] transition-all cursor-pointer";

  if (active) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColor || "bg-[#334155] text-foreground border-[#334155]")}>
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

