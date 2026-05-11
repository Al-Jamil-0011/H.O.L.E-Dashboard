"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, Eye, FileText, Calendar, MapPin,
  ArrowRightLeft, CheckCircle2, Box, Truck, UserCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// MOCK DATA based on exact screenshot requirements
const mockInventoryData = {
  'INV-1001': {
    id: 'INV-1001',
    type: 'Implant',
    title: 'Implant Details',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2873&auto=format&fit=crop', // generic medical metallic part placeholder
    status: 'In Stock',
    general: {
      serialNumber: 'SN-9823471',
      systemType: 'Orthopedic System X',
      vendor: 'MedTech Corp',
      status: 'Available',
    },
    location: {
      facility: 'Warehouse A - Shelf 4',
      recipientEmail: 'Adr.smith@cityhosp.org',
    },
    note: 'Lunch meeting with Dr. Smith to discuss the new pharmaceutical lineup and distribution schedule for the downtown clinic.',
    files: [
      { group: 'Inbound Image', name: 'PO_889_Final.pdf', size: '1.2 MB • FEB 15' },
      { group: 'Broken Instruments', name: 'PO_889_Final.pdf', size: '1.2 MB • FEB 15' },
    ]
  },
  'INV-1003': {
    id: 'INV-1003',
    type: 'Tray',
    title: 'Tray Details',
    image: 'https://images.unsplash.com/photo-1579565028127-6b3ce7839d37?q=80&w=2938&auto=format&fit=crop', // generic medical trays placeholder
    status: 'In Stock',
    tags: ['Loaner', 'Down Rack'],
    general: {
      serialNumber: 'SN-9823471',
      systemType: 'Orthopedic System X',
      vendor: 'MedTech Corp',
      status: 'Available',
    },
    location: {
      facility: 'City Hospital',
    },
    note: 'Lunch meeting with Dr. Smith to discuss the new pharmaceutical lineup and distribution schedule for the downtown clinic.',
    history: [
      { status: 'Arrived at Sterilization', time: 'Today, 10:24 AM', operator: 'J. Doe' },
      { status: 'Decontamination Complete', time: 'Today, 09:15 AM', station: 'Station 04' },
      { status: 'Received from OR Room 12', time: 'Today, 08:30 AM', case: 'Case #8821' },
    ]
  },
  'INV-1004': {
    id: 'INV-1004',
    type: 'Biological',
    title: 'Biological Details',
    image: 'https://images.unsplash.com/photo-1582719478250-c8940cebc8e5?q=80&w=2940&auto=format&fit=crop', // generic bio placeholder
    status: 'In Stock',
    general: {
      itemName: 'Reahent Alpha-7',
      vendor: 'MedTech Corp',
      lotNumber: '12345',
      quantity: '500ml',
    },
    location: {
      location: 'Warehouse A - Shelf 4',
      expiryDate: 'mm/dd/yyyy',
    },
    note: 'Lunch meeting with Dr. Smith to discuss the new pharmaceutical lineup and distribution schedule for the downtown clinic.',
  }
};

export default function InventoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Default to Implant if ID not found for demo purposes
  const item = mockInventoryData[id as keyof typeof mockInventoryData] || mockInventoryData['INV-1001'];

  return (
    <div className="flex justify-center w-full pb-24 animate-in fade-in duration-500">
      {/* Centered container (max-width: 1200px-1400px) */}
      <div className="w-full space-y-8">

        {/* HEADER SECTION */}
        <div className="flex items-center gap-4 border-b border-[#1E293B] pb-6">
          <button
            onClick={() => router.push('/admin/dashboard/inventory')}
            className="p-2.5 bg-[#1E293B] hover:bg-[#334155] rounded-xl transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">{item.title}</h1>
          {item.type === 'Tray' && (
            <button className="ml-auto px-4 py-2 bg-[#1E293B] text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-[#334155]">
              Edit
            </button>
          )}
        </div>

        {/* 1. IMAGE PREVIEW (TOP SECTION) */}
        <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] overflow-hidden shadow-sm relative">
          <div className="h-[300px] md:h-[400px] w-full bg-[#0B101E] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#151B2B] to-transparent opacity-60 z-10" />
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover opacity-80"
            />

            {/* Overlay Elements */}
            <div className="absolute top-6 right-6 z-20">
              <span className="px-4 py-1.5 text-xs font-bold bg-[#00E5FF]/20 text-[#00E5FF] rounded-full border border-[#00E5FF]/30 shadow-lg backdrop-blur-md">
                {item.status}
              </span>
            </div>

            {item.type === 'Tray' && item.tags && (
              <div className="absolute bottom-6 left-6 z-20 flex gap-3">
                <span className="px-4 py-2 text-sm font-bold bg-[#1E293B]/80 text-amber-500 rounded-lg backdrop-blur-md flex items-center gap-2 border border-[#334155]/50">
                  <Box className="h-4 w-4" /> Loaner
                </span>
                <span className="px-4 py-2 text-sm font-bold bg-[#1E293B]/80 text-[#00E5FF] rounded-lg backdrop-blur-md flex items-center gap-2 border border-[#334155]/50">
                  <ArrowRightLeft className="h-4 w-4" /> Down Rack
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. GENERAL INFORMATION */}
        <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">General Information</h2>
            <span className="px-3 py-1 text-xs font-bold bg-[#00E5FF]/10 text-[#00E5FF] rounded-full">
              {item.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {item.type !== 'Biological' ? (
              // Implant / Tray General Info
              <>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <Box className="h-5 w-5 text-[#00E5FF]" /> Serial Number
                  </span>
                  <span className="text-lg font-bold text-white">{item.general.serialNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <ArrowRightLeft className="h-5 w-5 text-[#00E5FF]" /> System Type
                  </span>
                  <span className="text-lg font-bold text-white">{item.general.systemType}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#00E5FF]" /> Vendor
                  </span>
                  <span className="text-lg font-bold text-white">{item.general.vendor}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#00E5FF]" /> Status
                  </span>
                  <span className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    {item.general.status}
                  </span>
                </div>
              </>
            ) : (
              // Biological General Info
              <>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <Box className="h-5 w-5 text-[#00E5FF]" /> Item Name
                  </span>
                  <span className="text-lg font-bold text-white">{item.general.itemName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#00E5FF]" /> Vendor
                  </span>
                  <span className="text-lg font-bold text-white">{item.general.vendor}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <ArrowRightLeft className="h-5 w-5 text-[#00E5FF]" /> Lot Number
                  </span>
                  <span className="text-lg font-bold text-white">{item.general.lotNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                    <Box className="h-5 w-5 text-[#00E5FF]" /> Quantity
                  </span>
                  <span className="text-lg font-bold text-white">{item.general.quantity}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. LOCATION & LOGISTICS */}
        <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-8 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-8">Location & Logistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#00E5FF]" />
                {item.type === 'Biological' ? 'Location' : 'Facility / Location'}
              </span>
              <span className="text-lg font-bold text-white">{item.location.facility || item.location.location}</span>
            </div>

            {item.type !== 'Biological' && item.location.recipientEmail && (
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                  <UserCircle2 className="h-5 w-5 text-[#00E5FF]" /> Recipient Email
                </span>
                <span className="text-lg font-bold text-gray-300">{item.location.recipientEmail}</span>
              </div>
            )}

            {item.type === 'Biological' && item.location.expiryDate && (
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <span className="text-sm font-bold text-gray-500 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#00E5FF]" /> Expiry Date
                </span>
                <span className="text-lg font-bold text-gray-300">{item.location.expiryDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. ADDITIONAL NOTE */}
        {item.note && (
          <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6">Additional Note</h2>
            <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00E5FF]/50" />
              <p className="text-base text-gray-300 leading-relaxed font-medium pl-2">
                {item.note}
              </p>
            </div>
          </div>
        )}

        {/* 5. UPLOADED FILES */}
        {item.files && item.files.length > 0 && (
          <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6">Uploaded Files</h2>
            <div className="space-y-6">
              {/* Grouping by type based on mock structure */}
              {item.files.map((file, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-500">{file.group}</h3>
                  <div className="flex items-center justify-between p-4 bg-[#0B101E] border border-[#1E293B] rounded-xl hover:border-[#334155] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-500/10 text-rose-500 rounded-lg">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white mb-1">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-[#00E5FF] transition-colors rounded-lg hover:bg-[#1E293B]">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. MOVEMENT HISTORY (ONLY FOR TRAY) */}
        {item.type === 'Tray' && item.history && (
          <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-8">Movement History</h2>
            <div className="relative pl-6 space-y-10">
              <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-[#1E293B]" />

              {item.history.map((event, idx) => (
                <div key={idx} className="relative flex gap-8">
                  <div className={cn(
                    "relative z-10 w-4 h-4 rounded-full mt-1.5 shrink-0 shadow-[0_0_0_6px_#151B2B]",
                    idx === 0 ? "bg-amber-500" :
                      idx === 1 ? "bg-gray-600" : "bg-gray-400"
                  )} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-lg font-bold text-white">{event.status}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-500">{event.time} • {event.operator || event.station || event.case}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BOTTOM ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-6 pt-4">
          <button className="w-full py-4 text-sm font-bold text-gray-300 bg-[#151B2B] border border-[#334155] rounded-xl hover:text-white hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-3 shadow-sm">
            <Truck className="h-5 w-5" /> View Shipment
          </button>
          <button className="w-full py-4 text-sm font-bold text-gray-300 bg-[#151B2B] border border-[#334155] rounded-xl hover:text-white hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-3 shadow-sm">
            <FileText className="h-5 w-5" /> View Sale
          </button>
        </div>

      </div>
    </div>
  );
}
