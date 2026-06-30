"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, Filter, Truck, Package, X, AlertCircle, Navigation, CheckCircle2 } from 'lucide-react';
import { useShipments, useShipmentSummary } from '@/hooks/admin/shipment';
import Link from 'next/link';



export default function ShipmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const { summary, loading: summaryLoading } = useShipmentSummary();

  const { shipments, loading: shipmentsLoading, meta, setQuery } = useShipments();

  const isMounted = useRef(false);

  // SYNC SEARCH & FILTERS
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const handler = setTimeout(() => {
      setQuery(prev => ({
        ...prev,
        searchTerm: search,
        status: statusFilter === 'All' ? '' : statusFilter,
        method: methodFilter === 'All' ? '' : methodFilter,
        page: 1
      }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search, statusFilter, methodFilter, setQuery]);

  const columns = [
    {
      header: "SHIPMENT ID",
      render: (item: any) => (
        <span className="font-bold text-primary tracking-wider">
          {item.shipmentId || item._id?.slice(-8).toUpperCase()}
        </span>
      ),
      className: "font-bold text-primary tracking-wider"
    },
    {
      header: "PACKAGE / REP",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground capitalize">{item.shipmentInfo?.type || "Package"}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{item.createdBy?.fullName || "System"}</span>
        </div>
      )
    },
    {
      header: "ROUTE (PICKUP → DROPOFF)",
      render: (item: any) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-muted-foreground truncate max-w-[150px] capitalize">{item.pickupInfo?.address || item.pickupInfo?.facility || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-muted-foreground/80 truncate max-w-[150px] capitalize">{item.dropoffInfo?.address || item.dropoffInfo?.facility || "-"}</span>
          </div>
        </div>
      )
    },
    {
      header: "DELIVERY METHOD",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.packageInfo?.serviceType === 'courier' ? (
            <Truck className="h-4 w-4 text-blue-400" />
          ) : (
            <Package className="h-4 w-4 text-amber-500" />
          )}
          <span className={cn(
            "text-xs font-bold capitalize",
            item.packageInfo?.serviceType === 'courier' ? "text-blue-400" : "text-amber-500"
          )}>
            {item.packageInfo?.serviceType || "Driver"}
          </span>
        </div>
      )
    },
    // {
    //   header: "TRACKING / DRIVER",
    //   render: (item: ShipmentItem) => (
    //     <span className="font-medium text-gray-300">
    //       {item.deliveryMethod === 'Driver' ? (item.assignedDriver || <span className="text-gray-500 italic">Unassigned</span>) : item.trackingNumber}
    //     </span>
    //   )
    // },
    {
      header: "STATUS",
      render: (item: any) => {
        const status = item.shipmentStatus || "Pending";
        let type: "success" | "accepted" | "pending" | "rejected" | "picked_up" | "delivered" | "warning" | "error" | "default" = "default";
        if (status === 'delivered') type = 'success';
        if (status === 'accepted') type = 'accepted';
        if (status === 'pending') type = 'pending';
        if (status === 'rejected') type = 'error';
        if (status === 'picked_up') type = 'warning';
        return <StatusBadge status={status} type={type} />;
      }
    },
    {
      header: "CREATED DATE",
      render: (item: any) => (
        <span className="text-muted-foreground text-[11px]">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
        </span>
      )
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <Link href={`/admin/dashboard/shipments/${item._id}`}>
          <button
            className="px-3 py-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors cursor-pointer"
          >
            Details
          </button>
        </Link >
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8 pb-10">

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title mb-1">
            Shipment Management
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium ">
            Monitor internal driver deliveries and external courier shipments
          </p>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TOTAL"
          value={summary?.total || 0}
          icon={<Package className="h-4 w-4 text-primary" />}
          loading={summaryLoading}
        />
        <StatCard
          title="PENDING"
          value={summary?.pending || 0}
          icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
          textColor="text-rose-500"
          highlight
          loading={summaryLoading}
        />
        <StatCard
          title="IN TRANSIT"
          value={summary?.inTransit || 0}
          icon={<Navigation className="h-4 w-4 text-amber-500" />}
          textColor="text-amber-500"
          loading={summaryLoading}
        />
        <StatCard
          title="DELIVERED"
          value={summary?.delivered || 0}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          textColor="text-emerald-500"
          loading={summaryLoading}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-border bg-muted dark:shadow-sm flex flex-col overflow-hidden">

        {/* CONTROL BAR */}
        <div className="p-4 border-b border-border bg-muted/50 flex flex-col md:flex-row gap-4 lg:items-center justify-between">

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--background)] border border-border rounded-lg py-2 px-3 text-xs font-medium text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-[var(--background)] border border-border rounded-lg py-2 px-3 text-xs font-medium text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="courier">COURIER</option>
              <option value="ups">UPS</option>
              <option value="fedex">FEDEX</option>
              <option value="usps">USPS</option>
            </select>

            {/* CLEAR FILTERS */}
            {(search || statusFilter !== 'All' || methodFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setMethodFilter('All');
                }}
                className="text-[10px] font-medium text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <X className="h-3 w-3" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by ID, Rep, or Facility..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md py-2 pl-9 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)] transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {shipmentsLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="flex-1 p-0">
          <DataTable
            data={shipments as any}
            columns={columns as any}
            loading={shipmentsLoading}
            onRowClick={() => { }}
            className="rounded-none border-none"
            pagination={meta ? {
              currentPage: meta.currentPage,
              totalPage: meta.totalPage,
              totalResult: meta.totalResult,
              onPageChange: (page) => setQuery(prev => ({ ...prev, page }))
            } : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  textColor = "text-foreground",
  highlight = false,
  loading = false,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  textColor?: string;
  highlight?: boolean;
  loading?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card p-4 dark:shadow-sm transition-all hover:bg-muted/30 overflow-hidden",
        highlight && Number(value) > 0 && "shadow-[0_0_15px_rgba(244,63,94,0.1)] border-rose-500/30"
      )}
    >
      {highlight && Number(value) > 0 && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl pointer-events-none rounded-full" />
      )}

      {loading && (
        <div className="absolute inset-0 bg-card animate-pulse p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-md bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-6 w-20 bg-muted rounded" />
              <div className="h-2 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="p-1.5 bg-background rounded-md border border-border">
            {icon}
          </div>
        </div>

        <div>
          <div
            className={cn(
              "text-2xl font-black tracking-tight",
              textColor
            )}
          >
            {value}
          </div>

          <h3 className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mt-0.5">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}