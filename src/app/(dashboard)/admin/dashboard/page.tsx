"use client";

import {
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import type { ApexOptions } from 'apexcharts';
import Loader from '@/components/loader';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Mock Data
const recentSalesData = [
    { id: '#1001', rep: 'John Smith', doctor: 'Dr. Williams', hospital: 'City Hospital', implant: 'Knee 2x', amount: '$18,000', comm: '$1,800', status: 'PAID' },
    { id: '#1002', rep: 'John Smith', doctor: 'Dr. Smith', hospital: 'City Hospital', implant: 'Hip 1x', amount: '$14,000', comm: '$1,400', status: 'PAID' },
    { id: '#1003', rep: 'Mike Chan', doctor: 'Dr. Patel', hospital: 'Metro Hospital', implant: 'Knee 1x', amount: '$9,500', comm: '$950', status: 'PENDING' }
];

export default function AdminDashboard() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const lineChartOptions: ApexOptions = {
        chart: {
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'inherit',
        },
        theme: {
            mode: isDark ? 'dark' : 'light',
        },
        colors: ['#00E5FF', '#3b82f6'],
        fill: {
            type: ['gradient', 'gradient'],
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            labels: { style: { colors: isDark ? '#a1a1aa' : '#71717a' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: isDark ? '#a1a1aa' : '#71717a' },
                formatter: (value) => `$${value / 1000}k`
            }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: isDark ? '#27272a' : '#e4e4e7',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } }
        },
        legend: { show: false },
        tooltip: { theme: isDark ? 'dark' : 'light' }
    };

    const lineChartSeries = [
        { name: 'Revenue', data: [31000, 40000, 28000, 51000, 42000, 109000] },
        { name: 'Expenses', data: [11000, 32000, 45000, 32000, 34000, 52000] }
    ];

    const barChartOptions: ApexOptions = {
        chart: {
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'inherit',
        },
        theme: {
            mode: isDark ? 'dark' : 'light',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '40%'
            }
        },
        colors: ['#00E5FF'],
        xaxis: {
            categories: ['John', 'Mike', 'Alex', 'Sarah', 'David'],
            labels: { style: { colors: isDark ? '#a1a1aa' : '#71717a' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: isDark ? '#a1a1aa' : '#71717a' },
                formatter: (value) => `$${value / 1000}k`
            }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: isDark ? '#27272a' : '#e4e4e7',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } }
        },
        legend: { show: false },
        tooltip: { theme: isDark ? 'dark' : 'light' }
    };

    const barChartSeries = [
        { name: 'Sales YTD', data: [45000, 38000, 32000, 28000, 21000] }
    ];

    const columns = [
        { header: "SALE ID", accessorKey: "id" as const, className: "font-medium text-primary" },
        { header: "REP", accessorKey: "rep" as const },
        { header: "DOCTOR", accessorKey: "doctor" as const },
        { header: "HOSPITAL", accessorKey: "hospital" as const },
        { header: "IMPLANT", accessorKey: "implant" as const },
        { header: "AMOUNT", accessorKey: "amount" as const, className: "text-primary font-medium" },
        { header: "COMMISSION", accessorKey: "comm" as const, className: "text-emerald-400" },
        {
            header: "STATUS",
            render: (item: typeof recentSalesData[0]) => {
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
            <div className="flex h-screen w-full items-center justify-center">
                <Loader size={40} text="Syncing Data..." />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
                        Admin Dashboard
                    </h1>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                        InvictusOS • Medical Device Revenue Operations • March 2026
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-card rounded shadow-sm border border-border transition-colors hover:text-foreground">
                        Refresh
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold text-background bg-primary rounded shadow-sm transition-all hover:opacity-90">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="TOTAL REVENUE" value="$245,000" trend="+12.4% this month" trendType="up" topBorderColor="border-t-[var(--primary)]" />
                <StatCard title="TOTAL SALES" value="83" trend="+7 new this month" trendType="up" topBorderColor="border-t-emerald-500" />
                <StatCard title="COMMISSION PAID" value="$32,000" trend="12 reps paid out" trendType="neutral" topBorderColor="border-t-rose-500" />
                <StatCard title="VENDOR PAYMENTS" value="$18,400" trend="3 pending payments" trendType="neutral" topBorderColor="border-t-amber-500" />
                <StatCard title="TOTAL EXPENSES" value="$12,000" trend="+8% vs last month" trendType="down" topBorderColor="border-t-blue-500" />
                <StatCard title="NET PROFIT" value="$201,000" trend="82% margin" trendType="up" topBorderColor="border-t-purple-500" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card shadow-sm lg:col-span-1 transition-all h-[320px] flex flex-col">
                    <div className="flex items-center justify-between p-5 pb-0 z-10 relative">
                        <div>
                            <h2 className="text-sm font-bold text-foreground">Monthly Revenue</h2>
                            <p className="text-[10px] text-muted-foreground mt-1">Jan-Jun 2026</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span>Revenue</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500/50"></span>Expenses</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 w-full pl-2 pb-2">
                        <Chart options={lineChartOptions} series={lineChartSeries} type="area" height="100%" width="100%" />
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm lg:col-span-1 transition-all h-[320px] flex flex-col">
                    <div className="flex items-center justify-between p-5 pb-0 z-10 relative">
                        <div>
                            <h2 className="text-sm font-bold text-foreground">Rep Performance</h2>
                            <p className="text-[10px] text-muted-foreground mt-1">Sales $ vs Rep (YTD 2026)</p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 w-full pl-2 pb-2 pt-2">
                        <Chart options={barChartOptions} series={barChartSeries} type="bar" height="100%" width="100%" />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm transition-all overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-5">
                    <h2 className="text-sm font-bold text-foreground">Recent Sales</h2>
                    <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-border rounded hover:text-foreground transition-colors">
                        View All
                    </button>
                </div>
                <div className="flex-1 px-5 pb-5">
                    <DataTable data={recentSalesData} columns={columns} />
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
        <div className={cn("rounded-xl border border-border border-t-[3px] bg-card p-5 shadow-sm transition-all hover:bg-muted/50", topBorderColor)}>
            <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {title}
            </h3>
            <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-foreground">{value}</div>
                <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                    {trendType === 'up' && <span className="text-primary font-semibold">{trend}</span>}
                    {trendType === 'down' && <span className="text-rose-500 font-semibold">{trend}</span>}
                    {trendType === 'neutral' && <span className="text-emerald-400 font-semibold">{trend}</span>}
                </p>
            </div>
        </div>
    );
}

