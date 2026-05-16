"use client";

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { CreateSaleModal } from '@/components/modals/CreateSaleModal';
import { useSales, useSalesSummary } from '@/hooks/admin/sales';
import { SalesStatCard } from '@/components/stats-card';


export default function SalesPage() {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { summary, loading: isLoading } = useSalesSummary();

  const { sales, loading: salesLoading, setQuery } = useSales();

  const handleFilterChange = (status: string) => {
    setFilter(status);
    setQuery(prev => ({
      ...prev,
      page: 1,
      status: status === 'All' ? undefined : status.toLowerCase() as any
    }));
  };

  const columns = [
    {
      header: "SALE ID",
      accessorKey: "saleId" as const,
      className: "font-medium text-primary",
      render: (item: any) => <span>#{item.saleId}</span>
    },
    {
      header: "REP",
      render: (item: any) => {
        const primaryRep = item.representatives?.users?.find((u: any) => u.assignRole === 'primary')?.representative;
        return <span>{primaryRep?.fullName || 'N/A'}</span>;
      }
    },
    {
      header: "DOCTOR",
      render: (item: any) => <span>{item.physician?.fullName || 'N/A'}</span>
    },
    {
      header: "HOSPITAL",
      render: (item: any) => {
        const facility = typeof item.facility === 'object' ? item.facility : null;
        return <span className="truncate max-w-[150px] inline-block">{facility?.address || 'N/A'}</span>;
      }
    },
    {
      header: "AMOUNT",
      render: (item: any) => <span className="text-[#00E5FF] font-medium">${item.billing?.totalAmount?.toLocaleString()}</span>
    },
    {
      header: "COMMISSION",
      render: (item: any) => <span className="text-emerald-400 font-medium">${item.representatives?.totalCommission?.toLocaleString()}</span>
    },
    {
      header: "STATUS",
      render: (item: any) => {
        const status = item.status?.toUpperCase();
        let type: "success" | "warning" | "error" = "success";
        if (status === 'PENDING') type = 'warning';
        if (status === 'REJECTED') type = 'error';
        return <StatusBadge status={status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/dashboard/sales/${item._id}`}>
            <button className="px-4 py-1.5 text-[11px] font-semibold text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors cursor-pointer">
              View
            </button>
          </Link>
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
          <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SalesStatCard
          title="REVENUE"
          value={summary?.revenue?.total ? `$${summary.revenue.total.toLocaleString()}` : '$0.00'}
          trend={summary?.revenue?.change ? `+${summary.revenue.change}%` : '0%'}
          topBorderColor="border-t-[var(--primary)]"
          loading={isLoading}
        />

        <SalesStatCard
          title="TOTAL SALES"
          value={summary?.totalSales?.count ? `${summary.totalSales.count}` : '0'}
          trend={summary?.totalSales?.newThisMonth ? `+${summary.totalSales.newThisMonth} new` : '0'}
          topBorderColor="border-t-emerald-500"
          loading={isLoading}
        />

        <SalesStatCard
          title="AVG VALUE"
          value={summary?.avgValue?.amount ? `$${summary.avgValue.amount.toLocaleString()}` : '$0.00'}
          trend={summary?.avgValue?.change ? `+${summary.avgValue.change}%` : '0%'}
          topBorderColor="border-t-purple-500"
          loading={isLoading}
        />

        <SalesStatCard
          title="CONVERSION"
          value={summary?.conversion?.rate ? `${summary.conversion.rate}%` : '0.00%'}
          trend={summary?.conversion?.trend ? `Stable (${summary.conversion.trend})` : '0%'}
          topBorderColor="border-t-amber-500"
          loading={isLoading}
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] dark:shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 bg-muted/40">
          <h2 className="text-sm font-bold text-foreground">All Sales</h2>
          <div className="flex gap-2">
            <FilterPill
              text="All"
              active={filter === 'All'}
              onClick={() => handleFilterChange('All')}
            />
            <FilterPill
              text="APPROVED"
              active={filter === 'APPROVED'}
              color="bg-[#00E5FF]/20 text-[#00E5FF]"
              activeColor="bg-[#00E5FF] text-[#0B101E]"
              onClick={() => handleFilterChange('APPROVED')}
            />
            <FilterPill
              text="Pending"
              active={filter === 'Pending'}
              color="bg-amber-500/20 text-amber-500"
              activeColor="bg-amber-500 text-[#0B101E]"
              onClick={() => handleFilterChange('Pending')}
            />
          </div >
        </div >
        <div className="flex-1 px-5 pb-5">
          <DataTable
            data={sales}
            columns={columns}
            loading={salesLoading}
          />
        </div>
      </div >
    </div >
  );
}

function FilterPill({
  text,
  active,
  onClick,
  color,
  activeColor
}: {
  text: string;
  active: boolean;
  onClick: () => void;
  color?: string;
  activeColor?: string
}) {
  const baseClasses = "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-[var(--border)] transition-all cursor-pointer";

  if (active) {
    return (
      <button
        onClick={onClick}
        className={cn(
          baseClasses,
          activeColor || "bg-[var(--border)] text-foreground border-[var(--border)]"
        )}>
        {text}
      </button>
    );
  }

  if (color) {
    return (
      <button
        onClick={onClick}
        className={cn(baseClasses, color, "hover:opacity-80")}>
        {text}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(baseClasses, "text-muted-foreground  hover:text-foreground hover:bg-[var(--border)]/50")}>
      {text}
    </button>
  )
}

