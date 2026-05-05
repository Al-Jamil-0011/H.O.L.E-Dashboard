"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import {
  Search,
  MapPin,
  DollarSign,
  Zap,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  CreditCard,
  History,
  TrendingUp
} from 'lucide-react';

// MOCK DATA

// Pricing Model (Based on backend Schema)
const mockPricing = {
  name: "Standard Logistics Pricing",
  amountPerKm: 1.5,
  currency: "USD",
  priorityCharges: [
    { priority: "standard", extraCharge: 0, estimatedTime: "2-4 hours" },
    { priority: "urgent", extraCharge: 5, estimatedTime: "1-2 hours" },
    { priority: "express", extraCharge: 10, estimatedTime: "30-60 mins" },
  ]
};

const mockWithdrawalRequests = [
  { id: 'WR-001', userId: 'DRV-1029', name: 'Daniel Carter', email: 'daniel.c@invictus.com', requestDate: '2026-04-20', amount: 350.00, status: 'Pending' },
  { id: 'WR-002', userId: 'DRV-1030', name: 'Sarah Jenkins', email: 'sarah.j@invictus.com', requestDate: '2026-04-21', amount: 120.00, status: 'Pending' },
  { id: 'WR-003', userId: 'DRV-1031', name: 'Mike Ross', email: 'mike.r@invictus.com', requestDate: '2026-04-21', amount: 450.00, status: 'Pending' },
];

const mockHistory = [
  { id: 'WR-000', userId: 'DRV-1025', name: 'John Doe', email: 'john.d@invictus.com', requestDate: '2026-04-18', amount: 200.00, status: 'Paid' },
  { id: 'WR-00-1', userId: 'DRV-1026', name: 'Alice Smith', email: 'alice.s@invictus.com', requestDate: '2026-04-17', amount: 550.00, status: 'Paid' },
];

export default function DriverEarningsControlPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
  const [search, setSearch] = useState('');
  const [pricing, setPricing] = useState(mockPricing);

  // Modals state
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isConfirmPayModalOpen, setIsConfirmPayModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Data State
  const [requests, setRequests] = useState(mockWithdrawalRequests);
  const [history, setHistory] = useState(mockHistory);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockWithdrawalRequests[0] | null>(null);

  // Pricing Form State
  const [newPricing, setNewPricing] = useState({
    amountPerKm: pricing.amountPerKm,
    urgentExtra: pricing.priorityCharges.find(p => p.priority === 'urgent')?.extraCharge || 0,
    expressExtra: pricing.priorityCharges.find(p => p.priority === 'express')?.extraCharge || 0
  });

  const handleSavePricing = () => {
    setPricing({
      ...pricing,
      amountPerKm: newPricing.amountPerKm,
      priorityCharges: [
        { priority: "standard", extraCharge: 0, estimatedTime: "2-4 hours" },
        { priority: "urgent", extraCharge: newPricing.urgentExtra, estimatedTime: "1-2 hours" },
        { priority: "express", extraCharge: newPricing.expressExtra, estimatedTime: "30-60 mins" }
      ]
    });
    setIsPricingModalOpen(false);
  };

  const handlePayConfirm = () => {
    if (selectedRequest) {
      // Move from requests to history
      const paidRequest = { ...selectedRequest, status: 'Paid' };
      setRequests(reqs => reqs.filter(r => r.id !== selectedRequest.id));
      setHistory(h => [paidRequest, ...h]);
    }
    setIsConfirmPayModalOpen(false);
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  // Table Columns
  const requestColumns = [
    { header: "USER ID", accessorKey: "userId" as const },
    {
      header: "DRIVER NAME",
      render: (item: any) => <span className="font-semibold text-white">{item.name}</span>
    },
    { header: "EMAIL", accessorKey: "email" as const },
    { header: "REQUEST DATE", accessorKey: "requestDate" as const, className: "text-gray-400" },
    {
      header: "AMOUNT",
      render: (item: any) => <span className="text-[#00E5FF] font-bold">${item.amount.toFixed(2)}</span>
    },
    {
      header: "ACTION",
      render: (item: any) => (
        <button
          onClick={() => { setSelectedRequest(item); setIsConfirmPayModalOpen(true); }}
          className="px-4 py-1.5 text-xs font-bold text-[#0B101E] bg-[#00E5FF] hover:bg-cyan-400 rounded-md shadow-sm transition-all"
        >
          Pay Now
        </button>
      )
    }
  ];

  const historyColumns = [
    { header: "USER ID", accessorKey: "userId" as const },
    {
      header: "DRIVER NAME",
      render: (item: any) => <span className="font-semibold text-white">{item.name}</span>
    },
    { header: "EMAIL", accessorKey: "email" as const },
    { header: "PAYMENT DATE", accessorKey: "requestDate" as const, className: "text-gray-400" },
    {
      header: "AMOUNT",
      render: (item: any) => <span className="text-emerald-400 font-bold">${item.amount.toFixed(2)}</span>
    },
    {
      header: "STATUS",
      render: (item: any) => (
        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
          Paid
        </span>
      )
    }
  ];

  // Filtering
  const filteredData = (activeTab === 'requests' ? requests : history).filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-12">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
          Driver Earnings Control
        </h1>
        <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wider">
          Manage global logistic pricing and driver withdrawal payouts
        </p>
      </div>

      {/* TOP SECTION - GLOBAL PRICING SUMMARY */}
      <div className="relative rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-br from-[#0B101E] to-[#151B2B] p-6 shadow-[0_0_20px_rgba(0,229,255,0.05)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00E5FF]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[#00E5FF]" />
              Global Pricing Summary
            </h2>
            <div className="flex flex-wrap items-center gap-3">

              {/* Data Blocks */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-sm">
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Base Rate (Per KM)</p>
                  <p className="text-lg font-black text-white">${pricing.amountPerKm.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-sm">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Urgency Fee</p>
                  <p className="text-lg font-black text-white">
                    +${pricing.priorityCharges.find(p => p.priority === 'urgent')?.extraCharge.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-sm">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Express / Rush Fee</p>
                  <p className="text-lg font-black text-white">
                    +${pricing.priorityCharges.find(p => p.priority === 'express')?.extraCharge.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <button
            onClick={() => {
              setNewPricing({
                amountPerKm: pricing.amountPerKm,
                urgentExtra: pricing.priorityCharges.find(p => p.priority === 'urgent')?.extraCharge || 0,
                expressExtra: pricing.priorityCharges.find(p => p.priority === 'express')?.extraCharge || 0
              });
              setIsPricingModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add Pricing
          </button>
        </div>
      </div>

      {/* MAIN SECTION - TABS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Tab Switcher */}
          <div className="inline-flex items-center bg-[#151B2B] p-1 rounded-xl border border-[#1E293B]">
            <button
              onClick={() => setActiveTab('requests')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all",
                activeTab === 'requests'
                  ? "bg-[#1E293B] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <CreditCard className="h-4 w-4" />
              Total Requests
              <span className={cn(
                "ml-1.5 px-2 py-0.5 text-[10px] rounded-full",
                activeTab === 'requests' ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "bg-[#1E293B] text-gray-400"
              )}>
                {requests.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all",
                activeTab === 'history'
                  ? "bg-[#1E293B] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <History className="h-4 w-4" />
              History
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 flex items-center group">
            <Search className="absolute left-3 h-4 w-4 text-gray-500 group-focus-within:text-[#00E5FF] transition-colors" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#151B2B] border border-[#1E293B] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all shadow-sm"
            />
          </div>

        </div>

        {/* TABLE WRAPPER */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#151B2B] shadow-xl overflow-hidden flex flex-col">
          <DataTable
            data={filteredData}
            columns={activeTab === 'requests' ? requestColumns : historyColumns}
            className="border-0 rounded-none bg-transparent"
          />

          {/* PAGINATION */}
          <div className="px-6 py-4 border-t border-[#1E293B] flex items-center justify-between bg-[#1A2234]">
            <p className="text-xs font-medium text-gray-500">
              Showing <span className="text-white font-bold">{filteredData.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-md border border-[#334155] text-gray-400 hover:text-white hover:bg-[#334155] transition-colors disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-white px-2">1</span>
              <button className="p-1.5 rounded-md border border-[#334155] text-gray-400 hover:text-white hover:bg-[#334155] transition-colors disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* --- ADD PRICING MODAL --- */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPricingModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0B101E] border border-[#1E293B] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Pricing</h3>
              <button onClick={() => setIsPricingModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest">Base Rate configuration</h4>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Amount Per KM ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={newPricing.amountPerKm}
                        onChange={(e) => setNewPricing({ ...newPricing, amountPerKm: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-3 pl-10 pr-4 text-sm text-white font-bold focus:outline-none focus:border-[#00E5FF] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#1E293B]" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Priority Settings (Extra Fee)</h4>

                <div className="space-y-3">

                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B] bg-[#151B2B]">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-bold">Standard</p>
                        <p className="text-[10px] text-gray-500">Default Priority</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-[#1E293B] px-3 py-1.5 rounded-lg">No Extra Fee</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B] bg-[#151B2B] focus-within:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-300">
                      <AlertCircle className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-sm font-bold text-purple-400">Urgency</p>
                        <p className="text-[10px] text-gray-500">1-2 hours delivery</p>
                      </div>
                    </div>
                    <div className="relative w-28">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="number"
                        min="0"
                        value={newPricing.urgentExtra}
                        onChange={(e) => setNewPricing({ ...newPricing, urgentExtra: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0B101E] border border-[#334155] rounded-lg py-1.5 pl-8 pr-3 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B] bg-[#151B2B] focus-within:border-amber-500/50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-sm font-bold text-amber-500">Express / Rush</p>
                        <p className="text-[10px] text-gray-500">30-60 mins delivery</p>
                      </div>
                    </div>
                    <div className="relative w-28">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="number"
                        min="0"
                        value={newPricing.expressExtra}
                        onChange={(e) => setNewPricing({ ...newPricing, expressExtra: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0B101E] border border-[#334155] rounded-lg py-1.5 pl-8 pr-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            <div className="p-5 bg-[#151B2B] border-t border-[#1E293B] flex justify-end gap-3">
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePricing}
                className="px-6 py-2.5 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              >
                Save Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM PAY MODAL --- */}
      {isConfirmPayModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsConfirmPayModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#0B101E] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-[#00E5FF]/10 text-[#00E5FF] rounded-full flex items-center justify-center mx-auto">
                <CreditCard size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Process Payment?</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Are you sure you want to complete this payment of <b className="text-white">${selectedRequest.amount.toFixed(2)}</b> to <b className="text-[#00E5FF]">{selectedRequest.name}</b>?
                </p>
              </div>
            </div>
            <div className="p-5 bg-[#151B2B] border-t border-[#1E293B] flex gap-3">
              <button
                onClick={() => setIsConfirmPayModalOpen(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-300 bg-[#1E293B] rounded-xl hover:bg-[#334155] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayConfirm}
                className="flex-1 py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl shadow-sm transition-all hover:bg-cyan-400"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS TOAST / MODAL --- */}
      {isSuccessModalOpen && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-2xl shadow-2xl">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400 tracking-wide">
              Payment Successful!
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
