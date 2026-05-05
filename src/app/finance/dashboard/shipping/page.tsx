"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

const shippingData = [
  { id: 'SHIP-1123', carrier: 'FedEx', rep: 'John Smith', cost: '$45', status: 'PAID' },
  { id: 'SHIP-1124', carrier: 'UPS', rep: 'Mike Chan', cost: '$38', status: 'PENDING' },
  { id: 'SHIP-1125', carrier: 'FedEx', rep: 'Sarah Johnson', cost: '$62', status: 'PENDING' },
];

export default function ShippingPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = shippingData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'FedEx') return item.carrier === 'FedEx';
    if (filter === 'UPS') return item.carrier === 'UPS';
    return true;
  });

  const columns = [
    { header: "SHIPMENT ID", accessorKey: "id" as const, className: "font-medium text-white" },
    { header: "CARRIER", accessorKey: "carrier" as const },
    { header: "REP", accessorKey: "rep" as const },
    { header: "COST", accessorKey: "cost" as const, className: "text-[#00E5FF] font-medium" },
    {
      header: "STATUS",
      render: (item: typeof shippingData[0]) => {
        let type: "success" | "warning" = "success";
        if (item.status === 'PENDING') type = 'warning';
        return <StatusBadge status={item.status} type={type} />;
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Shipping Costs
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Track shipment and delivery expenses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-gray-400 bg-[#151B2B] rounded shadow-sm border border-[#1E293B] transition-colors hover:text-white">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <StatCard title="TOTAL SHIPPING COSTS" amount="$1,450" color="text-rose-500" />
        <StatCard title="PENDING PAYMENTS" amount="$380" color="text-amber-500" />
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-white">All Shipments</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="FedEx" active={filter === 'FedEx'} color="bg-purple-500/20 text-purple-400" activeColor="bg-purple-500 text-[#0B101E]" onClick={() => setFilter('FedEx')} />
            <FilterPill text="UPS" active={filter === 'UPS'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-[#0B101E]" onClick={() => setFilter('UPS')} />
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
