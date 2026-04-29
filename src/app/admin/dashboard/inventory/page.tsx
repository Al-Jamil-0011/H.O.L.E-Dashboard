"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, Plus, Filter, AlertTriangle, Box, Activity, Warehouse, ArrowRightLeft } from 'lucide-react';
import { InventoryDetailsDrawer, InventoryItem } from './components/InventoryDetailsDrawer';

// MOCK DATA
const mockInventory: InventoryItem[] = [
  {
    id: 'INV-1001',
    name: 'Pedicle Screw 6.5mm x 45mm',
    type: 'Implant',
    serialNumber: 'SN-99827364',
    systemType: 'Expedium',
    vendor: 'DePuy Synthes',
    status: 'Available',
    ownership: 'Owned',
    facility: 'Main Warehouse',
    history: [
      { id: 'ev1', type: 'added', date: 'Oct 01, 2026', location: 'Main Warehouse', user: 'Admin' }
    ]
  },
  {
    id: 'INV-1002',
    name: 'Titanium Rod 5.5mm x 100mm',
    type: 'Implant',
    serialNumber: 'SN-11223344',
    systemType: 'Matrix',
    vendor: 'Medtronic',
    status: 'Assigned',
    ownership: 'Consigned',
    facility: 'City Hospital',
    history: [
      { id: 'ev1', type: 'added', date: 'Sep 15, 2026', location: 'Main Warehouse' },
      { id: 'ev2', type: 'shipped', date: 'Sep 20, 2026', location: 'City Hospital' },
      { id: 'ev3', type: 'assigned', date: 'Oct 05, 2026', location: 'City Hospital', user: 'Rep Sarah' }
    ]
  },
  {
    id: 'INV-1003',
    name: 'Cervical Instrument Tray',
    type: 'Tray',
    serialNumber: 'TRY-77654',
    systemType: 'Anterior Cervical',
    vendor: 'Stryker',
    status: 'Available',
    ownership: 'Consigned',
    facility: 'Greenwood Clinic',
    history: [
      { id: 'ev1', type: 'added', date: 'Aug 10, 2026', location: 'Main Warehouse' },
      { id: 'ev2', type: 'shipped', date: 'Aug 12, 2026', location: 'Greenwood Clinic' }
    ]
  },
  {
    id: 'INV-1003B',
    name: 'Lumbar Fusion Tray',
    type: 'Tray',
    serialNumber: 'TRY-99211',
    systemType: 'Posterior Lumbar',
    vendor: 'DePuy Synthes',
    status: 'Available',
    ownership: 'Owned',
    facility: 'Main Warehouse',
    history: [
      { id: 'ev1', type: 'added', date: 'Sep 05, 2026', location: 'Main Warehouse', user: 'Admin' }
    ]
  },
  {
    id: 'INV-1003C',
    name: 'Basic Ortho Tray',
    type: 'Tray',
    serialNumber: 'TRY-11002',
    systemType: 'General Ortho',
    vendor: 'Zimmer Biomet',
    status: 'Assigned',
    ownership: 'Owned',
    facility: 'Main Warehouse',
    history: [
      { id: 'ev1', type: 'added', date: 'Oct 10, 2026', location: 'Main Warehouse' },
      { id: 'ev2', type: 'assigned', date: 'Oct 12, 2026', location: 'Main Warehouse', user: 'Rep David' }
    ]
  },
  {
    id: 'INV-1004',
    name: 'Bone Graft Matrix 10cc',
    type: 'Bio',
    lotNumber: 'LOT-BGM998',
    vendor: 'Zimmer Biomet',
    status: 'Available',
    ownership: 'Owned',
    facility: 'Main Warehouse',
    quantity: 3, // LOW STOCK TRIGGER (< 5)
    expiryDate: '2026-11-01', // EXPIRING SOON
    history: [
      { id: 'ev1', type: 'added', date: 'Jul 01, 2026', location: 'Main Warehouse' }
    ]
  },
  {
    id: 'INV-1005',
    name: 'Demineralized Bone Matrix',
    type: 'Bio',
    lotNumber: 'LOT-DBM112',
    vendor: 'Medtronic',
    status: 'Used',
    ownership: 'Consigned',
    facility: 'City Hospital',
    quantity: 0,
    expiryDate: '2025-12-15', // EXPIRED
    history: [
      { id: 'ev1', type: 'added', date: 'Jan 10, 2025', location: 'Main Warehouse' },
      { id: 'ev2', type: 'shipped', date: 'Feb 15, 2025', location: 'City Hospital' },
      { id: 'ev3', type: 'used', date: 'Mar 20, 2026', location: 'City Hospital', user: 'Dr. Smith' }
    ]
  }
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Implant' | 'Tray' | 'Bio'>('All');
  const [ownershipToggle, setOwnershipToggle] = useState<'Owned' | 'Consigned'>('Owned');
  const [search, setSearch] = useState('');

  // Drawer State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const filteredData = mockInventory.filter((item) => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesOwnership = item.ownership === ownershipToggle;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.lotNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase()) ||
      item.facility?.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesOwnership && matchesSearch;
  });

  // Analytics
  const totalItems = mockInventory.length;
  const inStock = mockInventory.filter(i => i.status === 'Available').length;
  const lowStockCount = mockInventory.filter(i => i.type === 'Bio' && (i.quantity ?? 0) > 0 && (i.quantity ?? 0) < 5).length;
  const consignedItems = mockInventory.filter(i => i.ownership === 'Consigned').length;

  const handleRowClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      header: "ITEM NAME",
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-2">
          {item.type === 'Bio' && (item.quantity ?? 0) < 5 && item.status !== 'Used' && (
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          )}
          <span className={cn(
            "font-bold",
            item.type === 'Bio' && (item.quantity ?? 0) < 5 && item.status !== 'Used' ? "text-rose-400" : "text-white"
          )}>
            {item.name}
          </span>
        </div>
      )
    },
    {
      header: "TYPE",
      render: (item: InventoryItem) => (
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border",
          item.type === 'Implant' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
            item.type === 'Tray' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
              "bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20"
        )}>
          {item.type}
        </span>
      )
    },
    {
      header: "SERIAL / LOT NO.",
      render: (item: InventoryItem) => (
        <span className="font-medium text-gray-300">
          {item.serialNumber || item.lotNumber || '-'}
        </span>
      )
    },
    { header: "VENDOR", accessorKey: "vendor" as const, className: "text-gray-400" },
    // { 
    //   header: "QTY", 
    //   render: (item: InventoryItem) => (
    //     <span className={cn(
    //       "font-bold",
    //       item.type === 'Bio' && (item.quantity ?? 0) < 5 && item.status !== 'Used' ? "text-rose-500" : "text-gray-300"
    //     )}>
    //       {item.type === 'Bio' ? item.quantity : '-'}
    //     </span>
    //   )
    // },
    {
      header: "STATUS",
      render: (item: InventoryItem) => {
        let type: "success" | "warning" | "error" | "default" = "default";
        if (item.status === 'Available') type = 'success';
        if (item.status === 'Assigned') type = 'warning';
        if (item.status === 'Used') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    },
    { header: "LOCATION", accessorKey: "facility" as const, className: "text-gray-400" },
    {
      header: "EXPIRY DATE",
      render: (item: InventoryItem) => {
        if (item.type !== 'Bio' || !item.expiryDate) return <span className="text-gray-600">-</span>;

        const isExpired = new Date(item.expiryDate) < new Date();
        const isExpiringSoon = new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && !isExpired;

        return (
          <span className={cn(
            "font-medium",
            isExpired ? "text-rose-500" :
              isExpiringSoon ? "text-amber-500" : "text-gray-400"
          )}>
            {item.expiryDate}
          </span>
        );
      }
    },
    {
      header: "ACTIONS",
      render: (item: InventoryItem) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}
          className="px-3 py-1.5 text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-md hover:bg-[#00E5FF]/20 transition-colors"
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
        <StatCard title="TOTAL INVENTORY ITEMS" value={totalItems} icon={<Box className="h-5 w-5 text-[#00E5FF]" />} topBorderColor="border-t-[#00E5FF]" />
        <StatCard title="IN STOCK (AVAILABLE)" value={inStock} icon={<Activity className="h-5 w-5 text-emerald-500" />} topBorderColor="border-t-emerald-500" />
        <StatCard title="LOW STOCK ALERT" value={lowStockCount} icon={<AlertTriangle className="h-5 w-5 text-rose-500" />} textColor="text-rose-500" topBorderColor="border-t-rose-500" highlight />
        <StatCard title="CONSIGNED INVENTORY" value={consignedItems} icon={<Warehouse className="h-5 w-5 text-purple-400" />} topBorderColor="border-t-purple-500" />
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
            <div className="flex items-center bg-[#0B101E] p-1 rounded-lg border border-[#1E293B]">
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
            </div>
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
            data={filteredData}
            columns={columns}
            onRowClick={handleRowClick}
            className="rounded-none border-0 bg-transparent"
          />
        </div>
      </div>

      {/* DETAILS DRAWER */}
      <InventoryDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        item={selectedItem}
      />

    </div>
  );
}

function StatCard({ title, value, icon, textColor = "text-white", topBorderColor, highlight = false }: { title: string, value: string | number, icon: React.ReactNode, textColor?: string, topBorderColor: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "relative rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-[#1A2234] overflow-hidden",
      topBorderColor,
      highlight && Number(value) > 0 && "animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.2)] border-rose-500/50"
    )}>
      {highlight && Number(value) > 0 && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />
      )}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{title}</h3>
          <div className={cn("mt-2 text-3xl font-black tracking-tight", textColor)}>{value}</div>
        </div>
        <div className="p-2 bg-[#0B101E] rounded-lg border border-[#1E293B]">
          {icon}
        </div>
      </div>
    </div>
  )
}
