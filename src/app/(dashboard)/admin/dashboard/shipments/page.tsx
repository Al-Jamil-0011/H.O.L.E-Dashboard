"use client";

import { useState, useEffect } from 'react';
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


  // SYNC SEARCH & FILTERS
  useEffect(() => {
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
        <span className="font-bold text-[#00E5FF] tracking-wider">
          {item.shipmentId || item._id?.slice(-8).toUpperCase()}
        </span>
      ),
      className: "font-bold text-[#00E5FF] tracking-wider"
    },
    {
      header: "PACKAGE / REP",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-white capitalize">{item.shipmentInfo?.type || "Package"}</span>
          <span className="text-[10px] text-gray-500 font-medium">{item.createdBy?.fullName || "System"}</span>
        </div>
      )
    },
    {
      header: "ROUTE (PICKUP → DROPOFF)",
      render: (item: any) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-gray-300 truncate max-w-[150px] capitalize">{item.pickupInfo?.address || item.pickupInfo?.facility || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-gray-400 truncate max-w-[150px] capitalize">{item.dropoffInfo?.address || item.dropoffInfo?.facility || "-"}</span>
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
        <span className="text-gray-400 text-[11px]">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
        </span>
      )
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <Link href={`/admin/dashboard/shipments/${item._id}`}>
          <button
            className="px-3 py-1.5 text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-md hover:bg-[#00E5FF]/20 transition-colors cursor-pointer"
          >
            Details
          </button>
        </Link >
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Shipment Management
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Monitor internal driver deliveries and external courier shipments
          </p>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TOTAL"
          value={summary?.total || 0}
          icon={<Package className="h-4 w-4 text-[#00E5FF]" />}
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
      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-lg flex flex-col overflow-hidden">

        {/* CONTROL BAR */}
        <div className="p-4 border-b border-[#1E293B] bg-[#1A2234] flex flex-col md:flex-row gap-4 items-center justify-between">

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0B101E] border border-[#334155] rounded-lg py-2 px-3 text-xs font-bold text-gray-300 focus:outline-none focus:border-[#00E5FF] transition-colors appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-[#0B101E] border border-[#334155] rounded-lg py-2 px-3 text-xs font-bold text-gray-300 focus:outline-none focus:border-[#00E5FF] transition-colors appearance-none"
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
                className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <X className="h-3 w-3" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID, Rep, or Facility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B101E] border border-[#334155] rounded-lg py-2 pl-9 pr-10 text-xs font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
            {shipmentsLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-3 w-3 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
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
            className="rounded-none border-0 bg-transparent"
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
  textColor = "text-white",
  highlight = false,
  loading = false, // ✅ add this
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
        "relative rounded-xl border border-[#1E293B] bg-[#151B2B] p-4 shadow-sm transition-all hover:bg-[#1A2234] overflow-hidden",
        highlight && value > 0 && "shadow-[0_0_15px_rgba(244,63,94,0.15)] border-rose-500/30"
      )}
    >
      {highlight && value > 0 && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl pointer-events-none rounded-full" />
      )}

      {loading && (
        <div className="absolute inset-0 bg-[#151B2B] animate-pulse p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-md bg-[#1E293B]" />
            </div>

            <div className="space-y-2">
              <div className="h-6 w-20 bg-[#1E293B] rounded" />
              <div className="h-2 w-24 bg-[#1E293B] rounded" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="p-1.5 bg-[#0B101E] rounded-md border border-[#1E293B]">
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

          <h3 className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mt-0.5">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}