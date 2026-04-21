"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';

const repData = [
  { rep: 'John Doe', sales: '$120,000', earned: '$12,000', paid: '$8,000', pending: '$4,000' },
  { rep: 'Sarah Smith', sales: '$85,000', earned: '$8,500', paid: '$8,500', pending: '$0' },
  { rep: 'Mike Johnson', sales: '$224,000', earned: '$33,600', paid: '$30,000', pending: '$3,600' },
];

export default function RepAccountsPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = repData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Top Performers') {
      const salesNum = parseInt(item.sales.replace(/[^0-9.-]+/g,""));
      return salesNum >= 100000;
    }
    if (filter === 'Needs Payment') {
      const pendingNum = parseInt(item.pending.replace(/[^0-9.-]+/g,""));
      return pendingNum > 0;
    }
    return true;
  });

  const columns = [
    { header: "REP NAME", accessorKey: "rep" as const, className: "font-medium text-white" },
    { header: "TOTAL SALES", accessorKey: "sales" as const },
    { header: "COMMISSION EARNED", accessorKey: "earned" as const, className: "text-[#00E5FF]" },
    { header: "COMMISSION PAID", accessorKey: "paid" as const, className: "text-emerald-400" },
    { header: "PENDING BALANCE", accessorKey: "pending" as const, className: "text-rose-400 font-medium" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Rep Accounts
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Financial summary and balances for all sales representatives
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-gray-400 bg-[#151B2B] rounded shadow-sm border border-[#1E293B] transition-colors hover:text-white">
            Export Data
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <SummaryCard title="TOTAL REP SALES" amount="$429,000" color="text-[#00E5FF]" />
        <SummaryCard title="TOTAL COMMISSIONS" amount="$54,100" color="text-purple-400" />
        <SummaryCard title="TOTAL PENDING PAYABLE" amount="$7,600" color="text-rose-400" />
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-white">All Representatives</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="Top Performers" active={filter === 'Top Performers'} color="bg-emerald-500/20 text-emerald-400" activeColor="bg-emerald-500 text-[#0B101E]" onClick={() => setFilter('Top Performers')} />
            <FilterPill text="Needs Payment" active={filter === 'Needs Payment'} color="bg-rose-500/20 text-rose-500" activeColor="bg-rose-500 text-[#0B101E]" onClick={() => setFilter('Needs Payment')} />
          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable data={filteredData} columns={columns} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, color }: { title: string, amount: string, color: string }) {
  return (
    <div className="rounded-xl border border-[#1E293B] border-t-[3px] border-t-[#1E293B] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-white/[0.02]">
      <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{title}</h3>
      <div className={cn("mt-2 text-3xl font-black tracking-tight", color)}>{amount}</div>
    </div>
  )
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
