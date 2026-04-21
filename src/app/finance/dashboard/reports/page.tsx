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
    { header: "REPORT NAME", accessorKey: "name" as const, className: "font-medium text-white" },
    { header: "CATEGORY", accessorKey: "type" as const, className: "text-[#00E5FF]" },
    { header: "LAST GENERATED", accessorKey: "lastGenerated" as const, className: "text-gray-400" },
    {
      header: "ACTIONS",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[10px] font-bold text-[#0B101E] bg-[#00E5FF] rounded hover:bg-cyan-400 transition-colors">
            Generate New
          </button>
          <button className="px-3 py-1 text-[10px] font-medium text-gray-400 border border-[#1E293B] rounded hover:text-white transition-colors">
            PDF
          </button>
          <button className="px-3 py-1 text-[10px] font-medium text-gray-400 border border-[#1E293B] rounded hover:text-white transition-colors">
             Excel
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Financial Reports
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Generate and export critical business reports
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-white">Available Reports</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="Financial" active={filter === 'Financial'} color="bg-[#00E5FF]/20 text-[#00E5FF]" activeColor="bg-[#00E5FF] text-[#0B101E]" onClick={() => setFilter('Financial')} />
            <FilterPill text="Sales" active={filter === 'Sales'} color="bg-purple-500/20 text-purple-400" activeColor="bg-purple-500 text-[#0B101E]" onClick={() => setFilter('Sales')} />
            <FilterPill text="Payroll" active={filter === 'Payroll'} color="bg-emerald-500/20 text-emerald-400" activeColor="bg-emerald-500 text-[#0B101E]" onClick={() => setFilter('Payroll')} />
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
  const baseClasses = "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-[#1E293B] transition-all cursor-pointer";
  
  if (active) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColor || "bg-[#334155] text-white border-[#334155]")}>
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
    <button onClick={onClick} className={cn(baseClasses, "text-gray-400 hover:text-white hover:bg-[#1E293B]/50")}>
      {text}
    </button>
  )
}
