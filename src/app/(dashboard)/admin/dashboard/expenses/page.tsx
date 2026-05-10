"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import { ExpenseDetailsDrawer, ExpenseItem } from './components/ExpenseDetailsDrawer';
import { ApproveExpenseModal, RejectExpenseModal } from './components/ExpenseModals';
import { useExpenses, useExpenseSummary, useUpdateExpenseStatus } from '@/hooks/admin/expense';
import toast from 'react-hot-toast';
import Link from 'next/link';


export default function ExpensesPage() {
  const [filter, setFilter] = useState('All');
  const { summary, loading: summaryLoading, refetch: refetchSummary } = useExpenseSummary();
  const {
    expenses: apiExpenses,
    query,
    setQuery,
    refetch: refetchExpenses,
    loading: expensesLoading
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
    expense: `${exp.category} — ${typeof exp.physician === 'object' ? exp.physician?.fullName : 'N/A'}`,
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
    attachments: (exp.files || []).map(f => ({ name: f.split('/').pop() || 'Attachment', size: 'N/A', type: 'file' }))
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
        if (selectedExpense?.id === actionExpense.id) {
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
        if (selectedExpense?.id === actionExpense.id) {
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
      header: "EXPENSE",
      accessorKey: "expense" as const,
      className: "text-foreground font-medium"
    },
    {
      header: "CATEGORY",
      render: (item: ExpenseItem) => {
        let colorClass = "bg-gray-500/10 text-gray-400";
        if (item.category === 'SHIPMENT') colorClass = "bg-[#00E5FF]/10 text-[#00E5FF]";
        else if (item.category === 'TRAVEL') colorClass = "bg-purple-500/10 text-purple-400";
        else if (item.category === 'OFFICE') colorClass = "bg-emerald-500/10 text-emerald-400";
        else if (item.category === 'MARKETING') colorClass = "bg-amber-500/10 text-amber-400";

        return (
          <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-transparent shadow-sm", colorClass)}>
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
              <Link href={`/admin/dashboard/expenses/${item.id}`}>
                <button
                  // onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
                  className="px-4 py-1.5 text-[11px] font-semibold text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors cursor-pointer"
                >
                  View
                </button>
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); openApproveModal(item); }}
                className="px-3 py-1.5 text-[11px] font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openRejectModal(item); }}
                className="px-3 py-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          ) : (
            <Link href={`/admin/dashboard/expenses/${item.id}`}>
              <button
                // onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
                className="px-4 py-1.5 text-[11px] font-semibold text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors cursor-pointer"
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
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Expenses
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Company expense tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export')}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-[var(--border)]/50 rounded-lg shadow-sm border border-[var(--border)] transition-colors hover:bg-[var(--border)] hover:text-foreground cursor-pointer"
          >
            Export
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
          <StatCard
            title="TOTAL EXPENSES"
            amount={`$${summary?.totalExpenses?.amount?.toLocaleString() || '0'}`}
            subtitle={`${summary?.totalExpenses?.monthlyChange || 0}% this month`}
            subtitleColor="text-blue-500"
            borderColor="border-t-blue-500"
            glowColor="shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            isLoading={summaryLoading}
          />
          <StatCard
            title="PENDING APPROVAL"
            amount={`$${summary?.pendingApproval?.amount?.toLocaleString() || '0'}`}
            subtitle={`${summary?.pendingApproval?.count || 0} pending`}
            subtitleColor="text-amber-500"
            borderColor="border-t-amber-500"
            glowColor="shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            isLoading={summaryLoading}
          />
          <StatCard
            title="APPROVED"
            amount={`$${summary?.approved?.amount?.toLocaleString() || '0'}`}
            subtitle={`${summary?.approved?.count || 0} expenses`}
            subtitleColor="text-emerald-500"
            borderColor="border-t-emerald-500"
            glowColor="shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            isLoading={summaryLoading}
          />
          <StatCard
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
        <div className="xl:col-span-7 rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm flex flex-col min-h-[300px]">
          <h2 className="text-sm font-bold text-white mb-6">Total Expenses Overview</h2>
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

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">All Expenses</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} activeColor="bg-white text-black" onClick={() => handleFilterChange('All')} />
            <FilterPill text="Approved" active={filter === 'Approved'} color="bg-emerald-500/20 text-emerald-400" activeColor="bg-emerald-500 text-white" onClick={() => handleFilterChange('Approved')} />
            <FilterPill text="Pending" active={filter === 'Pending'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-white" onClick={() => handleFilterChange('Pending')} />
          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable
            data={expensesData}
            columns={columns}
            loading={expensesLoading}
            onRowClick={(item) => openDrawer(item as ExpenseItem)}
          />
        </div>
      </div>

      {/* DRAWER */}
      <ExpenseDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        expense={selectedExpense}
        onApprove={(exp) => {
          openApproveModal(exp);
        }}
        onReject={(exp) => {
          openRejectModal(exp);
        }}
      />

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

function StatCard({
  title,
  amount,
  subtitle,
  subtitleColor,
  borderColor,
  glowColor,
  isLoading
}: {
  title: string,
  amount: string,
  subtitle: string,
  subtitleColor: string,
  borderColor: string,
  glowColor?: string,
  isLoading?: boolean
}) {
  return (
    <div className={cn("rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-white/[0.02]", borderColor, glowColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{title}</h3>
      {isLoading ? (
        <div className="mt-2 space-y-2">
          <div className="h-8 w-24 bg-gray-800 animate-pulse rounded" />
          <div className="h-4 w-16 bg-gray-800 animate-pulse rounded" />
        </div>
      ) : (
        <>
          <div className="mt-2 text-3xl font-black tracking-tight text-white">{amount}</div>
          <p className={cn("mt-1 text-xs font-medium", subtitleColor)}>{subtitle}</p>
        </>
      )}
    </div>
  )
}

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function CustomLineChart({ chartData }: { chartData: { month: string; total: number }[] }) {
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
      foreColor: '#64748b',
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
      borderColor: '#1E293B',
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
        style: { colors: '#64748b', fontSize: '10px', fontWeight: 600 }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '10px', fontWeight: 600 },
        formatter: (val: number) => `$${Math.round(val / 1000)}k`
      }
    },
    tooltip: {
      theme: 'dark',
      x: { show: true },
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`
      },
      style: { fontSize: '12px' }
    },
    markers: {
      size: 4,
      colors: ['#0B101E'],
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

function FilterPill({ text, active, onClick, color, activeColor }: { text: string, active: boolean, onClick: () => void, color?: string, activeColor?: string }) {
  const baseClasses = "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-[var(--border)] transition-all cursor-pointer";

  if (active) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColor || "bg-[var(--border)] text-foreground border-[var(--border)]")}>
        {text}
      </button>
    );
  }

  if (color) {
    return (
      <button onClick={onClick} className={cn(baseClasses, color, "hover:opacity-80")}>
        {text}
      </button>
    )
  }

  return (
    <button onClick={onClick} className={cn(baseClasses, "text-muted-foreground hover:text-foreground hover:bg-[var(--border)]/50")}>
      {text}
    </button>
  )
}

