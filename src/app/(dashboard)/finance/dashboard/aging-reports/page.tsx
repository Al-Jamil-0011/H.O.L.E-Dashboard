"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

const agingData = [
  { invoice: 'INV-2234', hospital: 'City Hospital', amount: '$14,000', days: '45 days', status: 'OVERDUE' },
  { invoice: 'INV-2101', hospital: 'St Judes', amount: '$2,400', days: '92 days', status: 'CRITICAL' },
  { invoice: 'INV-2240', hospital: 'Mercy Gen', amount: '$8,500', days: '15 days', status: 'PENDING' },
];

export default function AgingReportsPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = agingData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Critical') return item.status === 'CRITICAL';
    if (filter === 'Overdue') return item.status === 'OVERDUE';
    if (filter === 'Pending') return item.status === 'PENDING';
    return true;
  });

  const columns = [
    { header: "INVOICE", accessorKey: "invoice" as const, className: "font-medium text-foreground" },
    { header: "HOSPITAL", accessorKey: "hospital" as const },
    { header: "AMOUNT", accessorKey: "amount" as const, className: "text-primary font-medium" },
    { header: "DAYS PENDING", accessorKey: "days" as const },
    {
      header: "STATUS",
      render: (item: typeof agingData[0]) => {
        let type: "success" | "warning" | "error" = "success";
        if (item.status === 'PENDING') type = 'warning';
        if (item.status === 'OVERDUE') type = 'error';
        if (item.status === 'CRITICAL') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
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
        <BucketCard title="0-30 DAYS" amount="$12,500" count="5 Invoices" borderColor="border-t-[#00E5FF]" textColor="text-primary" />
        <BucketCard title="30-60 DAYS" amount="$34,000" count="3 Invoices" borderColor="border-t-amber-500" textColor="text-amber-500" />
        <BucketCard title="60-90 DAYS" amount="$8,200" count="2 Invoices" borderColor="border-t-rose-400" textColor="text-rose-400" />
        <BucketCard title="90+ DAYS" amount="$2,400" count="1 Invoices" borderColor="border-t-rose-600" textColor="text-rose-600" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">Aging Invoices</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="Critical" active={filter === 'Critical'} color="bg-rose-500/20 text-rose-500" activeColor="bg-rose-500 text-[var(--background)]" onClick={() => setFilter('Critical')} />
            <FilterPill text="Overdue" active={filter === 'Overdue'} color="bg-rose-400/20 text-rose-400" activeColor="bg-rose-400 text-[var(--background)]" onClick={() => setFilter('Overdue')} />
            <FilterPill text="Pending" active={filter === 'Pending'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-[var(--background)]" onClick={() => setFilter('Pending')} />
          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable data={filteredData} columns={columns} />
        </div>
      </div>
    </div>
  );
}

function BucketCard({ title, amount, count, borderColor, textColor }: { title: string, amount: string, count: string, borderColor: string, textColor: string }) {
  return (
    <div className={cn("rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]", borderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{title}</h3>
      <div className={cn("mt-2 text-3xl font-black tracking-tight", textColor)}>{amount}</div>
      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{count}</p>
    </div>
  )
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

