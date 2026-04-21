"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

const vendorData = [
  { vendor: 'MedTech Inc.', invoice: 'VIN-9801', implant: 'Knee Implant System 2x', cost: '$6,000', paymentDate: 'Feb 14, 2026', method: 'Bank Transfer', status: 'PAID' },
  { vendor: 'OrthoSupply', invoice: 'VIN-9802', implant: 'Hip Implant Set 3x', cost: '$9,000', paymentDate: 'Feb 20, 2026', method: 'ACH', status: 'PAID' },
  { vendor: 'BoneSource LLC', invoice: 'VIN-9803', implant: 'Bone Cement 10 units', cost: '$4,200', paymentDate: '—', method: '—', status: 'PENDING' },
  { vendor: 'SpinalTech', invoice: 'VIN-9804', implant: 'Spinal Fusion Kit 1x', cost: '$8,200', paymentDate: '—', method: '—', status: 'PENDING' },
  { vendor: 'NeuroDevices', invoice: 'VIN-9805', implant: 'Neuro Implant System', cost: '$6,000', paymentDate: '—', method: '—', status: 'OVERDUE' },
  { vendor: 'ImplantCo', invoice: 'VIN-9806', implant: 'Hip Implant 2x', cost: '$4,800', paymentDate: 'Mar 1, 2025', method: 'Wire', status: 'PAID' },
  { vendor: 'PrecisionMed', invoice: 'VIN-9807', implant: 'Knee Implant Advanced 1x', cost: '$4,800', paymentDate: 'Mar 3, 2025', method: 'ACH', status: 'PAID' },
];

export default function VendorPaymentsPage() {
  const [filter, setFilter] = useState('All');

  const filteredData = vendorData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Paid') return item.status === 'PAID';
    if (filter === 'Pending') return item.status === 'PENDING';
    if (filter === 'Overdue') return item.status === 'OVERDUE';
    return true;
  });

  const columns = [
    { header: "VENDOR", accessorKey: "vendor" as const, className: "font-medium text-white" },
    { header: "INVOICE #", accessorKey: "invoice" as const, className: "text-gray-400" },
    { header: "IMPLANT / PRODUCT", accessorKey: "implant" as const },
    { header: "IMPLANT COST", accessorKey: "cost" as const, className: "text-[#00E5FF] font-medium" },
    { header: "PAYMENT DATE", accessorKey: "paymentDate" as const },
    { header: "METHOD", accessorKey: "method" as const },
    {
      header: "STATUS",
      render: (item: typeof vendorData[0]) => {
        let type: "success" | "warning" | "error" = "success";
        if (item.status === 'PENDING') type = 'warning';
        if (item.status === 'OVERDUE') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: typeof vendorData[0]) => (
        <div className="flex items-center gap-2">
          {item.status !== 'PAID' ? (
            <button className="px-3 py-1 text-[10px] font-bold text-[#0B101E] bg-amber-500 rounded hover:bg-amber-400 transition-colors">
              Pay Now
            </button>
          ) : (
            <button className="px-3 py-1 text-[10px] font-medium text-gray-400 border border-[#1E293B] rounded hover:text-white transition-colors">
              Receipt
            </button>
          )}
          <button className="px-3 py-1 text-[10px] font-medium text-gray-400 border border-[#1E293B] rounded hover:text-white transition-colors">
            Details
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
            Vendor Payments
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Track implant & supply vendor payment status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-gray-400 bg-[#151B2B] rounded shadow-sm border border-[#1E293B] transition-colors hover:text-white">
            Export CSV
          </button>
          <button className="px-4 py-1.5 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded shadow-sm transition-all hover:bg-cyan-400">
            + Add Vendor Payment
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="TOTAL PAID" value="$42,600" trend="8 vendors" topBorderColor="border-t-[#00E5FF]" />
        <StatCard title="PENDING" value="$18,400" trend="3 pending" trendColor="text-amber-500" topBorderColor="border-t-amber-500" />
        <StatCard title="OVERDUE" value="$6,000" trend="1 overdue" trendColor="text-rose-500" topBorderColor="border-t-rose-500" />
        <StatCard title="THIS MONTH" value="$22,400" trend="3 transactions" topBorderColor="border-t-emerald-500" />
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5">
          <div>
            <h2 className="text-sm font-bold text-white">All Vendor Payments</h2>
            <p className="text-[10px] text-gray-500 mt-1">Implant cost tracking by vendor</p>
          </div>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="Paid" active={filter === 'Paid'} color="bg-[#00E5FF]/20 text-[#00E5FF]" activeColor="bg-[#00E5FF] text-[#0B101E]" onClick={() => setFilter('Paid')} />
            <FilterPill text="Pending" active={filter === 'Pending'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-[#0B101E]" onClick={() => setFilter('Pending')} />
            <FilterPill text="Overdue" active={filter === 'Overdue'} color="bg-rose-500/20 text-rose-500" activeColor="bg-rose-500 text-[#0B101E]" onClick={() => setFilter('Overdue')} />
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
  trendColor = "text-[#00E5FF]",
  topBorderColor
}: {
  title: string;
  value: string;
  trend: string;
  trendColor?: string;
  topBorderColor: string;
}) {
  return (
    <div className={cn("rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-white/[0.02]", topBorderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
        {title}
      </h3>
      <div className="mt-3">
        <div className="text-2xl font-black tracking-tight text-white">{value}</div>
        <p className={cn("mt-2 text-[11px] font-medium", trendColor)}>
          {trend}
        </p>
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
