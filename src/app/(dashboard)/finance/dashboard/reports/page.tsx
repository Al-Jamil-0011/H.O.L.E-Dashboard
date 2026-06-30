"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';

const reportsData = [
  { name: 'Monthly Revenue', type: 'Financial', lastGenerated: 'Today, 09:00 AM' },
  { name: 'Profit & Loss (P&L)', type: 'Financial', lastGenerated: 'Yesterday, 14:30 PM' },
  { name: 'Rep Performance', type: 'Sales', lastGenerated: 'Feb 12, 10:00 AM' },
  { name: 'Commission Report', type: 'Payroll', lastGenerated: 'Feb 10, 16:00 PM' },
  { name: 'Expense Report', type: 'Operational', lastGenerated: 'Feb 01, 08:00 AM' },
];

export default function ReportsPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = reportsData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Financial') return item.type === 'Financial';
    if (filter === 'Sales') return item.type === 'Sales';
    if (filter === 'Payroll') return item.type === 'Payroll';
    return true;
  });

  const columns = [
    { header: "REPORT NAME", accessorKey: "name" as const, className: "font-medium text-foreground" },
    { header: "CATEGORY", accessorKey: "type" as const, className: "text-primary" },
    { header: "LAST GENERATED", accessorKey: "lastGenerated" as const, className: "text-muted-foreground" },
    {
      header: "ACTIONS",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[10px] font-medium text-[var(--background)] bg-primary rounded hover:bg-cyan-400 transition-colors">
            Generate New
          </button>
          <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-[var(--border)] rounded hover:text-foreground transition-colors">
            PDF
          </button>
          <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-[var(--border)] rounded hover:text-foreground transition-colors">
            Excel
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Financial Reports
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium ">
            Generate and export critical business reports
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">Available Reports</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="Financial" active={filter === 'Financial'} color="bg-primary/20 text-primary" activeColor="bg-primary text-[var(--background)]" onClick={() => setFilter('Financial')} />
            <FilterPill text="Sales" active={filter === 'Sales'} color="bg-purple-500/20 text-purple-400" activeColor="bg-purple-500 text-[var(--background)]" onClick={() => setFilter('Sales')} />
            <FilterPill text="Payroll" active={filter === 'Payroll'} color="bg-emerald-500/20 text-emerald-400" activeColor="bg-emerald-500 text-[var(--background)]" onClick={() => setFilter('Payroll')} />
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
  const baseClasses = "px-3 py-1.5 text-[10px] font-bold  rounded border border-[var(--border)] transition-all cursor-pointer";

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

