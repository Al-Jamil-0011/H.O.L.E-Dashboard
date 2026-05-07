"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

const invoiceData = [
  { id: 'INV-2234', saleId: '#1002', hospital: 'City Hospital', amount: '$14,000', due: 'Mar 01', status: 'PENDING' },
  { id: 'INV-2235', saleId: '#1003', hospital: 'Mercy Gen', amount: '$8,500', due: 'Mar 03', status: 'PENDING' },
  { id: 'INV-2236', saleId: '#0998', hospital: 'St Judes', amount: '$22,400', due: 'Feb 15', status: 'PAID' },
  { id: 'INV-2237', saleId: '#1005', hospital: 'Unity Medical', amount: '$11,500', due: 'Jan 28', status: 'OVERDUE' },
];

export default function InvoicesPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = invoiceData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Paid') return item.status === 'PAID';
    if (filter === 'Pending') return item.status === 'PENDING';
    if (filter === 'Overdue') return item.status === 'OVERDUE';
    return true;
  });

  const columns = [
    { header: "INVOICE ID", accessorKey: "id" as const, className: "font-medium text-foreground" },
    { header: "SALE ID", accessorKey: "saleId" as const, className: "text-primary" },
    { header: "HOSPITAL", accessorKey: "hospital" as const },
    { header: "AMOUNT", accessorKey: "amount" as const, className: "text-primary font-medium" },
    { header: "DUE DATE", accessorKey: "due" as const },
    {
      header: "STATUS",
      render: (item: typeof invoiceData[0]) => {
        let type: "success" | "warning" | "error" = "success";
        if (item.status === 'PENDING') type = 'warning';
        if (item.status === 'OVERDUE') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: typeof invoiceData[0]) => (
        <div className="flex items-center gap-2">
          {item.status !== 'PAID' && (
            <button className="px-3 py-1 text-[10px] font-bold text-[var(--background)] bg-emerald-500 rounded hover:bg-emerald-400 transition-colors">
              Mark Paid
            </button>
          )}
          <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-[var(--border)] rounded hover:text-foreground transition-colors">
            PDF
          </button>
          <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-[var(--border)] rounded hover:text-foreground transition-colors">
            Email
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Invoice Management
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Hospital invoice generation and tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded shadow-sm border border-[var(--border)] transition-colors hover:text-foreground">
            Export All
          </button>
          <button className="px-4 py-1.5 text-xs font-bold text-[var(--background)] bg-primary rounded shadow-sm transition-all hover:bg-cyan-400">
            Generate Invoices
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">All Invoices</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} activeColor="bg-black/80 text-[var(--background)]" onClick={() => setFilter('All')} />
            <FilterPill text="Paid" active={filter === 'Paid'} color="bg-primary/20 text-primary" activeColor="bg-primary text-[var(--background)]" onClick={() => setFilter('Paid')} />
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

