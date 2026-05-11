"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, Plus, Filter, AlertTriangle, Box, Activity, Warehouse, ArrowRightLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAllInventory, useInventorySummary } from '@/hooks/admin/inventory';


export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Implant' | 'Tray' | 'Bio'>('All');
  const [search, setSearch] = useState('');

  const router = useRouter();

  const { summary, loading: summaryLoading } = useInventorySummary();

  // SYNC FILTERS WITH API
  const { inventory: allInventory, loading: allInventoryLoading, meta, setQuery } = useAllInventory();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(prev => ({
        ...prev,
        searchTerm: search,
        category: activeTab === 'All' ? "" : activeTab as any,
        page: 1
      }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search, activeTab, setQuery]);

  const handleRowClick = (item: any) => {
    router.push(`/admin/dashboard/inventory/${item._id}`);
  };



  const columns = [
    {
      header: "ITEM NAME",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.productType === 'Bio' && (item.quantity ?? 0) < 5 && item.productStatus !== 'Used' && (
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          )}
          <span className={cn(
            "font-bold",
            item.productType === 'Bio' && (item.quantity ?? 0) < 5 && item.productStatus !== 'Used' ? "text-rose-400" : "text-white"
          )}>
            {item.title || item.name || 'N/A'}
          </span>
        </div>
      )
    },
    {
      header: "TYPE",
      render: (item: any) => (
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border",
          item.productType === 'Implant' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
            item.productType === 'Tray' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
              "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20"
        )}>
          {item.productType}
        </span>
      )
    },
    {
      header: "SERIAL / LOT NO.",
      render: (item: any) => (
        <span className="font-medium text-gray-300">
          {item.serialNumber || item.lotNumber || '-'}
        </span>
      )
    },
    {
      header: "VENDOR",
      render: (item: any) => (
        <span className="text-gray-400">
          {item.vendor?.companyName || item.vendor?.name || item.vendor || '-'}
        </span>
      )
    },
    {
      header: "STATUS",
      render: (item: any) => {
        let type: "success" | "warning" | "error" | "default" = "default";
        const status = item.productStatus || 'default';
        if (status.toLowerCase() === 'available' || status.toLowerCase() === 'warehouse') type = 'success';
        if (status.toLowerCase() === 'assigned') type = 'warning';
        if (status.toLowerCase() === 'used') type = 'error';
        return <StatusBadge status={status} type={type} />;
      }
    },
    { header: "LOCATION", accessorKey: "facility" as const, className: "text-gray-400" },
    {
      header: "EXPIRY DATE",
      render: (item: any) => {
        if (
          item.productType !== "Bio" ||
          !item.expiryDate
        ) {
          return (
            <span className="text-gray-600">
              N/A
            </span>
          );
        }

        const expiryDate =
          new Date(item.expiryDate);

        const isExpired =
          expiryDate < new Date();

        const isExpiringSoon =
          expiryDate <
          new Date(
            Date.now() +
            30 * 24 * 60 * 60 * 1000
          ) && !isExpired;

        const formattedDate =
          expiryDate.toLocaleDateString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );

        return (
          <span
            className={cn(
              "font-medium",
              isExpired
                ? "text-rose-500"
                : isExpiringSoon
                  ? "text-amber-500"
                  : "text-gray-400"
            )}
          >
            {formattedDate}
          </span>
        );
      },
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}
          className="px-3 py-1.5 text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-md hover:bg-[#00E5FF]/20 transition-colors cursor-pointer"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Inventory Management
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Monitor, track, and transfer medical inventory globally
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-300 bg-[#151B2B] rounded-lg shadow-sm border border-[#1E293B] transition-colors hover:text-white hover:bg-[#1E293B]">
            <Filter className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TOTAL INVENTORY ITEMS"
          value={summary?.totalInventory ?? 0}
          icon={<Box className="h-5 w-5 text-[#00E5FF]" />}
          topBorderColor="border-t-[#00E5FF]"
          loading={summaryLoading}
        />
        <StatCard
          title="IN STOCK (AVAILABLE)"
          value={summary?.totalAvailableInventory ?? 0}
          icon={<Activity className="h-5 w-5 text-emerald-500" />}
          topBorderColor="border-t-emerald-500"
          loading={summaryLoading}
        />
        <StatCard
          title="LOW STOCK ALERT"
          value={summary?.lowStockAlert?.productCount ?? 0}
          icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
          textColor="text-rose-500"
          topBorderColor="border-t-rose-500"
          highlight={summary?.lowStockAlert?.isLowStock === true ? true : false}
          loading={summaryLoading}
        />
        <StatCard
          title="CONSIGNED INVENTORY"
          value={0}
          icon={<Warehouse className="h-5 w-5 text-purple-400" />}
          topBorderColor="border-t-purple-500"
          loading={summaryLoading}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-lg flex flex-col overflow-hidden min-h-[500px]">

        {/* CONTROL BAR */}
        <div className="p-4 border-b border-[#1E293B] bg-[#1A2234] flex flex-col md:flex-row gap-4 items-center justify-between">

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Type Tabs */}
            <div className="flex items-center bg-[#0B101E] p-1 rounded-lg border border-[#1E293B] w-full sm:w-auto overflow-x-auto">
              {['All', 'Implant', 'Tray', 'Bio'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap",
                    activeTab === tab
                      ? "bg-[#1E293B] text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200 hover:bg-[#1E293B]/50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Ownership Toggle */}
            {/* <div className="flex items-center bg-[#0B101E] p-1 rounded-lg border border-[#1E293B]">
              {['Owned', 'Consigned'].map(toggle => (
                <button
                  key={toggle}
                  onClick={() => setOwnershipToggle(toggle as any)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap",
                    ownershipToggle === toggle
                      ? "bg-[#00E5FF]/20 text-[#00E5FF] shadow-sm border border-[#00E5FF]/30"
                      : "text-gray-500 hover:text-gray-300 hover:bg-[#1E293B]/50"
                  )}
                >
                  {toggle}
                </button>
              ))}
            </div> */}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select className="w-full sm:w-auto bg-[#0B101E] border border-[#334155] rounded-lg py-2 px-3 text-xs font-bold text-gray-300 focus:outline-none focus:border-[#00E5FF] transition-colors appearance-none">
              <option value="all">All Facilities</option>
              <option value="main">Main Warehouse</option>
              <option value="city">City Hospital</option>
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0B101E] border border-[#334155] rounded-lg py-2 pl-9 pr-3 text-xs font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>
          </div>

        </div>

        {/* DATA TABLE */}
        <div className="flex-1 p-0">
          <DataTable
            data={allInventory as any}
            columns={columns as any}
            loading={allInventoryLoading}
            onRowClick={handleRowClick}
            className="rounded-none border-0 bg-transparent"
            pagination={meta ? {
              currentPage: meta.page,
              totalPage: meta.totalPage,
              totalResult: meta.total,
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
  topBorderColor,
  highlight = false,
  loading = false,
}: {
  title: string,
  value: string | number,
  icon: React.ReactNode,
  textColor?: string,
  topBorderColor: string,
  highlight?: boolean,
  loading?: boolean,
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-[#1A2234] overflow-hidden",
        topBorderColor,
        highlight &&
        "animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.2)] border-rose-500/50"
      )}
    >
      {highlight && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />
      )}

      <div className="flex items-start justify-between">
        <div>
          {loading ? (
            <>
              <div className="h-3 w-20 rounded bg-[#1E293B] animate-pulse" />
              <div className="mt-3 h-8 w-16 rounded bg-[#1E293B] animate-pulse" />
            </>
          ) : (
            <>
              <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                {title}
              </h3>

              <div
                className={cn(
                  "mt-2 text-3xl font-black tracking-tight",
                  textColor
                )}
              >
                {value}
              </div>
            </>
          )}
        </div>

        <div className="p-2 bg-[#0B101E] rounded-lg border border-[#1E293B]">
          {loading ? (
            <div className="h-5 w-5 rounded bg-[#1E293B] animate-pulse" />
          ) : (
            icon
          )}
        </div>
      </div>
    </div>
  );
}