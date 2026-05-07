"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, Plus, Filter, Download } from 'lucide-react';
import Link from 'next/link';

const mockPurchaseOrders = [
  { id: 'XYZ14324', date: 'Feb 15, 2026', category: 'Bulk Bio', surgeon: 'Dr. Robert Smith', facility: 'City Hospital', type: 'Commission', fee: '$630.00', total: '$4,200.00', status: 'Complete' },
  { id: 'ABC56789', date: 'Mar 01, 2026', category: 'Standard', surgeon: 'Dr. Emily Johnson', facility: 'Greenwood Clinic', type: 'Consultation', fee: '$450.00', total: '$2,250.00', status: 'Open' },
  { id: 'JKL67890', date: 'Apr 15, 2026', category: 'Bulk Bio', surgeon: 'Dr. David Brown', facility: 'Sunrise Clinic', type: 'Commission', fee: '$350.00', total: '$1,750.00', status: 'Lost' },
  { id: 'DEF98765', date: 'Mar 15, 2026', category: 'Standard', surgeon: 'Dr. Michael Lee', facility: 'Downtown Medical Center', type: 'Surgery', fee: '$1,200.00', total: '$7,200.00', status: 'Complete' },
  { id: 'GHI12345', date: 'May 02, 2026', category: 'Standard', surgeon: 'Dr. Sarah Connor', facility: 'Westside General', type: 'Commission', fee: '$880.00', total: '$5,400.00', status: 'Open' },
  { id: 'MNO98765', date: 'May 10, 2026', category: 'Bulk Bio', surgeon: 'Dr. Alan Grant', facility: 'Jurassic Medical', type: 'Consultation', fee: '$300.00', total: '$1,500.00', status: 'Open' },
];

export default function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredData = mockPurchaseOrders.filter((po) => {
    const matchesTab = activeTab === 'All' || po.status === activeTab;
    const matchesSearch = 
      po.id.toLowerCase().includes(search.toLowerCase()) ||
      po.surgeon.toLowerCase().includes(search.toLowerCase()) ||
      po.facility.toLowerCase().includes(search.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const columns = [
    { header: "PO NUMBER (SN)", accessorKey: "id" as const, className: "font-bold text-foreground tracking-wider" },
    { header: "DATE", accessorKey: "date" as const, className: "text-muted-foreground" },
    { 
      header: "ORDER CATEGORY", 
      render: (item: typeof mockPurchaseOrders[0]) => (
        <span className={cn(
          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border",
          item.category === 'Bulk Bio' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
        )}>
          {item.category}
        </span>
      )
    },
    { header: "SURGEON", accessorKey: "surgeon" as const, className: "font-medium text-muted-foreground" },
    { header: "FACILITY", accessorKey: "facility" as const, className: "text-muted-foreground" },
    { 
      header: "TYPE INFO", 
      render: (item: typeof mockPurchaseOrders[0]) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.type}</span>
          <span className="text-muted-foreground font-medium">{item.fee}</span>
        </div>
      )
    },
    { header: "TOTAL VALUE", accessorKey: "total" as const, className: "text-primary font-bold text-sm tracking-wide" },
    { 
      header: "STATUS", 
      render: (item: typeof mockPurchaseOrders[0]) => {
        let type: "success" | "warning" | "error" = "success";
        if (item.status === 'Open') type = 'warning';
        if (item.status === 'Lost') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: typeof mockPurchaseOrders[0]) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/dashboard/purchase-orders/${item.id}`} className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground border border-[var(--border)] rounded-md hover:text-foreground hover:bg-[var(--border)]/50 transition-colors">
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
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] transition-colors hover:text-foreground hover:bg-[var(--border)]">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400">
            <Plus className="h-4 w-4" /> Create PO
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="TOTAL VOLUME" value="$22,300" trend="+15% this month" topBorderColor="border-t-[var(--primary)]" />
        <StatCard title="COMPLETED" value="23" trend="4 this week" topBorderColor="border-t-emerald-500" />
        <StatCard title="OPEN POS" value="8" trend="Needs attention" trendColor="text-amber-500" topBorderColor="border-t-amber-500" />
        <StatCard title="LOST / REJECTED" value="2" trend="-1 from last month" trendColor="text-rose-500" topBorderColor="border-t-rose-500" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg flex flex-col overflow-hidden min-h-[500px]">
        
        {/* TOP TABS & SEARCH BAR */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)] flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)] w-full md:w-auto overflow-x-auto">
            {['All', 'Complete', 'Open', 'Lost'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap",
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
            data={filteredData} 
            columns={columns} 
            className="rounded-none border-0 bg-transparent" 
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendColor = "text-primary", topBorderColor }: { title: string, value: string | number, trend: string, trendColor?: string, topBorderColor: string }) {
  return (
    <div className={cn("rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-[var(--muted)]", topBorderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{title}</h3>
      <div className="mt-2 text-3xl font-black tracking-tight text-foreground">{value}</div>
      <p className={cn("mt-1 text-xs font-medium", trendColor)}>{trend}</p>
    </div>
  )
}

