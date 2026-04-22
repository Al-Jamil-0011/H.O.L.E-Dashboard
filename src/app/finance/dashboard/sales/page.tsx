"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { CreateSaleModal } from '@/components/modals/CreateSaleModal';
const salesData = [
  { id: '#1001', rep: 'John Smith', doctor: 'Dr. Williams', hospital: 'City Hospital', implant: 'Knee 2x', amount: '$18,000', comm: '$1,800', status: 'PAID' },
  { id: '#1002', rep: 'John Smith', doctor: 'Dr. Smith', hospital: 'City Hospital', implant: 'Hip 1x', amount: '$14,000', comm: '$1,400', status: 'PAID' },
  { id: '#1003', rep: 'Mike Chan', doctor: 'Dr. Patel', hospital: 'Metro Hospital', implant: 'Knee 1x', amount: '$9,500', comm: '$950', status: 'PENDING' },
  { id: '#1004', rep: 'Alex Rivera', doctor: 'Dr. Johnson', hospital: 'Care Hospital', implant: 'Bone Cement 3x', amount: '$7,200', comm: '$720', status: 'PAID' },
  { id: '#1005', rep: 'Sarah Johnson', doctor: 'Dr. Brown', hospital: 'Unity Medical', implant: 'Hip 2x', amount: '$11,500', comm: '$1,150', status: 'OVERDUE' },
];

export default function SalesPage() {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = salesData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Paid') return item.status === 'PAID';
    if (filter === 'Pending') return item.status === 'PENDING';
    if (filter === 'Overdue') return item.status === 'OVERDUE';
    return true;
  });

  const columns = [
    { header: "SALE ID", accessorKey: "id" as const, className: "font-medium text-accent-teal" },
    { header: "REP", accessorKey: "rep" as const },
    { header: "DOCTOR", accessorKey: "doctor" as const },
    { header: "HOSPITAL", accessorKey: "hospital" as const },
    { header: "IMPLANT", accessorKey: "implant" as const },
    { header: "AMOUNT", accessorKey: "amount" as const, className: "text-accent-teal font-medium" },
    { header: "COMMISSION", accessorKey: "comm" as const, className: "text-emerald-400" },
    { 
      header: "STATUS", 
      render: (item: typeof salesData[0]) => {
        let type: "success" | "warning" | "error" = "success";
        if (item.status === 'PENDING') type = 'warning';
        if (item.status === 'OVERDUE') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      } 
    },
    {
      header: "ACTIONS",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[10px] font-medium text-gray-300 border border-[var(--border)] rounded hover:bg-white/5 transition-colors">
            View
          </button>
          <button className="px-3 py-1 text-[10px] font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
            Invoice
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <CreateSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Sales & Revenue
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            All US Sales • Q1 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded shadow-sm border border-[var(--border)] transition-colors hover:text-foreground">
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-1.5 text-xs font-bold text-[var(--background)] bg-accent-teal rounded shadow-sm transition-all hover:bg-cyan-400"
          >
            + New Sale
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="REVENUE" value="$245K" trend="+12.4%" topBorderColor="border-t-[#00E5FF]" />
        <StatCard title="TOTAL SALES" value="83" trend="+7 new" topBorderColor="border-t-emerald-500" />
        <StatCard title="AVG VALUE" value="$2,951" trend="+3.1%" topBorderColor="border-t-purple-500" />
        <StatCard title="CONVERSION" value="73%" trend="Stable" topBorderColor="border-t-amber-500" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-sm font-bold text-foreground">All Sales</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
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

function StatCard({ 
  title, 
  value, 
  trend, 
  topBorderColor
}: { 
  title: string; 
  value: string; 
  trend: string;
  topBorderColor: string;
}) {
  return (
    <div className={cn("rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]", topBorderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="mt-3">
        <div className="text-2xl font-black tracking-tight text-foreground">{value}</div>
        <p className="mt-2 text-[11px] font-medium text-accent-teal">
          {trend}
        </p>
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

