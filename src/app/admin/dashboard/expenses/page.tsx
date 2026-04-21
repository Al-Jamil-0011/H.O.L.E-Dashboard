"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';

const allExpenseData = [
  { id: 1, expense: 'FedEx — City Hospital', category: 'SHIPMENT', amount: '$450', date: 'Mar 10, 2026', submittedBy: 'John Smith', status: 'APPROVED' },
  { id: 2, expense: 'Flight — Chicago Conf.', category: 'TRAVEL', amount: '$820', date: 'Mar 8, 2026', submittedBy: 'Sarah Johnson', status: 'APPROVED' },
  { id: 3, expense: 'UPS — Metro Hospital', category: 'SHIPMENT', amount: '$380', date: 'Mar 12, 2026', submittedBy: 'Mike Chen', status: 'PENDING' },
  { id: 4, expense: 'Office Supplies Q1', category: 'OFFICE', amount: '$640', date: 'Mar 1, 2026', submittedBy: 'Admin', status: 'APPROVED' },
  { id: 5, expense: 'LinkedIn Ads — March', category: 'MARKETING', amount: '$600', date: 'Mar 1, 2026', submittedBy: 'Marketing', status: 'PENDING' },
];

export default function ExpensesPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = allExpenseData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Approved') return item.status === 'APPROVED';
    if (filter === 'Pending') return item.status === 'PENDING';
    return true;
  });

  const columns = [
    { header: "EXPENSE", accessorKey: "expense" as const, className: "font-medium text-white text-sm" },
    {
      header: "CATEGORY",
      render: (item: typeof allExpenseData[0]) => {
        let colorClass = "bg-gray-500/10 text-gray-400";
        if (item.category === 'SHIPMENT') colorClass = "bg-[#00E5FF]/10 text-[#00E5FF]";
        else if (item.category === 'TRAVEL') colorClass = "bg-purple-500/10 text-purple-400";
        else if (item.category === 'OFFICE') colorClass = "bg-emerald-500/10 text-emerald-400";
        else if (item.category === 'MARKETING') colorClass = "bg-amber-500/10 text-amber-400";

        return (
          <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-transparent shadow-sm", colorClass)}>
            {item.category}
          </span>
        );
      }
    },
    { header: "AMOUNT", accessorKey: "amount" as const, className: "text-[#00E5FF] font-medium" },
    { header: "DATE", accessorKey: "date" as const, className: "text-gray-400 text-sm" },
    { header: "SUBMITTED BY", accessorKey: "submittedBy" as const, className: "text-gray-400 text-sm" },
    {
      header: "STATUS",
      render: (item: typeof allExpenseData[0]) => {
        const isApproved = item.status === 'APPROVED';
        return (
          <span className={cn(
            "text-[10px] font-bold tracking-widest uppercase",
            isApproved ? "text-emerald-500" : "text-amber-500"
          )}>
            {item.status}
          </span>
        );
      }
    },
    {
      header: "ACTIONS",
      render: (item: typeof allExpenseData[0]) => (
        <div className="flex items-center gap-2">
          {item.status === 'PENDING' ? (
            <>
              <button
                onClick={() => console.log('Approve', item.id)}
                className="px-3 py-1.5 text-[11px] font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => console.log('Reject', item.id)}
                className="px-3 py-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded transition-colors"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => console.log('View', item.id)}
              className="px-4 py-1.5 text-[11px] font-semibold text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors"
            >
              View
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Expenses
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Company expense tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export')}
            className="px-4 py-2 text-xs font-semibold text-gray-300 bg-[#1E293B]/50 rounded-lg shadow-sm border border-[#334155] transition-colors hover:bg-[#1E293B] hover:text-white"
          >
            Export
          </button>
          <button
            onClick={() => console.log('Add Expense')}
            className="px-4 py-2 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded-lg shadow-sm transition-all hover:bg-cyan-400"
          >
            + Add Expense
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="TOTAL EXPENSES" amount="$12,000" subtitle="+8% this month" subtitleColor="text-rose-500" borderColor="border-t-rose-500" />
        <StatCard title="PENDING APPROVAL" amount="$2,400" subtitle="4 pending" subtitleColor="text-amber-500" borderColor="border-t-amber-500" />
        <StatCard title="APPROVED" amount="$9,600" subtitle="12 expenses" subtitleColor="text-emerald-500" borderColor="border-t-emerald-500" />
        <StatCard title="BUDGET LEFT" amount="$8,000" subtitle="40% remaining" subtitleColor="text-amber-500" borderColor="border-t-blue-500" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        {/* By Category */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm">
          <h2 className="text-sm font-bold text-white mb-5 border-b border-[#1E293B] pb-3">By Category</h2>
          <div className="space-y-4">
            <ProgressBar label="Shipment" amount="$5,400" percentage={54} color="bg-[#00E5FF]" />
            <ProgressBar label="Travel" amount="$3,000" percentage={30} color="bg-purple-500" />
            <ProgressBar label="Office" amount="$1,800" percentage={18} color="bg-emerald-500" />
            <ProgressBar label="Marketing" amount="$1,200" percentage={12} color="bg-amber-500" />
            <ProgressBar label="Other" amount="$600" percentage={6} color="bg-gray-500" />
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-white mb-5 border-b border-[#1E293B] pb-3">Budget Utilization</h2>
          <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-4">
            <div className="text-center mb-6">
              <span className="text-5xl font-black text-white tracking-tight">60%</span>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">OF $20,000 BUDGET USED</p>
            </div>

            <div className="w-full max-w-sm">
              <div className="h-3 w-full bg-[#0B101E] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-[#00E5FF] to-purple-500 rounded-full" style={{ width: '60%' }} />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Used: $12,000</span>
                <span>Left: $8,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-white">All Expenses</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="Approved" active={filter === 'Approved'} color="bg-emerald-500/20 text-emerald-400" activeColor="bg-emerald-500 text-[#0B101E]" onClick={() => setFilter('Approved')} />
            <FilterPill text="Pending" active={filter === 'Pending'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-[#0B101E]" onClick={() => setFilter('Pending')} />
          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable data={filteredData} columns={columns} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, amount, subtitle, subtitleColor, borderColor }: { title: string, amount: string, subtitle: string, subtitleColor: string, borderColor: string }) {
  return (
    <div className={cn("rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-white/[0.02]", borderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{title}</h3>
      <div className="mt-2 text-3xl font-black tracking-tight text-white">{amount}</div>
      <p className={cn("mt-1 text-xs font-medium", subtitleColor)}>{subtitle}</p>
    </div>
  )
}

function ProgressBar({ label, amount, percentage, color }: { label: string, amount: string, percentage: number, color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 shrink-0 text-xs font-medium text-gray-400">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-[#0B101E] overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
      </div>
      <div className="w-12 shrink-0 text-right text-xs font-bold text-white tracking-wide">{amount}</div>
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
