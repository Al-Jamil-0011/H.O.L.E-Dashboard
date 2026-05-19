"use client";

import { useState } from 'react';
import { cn, customToast } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import {
  Search,
  DollarSign,
  Zap,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle2,
  X,
  CreditCard,
  History,
  TrendingUp,
  User,
  Calendar,
  Hash,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';
import { useChangeWithdrawalStatus, useCreateOrUpdateShipmentRate, useDriverWithdrawals, useShipmentRate } from '@/hooks/admin/driver-payment';

import { useEffect, useMemo } from 'react';
import { StatInfoCard } from '@/components/stats-card';
import { FaEye } from 'react-icons/fa';




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

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isConfirmPayModalOpen, setIsConfirmPayModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<any | null>(null);
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);

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
      customToast.error("No shipment rate found to update");
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
      customToast.success(result?.message || "Shipment rate updated successfully");
      refetchShipmentRate();
      setIsPricingModalOpen(false);
    } else {
      customToast.error(result?.message || "Failed to update shipment rate");
    }
  };

  const handleUpdateStatus = async (request: any, status: 'approved' | 'rejected') => {
    if (!request) return;

    const result = await changeWithdrawalStatus(request._id, { status });
    if (result?.success) {
      setIsConfirmPayModalOpen(false);
      setIsDetailsModalOpen(false);
      if (status === 'approved') {
        setIsSuccessModalOpen(true);
        setTimeout(() => setIsSuccessModalOpen(false), 3000);
      } else {
        customToast.success(result?.message || "Request rejected successfully");
      }
      refetchPending();
      refetchHistory();
    } else {
      customToast.error(result?.message || `Failed to update request status`);
    }
  };

  const handlePayConfirm = async () => {
    if (!selectedRequest) return;
    await handleUpdateStatus(selectedRequest, 'approved');
  };

  // Table Columns
  const requestColumns = [
    { header: "TRANSACTION ID", accessorKey: "transactionId" as const },
    {
      header: "DRIVER NAME",
      render: (item: any) => <span className="font-semibold text-foreground">{item.user?.fullName}</span>
    },
    {
      header: "EMAIL",
      render: (item: any) => <span className="font-semibold text-foreground">{item.user?.email}</span>
    },
    {
      header: "REQUEST DATE",
      render: (item: any) => <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
    },
    {
      header: "AMOUNT",
      render: (item: any) => <span className="text-primary font-bold">${item.totalAmount?.toFixed(2)}</span>
    },
    {
      header: "ACTION",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedRequest(item); setIsConfirmPayModalOpen(true); }}
            className="px-4 py-1.5 text-xs font-medium text-background bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-all cursor-pointer"
          >
            Pay Now
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequestDetails(item);
              setIsDetailsModalOpen(true);
              setShowFullCardNumber(false);
            }}
            className="px-3 flex items-center gap-2 py-1 font-medium text-primary dark:text-[#00E5FF]/80 dark:bg-[#00E5FF]/10 rounded dark:hover:bg-[#00E5FF]/20 hover:bg-primary/10 transition-colors cursor-pointer">
            <FaEye /> Details
          </button>
        </div>
      )
    }
  ];

  const historyColumns = [
    { header: "TRANSACTION ID", accessorKey: "transactionId" as const },
    {
      header: "DRIVER NAME",
      render: (item: any) => <span className="font-semibold text-foreground">{item.user?.fullName}</span>
    },
    {
      header: "EMAIL",
      render: (item: any) => <span className="font-semibold text-foreground">{item.user?.email}</span>
    },
    {
      header: "PAYMENT DATE",
      render: (item: any) => <span className="text-muted-foreground">{new Date(item.updatedAt).toLocaleDateString()}</span>
    },
    {
      header: "AMOUNT",
      render: (item: any) => <span className="text-emerald-500 font-bold">${item.totalAmount?.toFixed(2)}</span>
    },
    {
      header: "STATUS",
      render: (item: any) => (
        <div className="flex items-center justify-between gap-4">
          <span className={cn(
            "px-3 py-1 text-[10px] font-bold rounded-md uppercase",
            item.status === 'paid' || item.status === 'approved'
              ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
              : item.status === 'rejected'
                ? "text-rose-500 bg-rose-500/10 border border-rose-500/20"
                : "text-amber-500 bg-amber-500/10 border border-amber-500/20"
          )}>
            {item.status}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequestDetails(item);
              setIsDetailsModalOpen(true);
              setShowFullCardNumber(false);
            }}
            className="px-3 flex items-center gap-2 py-1 font-medium text-primary dark:text-[#00E5FF]/80 dark:bg-[#00E5FF]/10 rounded dark:hover:bg-[#00E5FF]/20 hover:bg-primary/10 transition-colors cursor-pointer">
            <FaEye /> Details
          </button>
        </div>
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
        <h1 className="title mb-1">
          Driver Earnings Control
        </h1>
        <p className="text-[12px] text-muted-foreground font-medium ">
          Manage global logistic pricing and driver withdrawal payouts
        </p>
      </div>

      {/* TOP SECTION - GLOBAL PRICING SUMMARY */}
      <div className="relative rounded-2xl border border-primary/30 bg-card p-6 dark:shadow-lg dark:shadow-[0_0_20px_rgba(0,229,255,0.05)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              Global Pricing Summary
            </h2>
            <div className="flex flex-wrap items-center gap-3">

              <StatInfoCard
                icon={<DollarSign className="h-5 w-5" />}
                label="Base Rate (Per KM)"
                value={stats.baseRate.toFixed(2)}
                iconClass="bg-primary/10 text-primary"
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
          </div>

          <button
            onClick={() => setIsPricingModalOpen(true)}
            disabled={isSavingRate || shipmentRateLoading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[var(--background)] bg-primary rounded-lg dark:shadow-sm transition-all hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Add Pricing
          </button>
        </div>
      </div>

      {/* MAIN SECTION - TABS & SEARCH */}
      <div className="flex flex-col gap4 bg-muted dark:bg-[#151B2B] rounded-xl ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          {/* Tab Switcher */}
          <div className="inline-flex items-center bg-[var(--background)] p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab('requests')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all dark:shadow-sm cursor-pointer",
                activeTab === 'requests'
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CreditCard className="h-4 w-4" />
              Total Requests
              <span className={cn(
                "ml-1.5 px-2 py-0.5 text-[10px] rounded-full",
                activeTab === 'requests' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {pendingMeta?.totalResult || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "flex flex-1 items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all dark:shadow-sm cursor-pointer",
                activeTab === 'history'
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="h-4 w-4" />
              History
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md py-2 pl-9 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)] transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE WRAPPER */}
        <div className="border border-border bg-card dark:shadow-xl overflow-hidden flex flex-col">
          <DataTable
            data={activeTab === 'requests' ? pendingRequests : historyData}
            columns={activeTab === 'requests' ? requestColumns : historyColumns}
            loading={activeTab === 'requests' ? isPendingLoading : isHistoryLoading}
            onRowClick={() => { }}
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
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl dark:shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Create New Pricing</h3>
              <button onClick={() => setIsPricingModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase">Base Rate configuration</h4>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1.5">Amount Per KM ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={newPricing.amountPerKm}
                        onChange={(e) => setNewPricing({ ...newPricing, amountPerKm: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-foreground font-bold focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-500 uppercase">Priority Settings (Extra Fee)</h4>

                <div className="space-y-3">

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center gap-3 text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold">Standard</p>
                        <p className="text-[10px] text-muted-foreground">Default Priority</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">No Extra Fee</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 focus-within:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-3 text-foreground">
                      <AlertCircle className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-sm font-bold text-purple-400">Urgency</p>
                        <p className="text-[10px] text-muted-foreground">1-2 hours delivery</p>
                      </div>
                    </div>
                    <div className="relative w-28">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="number"
                        min="0"
                        value={newPricing.urgentExtra}
                        onChange={(e) => setNewPricing({ ...newPricing, urgentExtra: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-background border border-border rounded-lg py-1.5 pl-8 pr-3 text-sm font-bold text-foreground focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 focus-within:border-amber-500/50 transition-colors">
                    <div className="flex items-center gap-3 text-foreground">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-sm font-bold text-amber-500">Express / Rush</p>
                        <p className="text-[10px] text-muted-foreground">30-60 mins delivery</p>
                      </div>
                    </div>
                    <div className="relative w-28">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="number"
                        min="0"
                        value={newPricing.expressExtra}
                        onChange={(e) => setNewPricing({ ...newPricing, expressExtra: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-background border border-border rounded-lg py-1.5 pl-8 pr-3 text-sm font-bold text-foreground focus:outline-none focus:border-amber-500 "
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            <div className="p-5 bg-muted/40 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isSavingRate}
                onClick={handleSavePricing}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-background bg-primary rounded-lg dark:shadow-sm transition-all hover:bg-primary/90 text-sm font-medium cursor-pointer disabled:opacity-50"
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
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl dark:shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <CreditCard size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Process Payment?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Are you sure you want to complete this payment of <b className="text-foreground">${selectedRequest.totalAmount?.toFixed(2)}</b> to <b className="text-primary">{selectedRequest.user?.fullName}</b>?
                </p>
              </div>
            </div>
            <div className="p-5 bg-muted/40 border-t border-border flex gap-3">
              <button
                onClick={() => setIsConfirmPayModalOpen(false)}
                className="flex-1 py-3 text-sm font-medium text-muted-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isChangingStatus}
                onClick={handlePayConfirm}
                className="flex-1 py-3 text-sm font-medium text-background bg-primary rounded-xl dark:shadow-sm transition-all hover:bg-primary/90 cursor-pointer disabled:opacity-50"
              >
                {isChangingStatus ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAILS MODAL --- */}
      {isDetailsModalOpen && selectedRequestDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDetailsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl dark:shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Withdrawal Details</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{selectedRequestDetails.transactionId}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

              {/* Driver Info Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <User className="h-3 w-3" /> Driver Information
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Full Name</p>
                    <p className="text-sm font-bold text-foreground">{selectedRequestDetails.user?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Email Address</p>
                    <p className="text-sm font-bold text-foreground truncate">{selectedRequestDetails.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="h-3 w-3" /> Financial breakdown
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Total Amount</p>
                    <p className="text-lg font-black text-foreground">${selectedRequestDetails.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Due Amount</p>
                    <p className="text-lg font-black text-emerald-500">${selectedRequestDetails.dueAmount?.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Platform Fee</p>
                    <p className="text-lg font-black text-rose-500">${selectedRequestDetails.platformFee?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Transaction & Card Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-3 w-3" /> Transaction Security
                </h4>
                <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-bold text-muted-foreground">Transaction ID</p>
                    </div>
                    <p className="text-sm font-black text-foreground">{selectedRequestDetails.transactionId}</p>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-bold text-muted-foreground">Card Number</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-black text-foreground tracking-wider font-mono">
                        {showFullCardNumber
                          ? selectedRequestDetails.cardNumber?.toString().replace(/(\d{4})/g, '$1 ').trim()
                          : `${selectedRequestDetails.cardNumber?.toString().slice(0, 2)}** **** **** ${selectedRequestDetails.cardNumber?.toString().slice(-4)}`
                        }
                      </p>
                      <button
                        onClick={() => setShowFullCardNumber(!showFullCardNumber)}
                        className="p-1.5 rounded-lg bg-background border border-border hover:text-primary transition-colors cursor-pointer"
                      >
                        {showFullCardNumber ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-bold text-muted-foreground">Requested On</p>
                    </div>
                    <p className="text-sm font-black text-foreground">{new Date(selectedRequestDetails.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-bold text-muted-foreground">Status</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase rounded-md",
                      selectedRequestDetails.status === 'paid' || selectedRequestDetails.status === 'approved'
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : selectedRequestDetails.status === 'rejected'
                          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    )}>
                      {selectedRequestDetails.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 bg-muted/20 border-t border-border flex gap-2 justify-end">
              {selectedRequestDetails.status === 'pending' ? (
                <>
                  <button
                    disabled={isChangingStatus}
                    onClick={() => handleUpdateStatus(selectedRequestDetails, 'rejected')}
                    className="px-6 py-2.5 text-sm font-medium text-foreground border border-red-500/70 rounded-xl dark:shadow-lg text-red-500/70 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isChangingStatus ? "Processing..." : "Reject"}
                  </button>
                  <button
                    disabled={isChangingStatus}
                    onClick={() => handleUpdateStatus(selectedRequestDetails, 'approved')}
                    className="px-6 py-2.5 text-sm font-medium text-background bg-primary rounded-xl dark:shadow-lg hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isChangingStatus ? "Processing..." : "Pay Now"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-background bg-primary rounded-xl dark:shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Close Details
                </button>
              )}
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


