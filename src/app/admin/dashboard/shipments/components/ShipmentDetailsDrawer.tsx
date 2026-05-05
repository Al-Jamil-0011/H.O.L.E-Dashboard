"use client";

import { useState } from "react";
import { X, MapPin, Truck, CheckCircle2, FileText, Download, UserCircle2, ArrowRight, Expand, Info, Phone, Copy, ChevronLeft, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackingEvent {
  id: string;
  status: string;
  date: string;
  time: string;
  location?: string;
  isCompleted: boolean;
}

export interface ShipmentItem {
  id: string;
  packageType: string;
  companyName?: string;
  priority?: 'Urgent' | 'Standard';
  createdBy: string;
  deliveryMethod: 'Driver' | 'FedEx' | 'UPS';
  status: 'Pending' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  createdDate: string;

  pickup: {
    facility: string;
    address: string;
    contact: string;
    phone: string;
    date: string;
    instructions?: string;
  };

  dropoff: {
    facility: string;
    address: string;
    contact: string;
    phone: string;
    instructions?: string;
  };

  packageDetails: {
    weight: string;
    dimensions: string;
    specialInstructions?: string;
  };

  // Courier specific
  trackingNumber?: string;
  estimatedDelivery?: string;

  // Driver specific
  assignedDriver?: string;
  driverPhone?: string;

  files: { name: string; size: string; type: 'pdf' | 'doc' }[];
  inventoryItems?: { name: string; sn: string; status: string }[];
  estimatedCost?: number;
  timeline: TrackingEvent[];
}

interface ShipmentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: ShipmentItem | null;
}

export function ShipmentDetailsDrawer({ isOpen, onClose, shipment }: ShipmentDetailsDrawerProps) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  if (!isOpen || !shipment) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#18181B] border-l border-[#27272A] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[#27272A] bg-[#18181B] shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-bold text-white tracking-tight">Job Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#27272A] p-5 space-y-6 bg-[#18181B]">

          {/* STATUS & ID */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">STATUS</p>
              <span className={cn(
                "px-2.5 py-1 text-[10px] font-bold rounded-full",
                shipment.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-400" :
                  shipment.status === 'Pending' ? "bg-amber-500/10 text-amber-500" :
                    "bg-[#00E5FF]/10 text-[#00E5FF]"
              )}>
                {shipment.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">JOB ID</p>
              <p className="text-sm font-bold text-gray-300">{shipment.id}</p>
            </div>
          </div>

          {/* JOB INFO */}
          <div className="bg-[#202024] border border-[#27272A] rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Job Info</h3>
              {shipment.priority === 'Urgent' && (
                <span className="px-2 py-0.5 text-[10px] font-bold text-rose-400 bg-rose-500/10 rounded-full border border-rose-500/20">
                  urgent
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#27272A] border border-[#3F3F46] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#00E5FF]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{shipment.companyName || shipment.packageType}</p>
                  <p className="text-xs text-gray-500">{shipment.packageType}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar mock */}
                  <div className="h-10 w-10 rounded-full bg-[#27272A] overflow-hidden flex items-center justify-center border border-[#3F3F46]">
                    <UserCircle2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{shipment.assignedDriver || shipment.createdBy}</p>
                    <p className="text-xs text-gray-500">{shipment.assignedDriver ? 'Assigned Driver' : 'Rep'}</p>
                  </div>
                </div>
                {(shipment.assignedDriver || shipment.driverPhone) && (
                  <button className="h-8 w-8 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#00E5FF] flex items-center justify-center hover:bg-[#3F3F46] transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* MAP PREVIEW */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Active Shipments</h3>
            <div className={cn(
              "relative bg-[#202024] border border-[#27272A] rounded-xl overflow-hidden transition-all duration-500",
              isMapExpanded ? "h-64" : "h-32"
            )}>
              {/* Fake Map Image - using a placeholder map style */}
              <div className="absolute inset-0 bg-[#0B101E]/80" style={{ backgroundImage: 'radial-gradient(#27272A 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#202024] to-transparent opacity-50" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#18181B] border border-[#27272A] px-3 py-1 rounded-md text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
                    In Transit
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#18181B] border-r border-b border-[#27272A] rotate-45" />
                  </div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROUTE INFORMATION */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Route Information</h3>
            <div className="bg-[#202024] border border-[#27272A] rounded-xl p-5 relative">
              <div className="absolute left-[27px] top-10 bottom-10 w-px bg-[#3F3F46]" />

              <div className="space-y-6">
                {/* Pickup */}
                <div className="flex gap-4">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#202024] shrink-0 mt-1 relative z-10" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Pickup Location</p>
                      <p className="text-sm font-bold text-white">{shipment.pickup.facility}</p>
                      <p className="text-xs text-gray-400">{shipment.pickup.address}</p>
                    </div>

                    <div className="bg-[#18181B] rounded-lg p-3 space-y-2 border border-[#27272A]">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 block mb-0.5">Contact</span>
                          <span className="text-gray-300 font-medium">{shipment.pickup.contact}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-0.5">Phone</span>
                          <span className="text-[#00E5FF] font-medium flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {shipment.pickup.phone}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500 block mb-0.5">Pickup Date</span>
                          <span className="text-gray-300 font-medium">{shipment.pickup.date}</span>
                        </div>
                      </div>
                      {shipment.pickup.instructions && (
                        <div className="pt-2 border-t border-[#27272A]">
                          <span className="text-gray-500 block mb-0.5 text-xs">Instructions</span>
                          <span className="text-gray-300 text-xs">{shipment.pickup.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Drop-off */}
                <div className="flex gap-4">
                  <div className="w-4 h-4 rounded-full bg-rose-500 border-4 border-[#202024] shrink-0 mt-1 relative z-10" />
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Drop-off Location</p>
                      <p className="text-sm font-bold text-white">{shipment.dropoff.facility}</p>
                      <p className="text-xs text-gray-400">{shipment.dropoff.address}</p>
                    </div>

                    <div className="bg-[#18181B] rounded-lg p-3 space-y-2 border border-[#27272A]">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 block mb-0.5">Contact</span>
                          <span className="text-gray-300 font-medium">{shipment.dropoff.contact}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-0.5">Phone</span>
                          <span className="text-[#00E5FF] font-medium flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {shipment.dropoff.phone}
                          </span>
                        </div>
                      </div>
                      {shipment.dropoff.instructions && (
                        <div className="pt-2 border-t border-[#27272A]">
                          <span className="text-gray-500 block mb-0.5 text-xs">Instructions</span>
                          <span className="text-gray-300 text-xs">{shipment.dropoff.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PACKAGE DETAILS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Package Details</h3>
            <div className="bg-[#202024] border border-[#27272A] rounded-xl p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-1"><Package className="h-3 w-3" /> Services Type</p>
                <p className="text-sm font-bold text-white">{shipment.deliveryMethod}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Weight</p>
                  <p className="text-sm text-gray-300">{shipment.packageDetails.weight}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Dimensions (L*W*H)</p>
                  <p className="text-sm text-gray-300">{shipment.packageDetails.dimensions}</p>
                </div>
              </div>
            </div>

            {shipment.packageDetails.specialInstructions && (
              <div className="bg-[#332014] border border-[#5c3716] rounded-xl p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-500 mb-1">Special Instructions</p>
                  <p className="text-xs text-amber-500/80 leading-relaxed">{shipment.packageDetails.specialInstructions}</p>
                </div>
              </div>
            )}
          </div>

          {/* INVENTORY ITEMS */}
          {shipment.inventoryItems && shipment.inventoryItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Inventory Item List</h3>
              <div className="space-y-2">
                {shipment.inventoryItems.map((item, idx) => (
                  <div key={idx} className="bg-[#202024] border border-[#27272A] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">SN: {item.sn}</p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-full",
                      item.status === 'In Stock' ? "bg-emerald-500/10 text-emerald-400" :
                        item.status === 'Used' ? "bg-rose-500/10 text-rose-400" :
                          "bg-[#00E5FF]/10 text-[#00E5FF]"
                    )}>
                      {item.status}
                    </span>
                  </div>
                ))}
                <button className="w-full py-3 bg-[#18181B] border border-[#27272A] rounded-xl text-xs font-bold text-[#00E5FF] hover:bg-[#27272A] transition-colors mt-2">
                  View All {shipment.inventoryItems.length > 2 ? shipment.inventoryItems.length : 12} items
                </button>
              </div>
            </div>
          )}

          {/* TRACKING HISTORY TIMELINE */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Tracking History</h3>
            <div className="bg-[#202024] border border-[#27272A] rounded-xl p-6 relative">
              <div className="absolute left-[35px] top-8 bottom-8 w-px bg-[#3F3F46]" />
              <div className="space-y-6 relative">
                {shipment.timeline.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    <div className={cn(
                      "relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-4",
                      event.isCompleted
                        ? "bg-[#00E5FF] border-[#202024] shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                        : "bg-[#27272A] border-[#202024]"
                    )} />
                    <div className="space-y-1 flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-bold", event.isCompleted ? "text-white" : "text-gray-500")}>
                          {event.status}
                        </span>
                        <span className="text-[10px] font-medium text-gray-500 text-right">
                          {event.date}<br />{event.time}
                        </span>
                      </div>
                      {event.location && <p className="text-xs text-gray-400 font-medium">{event.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ATTACHED FILES */}
          {shipment.files && shipment.files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><FileText className="h-4 w-4 text-[#00E5FF]" /> Attached Files</h3>
              <div className="space-y-2">
                {shipment.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-[#202024] border border-[#27272A] rounded-xl group hover:border-[#3F3F46] transition-colors cursor-pointer">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* STICKY FOOTER */}
        <div className="p-5 border-t border-[#27272A] bg-[#18181B] shrink-0 space-y-3">
          <div className="bg-[#0D2B68] rounded-xl p-4 flex flex-col justify-center border border-[#1E3A8A]">
            <p className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest mb-1">ESTIMATED SERVICE FEE</p>
            <div className="flex items-baseline text-white">
              <span className="text-lg font-bold mr-1">$</span>
              <span className="text-3xl font-black tracking-tight">{shipment.estimatedCost ? shipment.estimatedCost.toFixed(2) : "0.00"}</span>
            </div>
          </div>

          {/* <button className="w-full py-3.5 bg-[#00E5FF] hover:bg-cyan-400 text-[#0B101E] rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <Truck className="h-4 w-4" /> Track Shipment
          </button> */}
        </div>

      </div>
    </>
  );
}

// Temporary icon to avoid import issues if not in lucide
function Package(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
