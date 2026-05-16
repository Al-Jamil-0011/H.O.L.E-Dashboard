"use client";

import { cn } from '@/lib/utils';
import {
  History,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { useQuickBooksSyncLogs } from '@/hooks/finance/quick-books';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

dayjs.extend(relativeTime);

export default function QuickBooksLogsPage() {
  const { logs, loading } = useQuickBooksSyncLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');

  const filteredLogs = useMemo(() => {
    if (!Array.isArray(logs)) return [];
    return logs.filter(log => {
      const matchesSearch = log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.syncType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [logs, searchTerm, statusFilter]);

  const columns = [
    {
      header: "SYNC TYPE",
      render: (item: any) => (
        <span className="font-bold text-foreground text-[11px] uppercase tracking-wider">
          {item.syncType}
        </span>
      )
    },
    {
      header: "MESSAGE",
      render: (item: any) => (
        <p className={cn(
          "text-[13px] font-medium max-w-md",
          item.status === 'error' ? 'text-rose-400' : 'text-foreground'
        )}>
          {item.message}
        </p>
      )
    },
    {
      header: "STATUS",
      render: (item: any) => (
        <StatusBadge
          status={item.status.toUpperCase()}
          type={item.status === 'success' ? 'success' : 'error'}
        />
      )
    },
    {
      header: "TIME",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="text-[12px] text-foreground font-medium">
            {dayjs(item.createdAt).format('MMM DD, YYYY HH:mm:ss')}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter opacity-60">
            {dayjs(item.createdAt).fromNow()}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/finance/dashboard/quickbooks"
            className="p-2 hover:bg-white/5 rounded-full transition-colors border border-[var(--border)]"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Synchronization History
              </h1>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
              Detailed audit trail of all QuickBooks synchronization events
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search sync events..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg border border-[var(--border)] w-full md:w-auto">
          <FilterPill
            text="All"
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          />
          <FilterPill
            text="Success"
            active={statusFilter === 'success'}
            color="text-emerald-400 hover:bg-emerald-500/10"
            activeColor="bg-emerald-500 text-white"
            onClick={() => setStatusFilter('success')}
          />
          <FilterPill
            text="Errors"
            active={statusFilter === 'error'}
            color="text-rose-400 hover:bg-rose-500/10"
            activeColor="bg-rose-500 text-white"
            onClick={() => setStatusFilter('error')}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden flex flex-col">
        <div className="flex-1 p-2">
          <DataTable
            data={filteredLogs}
            columns={columns}
            loading={loading}
            onRowClick={() => { }}
          />
        </div>
      </div>
    </div>
  );
}

function FilterPill({ text, active, onClick, color, activeColor }: { text: string, active: boolean, onClick: () => void, color?: string, activeColor?: string }) {
  const baseClasses = "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer border border-transparent flex-1 md:flex-none text-center";

  if (active) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColor || "bg-[var(--border)] text-foreground")}>
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
