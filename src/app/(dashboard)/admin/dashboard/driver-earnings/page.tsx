"use client";

import { useState, ReactNode } from 'react';
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
import { useChangeWithdrawalStatus, useCreateOrUpdateShipmentRate, useDriverWithdrawals, useShipmentRate } from '@/hooks/admin/driver-payment';
import toast from 'react-hot-toast';
import { useEffect, useMemo } from 'react';




export default function DriverEarningsControlPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'history'>('requests');
  const [search, setSearch] = useState('');

  // shipment rate hooks
  const { shipmentRate, loading: shipmentRateLoading, refetch: refetchShipmentRate } = useShipmentRate();
  const { createOrUpdateShipmentRate, loading: isSavingRate } = useCreateOrUpdateShipmentRate();

  // withdrawal hooks
  const {
    withdrawals: pendingRequests,
    loading: isPendingLoading,
    meta: pendingMeta,
    setQuery: setPendingQuery,
    refetch: refetchPending
  } = useDriverWithdrawals("pending");

  const {
    withdrawals: historyData,
    loading: isHistoryLoading,
    meta: historyMeta,
    setQuery: setHistoryQuery,
    refetch: refetchHistory
  } = useDriverWithdrawals("paid");

  const { changeWithdrawalStatus, loading: isChangingStatus } = useChangeWithdrawalStatus();

  // Modals state
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isConfirmPayModalOpen, setIsConfirmPayModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Pricing Form State
  const [newPricing, setNewPricing] = useState({
    amountPerKm: 0,
    urgentExtra: 0,
    expressExtra: 0
  });

  // Sync pricing state with fetched data
  useEffect(() => {
    if (shipmentRate) {
      setNewPricing({
        amountPerKm: shipmentRate.amountPerKm,
        urgentExtra: shipmentRate.priorityCharges?.find(p => p.priority === 'urgent')?.extraCharge || 0,
        expressExtra: shipmentRate.priorityCharges?.find(p => p.priority === 'express')?.extraCharge || 0
      });
    }
  }, [shipmentRate]);

  // DEBOUNCED SEARCH
  useEffect(() => {
    const handler = setTimeout(() => {
      setPendingQuery(prev => {
        if (prev.searchTerm === search) return prev;
        return { ...prev, searchTerm: search, page: 1 };
      });
      setHistoryQuery(prev => {
        if (prev.searchTerm === search) return prev;
        return { ...prev, searchTerm: search, page: 1 };
      });
    }, 500);
    return () => clearTimeout(handler);
  }, [search, setPendingQuery, setHistoryQuery]);

  const handleSavePricing = async () => {
    if (!shipmentRate) {
      toast.error("No shipment rate found to update");
      return;
    }

    // Construct the priorityCharges array by updating existing ones
    const updatedPriorityCharges = (shipmentRate.priorityCharges || []).map((pc: any) => {
      if (pc.priority === 'urgent') {
        return { ...pc, extraCharge: newPricing.urgentExtra };
      }
      if (pc.priority === 'express') {
        return { ...pc, extraCharge: newPricing.expressExtra };
      }
      return pc;
    });

    const payload = {
      amountPerKm: newPricing.amountPerKm,
      priorityCharges: updatedPriorityCharges
    };

    const result = await createOrUpdateShipmentRate(payload as any);
    if (result?.success) {
      toast.success(result?.message || "Shipment rate updated successfully");
      refetchShipmentRate();
      setIsPricingModalOpen(false);
    } else {
      toast.error(result?.message || "Failed to update shipment rate");
    }
  };

  const handlePayConfirm = async () => {
    if (!selectedRequest) return;

    const result = await changeWithdrawalStatus(selectedRequest._id, { status: 'paid' });
    if (result?.success) {
      setIsConfirmPayModalOpen(false);
      setIsSuccessModalOpen(true);
      refetchPending();
      refetchHistory();
      setTimeout(() => setIsSuccessModalOpen(false), 3000);
    } else {
      toast.error(result?.message || "Failed to process payment");
    }
  };

  // Table Columns
  const requestColumns = [
    { header: "TRANSACTION ID", accessorKey: "transactionId" as const },
    {
      header: "DRIVER NAME",
      render: (item: any) => <span className="font-semibold text-white">{item.user?.fullName}</span>
    },
    {
      header: "EMAIL",
      render: (item: any) => <span className="font-semibold text-white">{item.user?.email}</span>
    },
    {
      header: "REQUEST DATE",
      render: (item: any) => <span className="text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
    },
    {
      header: "AMOUNT",
      render: (item: any) => <span className="text-[#00E5FF] font-bold">${item.totalAmount?.toFixed(2)}</span>
    },
    {
      header: "ACTION",
      render: (item: any) => (
        <button
          onClick={() => { setSelectedRequest(item); setIsConfirmPayModalOpen(true); }}
          className="px-4 py-1.5 text-xs font-bold text-[#0B101E] bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-all cursor-pointer"
        >
          Pay Now
        </button>
      )
    }
  ];

  const historyColumns = [
    { header: "TRANSACTION ID", accessorKey: "transactionId" as const },
    {
      header: "DRIVER NAME",
      render: (item: any) => <span className="font-semibold text-white">{item.user?.fullName}</span>
    },
    {
      header: "EMAIL",
      render: (item: any) => <span className="font-semibold text-white">{item.user?.email}</span>
    },
    {
      header: "PAYMENT DATE",
      render: (item: any) => <span className="text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</span>
    },
    {
      header: "AMOUNT",
      render: (item: any) => <span className="text-emerald-400 font-bold">${item.totalAmount?.toFixed(2)}</span>
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

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      baseRate: shipmentRate?.amountPerKm || 0,
      urgentFee: shipmentRate?.priorityCharges?.find(p => p.priority === 'urgent')?.extraCharge || 0,
      expressFee: shipmentRate?.priorityCharges?.find(p => p.priority === 'express')?.extraCharge || 0,
    };
  }, [shipmentRate]);

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

              <StatInfoCard
                icon={<DollarSign className="h-5 w-5" />}
                label="Base Rate (Per KM)"
                value={stats.baseRate.toFixed(2)}
                iconClass="bg-[#00E5FF]/10 text-[#00E5FF]"
                loading={shipmentRateLoading}
              />

              <StatInfoCard
                icon={<AlertCircle className="h-5 w-5" />}
                label="Urgency Fee"
                value={stats.urgentFee.toFixed(2)}
                valuePrefix="+$"
                iconClass="bg-purple-500/10 text-purple-400"
                loading={shipmentRateLoading}
              />

              <StatInfoCard
                icon={<Zap className="h-5 w-5" />}
                label="Express / Rush Fee"
                value={stats.expressFee.toFixed(2)}
                valuePrefix="+$"
                iconClass="bg-amber-500/10 text-amber-500"
                loading={shipmentRateLoading}
              />

            </div>
            {/* <div className="flex flex-wrap items-center gap-3"> 
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-sm">
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Base Rate (Per KM)</p>
                  <p className="text-lg font-black text-white">${stats.baseRate.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-sm">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Urgency Fee</p>
                  <p className="text-lg font-black text-white">
                    +${stats.urgentFee.toFixed(2)}
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
                    +${stats.expressFee.toFixed(2)}
                  </p>
                </div>
              </div>

            </div> */}
          </div>

          <button
            onClick={() => setIsPricingModalOpen(true)}
            disabled={isSavingRate || shipmentRateLoading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-primary/90 cursor-pointer"
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
                "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer",
                activeTab === 'requests'
                  ? "bg-[#1E293B] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <CreditCard className="h-4 w-4" />
              Total Requests
              <span className={cn(
                "ml-1.5 px-2 py-0.5 text-[10px] rounded-full",
                activeTab === 'requests' ? "bg-primary/20 text-primary" : "bg-[#1E293B] text-gray-400"
              )}>
                {pendingMeta?.totalResult || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer",
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
            data={activeTab === 'requests' ? pendingRequests : historyData}
            columns={activeTab === 'requests' ? requestColumns : historyColumns}
            loading={activeTab === 'requests' ? isPendingLoading : isHistoryLoading}
            className="border-0 rounded-none bg-transparent"
            pagination={{
              currentPage: activeTab === 'requests' ? pendingMeta?.currentPage || 1 : historyMeta?.currentPage || 1,
              totalPage: activeTab === 'requests' ? pendingMeta?.totalPage || 1 : historyMeta?.totalPage || 1,
              totalResult: activeTab === 'requests' ? pendingMeta?.totalResult || 0 : historyMeta?.totalResult || 0,
              onPageChange: (page) => {
                const setQuery = activeTab === 'requests' ? setPendingQuery : setHistoryQuery;
                setQuery(prev => ({ ...prev, page }));
              }
            }}
          />
        </div>

      </div>

      {/* --- ADD PRICING MODAL --- */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPricingModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0B101E] border border-[#1E293B] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Pricing</h3>
              <button onClick={() => setIsPricingModalOpen(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
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
                        className="w-full bg-[#0B101E] border border-[#334155] rounded-lg py-1.5 pl-8 pr-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500 "
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            <div className="p-5 bg-[#151B2B] border-t border-[#1E293B] flex justify-end gap-3">
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isSavingRate}
                onClick={handleSavePricing}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400 text-sm font-bold cursor-pointer disabled:opacity-50"
              >
                {isSavingRate ? "Saving..." : "Save Price"}
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
                  Are you sure you want to complete this payment of <b className="text-white">${selectedRequest.totalAmount?.toFixed(2)}</b> to <b className="text-[#00E5FF]">{selectedRequest.user?.fullName}</b>?
                </p>
              </div>
            </div>
            <div className="p-5 bg-[#151B2B] border-t border-[#1E293B] flex gap-3">
              <button
                onClick={() => setIsConfirmPayModalOpen(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-300 bg-[#1E293B] rounded-xl hover:bg-[#334155] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isChangingStatus}
                onClick={handlePayConfirm}
                className="flex-1 py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl shadow-sm transition-all hover:bg-cyan-400 cursor-pointer disabled:opacity-50"
              >
                {isChangingStatus ? "Processing..." : "Confirm"}
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



type StatInfoCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  valuePrefix?: string;
  valueSuffix?: string;
  iconClass?: string;
  loading?: boolean;
};

export function StatInfoCard({
  icon,
  label,
  value,
  valuePrefix = "",
  valueSuffix = "",
  iconClass = "",
  loading = false,
}: StatInfoCardProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-sm relative overflow-hidden">

      {loading && (
        <div className="absolute inset-0 bg-[#151B2B] animate-pulse p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#1E293B]" />
          <div className="flex-1 space-y-2">
            <div className="h-2 w-24 bg-[#1E293B] rounded" />
            <div className="h-4 w-16 bg-[#1E293B] rounded" />
          </div>
        </div>
      )}

      {/* Icon */}
      <div className={cn("p-2 rounded-lg", iconClass)}>
        {icon}
      </div>

      {/* Content */}
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {label}
        </p>

        <p className="text-lg font-black text-white">
          {valuePrefix}
          {value}
          {valueSuffix}
        </p>
      </div>
    </div>
  );
}