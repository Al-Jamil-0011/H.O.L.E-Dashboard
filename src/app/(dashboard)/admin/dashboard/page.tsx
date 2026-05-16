"use client";
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import type { ApexOptions } from 'apexcharts';
import { useDashboardOverview } from '@/hooks/overview';
import { IRecentSale } from '@/hooks/overview/interface';
import { DashboardStatCard } from '@/components/stats-card';
import Link from 'next/link';
import { useMyProfile } from '@/hooks/admin/users';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Recent sales moved to columns render logic using IRecentSale interface

export default function Home() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { profile } = useMyProfile();

    console.log("profile", profile)
    const { summary: dashboardData, loading: isLoading, refetch } = useDashboardOverview();

    // Chart Data Preparation
    const monthlyRevenue = dashboardData?.charts?.monthlyRevenue || [];
    const repPerformance = dashboardData?.charts?.repPerformance || [];


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
            categories: monthlyRevenue.map(m => m.month),
            labels: { style: { colors: isDark ? '#a1a1aa' : '#71717a' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: isDark ? '#a1a1aa' : '#71717a' },
                formatter: (value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
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
        { name: 'Revenue', data: monthlyRevenue.map(m => m.revenue) },
        { name: 'Expenses', data: monthlyRevenue.map(m => m.expenses) }
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
            categories: repPerformance.map(r => r.repName),
            labels: { style: { colors: isDark ? '#a1a1aa' : '#71717a' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: isDark ? '#a1a1aa' : '#71717a' },
                formatter: (value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
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
        { name: 'Revenue', data: repPerformance.map(r => r.revenue) },
        { name: 'Sales', data: repPerformance.map(r => r.sales) }
    ];


    const columns = [
        {
            header: "SALE ID",
            render: (item: IRecentSale) => <span className="font-medium text-foreground">{item.saleId}</span>
        },
        { header: "REP", accessorKey: "rep" as const },
        { header: "DOCTOR", accessorKey: "doctor" as const },
        { header: "HOSPITAL", accessorKey: "hospital" as const },
        { header: "IMPLANT", accessorKey: "implant" as const },
        {
            header: "AMOUNT",
            render: (item: IRecentSale) => <span className="text-primary font-medium">${item.amount.toLocaleString()}</span>
        },
        {
            header: "COMMISSION",
            render: (item: IRecentSale) => <span className="text-emerald-400 font-medium">${item.commission.toLocaleString()}</span>
        },
        {
            header: "STATUS",
            render: (item: IRecentSale) => {
                let type: "success" | "warning" | "error" = "warning";
                if (item.status === 'paid' || item.status === 'PAID') type = 'success';
                if (item.status === 'rejected' || item.status === 'REJECTED') type = 'error';
                return <StatusBadge status={item.status} type={type} />;
            }
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8">
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
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-card rounded dark:shadow-sm border border-border transition-colors hover:text-foreground cursor-pointer"
                    >
                        Refresh
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold text-background bg-primary rounded shadow-sm transition-all hover:opacity-90 cursor-pointer">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardStatCard
                    title="TOTAL REVENUE"
                    value={`$${dashboardData?.stats?.revenue?.totalRevenue?.toLocaleString() || "0"}`}
                    trend={`${(dashboardData?.stats?.revenue?.thisMonthPercentage ?? 0) > 0 ? '+' : ''}${dashboardData?.stats?.revenue?.thisMonthPercentage ?? 0}% this month`}
                    trendType={(dashboardData?.stats?.revenue?.thisMonthPercentage ?? 0) >= 0 ? "up" : "down"}
                    topBorderColor="border-t-[#00E5FF]"
                    loading={isLoading}
                />
                <DashboardStatCard
                    title="TOTAL SALES"
                    value={dashboardData?.stats?.sales?.totalSales?.toString() || "0"}
                    trend={`+${dashboardData?.stats?.sales?.thisMonthCount ?? 0} new this month`}
                    trendType="up"
                    topBorderColor="border-t-emerald-500"
                    loading={isLoading}
                />
                <DashboardStatCard
                    title="COMMISSION PAID"
                    value={`$${dashboardData?.stats?.commission?.totalCommissions?.toLocaleString() || "0"}`}
                    trend={`${dashboardData?.stats?.commission?.reps ?? 0} reps paid out`}
                    trendType="neutral"
                    topBorderColor="border-t-rose-500"
                    loading={isLoading}
                />
                <DashboardStatCard
                    title="VENDOR PAYMENTS"
                    value={`$${dashboardData?.stats?.vendor?.totalVendorPayments?.toLocaleString() || "0"}`}
                    trend={`${dashboardData?.stats?.vendor?.pendingCount ?? 0} pending payments`}
                    trendType="neutral"
                    topBorderColor="border-t-amber-500"
                    loading={isLoading}
                />
                <DashboardStatCard
                    title="TOTAL EXPENSES"
                    value={`$${dashboardData?.stats?.expense?.totalExpenses?.toLocaleString() || "0"}`}
                    trend={`${(dashboardData?.stats?.expense?.lastMonthPercentage ?? 0) > 0 ? '+' : ''}${dashboardData?.stats?.expense?.lastMonthPercentage ?? 0}% vs last month`}
                    trendType={(dashboardData?.stats?.expense?.lastMonthPercentage ?? 0) <= 0 ? "down" : "up"}
                    topBorderColor="border-t-blue-500"
                    loading={isLoading}
                />
                <DashboardStatCard
                    title="NET PROFIT"
                    value={`$${dashboardData?.stats?.netProfit?.totalNetProfit?.toLocaleString() || "0"}`}
                    trend={`${dashboardData?.stats?.netProfit?.margin ?? 0}% margin`}
                    trendType="up"
                    topBorderColor="border-t-purple-500"
                    loading={isLoading}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card dark:shadow-sm lg:col-span-1 transition-all h-[320px] flex flex-col">
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
                        <Chart
                            options={lineChartOptions}
                            series={lineChartSeries}
                            type="area"
                            height="100%"
                            width="100%"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card dark:shadow-sm lg:col-span-1 transition-all h-[320px] flex flex-col">
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

            <div className="rounded-xl border border-border bg-card dark:shadow-sm transition-all overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-5">
                    <h2 className="text-sm font-bold text-foreground">Recent Sales</h2>
                    <Link href={`/${profile?.role}/dashboard/sales`}>
                        <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-border rounded hover:text-foreground transition-colors cursor-pointer">
                            View All
                        </button>
                    </Link>
                </div>
                <div className="flex-1 px-5 pb-5">
                    <DataTable
                        data={dashboardData?.recentSales || []}
                        columns={columns}
                        loading={isLoading}
                        onRowClick={() => { }}
                    />
                </div>
            </div>
        </div>
    );
}


