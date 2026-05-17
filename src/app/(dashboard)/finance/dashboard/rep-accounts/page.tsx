"use client";

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import { useRepAccounts, useRepAccountsSummary } from '@/hooks/finance/rep-accounts';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { CommonFilterPill, RepAccountsStatsCard } from '@/components/stats-card';

export default function RepAccountsPage() {
  const [filter, setFilter] = useState('All');
  const { repAccounts, meta, loading, query, setQuery } = useRepAccounts();
  const { summary, loading: summaryLoading } = useRepAccountsSummary();

  const filteredData = useMemo(() => {
    return repAccounts.filter(item => {
      if (filter === 'All') return true;
      if (filter === 'Top Performers') {
        return (item.totalSales || 0) >= 10000; // Threshold for top performers
      }
      if (filter === 'Needs Payment') {
        return (item.pendingBalance || 0) > 0;
      }
      return true;
    });
  }, [repAccounts, filter]);

  const columns = [
    {
      header: "REPRESENTATIVE",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 overflow-hidden relative">
            {item.profileUrl ? (
              <Image src={item.profileUrl} alt={item.fullName} fill className="object-cover" />
            ) : (
              item.fullName?.charAt(0) || 'R'
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm tracking-tight">{item.fullName}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter opacity-70">
              {item.email || 'No email provided'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "TOTAL SALES",
      render: (item: any) => (
        <span className="font-mono font-medium text-foreground">
          ${(item.totalSales || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: "EARNED",
      className: "text-primary",
      render: (item: any) => (
        <span className="font-mono font-bold text-primary">
          ${(item.commissionEarned || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: "PAID",
      className: "text-emerald-400",
      render: (item: any) => (
        <span className="font-mono font-medium text-emerald-400/90">
          ${(item.commissionPaid || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: "PENDING",
      className: "text-rose-400 font-medium",
      render: (item: any) => (
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "font-mono font-bold",
            (item.pendingBalance || 0) > 0 ? "text-rose-400" : "text-muted-foreground/40"
          )}>
            ${(item.pendingBalance || 0).toLocaleString()}
          </span>
          {(item.pendingBalance || 0) > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Rep Accounts
            </h1>
          </div>
          <p className="text-xs text-muted-foreground font-medium max-w-md">
            Monitor representative performance, track commissions earned, and manage pending balances with real-time financial data.
          </p>
        </div>
        <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer flex items-center gap-2">
          <Download className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          EXPORT
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <RepAccountsStatsCard
          title="Total Rep Sales"
          value={summary?.totalRepSales}
          loading={summaryLoading}
          color="text-primary"
          borderColor="border-t-primary"
        />
        <RepAccountsStatsCard
          title="Total Commissions"
          value={summary?.totalCommissions}
          loading={summaryLoading}
          color="text-indigo-400"
          borderColor="border-t-indigo-400"
        />
        <RepAccountsStatsCard
          title="Pending Payable"
          value={summary?.totalPendingPayable}
          loading={summaryLoading}
          color="text-rose-400"
          isAlert={(summary?.totalPendingPayable || 0) > 0}
          borderColor="border-t-rose-400"
        />
        <RepAccountsStatsCard
          title="Representatives"
          value={summary?.representativeCount}
          loading={summaryLoading}
          color="text-emerald-400"
          isNumber
          borderColor="border-t-emerald-400"
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:shadow-sm dark:shadow-black/5 transition-all overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 border-b border-[var(--border)] bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground ">Representatives List</h2>
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold  uppercase tracking-widest">
              {meta?.totalResult || 0} TOTAL
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--background)] rounded-lg border border-border w-full sm:w-auto overflow-x-auto p-1">
            <CommonFilterPill
              text="All"
              active={filter === 'All'}
              onClick={() => setFilter('All')}
            />
            <CommonFilterPill
              text="Top Performers"
              active={filter === 'Top Performers'}
              color="text-emerald-400 hover:bg-emerald-500/10"
              activeColor="bg-emerald-500 text-white"
              onClick={() => setFilter('Top Performers')}
            />
            <CommonFilterPill
              text="Needs Payment"
              active={filter === 'Needs Payment'}
              color="text-rose-400 hover:bg-rose-500/10"
              activeColor="bg-rose-500 text-white"
              onClick={() => setFilter('Needs Payment')}
            />
          </div>
        </div>
        <DataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          className='border-none rounded-none'
          onRowClick={() => { }}
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

