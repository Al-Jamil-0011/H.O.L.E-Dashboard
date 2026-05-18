"use client";

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { CreateSaleModal } from '@/components/modals/CreateSaleModal';
import { useSales, useSalesSummary } from '@/hooks/admin/sales';
import { CommonFilterPill, SalesStatCard } from '@/components/stats-card';


export default function SalesPage() {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { summary, loading: isLoading } = useSalesSummary();

  const { sales, loading: salesLoading, setQuery, meta } = useSales();

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
      render: (item: any) => {
        const val = typeof item.saleId === 'object' ? (item.saleId?.saleId || item.saleId?._id || '') : item.saleId;
        return <span>#{String(val || '')}</span>;
      }
    },
    {
      header: "REP",
      render: (item: any) => {
        const primaryRep = item.representatives?.users?.find((u: any) => u.assignRole === 'primary')?.representative;
        const name = typeof primaryRep?.fullName === 'object' ? '' : primaryRep?.fullName;
        return <span>{name || 'N/A'}</span>;
      }
    },
    {
      header: "DOCTOR",
      render: (item: any) => {
        const name = typeof item.physician?.fullName === 'object' ? '' : item.physician?.fullName;
        return <span>{name || 'N/A'}</span>;
      }
    },
    {
      header: "HOSPITAL",
      render: (item: any) => {
        const facility = typeof item.facility === 'object' ? item.facility : null;
        let addr = facility?.address;
        if (typeof addr === 'object') {
          addr = addr?.street || addr?.city || 'N/A';
        }
        return <span className="truncate max-w-[150px] inline-block">{String(addr || 'N/A')}</span>;
      }
    },
    {
      header: "AMOUNT",
      render: (item: any) => {
        const amount = typeof item.billing?.totalAmount === 'object' ? 0 : Number(item.billing?.totalAmount || 0);
        return <span className="text-[#00E5FF] font-medium">${amount.toLocaleString()}</span>;
      }
    },
    {
      header: "COMMISSION",
      render: (item: any) => {
        const comm = typeof item.representatives?.totalCommission === 'object' ? 0 : Number(item.representatives?.totalCommission || 0);
        return <span className="text-emerald-400 font-medium">${comm.toLocaleString()}</span>;
      }
    },
    {
      header: "STATUS",
      render: (item: any) => {
        const status = typeof item.status === 'string' ? item.status.toUpperCase() : 'UNKNOWN';
        let type: "success" | "warning" | "error" = "success";
        if (status === 'PENDING') type = 'warning';
        if (status === 'REJECTED') type = 'error';
        return <StatusBadge status={status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: any) => {
        const id = typeof item._id === 'object' ? item._id?._id : item._id;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/finance/dashboard/sales/${id}`}>
              <button className="px-3 py-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors cursor-pointer">
                View
              </button>
            </Link>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8">
      <CreateSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title mb-1">
            Sales & Revenue
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium ">
            All US Sales • Q1 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer">
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

      <div className="rounded-xl border border-[var(--border)] bg-bg-muted dark:shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 bg-muted/40">
          <h2 className="text-sm font-bold text-foreground">All Sales</h2>
          <div className="flex gap-2 bg-[var(--background)] rounded-lg border border-border w-full sm:w-auto overflow-x-auto p-1">
            <CommonFilterPill
              text="All"
              active={filter === 'All'}
              onClick={() => handleFilterChange('All')}
            />
            <CommonFilterPill
              text="APPROVED"
              active={filter === 'APPROVED'}
              color="bg-primary/20 text-primary"
              activeColor="bg-primary dark:text-black text-white"
              onClick={() => handleFilterChange('APPROVED')}
            />
            <CommonFilterPill
              text="Pending"
              active={filter === 'Pending'}
              color="bg-amber-500/20 text-amber-500"
              activeColor="bg-amber-500 text-white dark:text-[#0B101E]"
              onClick={() => handleFilterChange('Pending')}
            />
          </div >
        </div >
        <DataTable
          data={sales}
          className='!border-none !rounded-none'
          columns={columns}
          loading={salesLoading}
          onRowClick={() => { }}
          pagination={meta ? {
            currentPage: meta.currentPage,
            totalPage: meta.totalPage,
            totalResult: meta.totalResult,
            onPageChange: (page) => setQuery(prev => ({ ...prev, page }))
          } : undefined}
        />
      </div >
    </div >
  );
}
