"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/DataTable';
import { ExpenseDetailsDrawer, ExpenseItem } from './components/ExpenseDetailsDrawer';
import { ApproveExpenseModal, RejectExpenseModal } from './components/ExpenseModals';

const initialExpenseData: ExpenseItem[] = [
  {
    id: 1,
    expense: 'FedEx — City Hospital',
    category: 'SHIPMENT',
    amount: '$450.00',
    date: 'Mar 10, 2026',
    submittedBy: 'John Smith',
    status: 'APPROVED',
    role: 'Logistics Coordinator',
    submittedTime: 'Mar 11, 2026 • 08:30 AM',
    physicianClient: 'City Hospital',
    paidStatus: 'Corporate Card',
    description: 'Emergency shipment of spinal implant kits to City Hospital for Dr. Roberts surgery.',
    attachments: [
      { name: 'FedEx_Receipt_1039.pdf', size: '1.2 MB', type: 'pdf' }
    ]
  },
  {
    id: 2,
    expense: 'Flight — Chicago Conf.',
    category: 'TRAVEL',
    amount: '$820.00',
    date: 'Mar 8, 2026',
    submittedBy: 'Sarah Johnson',
    status: 'APPROVED',
    role: 'Sales Representative',
    submittedTime: 'Mar 09, 2026 • 10:15 AM',
    physicianClient: 'N/A',
    paidStatus: 'Reimbursable',
    description: 'Round trip flight to Chicago for the Annual Orthopedic Surgeons Conference.',
    attachments: [
      { name: 'Delta_Itinerary.pdf', size: '840 KB', type: 'pdf' }
    ]
  },
  {
    id: 3,
    expense: 'UPS — Metro Hospital',
    category: 'SHIPMENT',
    amount: '$380.00',
    date: 'Mar 12, 2026',
    submittedBy: 'Alex Johnson',
    status: 'PENDING',
    role: 'Sales Representative',
    submittedTime: 'Mar 12, 2026 • 09:45 AM',
    physicianClient: 'Dr. Smith',
    paidStatus: 'Corporate Card',
    description: 'Lunch meeting with Dr. Smith to discuss the new pharmaceutical lineup and distribution schedule for the downtown clinic.',
    attachments: [
      { name: 'PO_889_Final.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Implant_Serial_Photo.jpg', size: '3.4 MB', type: 'jpg' }
    ]
  },
  {
    id: 4,
    expense: 'Office Supplies Q1',
    category: 'OFFICE',
    amount: '$640.00',
    date: 'Mar 1, 2026',
    submittedBy: 'Admin',
    status: 'APPROVED',
    role: 'Operations Manager',
    submittedTime: 'Mar 02, 2026 • 11:00 AM',
    physicianClient: 'N/A',
    paidStatus: 'Corporate Card',
    description: 'Bulk purchase of printer ink, paper, and general office supplies for Q1.',
    attachments: [
      { name: 'Staples_Invoice.pdf', size: '2.1 MB', type: 'pdf' }
    ]
  },
  {
    id: 5,
    expense: 'LinkedIn Ads — March',
    category: 'MARKETING',
    amount: '$600.00',
    date: 'Mar 1, 2026',
    submittedBy: 'Marketing',
    status: 'PENDING',
    role: 'Marketing Director',
    submittedTime: 'Mar 05, 2026 • 02:20 PM',
    physicianClient: 'N/A',
    paidStatus: 'Corporate Card',
    description: 'Monthly LinkedIn advertising budget for B2B clinical outreach campaign.',
    attachments: [
      { name: 'LinkedIn_Ads_March.pdf', size: '500 KB', type: 'pdf' }
    ]
  },
];

export default function ExpensesPage() {
  const [filter, setFilter] = useState('All');
  const [expensesData, setExpensesData] = useState<ExpenseItem[]>(initialExpenseData);

  // Drawer and Modal States
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [actionExpense, setActionExpense] = useState<ExpenseItem | null>(null);

  const filteredData = expensesData.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Approved') return item.status === 'APPROVED';
    if (filter === 'Pending') return item.status === 'PENDING';
    return true;
  });

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

  const handleApprove = () => {
    if (!actionExpense) return;
    setExpensesData(prev => prev.map(exp =>
      exp.id === actionExpense.id ? { ...exp, status: 'APPROVED' } : exp
    ));
    if (selectedExpense?.id === actionExpense.id) {
      setSelectedExpense({ ...selectedExpense, status: 'APPROVED' });
    }
  };

  const handleReject = (reason: string) => {
    if (!actionExpense) return;
    // In a real app, you might save the reason to the expense object here
    setExpensesData(prev => prev.map(exp =>
      exp.id === actionExpense.id ? { ...exp, status: 'REJECTED' } : exp
    ));
    if (selectedExpense?.id === actionExpense.id) {
      setSelectedExpense({ ...selectedExpense, status: 'REJECTED' });
    }
  };

  const columns = [
    { header: "EXPENSE", accessorKey: "expense" as const, className: "font-medium text-white text-sm" },
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
    { header: "AMOUNT", accessorKey: "amount" as const, className: "text-[#00E5FF] font-medium" },
    { header: "DATE", accessorKey: "date" as const, className: "text-gray-400 text-sm" },
    { header: "SUBMITTED BY", accessorKey: "submittedBy" as const, className: "text-gray-400 text-sm" },
    {
      header: "STATUS",
      render: (item: ExpenseItem) => {
        const isApproved = item.status === 'APPROVED';
        return (
          <span className={cn(
            "text-[10px] font-bold tracking-widest uppercase",
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
              <button
                onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
                className="px-4 py-1.5 text-[11px] font-semibold text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors"
              >
                View
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openApproveModal(item); }}
                className="px-3 py-1.5 text-[11px] font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-colors"
              >
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openRejectModal(item); }}
                className="px-3 py-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded transition-colors"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); openDrawer(item); }}
              className="px-4 py-1.5 text-[11px] font-semibold text-gray-300 bg-[#334155]/50 hover:bg-[#334155] rounded transition-colors"
            >
              View
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Expenses
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Company expense tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export')}
            className="px-4 py-2 text-xs font-semibold text-gray-300 bg-[#1E293B]/50 rounded-lg shadow-sm border border-[#334155] transition-colors hover:bg-[#1E293B] hover:text-white"
          >
            Export
          </button>
          {/* <button
            onClick={() => console.log('Add Expense')}
            className="px-4 py-2 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded-lg shadow-sm transition-all hover:bg-cyan-400"
          >
            + Add Expense
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* LEFT: 2x2 Grid */}
        <div className="xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="TOTAL EXPENSES" amount="$12,000" subtitle="+8% this month" subtitleColor="text-rose-500" borderColor="border-t-rose-500" glowColor="shadow-[0_0_15px_rgba(244,63,94,0.1)]" />
          <StatCard title="PENDING APPROVAL" amount="$2,400" subtitle="4 pending" subtitleColor="text-amber-500" borderColor="border-t-amber-500" glowColor="shadow-[0_0_15px_rgba(245,158,11,0.1)]" />
          <StatCard title="APPROVED" amount="$9,600" subtitle="12 expenses" subtitleColor="text-emerald-500" borderColor="border-t-emerald-500" glowColor="shadow-[0_0_15px_rgba(16,185,129,0.1)]" />
          <StatCard title="BUDGET LEFT" amount="$8,000" subtitle="40% remaining" subtitleColor="text-amber-500" borderColor="border-t-blue-500" glowColor="shadow-[0_0_15px_rgba(59,130,246,0.1)]" />
        </div>

        {/* RIGHT: Graph */}
        <div className="xl:col-span-7 rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-white mb-6">Total Expenses Overview</h2>
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <CustomLineChart />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-white">All Expenses</h2>
          <div className="flex gap-2">
            <FilterPill text="All" active={filter === 'All'} onClick={() => setFilter('All')} />
            <FilterPill text="Approved" active={filter === 'Approved'} color="bg-emerald-500/20 text-emerald-400" activeColor="bg-emerald-500 text-[#0B101E]" onClick={() => setFilter('Approved')} />
            <FilterPill text="Pending" active={filter === 'Pending'} color="bg-amber-500/20 text-amber-500" activeColor="bg-amber-500 text-[#0B101E]" onClick={() => setFilter('Pending')} />
          </div>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable
            data={filteredData}
            columns={columns}
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

function StatCard({ title, amount, subtitle, subtitleColor, borderColor, glowColor }: { title: string, amount: string, subtitle: string, subtitleColor: string, borderColor: string, glowColor?: string }) {
  return (
    <div className={cn("rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-white/[0.02]", borderColor, glowColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{title}</h3>
      <div className="mt-2 text-3xl font-black tracking-tight text-white">{amount}</div>
      <p className={cn("mt-1 text-xs font-medium", subtitleColor)}>{subtitle}</p>
    </div>
  )
}

function CustomLineChart() {
  const data = [
    { label: 'Oct', value: 4500 },
    { label: 'Nov', value: 5200 },
    { label: 'Dec', value: 4800 },
    { label: 'Jan', value: 8100 },
    { label: 'Feb', value: 10500 },
    { label: 'Mar', value: 12000 },
  ];

  const maxVal = 14000;
  const paddingX = 40;
  const paddingY = 20;

  // We use percentages for flexible rendering in SVG
  const getX = (index: number) => paddingX + (index * (600 - 2 * paddingX)) / (data.length - 1);
  const getY = (val: number) => 200 - paddingY - (val / maxVal) * (200 - 2 * paddingY);

  let pathD = `M ${getX(0)},${getY(data[0].value)}`;
  for (let i = 1; i < data.length; i++) {
    const x0 = getX(i - 1);
    const y0 = getY(data[i - 1].value);
    const x1 = getX(i);
    const y1 = getY(data[i].value);

    const cx0 = x0 + (x1 - x0) / 2;
    const cy0 = y0;
    const cx1 = x0 + (x1 - x0) / 2;
    const cy1 = y1;

    pathD += ` C ${cx0},${cy0} ${cx1},${cy1} ${x1},${y1}`;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 600 200" className="w-full h-full min-w-[500px]" preserveAspectRatio="none">
        <line x1={paddingX} y1={getY(10000)} x2={600 - paddingX} y2={getY(10000)} stroke="#334155" strokeDasharray="4" strokeWidth="1" />
        <line x1={paddingX} y1={getY(5000)} x2={600 - paddingX} y2={getY(5000)} stroke="#334155" strokeDasharray="4" strokeWidth="1" />

        <text x={paddingX - 10} y={getY(10000)} fill="#64748b" fontSize="10" textAnchor="end" alignmentBaseline="middle">10k</text>
        <text x={paddingX - 10} y={getY(5000)} fill="#64748b" fontSize="10" textAnchor="end" alignmentBaseline="middle">5k</text>

        <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth="3" />

        <path d={`${pathD} L ${getX(data.length - 1)},${200 - paddingY} L ${getX(0)},${200 - paddingY} Z`} fill="url(#areaGradient)" opacity="0.5" />

        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#151B2B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.value)} r="4" fill="#0B101E" stroke="#00E5FF" strokeWidth="2" />
            <text x={getX(i)} y={200 - 5} fill="#94a3b8" fontSize="10" textAnchor="middle">{d.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ProgressBar({ label, amount, percentage, color }: { label: string, amount: string, percentage: number, color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 shrink-0 text-xs font-medium text-gray-400">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-[#0B101E] overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
      </div>
      <div className="w-12 shrink-0 text-right text-xs font-bold text-white tracking-wide">{amount}</div>
    </div>
  )
}

function FilterPill({ text, active, onClick, color, activeColor }: { text: string, active: boolean, onClick: () => void, color?: string, activeColor?: string }) {
  const baseClasses = "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border border-[#1E293B] transition-all cursor-pointer";

  if (active) {
    return (
      <button onClick={onClick} className={cn(baseClasses, activeColor || "bg-[#334155] text-white border-[#334155]")}>
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
    <button onClick={onClick} className={cn(baseClasses, "text-gray-400 hover:text-white hover:bg-[#1E293B]/50")}>
      {text}
    </button>
  )
}
