"use client";

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import { useRepAccounts, useRepAccountsSummary } from '@/hooks/finance/rep-accounts';
import { Wallet, Download, Search } from 'lucide-react';
import Image from 'next/image';

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
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic">
              Rep Accounts <span className="text-primary not-italic font-light">Hub</span>
            </h1>
          </div>
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            Monitor representative performance, track commissions earned, and manage pending balances with real-time financial data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search reps..."
              className="pl-9 pr-4 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/50"
              value={query.searchTerm}
              onChange={(e) => setQuery({ ...query, searchTerm: e.target.value })}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-foreground bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] transition-all hover:border-primary/50 hover:bg-primary/5 group">
            <Download className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            EXPORT
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Rep Sales"
          value={summary?.totalRepSales}
          loading={summaryLoading}
          color="text-primary"
          borderColor="border-t-primary"
        />
        <SummaryCard
          title="Total Commissions"
          value={summary?.totalCommissions}
          loading={summaryLoading}
          color="text-indigo-400"
          borderColor="border-t-indigo-400"
        />
        <SummaryCard
          title="Pending Payable"
          value={summary?.totalPendingPayable}
          loading={summaryLoading}
          color="text-rose-400"
          isAlert={(summary?.totalPendingPayable || 0) > 0}
          borderColor="border-t-rose-400"
        />
        <SummaryCard
          title="Representatives"
          value={summary?.representativeCount}
          loading={summaryLoading}
          color="text-emerald-400"
          isNumber
          borderColor="border-t-emerald-400"
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/5 transition-all overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 border-b border-[var(--border)] bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-base font-black text-foreground tracking-tight uppercase">Representatives List</h2>
            <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {meta?.totalResult || 0} TOTAL
            </span>
          </div>
          <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-xl border border-[var(--border)]">
            <FilterPill
              text="All"
              active={filter === 'All'}
              activeColor="bg-primary text-white dark:text-black"
              onClick={() => setFilter('All')}
            />
            <FilterPill
              text="Top Performers"
              active={filter === 'Top Performers'}
              color="text-emerald-400 hover:bg-emerald-500/10"
              activeColor="bg-emerald-500 text-white"
              onClick={() => setFilter('Top Performers')}
            />
            <FilterPill
              text="Needs Payment"
              active={filter === 'Needs Payment'}
              color="text-rose-400 hover:bg-rose-500/10"
              activeColor="bg-rose-500 text-white"
              onClick={() => setFilter('Needs Payment')}
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
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value?: number;
  loading: boolean;
  color: string;
  isAlert?: boolean;
  isNumber?: boolean;
  borderColor?: string;
}

function SummaryCard({ title, value, loading, color, isAlert, isNumber, borderColor }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]",
        borderColor
      )}
    >
      {/* Background Glow */}
      <div className={cn("absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-5 rounded-full transition-opacity group-hover:opacity-10", color.replace('text-', 'bg-'))} />

      <h3 className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-60 mb-2">{title}</h3>

      {loading ? (
        <div className="h-9 w-24 bg-muted/50 rounded-md animate-pulse" />
      ) : (
        <div className={cn("text-3xl font-black tracking-tight flex items-baseline gap-1", color)}>
          {!isNumber && <span className="text-lg font-light opacity-50">$</span>}
          {(value || 0).toLocaleString()}
        </div>
      )}

      {isAlert && !loading && (
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Action Required</span>
        </div>
      )}
    </div>
  )
}

function FilterPill({ text, active, onClick, color, activeColor }: { text: string, active: boolean, onClick: () => void, color?: string, activeColor?: string }) {
  const baseClasses = "px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer border border-transparent";

  if (active) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColor || "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105")}>
        {text}
      </button>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseClasses, color || "text-muted-foreground hover:text-foreground hover:bg-[var(--border)]/30")}>
      {text}
    </button>
  )
}


