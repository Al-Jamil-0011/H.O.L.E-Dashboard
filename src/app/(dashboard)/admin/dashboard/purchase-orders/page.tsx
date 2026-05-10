"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, Plus, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import { usePurchaseOrders, usePurchaseOrderSummary } from '@/hooks/admin/purchase-order';

export default function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const { summary, loading: isLoading } = usePurchaseOrderSummary();
  const {
    purchaseOrders,
    loading: isPurchaseOrdersLoading,
    query,
    setQuery
  } = usePurchaseOrders();

  // DEBOUNCED SEARCH
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(prev => ({ ...prev, searchTerm: search, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search, setQuery]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const statusMap: Record<string, any> = {
      'All': undefined,
      'Complete': 'complete',
      'Open': 'open',
      'Lost': 'lost'
    };
    setQuery(prev => ({ ...prev, status: statusMap[tab], page: 1 }));
  };

  const columns = [
    {
      header: "PO NUMBER (SN)",
      accessorKey: "purchaseOrderNumber" as const,
      className: "font-bold text-foreground tracking-wider"
    },
    {
      header: "DATE",
      render: (item: any) => (
        <span className="text-muted-foreground">
          {item.procedureDate ? new Date(item.procedureDate).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      header: "ORDER CATEGORY",
      render: (item: any) => (
        <span className={cn(
          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border",
          item.orderType === 'bulkBioOrder' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
        )}>
          {item.orderType === 'bulkBioOrder' ? 'Bulk Bio' : 'Standard PO'}
        </span>
      )
    },
    {
      header: "SURGEON",
      render: (item: any) => (
        <span className="font-medium text-muted-foreground">
          {typeof item.surgery === 'object' ? item.surgery.info?.fullName : 'N/A'}
        </span>
      )
    },
    {
      header: "FACILITY",
      render: (item: any) => (
        <span className="text-muted-foreground truncate max-w-[150px] inline-block">
          {typeof item.facility === 'object' ? item.facility.address : 'N/A'}
        </span>
      )
    },
    {
      header: "TYPE INFO",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.orderType === 'bulkBioOrder' ? 'Bulk' : 'Standard'}</span>
          <span className="text-muted-foreground font-medium">${item.totalAmount?.toLocaleString() || '0'}</span>
        </div>
      )
    },
    {
      header: "TOTAL VALUE",
      render: (item: any) => (
        <span className="text-primary font-bold text-sm tracking-wide">
          ${item.totalAmount?.toLocaleString() || '0.00'}
        </span>
      )
    },
    {
      header: "STATUS",
      render: (item: any) => {
        let type: "success" | "warning" | "error" = "success";
        if (item.status === 'open') type = 'warning';
        if (item.status === 'lost') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/dashboard/purchase-orders/${item._id}`} className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground border border-[var(--border)] rounded-md hover:text-foreground hover:bg-[var(--border)]/50 transition-colors">
            View Details
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Purchase Orders
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Track and manage all facility and surgeon purchase orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] transition-colors hover:text-foreground hover:bg-[var(--border)] cursor-pointer">
            <Download className="h-4 w-4" /> Export
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400">
            <Plus className="h-4 w-4" /> Create PO
          </button> */}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TOTAL VOLUME"
          value={`$${summary?.totalVolume?.amount?.toLocaleString() || '0'}`}
          trend={`+ ${summary?.totalVolume?.changePercent}% this month`}
          topBorderColor="border-t-[var(--primary)]"
          loading={isLoading}
        />
        <StatCard
          title="COMPLETED"
          value={summary?.completed?.count?.toLocaleString() || '0'}
          trend={`${summary?.completed?.thisWeek} this week`}
          trendColor="text-emerald-500"
          topBorderColor="border-t-emerald-500"
          loading={isLoading}
        />
        <StatCard
          title="OPEN POS"
          value={summary?.openPOs?.count?.toLocaleString() || '0'}
          trend={summary?.openPOs?.needsAttention ? 'Needs attention' : 'No attention needed'}
          trendColor="text-amber-500"
          topBorderColor="border-t-amber-500"
          loading={isLoading}
        />
        <StatCard
          title="LOST / REJECTED"
          value={summary?.lostRejected?.count?.toLocaleString() || '0'}
          trend={`${summary?.lostRejected?.diffFromLastMonth} from last month`}
          trendColor="text-rose-500"
          topBorderColor="border-t-rose-500"
          loading={isLoading}
        />

      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg flex flex-col overflow-hidden min-h-[500px]">

        {/* TOP TABS & SEARCH BAR */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)] flex flex-col md:flex-row gap-4 items-center justify-between">

          <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)] w-full md:w-auto overflow-x-auto">
            {['All', 'Complete', 'Open', 'Lost'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-6 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap cursor-pointer",
                  activeTab === tab
                    ? "bg-[var(--border)] text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-gray-200 hover:bg-[var(--border)]/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by PO#, Surgeon, or facility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

        </div>

        {/* DATA TABLE */}
        <div className="flex-1 p-0">
          <DataTable
            data={purchaseOrders}
            columns={columns}
            loading={isPurchaseOrdersLoading}
            className="rounded-none border-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}

// function StatCard({ title, value, trend, trendColor = "text-primary", topBorderColor }: { title: string, value: string | number, trend: string, trendColor?: string, topBorderColor: string }) {
//   return (
//     <div className={cn("rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-[var(--muted)]", topBorderColor)}>
//       <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{title}</h3>
//       <div className="mt-2 text-3xl font-black tracking-tight text-foreground">{value}</div>
//       <p className={cn("mt-1 text-xs font-medium", trendColor)}>{trend}</p>
//     </div>
//   )
// }



function StatCard({
  title,
  value,
  trend,
  topBorderColor,
  trendColor = "text-primary",
  loading = false
}: {
  title: string;
  value: string;
  trend: string;
  topBorderColor: string;
  trendColor?: string;
  loading?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]",
        topBorderColor
      )}
    >
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {title}
      </h3>

      <div className="mt-3 space-y-2">
        {loading ? (
          <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
        ) : (
          <div className="text-2xl font-black tracking-tight text-foreground">
            {value}
          </div>
        )}

        {loading ? (
          <div className="h-3 w-20 rounded-md bg-muted animate-pulse" />
        ) : (
          <p className={cn("mt-2 text-[11px] font-medium", trendColor)}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}


