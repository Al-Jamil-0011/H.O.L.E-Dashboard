"use client";

import { cn } from '@/lib/utils';
import {
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function QuickBooksPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 max-w-5xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            QuickBooks Integration
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Manage your accounting synchronization with QuickBooks Online
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
            Connected
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 pb-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-foreground">Manual Sync Actions</h2>
          </div>
          <div className="p-5 space-y-3">
            <SyncAction title="SYNC INVOICES" description="Push all newly generated invoices to QB" />
            <SyncAction title="SYNC PAYMENTS" description="Update payment statuses from hospital" />
            <SyncAction title="SYNC VENDOR BILLS" description="Record vendor charges as expenses" />
          </div>
          <div className="p-5 pt-0 mt-auto">
            <button className="w-full mt-2 flex items-center justify-center gap-2 rounded bg-emerald-500 px-4 py-2.5 text-xs font-bold text-[var(--background)] shadow-sm transition-all hover:bg-emerald-400 uppercase tracking-widest">
              <RefreshCcw className="h-4 w-4" />
              Sync All Now
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 pb-4 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-sm font-bold text-foreground">Recent Sync Logs</h2>
            <button className="text-[10px] uppercase font-bold text-primary hover:text-cyan-300 transition-colors">
              View All
            </button>
          </div>
          <div className="p-5 space-y-4">
            <LogItem status="success" message="Successfully synced 12 invoices" time="10 mins ago" />
            <LogItem status="success" message="Successfully synced 3 payments" time="1 hour ago" />
            <LogItem status="error" message="Failed to sync Vendor Bill #203" time="2 hours ago" />
            <LogItem status="success" message="Successfully synced 4 Vendor Bills" time="Yesterday, 14:00" />
            <LogItem status="success" message="Initial QuickBooks Connection" time="Feb 01, 2026" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SyncAction({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 hover:bg-[var(--border)]/50 transition-colors">
      <div>
        <h3 className="text-[11px] font-bold text-foreground tracking-widest uppercase mb-1">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <button className="text-[11px] font-bold text-primary hover:text-cyan-300 uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded transition-colors">Sync</button>
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

