"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

const paymentData = [
  { invoice: 'INV-2234', hospital: 'City Hospital', amount: '$14,000', method: 'Bank Transfer', date: 'Feb 10', status: 'PAID' },
  { invoice: 'INV-2235', hospital: 'Mercy Gen', amount: '$8,500', method: 'Credit Card', date: 'Feb 15', status: 'PENDING' },
  { invoice: 'INV-2230', hospital: 'St Judes', amount: '$5,200', method: 'Check', date: 'Jan 10', status: 'OVERDUE' },
];

export default function PaymentsPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = paymentData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Paid') return item.status === 'PAID';
    if (filter === 'Pending') return item.status === 'PENDING';
    if (filter === 'Overdue') return item.status === 'OVERDUE';
    return true;
  });

  const columns = [
    { header: "INVOICE", accessorKey: "invoice" as const, className: "font-medium text-foreground" },
    { header: "HOSPITAL", accessorKey: "hospital" as const },
    { header: "AMOUNT", accessorKey: "amount" as const, className: "text-accent-teal font-medium" },
    { header: "PAYMENT METHOD", accessorKey: "method" as const },
    { header: "PAYMENT DATE", accessorKey: "date" as const },
    {
      header: "STATUS",
      render: (item: typeof paymentData[0]) => {
        let type: "success" | "warning" | "error" = "success";
        if (item.status === 'PENDING') type = 'warning';
        if (item.status === 'OVERDUE') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Payments
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Track incoming payments and statuses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded shadow-sm border border-[var(--border)] transition-colors hover:text-foreground">
            Export Record
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="TOTAL RECEIVED" amount="$45,200" color="text-accent-teal" />
        <StatCard title="PENDING" amount="$12,400" color="text-amber-500" />
        <StatCard title="OVERDUE" amount="$8,600" color="text-rose-500" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">All Payments</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} activeColor="bg-black/80 text-[var(--background)]" onClick={() => setFilter('All')} />
            <FilterPill text="Paid" active={filter === 'Paid'} color="bg-accent-teal/20 text-accent-teal" activeColor="bg-accent-teal text-[var(--background)]" onClick={() => setFilter('Paid')} />
            <FilterPill text="Pending" active={filter === 'Pending'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-[var(--background)]" onClick={() => setFilter('Pending')} />
            <FilterPill text="Overdue" active={filter === 'Overdue'} color="bg-rose-500/20 text-rose-500" activeColor="bg-rose-500 text-[var(--background)]" onClick={() => setFilter('Overdue')} />
          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable data={filteredData} columns={columns} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, amount, color }: { title: string, amount: string, color: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] border-t-[3px] border-t-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]">
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{title}</h3>
      <div className={cn("mt-2 text-3xl font-black tracking-tight", color)}>{amount}</div>
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

