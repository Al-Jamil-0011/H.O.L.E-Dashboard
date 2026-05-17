"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import { ExpenseItem } from './components/ExpenseDetailsDrawer';
import { ApproveExpenseModal, RejectExpenseModal } from './components/ExpenseModals';
import { useExpenses, useExpenseSummary, useUpdateExpenseStatus } from '@/hooks/admin/expense';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { CommonFilterPill, ExpensesStatCard } from '@/components/stats-card';


export default function ExpensesPage() {
  const [filter, setFilter] = useState('All');
  const { summary, loading: summaryLoading, refetch: refetchSummary } = useExpenseSummary();
  const {
    expenses: apiExpenses,
    query,
    setQuery,
    refetch: refetchExpenses,
    loading: expensesLoading,
    meta
  } = useExpenses();

  const { updateExpenseStatus } = useUpdateExpenseStatus();

  // Drawer and Modal States
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [actionExpense, setActionExpense] = useState<ExpenseItem | null>(null);

  // Map API data to UI format
  const expensesData: ExpenseItem[] = apiExpenses.map(exp => ({
    id: exp._id,
    physician: typeof exp.physician === 'object' ? exp.physician?.fullName : 'N/A',
    category: exp.category,
    amount: `$${exp.totalAmount.toLocaleString()}`,
    date: new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    submittedBy: typeof exp.representative === 'object' ? exp.representative?.fullName : 'Unknown',
    status: exp.status.toUpperCase() as any,
    role: (typeof exp.representative === 'object' ? exp.representative?.territory : '') || 'Representative',
    submittedTime: exp.createdAt ? new Date(exp.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    physicianClient: typeof exp.physician === 'object' ? exp.physician?.fullName : 'N/A',
    paidStatus: exp.isPaid ? 'Paid' : 'Unpaid',
    description: exp.description || '',
    attachments: (exp.files || []).map(f => ({ name: f.split('/').pop() || 'Attachment', size: 'N/A', type: 'file' as any }))
  }));

  const openDrawer = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setIsDrawerOpen(true);
  };

  const openApproveModal = (expense: ExpenseItem) => {
    setActionExpense(expense);
    setIsApproveModalOpen(true);
  };

  const openRejectModal = (expense: ExpenseItem) => {
    setActionExpense(expense);
    setIsRejectModalOpen(true);
  };

  const handleApprove = async () => {
    if (!actionExpense) return;

    const promise = updateExpenseStatus(actionExpense.id as string, 'approved');

    toast.promise(promise, {
      loading: 'Approving expense...',
      success: (data) => {
        if (!data) throw new Error('Failed to approve');
        refetchExpenses();
        refetchSummary();
        setIsApproveModalOpen(false);
        if (selectedExpense && selectedExpense.id === actionExpense.id) {
          setSelectedExpense({ ...selectedExpense, status: 'APPROVED' });
        }
        return 'Expense approved successfully';
      },
      error: (err) => err?.message || 'Failed to approve expense'
    });
  };

  const handleReject = async (reason: string) => {
    if (!actionExpense) return;

    const promise = updateExpenseStatus(actionExpense.id as string, 'rejected', reason);

    toast.promise(promise, {
      loading: 'Rejecting expense...',
      success: (data) => {
        if (!data) throw new Error('Failed to reject');
        refetchExpenses();
        refetchSummary();
        setIsRejectModalOpen(false);
        if (selectedExpense && selectedExpense.id === actionExpense.id) {
          setSelectedExpense({ ...selectedExpense, status: 'REJECTED' });
        }
        return 'Expense rejected';
      },
      error: (err) => err?.message || 'Failed to reject expense'
    });
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setQuery({
      ...query,
      status: newFilter === 'All' ? '' : newFilter.toLowerCase()
    });
  };

  const columns = [
    {
      header: "PHYSICIAN",
      accessorKey: "physician" as const,
      className: "text-foreground font-medium"
    },
    {
      header: "CATEGORY",
      render: (item: ExpenseItem) => {
        return (
          <span className={cn("px-2.5 py-1 text-[10px] font-bold  rounded border border-transparent dark:shadow-sm bg-purple-500/10 text-purple-400")}>
            {item.category}
          </span>
        );
      }
    },
    {
      header: "AMOUNT",
      accessorKey: "amount" as const,
      className: "text-primary font-medium"
    },
    {
      header: "DATE",
      accessorKey: "date" as const,
      className: "text-muted-foreground font-medium"
    },
    {
      header: "SUBMITTED BY",
      accessorKey: "submittedBy" as const,
      className: "text-muted-foreground font-medium"
    },
    {
      header: "STATUS",
      render: (item: ExpenseItem) => {
        const isApproved = item.status === 'APPROVED';
        return (
          <span className={cn(
            "text-[10px] font-bold tracking-widest uppercase font-medium ",
            isApproved ? "text-emerald-500" : item.status === 'PENDING' ? "text-amber-500" : "text-rose-500"
          )}>
            {item.status}
          </span>
        );
      }
    },
    {
      header: "ACTIONS",
      render: (item: ExpenseItem) => (
        <div className="flex items-center gap-2">
          {item.status === 'PENDING' ? (
            <>
              <Link href={`/finance/dashboard/expenses/${item.id}`}>
                <button
                  className="px-4 py-1.5 text-[11px] font-medium text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors cursor-pointer"
                >
                  View
                </button>
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); openApproveModal(item); }}
                className="px-3 py-1.5 text-[11px] font-medium text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openRejectModal(item); }}
                className="px-3 py-1.5 text-[11px] font-medium text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          ) : (
            <Link href={`/finance/dashboard/expenses/${item.id}`}>
              <button
                // onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
                className="px-3 py-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors cursor-pointer"
              >
                View
              </button>
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title mb-1">
            Expenses
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium ">
            Company expense tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export')}
            className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer">
            Export CSV
          </button>
          {/* <button
            onClick={() => console.log('Add Expense')}
            className="px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400"
          >
            + Add Expense
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* LEFT: 2x2 Grid */}
        <div className="xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ExpensesStatCard
            title="TOTAL EXPENSES"
            amount={`$${summary?.totalExpenses?.amount?.toLocaleString() || '0'}`}
            subtitle={`${summary?.totalExpenses?.monthlyChange || 0}% this month`}
            subtitleColor="text-blue-500"
            borderColor="border-t-blue-500"
            glowColor="shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            isLoading={summaryLoading}
          />
          <ExpensesStatCard
            title="PENDING APPROVAL"
            amount={`$${summary?.pendingApproval?.amount?.toLocaleString() || '0'}`}
            subtitle={`${summary?.pendingApproval?.count || 0} pending`}
            subtitleColor="text-amber-500"
            borderColor="border-t-amber-500"
            glowColor="shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            isLoading={summaryLoading}
          />
          <ExpensesStatCard
            title="APPROVED"
            amount={`$${summary?.approved?.amount?.toLocaleString() || '0'}`}
            subtitle={`${summary?.approved?.count || 0} expenses`}
            subtitleColor="text-emerald-500"
            borderColor="border-t-emerald-500"
            glowColor="shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            isLoading={summaryLoading}
          />
          <ExpensesStatCard
            title="REJECTED"
            amount={`$${summary?.rejected?.amount?.toLocaleString() || '0'}`}
            subtitle={`${summary?.rejected?.count || 0} rejected`}
            subtitleColor="text-rose-500"
            borderColor="border-t-rose-500"
            glowColor="shadow-[0_0_15px_rgba(244,63,94,0.1)]"
            isLoading={summaryLoading}
          />
        </div>

        {/* RIGHT: Graph */}
        <div className="xl:col-span-7 rounded-xl border border-border bg-card p-5 dark:shadow-sm flex flex-col min-h-[300px]">
          <h2 className="text-sm font-bold text-foreground mb-6">Total Expenses Overview</h2>
          <div className="flex-1 flex items-center justify-center">
            {summaryLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Loading Chart...</p>
              </div>
            ) : (
              <CustomLineChart chartData={summary?.chart || []} />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card dark:shadow-sm transition-all overflow-hidden flex flex-col bg-muted">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">All Expenses</h2>
          <div className="flex gap-2 bg-[var(--background)] rounded-lg border border-border w-full sm:w-auto overflow-x-auto p-1">
            <CommonFilterPill
              text="All"
              active={filter === 'All'}
              onClick={() => handleFilterChange('All')}
            />
            <CommonFilterPill
              text="Approved"
              active={filter === 'Approved'}
              color="bg-emerald-500/10 text-emerald-500"
              activeColor="bg-emerald-500 text-white"
              onClick={() => handleFilterChange('Approved')}
            />
            <CommonFilterPill
              text="Pending"
              active={filter === 'Pending'}
              color="bg-amber-500/10 text-amber-500"
              activeColor="bg-amber-500 text-white"
              onClick={() => handleFilterChange('Pending')}
            />
          </div>
        </div>
        <div className="flex-1">
          <DataTable
            data={expensesData}
            className='!border-none !rounded-none'
            columns={columns}
            loading={expensesLoading}
            onRowClick={(item) => openDrawer(item as ExpenseItem)}
            pagination={meta ? {
              currentPage: meta.currentPage,
              totalPage: meta.totalPage,
              totalResult: meta.totalResult,
              onPageChange: (page) => setQuery(prev => ({ ...prev, page }))
            } : undefined}
          />
        </div>
      </div>


      {/* MODALS */}
      <ApproveExpenseModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleApprove}
      />

      <RejectExpenseModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleReject}
      />

    </div>
  );
}

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function CustomLineChart({ chartData }: { chartData: { month: string; total: number }[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = chartData.length > 0 ? chartData : [
    { month: 'Oct', total: 0 },
    { month: 'Nov', total: 0 },
    { month: 'Dec', total: 0 },
    { month: 'Jan', total: 0 },
    { month: 'Feb', total: 0 },
    { month: 'Mar', total: 0 },
  ];

  const options: any = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      foreColor: isDark ? '#a1a1aa' : '#71717a',
      sparkline: { enabled: false },
    },
    colors: ['#00E5FF'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: '#00E5FF', opacity: 0.4 },
          { offset: 100, color: '#00E5FF', opacity: 0 }
        ]
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#00E5FF']
    },
    grid: {
      show: true,
      borderColor: isDark ? '#1E293B' : '#e2e8f0',
      strokeDashArray: 4,
      padding: { left: 10, right: 10, top: 0, bottom: 0 },
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } }
    },
    xaxis: {
      categories: data.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: isDark ? '#a1a1aa' : '#71717a', fontSize: '10px', fontWeight: 600 }
      }
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? '#a1a1aa' : '#71717a', fontSize: '10px', fontWeight: 600 },
        formatter: (val: number) => `$${Math.round(val / 1000)}k`
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      x: { show: true },
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`
      },
      style: { fontSize: '12px' }
    },
    markers: {
      size: 4,
      colors: [isDark ? '#0B101E' : '#ffffff'],
      strokeColors: '#00E5FF',
      strokeWidth: 2,
      hover: { size: 6 }
    }
  };

  const series = [{
    name: 'Expenses',
    data: data.map(d => d.total)
  }];

  return (
    <div className="w-full h-full min-h-[250px]">
      <Chart
        options={options}
        series={series}
        type="area"
        height="100%"
        width="100%"
      />
    </div>
  );
}
