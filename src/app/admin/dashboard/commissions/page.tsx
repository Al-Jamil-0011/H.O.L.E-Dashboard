"use client";

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search } from 'lucide-react';

const commissionData = [
  { rep: 'John Smith', sales: '$40,000', rate: '10%', comm: '$4,000', paid: '$4,000', status: 'PAID' },
  { rep: 'Sarah Johnson', sales: '$28,500', rate: '10%', comm: '$2,850', paid: '$2,850', status: 'PAID' },
  { rep: 'Mike Chan', sales: '$22,000', rate: '10%', comm: '$2,200', paid: '$0', status: 'PENDING' },
  { rep: 'Alex Rivera', sales: '$18,700', rate: '10%', comm: '$1,870', paid: '$0', status: 'PENDING' },
  { rep: 'Linda Torres', sales: '$15,200', rate: '10%', comm: '$1,520', paid: '$1,520', status: 'PAID' },
  { rep: 'James Park', sales: '$31,000', rate: '10%', comm: '$3,100', paid: '$3,100', status: 'PAID' },
  { rep: 'David Kim', sales: '$13,600', rate: '10%', comm: '$1,360', paid: '$0', status: 'PAID' },
];

export default function CommissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    { header: "REP NAME", accessorKey: "rep" as const, className: "font-medium text-white" },
    { header: "TOTAL SALES", accessorKey: "sales" as const },
    { header: "RATE", accessorKey: "rate" as const },
    { header: "COMMISSION AMT", accessorKey: "comm" as const, className: "text-emerald-400 font-bold" },
    { header: "PAID", accessorKey: "paid" as const, className: "text-[#00E5FF] font-medium" },
    {
      header: "STATUS",
      render: (item: typeof commissionData[0]) => {
        let type: "success" | "warning" | "error" | "default" = "default";
        if (item.status === 'PENDING') type = 'warning';
        if (item.status === 'Mark PaidD') type = 'success';
        if (item.status === 'PAID') type = 'success';
        if (item.status === 'TOTAL PAID') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    },

    {
      header: "ACTIONS",
      render: (item: typeof commissionData[0]) => (
        <div className="flex items-center gap-2">
          {item.status === 'PENDING' && (
            <button className="px-3 py-1 text-[10px] font-bold text-[#0B101E] bg-emerald-500 rounded hover:bg-emerald-400 transition-colors">
              Mark Paid
            </button>
          )}
          <Link href={`/admin/dashboard/commissions/C-1001`}>
            <button className="px-3 py-1 text-[10px] font-medium text-gray-400 border border-[#1E293B] rounded hover:text-white transition-colors">
              View Details
            </button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Commission Management
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Rep commission tracking and approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-gray-400 bg-[#151B2B] rounded shadow-sm border border-[#1E293B] transition-colors hover:text-white">
            Export
          </button>
          {/* <button className="px-4 py-1.5 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded shadow-sm transition-all hover:bg-cyan-400">
            Bulk Mark Paid
          </button> */}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="TOTAL COMMISSION" value="$44,000" trend="All reps YTD" topBorderColor="border-t-[#00E5FF]" />
        <StatCard title="PAID OUT" value="$32,000" trend="8 reps paid" trendColor="text-emerald-500" topBorderColor="border-t-emerald-500" />
        <StatCard title="PENDING APPROVAL" value="$8,500" trend="4 pending" trendColor="text-amber-500" topBorderColor="border-t-amber-500" />
      </div>


      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-white">Rep Commissions</h2>
        </div>

        {/* FILTER BAR */}
        <div className="p-4 border-b border-[#1E293B] flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1A2234]">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-8 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name..."
              className="w-full bg-[#0B101E] border border-[#334155] rounded-full py-2 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 px-5 pb-5">
          <DataTable data={commissionData} columns={columns} />
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
