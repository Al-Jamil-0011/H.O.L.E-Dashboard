"use client";

import { X, ArrowRightLeft, AlertTriangle, Box, Truck, CheckCircle2, FileText, Download, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InventoryEvent {
  id: string;
  type: 'added' | 'shipped' | 'assigned' | 'used' | 'returned';
  date: string;
  location: string;
  user?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'Implant' | 'Tray' | 'Bio';
  serialNumber?: string;
  lotNumber?: string;
  systemType?: string;
  vendor: string;
  status: 'Available' | 'Assigned' | 'Used';
  ownership: 'Owned' | 'Consigned';
  facility?: string;
  quantity?: number; // Bio only
  expiryDate?: string; // Bio only
  notes?: string;
  files?: { name: string; url: string; size: string }[];
  history: InventoryEvent[];
}

interface InventoryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export function InventoryDetailsDrawer({ isOpen, onClose, item }: InventoryDetailsDrawerProps) {
  if (!isOpen || !item) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0B101E] border-l border-[#1E293B] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B] bg-[#151B2B]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#1E293B] transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{item.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#00E5FF]/10 text-[#00E5FF] rounded border border-[#00E5FF]/20">
                  {item.type}
                </span>
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border",
                  item.status === 'Available' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  item.status === 'Assigned' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  "bg-gray-500/10 text-gray-400 border-gray-500/20"
                )}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1E293B] p-6 space-y-8">
          
          {/* GENERAL INFO */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Box className="h-4 w-4" /> General Information
            </h3>
            
            <div className="bg-[#151B2B] border border-[#1E293B] rounded-xl p-5 grid grid-cols-2 gap-4">
              {item.type !== 'Bio' && (
                <>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Serial Number</p>
                    <p className="text-sm font-bold text-white">{item.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">System Type</p>
                    <p className="text-sm font-medium text-gray-300">{item.systemType || 'N/A'}</p>
                  </div>
                </>
              )}

              {item.type === 'Bio' && (
                <>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Lot Number</p>
                    <p className="text-sm font-bold text-white">{item.lotNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Quantity</p>
                    <p className="text-sm font-medium text-gray-300">{item.quantity} Units</p>
                  </div>
                </>
              )}

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Vendor</p>
                <p className="text-sm font-medium text-gray-300">{item.vendor}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Ownership</p>
                <p className="text-sm font-bold text-[#00E5FF]">{item.ownership}</p>
              </div>
            </div>
          </section>

          {/* LOCATION & LOGISTICS */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Truck className="h-4 w-4" /> Location & Logistics
            </h3>
            <div className="bg-[#151B2B] border border-[#1E293B] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Current Location</span>
                <span className="text-sm font-bold text-white">{item.facility || 'Warehouse'}</span>
              </div>
              
              {item.type === 'Bio' && item.expiryDate && (
                <div className="flex items-center justify-between border-t border-[#1E293B] pt-4 mt-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Expiry Date</span>
                  <span className={cn(
                    "text-sm font-bold", 
                    new Date(item.expiryDate) < new Date() ? "text-rose-500" : "text-amber-500"
                  )}>
                    {item.expiryDate}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* FILES */}
          {item.files && item.files.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4" /> Attached Files
              </h3>
              <div className="space-y-2">
                {item.files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#151B2B] border border-[#1E293B] rounded-lg group hover:border-[#334155] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#00E5FF]" />
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">{file.name}</p>
                        <p className="text-[10px] text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-gray-500 group-hover:text-white" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MOVEMENT HISTORY TIMELINE */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" /> Movement History
            </h3>
            <div className="bg-[#151B2B] border border-[#1E293B] rounded-xl p-5 pl-6 relative">
              
              {/* Timeline Line */}
              <div className="absolute left-[31px] top-8 bottom-8 w-px bg-[#1E293B]" />

              <div className="space-y-6 relative">
                {item.history.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    
                    {/* Icon / Node */}
                    <div className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#0B101E] border border-[#334155]">
                      {event.type === 'added' ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> :
                       event.type === 'shipped' ? <Truck className="h-3 w-3 text-blue-500" /> :
                       event.type === 'assigned' ? <UserCircle2 className="h-3 w-3 text-purple-500" /> :
                       event.type === 'used' ? <Box className="h-3 w-3 text-amber-500" /> :
                       <ArrowRightLeft className="h-3 w-3 text-gray-400" />}
                    </div>

                    <div className="space-y-1 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white capitalize">{event.type}</span>
                        <span className="text-[10px] font-medium text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium">Location: <span className="text-gray-300">{event.location}</span></p>
                      {event.user && <p className="text-xs text-gray-400 font-medium">By: <span className="text-[#00E5FF]">{event.user}</span></p>}
                      {event.notes && <p className="text-xs text-gray-500 italic mt-1 bg-[#0B101E] p-2 rounded-md border border-[#1E293B]">{event.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* NOTES */}
          {item.notes && (
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4" /> Internal Notes
              </h3>
              <div className="bg-[#151B2B] border border-[#1E293B] rounded-xl p-5 text-sm text-gray-300 leading-relaxed">
                {item.notes}
              </div>
            </section>
          )}

        </div>

        {/* ADMIN ACTIONS FOOTER */}
        <div className="p-6 border-t border-[#1E293B] bg-[#0B101E] grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded-lg hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <ArrowRightLeft className="h-4 w-4" /> Transfer
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors">
            <AlertTriangle className="h-4 w-4" /> Mark Damaged
          </button>
          <button className="col-span-1 flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-gray-300 bg-[#151B2B] border border-[#334155] rounded-lg hover:text-white hover:bg-[#1E293B] transition-colors">
            <Truck className="h-4 w-4" /> View Shipment
          </button>
          <button className="col-span-1 flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-gray-300 bg-[#151B2B] border border-[#334155] rounded-lg hover:text-white hover:bg-[#1E293B] transition-colors">
            <FileText className="h-4 w-4" /> View Sale
          </button>
        </div>

      </div>
    </>
  );
}
