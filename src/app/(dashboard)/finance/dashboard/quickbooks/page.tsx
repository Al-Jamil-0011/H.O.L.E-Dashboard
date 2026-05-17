"use client";

import { cn } from '@/lib/utils';
import {
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useQuickBooksStatus, useQuickBooksSyncLogs, useQuickBooksSync } from '@/hooks/finance/quick-books';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';

dayjs.extend(relativeTime);

export default function QuickBooksPage() {
  const { status, loading: statusLoading, refetch: refetchStatus } = useQuickBooksStatus();
  const { logs, loading: logsLoading, refetch: refetchLogs } = useQuickBooksSyncLogs();
  const { sync, syncing } = useQuickBooksSync();

  const handleSync = async (type: "invoices" | "payments" | "vendor-bills" | "all") => {
    const res = await sync(type);
    if (res.success) {
      refetchStatus();
      refetchLogs();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8 max-w-5xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            QuickBooks Integration
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Manage your accounting synchronization with QuickBooks Online
          </p>
        </div>
        <div className="flex items-center gap-3">
          {statusLoading ? (
            <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
          ) : status?.isConnected ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 ">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-400 border border-rose-500/20 ">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              Disconnected
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] dark:shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 pb-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-foreground">Manual Sync Actions</h2>
          </div>
          <div className="p-5 space-y-3">
            <SyncAction
              title="SYNC INVOICES"
              description="Push all newly generated invoices to QB"
              onSync={() => handleSync("invoices")}
              loading={syncing === "invoices"}
              disabled={syncing !== null}
            />
            <SyncAction
              title="SYNC PAYMENTS"
              description="Update payment statuses from hospital"
              onSync={() => handleSync("payments")}
              loading={syncing === "payments"}
              disabled={syncing !== null}
            />
            <SyncAction
              title="SYNC VENDOR BILLS"
              description="Record vendor charges as expenses"
              onSync={() => handleSync("vendor-bills")}
              loading={syncing === "vendor-bills"}
              disabled={syncing !== null}
            />
          </div>
          <div className="p-5 pt-0 mt-auto">
            <button
              onClick={() => handleSync("all")}
              disabled={syncing !== null}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded bg-emerald-500 px-4 py-2.5 text-xs font-medium text-[var(--background)] dark:shadow-sm transition-all hover:bg-emerald-400 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {syncing === "all" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className={cn("h-4 w-4", syncing && "animate-spin")} />
              )}
              {syncing === "all" ? "Syncing Everything..." : "Sync All Now"}
            </button>
            {status?.lastFullSyncAt && (
              <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase font-semibold">
                Last full sync: {dayjs(status.lastFullSyncAt).format('MMM DD, YYYY HH:mm')}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] dark:shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 pb-4 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-sm font-bold text-foreground">Recent Sync Logs</h2>
            <Link
              href="/finance/dashboard/quickbooks/logs"
              className="text-[10px] uppercase font-bold text-primary hover:text-cyan-300 transition-colors cursor-pointer"
            >
              View All
            </Link>
          </div>
          <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {logsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start animate-pulse">
                  <div className="h-4 w-4 bg-muted rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <LogItem
                  key={log._id}
                  status={log.status}
                  message={log.message}
                  time={dayjs(log.createdAt).fromNow()}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2 opacity-20" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">No sync logs available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SyncAction({ title, description, onSync, loading, disabled }: { title: string, description: string, onSync: () => void, loading: boolean, disabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 hover:bg-[var(--border)]/50 transition-colors">
      <div>
        <h3 className="text-[11px] font-medium text-foreground tracking-widest uppercase mb-1">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onSync}
        disabled={disabled || loading}
        className="text-[11px] font-medium text-primary/70 hover:text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        {loading ? 'Syncing...' : 'Sync'}
      </button>
    </div>
  );
}

function LogItem({ status, message, time }: { status: 'success' | 'error', message: string, time: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-0.5 shrink-0">
        {status === 'success' ? (
          <CheckCircle2 className="h-[14px] w-[14px] text-emerald-500" />
        ) : (
          <AlertCircle className="h-[14px] w-[14px] text-rose-500" />
        )}
      </div>
      <div>
        <p className={cn("text-[13px] font-medium leading-tight", status === 'error' ? 'text-rose-400' : 'text-gray-300')}>{message}</p>
        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">{time}</p>
      </div>
    </div>
  );
}
