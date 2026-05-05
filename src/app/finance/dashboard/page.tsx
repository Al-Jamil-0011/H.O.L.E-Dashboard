"use client";

import {
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

// Mock Data
const recentActivityData = [
    { id: '#1002', rep: 'John Smith', hospital: 'City Hospital', amount: '$14,000', status: 'PAID' },
    { id: '#1003', rep: 'Mike Chan', hospital: 'Metro Hospital', amount: '$9,500', status: 'PENDING' },
    { id: '#1004', rep: 'Alex Rivera', hospital: 'Care Hospital', amount: '$7,200', status: 'PAID' },
];

export default function Home() {
    const columns = [
        { header: "SALE ID", accessorKey: "id" as const, className: "font-medium text-[#00E5FF]" },
        { header: "REP", accessorKey: "rep" as const },
        { header: "HOSPITAL", accessorKey: "hospital" as const },
        { header: "AMOUNT", accessorKey: "amount" as const, className: "text-[#00E5FF] font-medium" },
        {
            header: "STATUS",
            render: (item: typeof recentActivityData[0]) => (
                <StatusBadge
                    status={item.status}
                    type={item.status === 'PAID' ? 'success' : 'warning'}
                />
            )
        },
        {
            header: "ACTIONS",
            render: () => (
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-[10px] font-medium text-gray-300 border border-[#1E293B] rounded hover:bg-white/5 transition-colors">
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
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white mb-1">
                        Finance Dashboard
                    </h1>
                    <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                        InvictusOS • Medical Device Revenue Operations • March 2026
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-1.5 text-xs font-semibold text-gray-400 bg-[#151B2B] rounded shadow-sm border border-[#1E293B] transition-colors hover:text-white">
                        Refresh
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded shadow-sm transition-all hover:bg-cyan-400">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="TOTAL REVENUE" value="$245,000" trend="+12.4% this month" trendType="up" topBorderColor="border-t-[#00E5FF]" />
                <StatCard title="TOTAL SALES" value="83" trend="+7 new this month" trendType="up" topBorderColor="border-t-emerald-500" />
                <StatCard title="COMMISSION PAID" value="$32,000" trend="12 reps paid out" trendType="neutral" topBorderColor="border-t-rose-500" />
                <StatCard title="VENDOR PAYMENTS" value="$18,400" trend="3 pending payments" trendType="neutral" topBorderColor="border-t-amber-500" />
                <StatCard title="TOTAL EXPENSES" value="$12,000" trend="+8% vs last month" trendType="down" topBorderColor="border-t-blue-500" />
                <StatCard title="NET PROFIT" value="$201,000" trend="82% margin" trendType="up" topBorderColor="border-t-purple-500" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm lg:col-span-1 transition-all h-[320px] flex flex-col">
                    <div className="flex items-center justify-between p-5 pb-0">
                        <div>
                            <h2 className="text-sm font-bold text-white">Monthly Revenue</h2>
                            <p className="text-[10px] text-gray-500 mt-1">Jan-Jun 2026</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>Revenue</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500/50"></span>Expenses</span>
                        </div>
                    </div>
                    <div className="flex-1 p-5 flex items-center justify-center">
                        <p className="text-xs text-gray-600 font-mono">[ Line Chart Placeholder ]</p>
                    </div>
                </div>

                <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm lg:col-span-1 transition-all h-[320px] flex flex-col">
                    <div className="flex items-center justify-between p-5 pb-0">
                        <div>
                            <h2 className="text-sm font-bold text-white">Rep Performance</h2>
                            <p className="text-[10px] text-gray-500 mt-1">Sales $ vs Rep (YTD 2026)</p>
                        </div>
                    </div>
                    <div className="flex-1 p-5 flex items-center justify-center">
                        <p className="text-xs text-gray-600 font-mono">[ Bar Chart Placeholder ]</p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-5">
                    <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
                    <button className="px-3 py-1 text-[10px] font-medium text-gray-400 border border-[#1E293B] rounded hover:text-white transition-colors">
                        View All
                    </button>
                </div>
                <div className="flex-1 px-5 pb-5">
                    <DataTable data={recentActivityData} columns={columns} />
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    trend,
    trendType,
    topBorderColor
}: {
    title: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down' | 'neutral';
    topBorderColor: string;
}) {
    return (
        <div className={cn("rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-white/[0.02]", topBorderColor)}>
            <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                {title}
            </h3>
            <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-white">{value}</div>
                <p className="mt-2 text-[11px] font-medium text-gray-400">
                    {trendType === 'up' && <span className="text-[#00E5FF] font-semibold">{trend}</span>}
                    {trendType === 'down' && <span className="text-rose-500 font-semibold">{trend}</span>}
                    {trendType === 'neutral' && <span className="text-emerald-400 font-semibold">{trend}</span>}
                </p>
            </div>
        </div>
    );
}
