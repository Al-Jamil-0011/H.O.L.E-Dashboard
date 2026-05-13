"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useShippingCosts, useShippingCostSummary } from '@/hooks/finance/shipping-cost';

import { IShippingCost } from '@/hooks/finance/shipping-cost/interface';
import { Package, Truck } from 'lucide-react';

export default function ShippingPage() {
  const [filter, setFilter] = useState('all');

  const { summary, loading: isLoading } = useShippingCostSummary();

  const { shippingCosts, loading, meta, query, setQuery } = useShippingCosts();

  const handleFilterChange = (type: string) => {
    setFilter(type);
    setQuery({
      ...query,
      type: type === 'all' ? "" : type,
      page: 1
    });
  };

  const columns = [
    {
      header: "SHIPMENT ID",
      render: (item: IShippingCost) => (
        <span className="font-medium text-foreground">
          {item.shipmentId || "N/A"}
        </span>
      )
    },
    // {
    //   header: "CARRIER",
    //   render: (item: IShippingCost) => (
    //     <span className="uppercase">{item.shippingCost?.type || "N/A"}</span>
    //   )
    // },
    {
      header: "CARRIER",
      render: (item: IShippingCost) => (
        <div className="flex items-center gap-2">
          {item.shippingCost?.type === 'courier' ? (
            <Truck className="h-4 w-4 text-blue-400" />
          ) : (
            <Package className="h-4 w-4 text-amber-500" />
          )}
          <span className={cn(
            "text-xs font-bold capitalize",
            item.shippingCost?.type === 'courier' ? "text-blue-400" : "text-amber-500"
          )}>
            {item.shippingCost?.type || "Courier"}
          </span>
        </div>
      )
    },
    {
      header: "REP",
      render: (item: IShippingCost) => (
        <div className='flex flex-col gap-1'>
          {item.createdBy?.fullName || "N/A"}
          <p className="text-[11px] text-muted-foreground font-medium">
            {item.createdBy?.email || "N/A"}
          </p>
        </div>
      )
    },
    {
      header: "COST",
      render: (item: IShippingCost) => (
        <span className="text-primary font-medium">
          ${item.shippingCost?.totalCost?.toLocaleString() || "0"}
        </span>
      )
    },
    {
      header: "STATUS",
      render: (item: IShippingCost) => {
        const status = item.shippingCost?.status || "PENDING";
        let type: "success" | "warning" | "error" = "warning";
        if (status === 'PAID') type = 'success';
        return <StatusBadge status={status} type={type} />;
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Shipping Costs
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Track shipment and delivery expenses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded shadow-sm border border-[var(--border)] transition-colors hover:text-foreground">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="TOTAL SHIPPING COSTS"
          amount={`$${summary?.totalShippingCost ?? 0}`}
          color="text-rose-500"
          loading={isLoading}
        />

        <StatCard
          title="PENDING PAYMENTS"
          amount={`$${summary?.totalPendingPayments ?? 0}`}
          color="text-amber-500"
          loading={isLoading}
        />

        <StatCard
          title="PAID PAYMENTS"
          amount={`$${summary?.totalPaidPayments ?? 0}`}
          color="text-emerald-500"
          loading={isLoading}
        />

        <StatCard
          title="SHIPMENTS WITH COST"
          amount={`${summary?.totalShipmentsWithCost ?? 0}`}
          color="text-sky-500"
          loading={isLoading}
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">All Shipments</h2>
          <div className="flex gap-2">
            <FilterPill
              text="All"
              active={filter === 'all'}
              onClick={() => handleFilterChange('all')}
            />

            <FilterPill
              text="FedEx"
              active={filter === 'fedex'}
              color="bg-purple-500/20 text-purple-400"
              activeColor="bg-purple-500 text-[var(--background)]"
              onClick={() => handleFilterChange('fedex')}
            />

            <FilterPill
              text="UPS"
              active={filter === 'ups'}
              color="bg-amber-500/20 text-amber-500"
              activeColor="bg-amber-500 text-[var(--background)]"
              onClick={() => handleFilterChange('ups')}
            />
            <FilterPill
              text="usps"
              active={filter === 'usps'}
              color="bg-indigo-500/20 text-indigo-400"
              activeColor="bg-indigo-500 text-[var(--background)]"
              onClick={() => handleFilterChange('usps')}
            />
            <FilterPill
              text="COURIER"
              active={filter === 'courier'}
              color="bg-indigo-500/20 text-indigo-400"
              activeColor="bg-indigo-500 text-[var(--background)]"
              onClick={() => handleFilterChange('courier')}
            />
          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable
            data={shippingCosts}
            columns={columns}
            loading={loading}
            pagination={meta ? {
              currentPage: meta.currentPage,
              totalPage: meta.totalPage,
              totalResult: meta.totalResult,
              onPageChange: (page) => setQuery({ ...query, page })
            } : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  amount,
  color,
  loading = false
}: {
  title: string,
  amount: string,
  color: string,
  loading?: boolean
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] border-t-[3px] border-t-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]">
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {title}
      </h3>

      {loading ? (
        <div className="mt-2 h-9 w-24 animate-pulse rounded-md bg-white/10" />
      ) : (
        <div className={cn("mt-2 text-3xl font-black tracking-tight", color)}>
          {amount}
        </div>
      )}
    </div>
  )
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

