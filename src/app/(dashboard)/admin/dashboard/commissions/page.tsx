"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { Search, CheckCircle2 } from 'lucide-react';
import { useCommissions, useCommissionSummary, useMarkCommissionPaid } from '@/hooks/admin/commissions';
import Link from 'next/link';
import { CommissionStatCard } from '@/components/stats-card';

export default function CommissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { summary, loading: isLoading } = useCommissionSummary();
  const { commissions, loading: commissionLoading, setQuery, refetch } = useCommissions();
  const { markCommissionPaid, loading: isMarkingPaid } = useMarkCommissionPaid();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(prev => ({ ...prev, searchTerm: searchQuery, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, setQuery]);

  const handleMarkAsPaid = (id: string) => {
    setSelectedId(id);
    setShowPaidModal(true);
  };

  const confirmMarkAsPaid = async () => {
    if (!selectedId) return;
    const res = await markCommissionPaid(selectedId);
    if (res?.success) {
      toast.success('Commission marked as paid');
      setShowPaidModal(false);
      setSelectedId(null);
      refetch();
    } else {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    {
      header: "REP NAME",
      render: (item: any) => {
        const primaryRep = item.sale?.createdBy;
        return <span className="font-medium text-foreground">{primaryRep?.fullName || 'N/A'}</span>;
      }
    },
    {
      header: "TOTAL SALES",
      render: (item: any) => <span>${item.sale?.billing?.totalAmount?.toLocaleString() || '0'}</span>
    },
    {
      header: "RATE",
      render: (item: any) => <span>{item.sale?.representatives?.users?.[0]?.commissionRate || 0}%</span>
    },
    {
      header: "COMMISSION AMT",
      render: (item: any) => <span className="text-emerald-400 font-bold">${item.sale?.representatives?.users?.[0]?.commission?.toLocaleString() || '0'}</span>
    },
    {
      header: "PAID",
      render: (item: any) => (
        <span className="text-primary font-medium">
          ${item.status === 'paid' ? item.sale?.representatives?.users?.[0]?.commission?.toLocaleString() : '0'}
        </span>
      )
    },
    {
      header: "STATUS",
      render: (item: any) => {
        const status = item.status === 'paid' ? 'PAID' : 'PENDING';
        const type = status === 'PAID' ? 'success' : 'warning';
        return <StatusBadge status={status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === 'unpaid' && (
            <button
              onClick={() => handleMarkAsPaid(item._id)}
              disabled={isMarkingPaid && selectedId === item._id}
              className="px-3 py-1 text-[10px] font-bold text-white dark:text-black bg-emerald-500 rounded hover:bg-emerald-400 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              {isMarkingPaid && selectedId === item._id ? (
                <div className="h-2 w-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : null}
              Mark Paid
            </button>
          )}
          <Link href={`/admin/dashboard/commissions/${item._id}`}>
            <button className="px-4 py-1.5 text-[11px] font-semibold text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors cursor-pointer">
              Details
            </button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Commission Management
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Rep commission tracking and approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-[var(--card)] rounded shadow-sm border border-[var(--border)] transition-colors hover:text-foreground">
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CommissionStatCard
          title="TOTAL COMMISSION"
          value={summary?.totalCommission?.amount ? `$${summary.totalCommission.amount.toLocaleString()}` : '$0.00'}
          trend="All reps YTD"
          topBorderColor="border-t-[#00E5FF]"
          loading={isLoading}
        />
        <CommissionStatCard
          title="PAID OUT"
          value={summary?.paidOut?.amount ? `$${summary.paidOut.amount.toLocaleString()}` : '$0.00'}
          trend={`${summary?.paidOut?.repsPaid || 0} reps paid`}
          trendColor="text-emerald-500"
          topBorderColor="border-t-emerald-500"
          loading={isLoading}
        />
        <CommissionStatCard
          title="PENDING APPROVAL"
          value={summary?.pendingApproval?.amount ? `$${summary.pendingApproval.amount.toLocaleString()}` : '$0.00'}
          trend={`${summary?.pendingApproval?.count || 0} pending`}
          trendColor="text-amber-500"
          topBorderColor="border-t-amber-500"
          loading={isLoading}
        />
        <CommissionStatCard
          title="Paid Commission"
          value={summary?.paidCommission?.amount ? `$${summary.paidCommission.amount.toLocaleString()}` : '$0.00'}
          trend={`${summary?.paidCommission?.count || 0} this month`}
          trendColor="text-violet-500"
          topBorderColor="border-t-violet-500"
          loading={isLoading}
        />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-[#1E293B] dark:bg-[#151B2B] dark:shadow-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">Rep Commissions</h2>
        </div>
        <div className="p-4 flex flex-col gap-4 bg-muted/40">
          <div className="border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between pb-4 ">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)] transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 pb-5">
            <DataTable
              data={commissions}
              columns={columns}
              loading={commissionLoading}
              onRowClick={() => { }}
            />
          </div>
        </div>
        {/* CONFIRM PAID MODAL */}
        {showPaidModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#151B2B] border border-[#1E293B] rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 dark:shadow-2xl">
              <div className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Confirm Payout</h3>
                <p className="text-sm text-gray-400 mb-6 font-medium">
                  Are you sure you want to mark this commission as paid? This action will update the representative&apos;s balance and finalize the transaction record.
                </p>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowPaidModal(false)}
                    className="flex-1 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmMarkAsPaid}
                    disabled={isMarkingPaid}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0B101E] rounded-lg text-sm font-bold transition-all dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isMarkingPaid ? (
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : <CheckCircle2 className="h-4 w-4" />}
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
