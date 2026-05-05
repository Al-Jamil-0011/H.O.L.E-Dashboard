"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, Filter, Truck, Package, Clock, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { ShipmentDetailsDrawer, ShipmentItem } from './components/ShipmentDetailsDrawer';

// MOCK DATA
const mockShipments: ShipmentItem[] = [
  {
    id: '#INV-99284',
    packageType: 'Spinal Kit',
    companyName: 'Implant',
    priority: 'Urgent',
    createdBy: 'Rep. Sarah Jenkins',
    deliveryMethod: 'Driver',
    status: 'In Transit',
    createdDate: 'Oct 25, 2026',
    pickup: {
      facility: 'Metro Hospital',
      address: '789 Medical Drive, Central District',
      contact: 'Dr. Emily Watson',
      phone: '+1 555-0789',
      date: '12/12/2026',
      instructions: 'Use the loading dock at the rear entrance'
    },
    dropoff: {
      facility: 'Valley Medical Center',
      address: '321 Valley Road, South District',
      contact: 'Pharmacy Manager',
      phone: '+1 555-0321',
      instructions: 'Deliver to Pharmacy Department on 2nd floor'
    },
    packageDetails: {
      weight: '5 kg',
      dimensions: '12*10*6',
      specialInstructions: 'Temperature controlled items - handle with care'
    },
    assignedDriver: 'Marcus Thompson',
    driverPhone: '+1 555-8822',
    files: [
      { name: 'Shipment Manifest.pdf', size: '245 KB', type: 'pdf' },
      { name: 'Delivery Instructions.pdf', size: '180 KB', type: 'pdf' }
    ],
    inventoryItems: [
      { name: 'Tapered Stem - Size 4', sn: 'BB2910-A', status: 'In Stock' },
      { name: 'Acetabular Cup - 52mm', sn: '771922-B', status: 'In Stock' }
    ],
    estimatedCost: 24.50,
    timeline: [
      { id: 't1', status: 'Created', date: 'Oct 25, 2026', time: '07:30 AM', isCompleted: true },
      { id: 't2', status: 'Assigned', date: 'Oct 25, 2026', time: '07:45 AM', isCompleted: true },
      { id: 't3', status: 'Picked Up', date: 'Oct 25, 2026', time: '08:15 AM', location: 'Metro Hospital', isCompleted: true },
      { id: 't4', status: 'In Transit', date: 'Oct 25, 2026', time: '08:30 AM', isCompleted: true },
      { id: 't5', status: 'Delivered', date: '--', time: '--', isCompleted: false },
    ]
  },
  {
    id: '#INV-99285',
    packageType: 'Biological Graft',
    companyName: 'BioHealth',
    priority: 'Standard',
    createdBy: 'Rep. David Lee',
    deliveryMethod: 'FedEx',
    status: 'In Transit',
    createdDate: 'Oct 24, 2026',
    pickup: {
      facility: 'Main Warehouse',
      address: '789 Logistics Blvd',
      contact: 'Warehouse Admin',
      phone: '+1 555-1111',
      date: 'Oct 24, 02:00 PM'
    },
    dropoff: {
      facility: 'City Hospital',
      address: '100 Main St',
      contact: 'Receiving Dept',
      phone: '+1 555-2222'
    },
    packageDetails: {
      weight: '2 kg',
      dimensions: '8" x 8" x 8"',
      specialInstructions: 'Keep refrigerated.'
    },
    trackingNumber: '1CZXCA6AC0A55668685',
    estimatedDelivery: 'Oct 26, 5:00 PM',
    files: [
      { name: 'Shipping Label.pdf', size: '150 KB', type: 'pdf' }
    ],
    inventoryItems: [
      { name: 'Bone Graft Wedge', sn: 'BG-992', status: 'In Stock' }
    ],
    estimatedCost: 35.00,
    timeline: [
      { id: 't1', status: 'Created', date: 'Oct 24, 2026', time: '01:00 PM', isCompleted: true },
      { id: 't2', status: 'Picked Up', date: 'Oct 24, 2026', time: '02:30 PM', location: 'Main Warehouse', isCompleted: true },
      { id: 't3', status: 'Departed FedEx Facility', date: 'Oct 24, 2026', time: '08:00 PM', location: 'Springfield, IL', isCompleted: true },
      { id: 't4', status: 'In Transit', date: 'Oct 25, 2026', time: '06:00 AM', isCompleted: true },
      { id: 't5', status: 'Delivered', date: '--', time: '--', isCompleted: false },
    ]
  },
  {
    id: '#INV-99286',
    packageType: 'Ortho Tray',
    companyName: 'OrthoTech',
    priority: 'Standard',
    createdBy: 'Rep. Amanda Cole',
    deliveryMethod: 'Driver',
    status: 'Pending',
    createdDate: 'Oct 25, 2026',
    pickup: {
      facility: 'City Hospital',
      address: '100 Main St',
      contact: 'OR Staff',
      phone: '+1 555-2222',
      date: 'Pending'
    },
    dropoff: {
      facility: 'North Sterilization Center',
      address: '123 Medical Drive',
      contact: 'Sterilization Admin',
      phone: '+1 555-0192'
    },
    packageDetails: {
      weight: '15 kg',
      dimensions: '24" x 12" x 8"'
    },
    assignedDriver: '',
    files: [],
    inventoryItems: [
      { name: 'Basic Ortho Tray', sn: 'TR-102', status: 'Used' }
    ],
    estimatedCost: 15.00,
    timeline: [
      { id: 't1', status: 'Created', date: 'Oct 25, 2026', time: '09:00 AM', isCompleted: true },
      { id: 't2', status: 'Assigned', date: '--', time: '--', isCompleted: false },
      { id: 't3', status: 'Picked Up', date: '--', time: '--', isCompleted: false },
    ]
  },
  {
    id: '#INV-99287',
    packageType: 'Knee Implant',
    companyName: 'Implant',
    priority: 'Urgent',
    createdBy: 'Rep. John Doe',
    deliveryMethod: 'UPS',
    status: 'Delivered',
    createdDate: 'Oct 20, 2026',
    pickup: {
      facility: 'Supplier Warehouse',
      address: '55 Commerce Way',
      contact: 'Shipping Dept',
      phone: '+1 555-3333',
      date: 'Oct 20, 10:00 AM'
    },
    dropoff: {
      facility: 'Greenwood Clinic',
      address: '77 Forest Ave',
      contact: 'Dr. Evans',
      phone: '+1 555-4444'
    },
    packageDetails: {
      weight: '1 kg',
      dimensions: '6" x 6" x 4"'
    },
    trackingNumber: '1Z9999999999999999',
    estimatedDelivery: 'Oct 22, 12:00 PM',
    files: [
      { name: 'Invoice.pdf', size: '100 KB', type: 'pdf' }
    ],
    inventoryItems: [
      { name: 'Knee Joint Rev 2', sn: 'KJ-2001', status: 'Consigned' }
    ],
    estimatedCost: 42.50,
    timeline: [
      { id: 't1', status: 'Created', date: 'Oct 20, 2026', time: '09:00 AM', isCompleted: true },
      { id: 't2', status: 'Picked Up', date: 'Oct 20, 2026', time: '10:30 AM', isCompleted: true },
      { id: 't3', status: 'Out for Delivery', date: 'Oct 22, 2026', time: '08:00 AM', isCompleted: true },
      { id: 't4', status: 'Delivered', date: 'Oct 22, 2026', time: '11:45 AM', location: 'Greenwood Clinic', isCompleted: true },
    ]
  }
];

export default function ShipmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Drawer State
  const [selectedShipment, setSelectedShipment] = useState<ShipmentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const filteredData = mockShipments.filter((shipment) => {
    const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
    const matchesMethod = methodFilter === 'All' ||
      (methodFilter === 'Courier' ? (shipment.deliveryMethod === 'FedEx' || shipment.deliveryMethod === 'UPS') : shipment.deliveryMethod === methodFilter);
    const matchesSearch =
      shipment.id.toLowerCase().includes(search.toLowerCase()) ||
      shipment.createdBy.toLowerCase().includes(search.toLowerCase()) ||
      shipment.pickup.facility.toLowerCase().includes(search.toLowerCase()) ||
      shipment.dropoff.facility.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesMethod && matchesSearch;
  });

  // Analytics
  const totalShipments = mockShipments.length;
  const pendingShipments = mockShipments.filter(s => s.status === 'Pending').length;
  const inTransit = mockShipments.filter(s => s.status === 'In Transit').length;
  const delivered = mockShipments.filter(s => s.status === 'Delivered').length;
  const courierShipments = mockShipments.filter(s => s.deliveryMethod === 'FedEx' || s.deliveryMethod === 'UPS').length;
  const driverDeliveries = mockShipments.filter(s => s.deliveryMethod === 'Driver').length;

  const handleRowClick = (shipment: ShipmentItem) => {
    setSelectedShipment(shipment);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      header: "SHIPMENT ID",
      accessorKey: "id" as const,
      className: "font-bold text-[#00E5FF] tracking-wider"
    },
    {
      header: "PACKAGE / REP",
      render: (item: ShipmentItem) => (
        <div className="flex flex-col">
          <span className="font-bold text-white">{item.packageType}</span>
          <span className="text-[10px] text-gray-500 font-medium">{item.createdBy}</span>
        </div>
      )
    },
    {
      header: "ROUTE (PICKUP → DROPOFF)",
      render: (item: ShipmentItem) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-gray-300 truncate max-w-[150px]">{item.pickup.facility}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-gray-400 truncate max-w-[150px]">{item.dropoff.facility}</span>
          </div>
        </div>
      )
    },
    {
      header: "DELIVERY METHOD",
      render: (item: ShipmentItem) => (
        <div className="flex items-center gap-2">
          {item.deliveryMethod === 'Driver' ? (
            <Truck className="h-4 w-4 text-blue-400" />
          ) : (
            <Package className="h-4 w-4 text-amber-500" />
          )}
          <span className={cn(
            "text-xs font-bold",
            item.deliveryMethod === 'Driver' ? "text-blue-400" : "text-amber-500"
          )}>
            {item.deliveryMethod}
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
      render: (item: ShipmentItem) => {
        let type: "success" | "warning" | "error" | "default" = "default";
        if (item.status === 'Delivered') type = 'success';
        if (item.status === 'Pending') type = 'error'; // Needs attention
        if (item.status === 'In Transit') type = 'warning';
        return <StatusBadge status={item.status} type={type} />;
      }
    },
    { header: "CREATED DATE", accessorKey: "createdDate" as const, className: "text-gray-400 text-[11px]" },
    {
      header: "ACTIONS",
      render: (item: ShipmentItem) => (
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
            Shipment Management
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Monitor internal driver deliveries and external courier shipments
          </p>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="TOTAL" value={totalShipments} icon={<Package className="h-4 w-4 text-[#00E5FF]" />} />
        <StatCard title="PENDING" value={pendingShipments} icon={<AlertCircle className="h-4 w-4 text-rose-500" />} textColor="text-rose-500" highlight />
        <StatCard title="IN TRANSIT" value={inTransit} icon={<Navigation className="h-4 w-4 text-amber-500" />} textColor="text-amber-500" />
        <StatCard title="DELIVERED" value={delivered} icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} textColor="text-emerald-500" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-lg flex flex-col overflow-hidden min-h-[500px]">

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
              <option value="Driver">Internal Driver</option>
              <option value="Courier">External Courier</option>
            </select>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID, Rep, or Facility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B101E] border border-[#334155] rounded-lg py-2 pl-9 pr-3 text-xs font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
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
      <ShipmentDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        shipment={selectedShipment}
      />

    </div>
  );
}

function StatCard({ title, value, icon, textColor = "text-white", highlight = false }: { title: string, value: string | number, icon: React.ReactNode, textColor?: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "relative rounded-xl border border-[#1E293B] bg-[#151B2B] p-4 shadow-sm transition-all hover:bg-[#1A2234] overflow-hidden",
      highlight && value > 0 && "shadow-[0_0_15px_rgba(244,63,94,0.15)] border-rose-500/30"
    )}>
      {highlight && value > 0 && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl pointer-events-none rounded-full" />
      )}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="p-1.5 bg-[#0B101E] rounded-md border border-[#1E293B]">
            {icon}
          </div>
        </div>
        <div>
          <div className={cn("text-2xl font-black tracking-tight", textColor)}>{value}</div>
          <h3 className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mt-0.5">{title}</h3>
        </div>
      </div>
    </div>
  )
}
