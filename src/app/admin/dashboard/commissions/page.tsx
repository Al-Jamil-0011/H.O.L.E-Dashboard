"use client";

import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';

const commissionData = [
  { rep: 'John Smith', sales: '$40,000', rate: '10%', comm: '$4,000', paid: '$4,000', status: 'PAID' },
  { rep: 'Sarah Johnson', sales: '$28,500', rate: '10%', comm: '$2,850', paid: '$2,850', status: 'PAID' },
  { rep: 'Mike Chan', sales: '$22,000', rate: '10%', comm: '$2,200', paid: '$0', status: 'PENDING' },
  { rep: 'Alex Rivera', sales: '$18,700', rate: '10%', comm: '$1,870', paid: '$0', status: 'PENDING' },
  { rep: 'Linda Torres', sales: '$15,200', rate: '10%', comm: '$1,520', paid: '$1,520', status: 'PAID' },
  { rep: 'James Park', sales: '$31,000', rate: '10%', comm: '$3,100', paid: '$3,100', status: 'PAID' },
  { rep: 'David Kim', sales: '$13,600', rate: '10%', comm: '$1,360', paid: '$0', status: 'PAID COMMISSION' },
];

export default function CommissionsPage() {
  const columns = [
    { header: "REP NAME", accessorKey: "rep" as const, className: "font-medium text-foreground" },
    { header: "TOTAL SALES", accessorKey: "sales" as const },
    { header: "RATE", accessorKey: "rate" as const },
    { header: "COMMISSION AMT", accessorKey: "comm" as const, className: "text-emerald-400 font-bold" },
    { header: "PAID", accessorKey: "paid" as const, className: "text-accent-teal font-medium" },
    {
      header: "STATUS",
      render: (item: typeof commissionData[0]) => {
        let type: "success" | "warning" | "error" | "default" = "default";
        if (item.status === 'PENDING') type = 'warning';
        if (item.status === 'APPROVED') type = 'success';
        if (item.status === 'PAID') type = 'success';
        if (item.status === 'TOTAL PAID') type = 'error';
        return <StatusBadge status={item.status} type={type} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: typeof commissionData[0]) => (
        <div className="flex items-center gap-2">
          {item.status === 'PENDING' ? (
            <>
              <button className="px-3 py-1 text-[10px] font-bold text-[var(--background)] bg-emerald-500 rounded hover:bg-emerald-400 transition-colors">
                APPROVE
              </button>
              <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-[var(--border)] rounded hover:text-foreground transition-colors">
                Receipt
              </button>
            </>
          ) : (
            <button className="px-3 py-1 text-[10px] font-medium text-muted-foreground border border-[var(--border)] rounded hover:text-foreground transition-colors">
              Receipt
            </button>
          )}
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
          <button className="px-4 py-1.5 text-xs font-bold text-[var(--background)] bg-accent-teal rounded shadow-sm transition-all hover:bg-cyan-400">
            Bulk Approve
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="TOTAL COMMISSION" value="$44,000" trend="All reps YTD" topBorderColor="border-t-[var(--accent-teal)]" />
        <StatCard title="PAID OUT" value="$32,000" trend="8 reps paid" trendColor="text-emerald-500" topBorderColor="border-t-emerald-500" />
        <StatCard title="PENDING APPROVAL" value="$8,500" trend="4 pending" trendColor="text-amber-500" topBorderColor="border-t-amber-500" />
        <StatCard title="PAID COMMISSION" value="$3,500" trend="2 PAID COMMISSION" trendColor="text-rose-500" topBorderColor="border-t-rose-500" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-5">
          <h2 className="text-sm font-bold text-foreground">Rep Commissions</h2>
        </div>
        <div className="flex-1 px-5 pb-5">
          <DataTable data={commissionData} columns={columns} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  trendColor = "text-accent-teal",
  topBorderColor
}: {
  title: string;
  value: string;
  trend: string;
  trendColor?: string;
  topBorderColor: string;
}) {
  return (
    <div className={cn("rounded-xl border border-[var(--border)] border-t-[3px] bg-[var(--card)] p-5 shadow-sm transition-all hover:bg-white/[0.02]", topBorderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="mt-3">
        <div className="text-2xl font-black tracking-tight text-foreground">{value}</div>
        <p className={cn("mt-2 text-[11px] font-medium", trendColor)}>
          {trend}
        </p>
      </div>
    </div>
  );
}

