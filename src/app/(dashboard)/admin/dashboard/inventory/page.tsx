"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, Filter, AlertTriangle, Box, Activity, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAllInventory, useInventorySummary } from '@/hooks/admin/inventory';
import { useFacilities } from '@/hooks/common';
import { InventoryStatCard } from '@/components/stats-card';


export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Implant' | 'Tray' | 'Bio'>('All');
  const [search, setSearch] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('all');

  const router = useRouter();

  const { summary, loading: summaryLoading } = useInventorySummary();
  const { facilityOptions } = useFacilities();

  // SYNC FILTERS WITH API
  const { inventory: allInventory, loading: allInventoryLoading, meta, setQuery } = useAllInventory();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(prev => ({
        ...prev,
        searchTerm: search,
        category: activeTab === 'All' ? "" : activeTab as any,
        facility: selectedFacility === 'all' ? "" : selectedFacility,
        page: 1
      }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search, activeTab, selectedFacility, setQuery]);

  const handleRowClick = (item: any) => {
    router.push(`/admin/dashboard/inventory/${item._id}`);
  };



  const columns = [
    {
      header: "ITEM NAME",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {/* {item.productType === 'Bio' && (item.quantity ?? 0) < 5 && item.productStatus !== 'Used' && (
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          )}
          <span className={cn(
            "font-bold",
            item.productType === 'Bio' && (item.quantity ?? 0) < 5 && item.productStatus !== 'Used' ? "text-rose-400" : "text-white"
          )}>
            {item.title || item.name || 'N/A'}
          </span> */}
          {
            item?.productType === 'Bio' ?
              <span className={cn(
                "font-bold",
                item.productType === 'Bio' && (item.quantity ?? 0) < 5 && item.productStatus !== 'Used' ? "text-rose-400" : "dark:text-white text-black"
              )}>
                {item?.itemName || 'N/A'}
              </span> :
              <span className={cn(
                "font-bold")}>
                {item.title || item.serialNumber || 'N/A'}
              </span>
          }
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
        <span className="font-medium text-muted-foreground">
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
    {
      header: "LOCATION",
      render: (item: any) => <span className="text-muted-foreground">{item.facility?.name || 'N/A'}</span>
    },
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
          className="px-3 py-1.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors cursor-pointer"
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
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Inventory Management
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Monitor, track, and transfer medical inventory globally
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground bg-card rounded-lg dark:shadow-sm border border-border transition-colors hover:text-foreground hover:bg-muted cursor-pointer">
            <Filter className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InventoryStatCard
          title="TOTAL INVENTORY ITEMS"
          value={summary?.totalInventory ?? 0}
          icon={<Box className="h-5 w-5 text-primary" />}
          topBorderColor="border-t-primary"
          loading={summaryLoading}
        />
        <InventoryStatCard
          title="IN STOCK (AVAILABLE)"
          value={summary?.totalAvailableInventory ?? 0}
          icon={<Activity className="h-5 w-5 text-emerald-500" />}
          topBorderColor="border-t-emerald-500"
          loading={summaryLoading}
        />
        <InventoryStatCard
          title="LOW STOCK ALERT"
          value={summary?.lowStockAlert?.productCount ?? 0}
          icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
          textColor="text-rose-500"
          topBorderColor="border-t-rose-500"
          highlight={summary?.lowStockAlert?.isLowStock === true ? true : false}
          loading={summaryLoading}
        />
        <InventoryStatCard
          title="CONSIGNED INVENTORY"
          value={0}
          icon={<Warehouse className="h-5 w-5 text-purple-400" />}
          topBorderColor="border-t-purple-500"
          loading={summaryLoading}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-border bg-[var(--card)] dark:shadow-lg flex flex-col overflow-hidden">

        {/* CONTROL BAR */}
        <div className="p-4 border-b border-border bg-[var(--muted)] flex flex-col md:flex-row gap-4 items-center justify-between">

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Type Tabs */}
            <div className="flex items-center bg-[var(--background)] p-1 rounded-lg border border-border w-full sm:w-auto overflow-x-auto">
              {['All', 'Implant', 'Tray', 'Bio'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-6 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap cursor-pointer",
                    activeTab === tab
                      ? "bg-[var(--border)] text-foreground dark:shadow-sm"
                      : "text-muted-foreground dark:hover:text-gray-200 hover:bg-[var(--border)]/50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full sm:w-auto bg-muted border border-border rounded-lg py-2 px-3 text-xs font-bold text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Facilities</option>
              {facilityOptions?.length > 0 && facilityOptions?.map((facility) => (
                <option key={facility.value} value={facility.value}>
                  {facility.label}
                </option>
              ))}
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg py-2 pl-9 pr-3 text-xs font-bold text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
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
