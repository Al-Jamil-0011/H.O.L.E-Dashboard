"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart4,
  FileText,
  CreditCard,
  Wallet,
  Percent,
  Receipt,
  Truck,
  Clock,
  PieChart,
  Users,
  RefreshCcw,
  Settings,
  Building2,
  Package,
  ShoppingCart,
  DollarSign,
  Stethoscope,
  FileDown,
  Bell,
  ClipboardList,
  HelpCircle,
  X,
  FolderPlus,
} from 'lucide-react';

const mainNavItems = [
  { name: 'Home', href: '/', icon: LayoutDashboard },
  { name: 'Finance', href: '/finance/dashboard', icon: LayoutDashboard },
  { name: 'Admin', href: '/admin/dashboard', icon: LayoutDashboard },
];

const financeNavItems = [
  { name: 'Sales & Revenue', href: '/finance/dashboard/sales', icon: BarChart4 },
  { name: 'Invoices', href: '/finance/dashboard/invoices', icon: FileText },
  { name: 'Payments', href: '/finance/dashboard/payments', icon: CreditCard },
  { name: 'Vendor Payments', href: '/finance/dashboard/vendor-payments', icon: Wallet },
  { name: 'Commission', href: '/finance/dashboard/commissions', icon: Percent },
  { name: 'Expenses', href: '/finance/dashboard/expenses', icon: Receipt },
  { name: 'Shipping Costs', href: '/finance/dashboard/shipping', icon: Truck },
];

const analyticsNavItems = [
  { name: 'Aging Report', href: '/finance/dashboard/aging-reports', icon: Clock },
  { name: 'Financial Reports', href: '/finance/dashboard/reports', icon: PieChart },
  { name: 'Rep Accounts', href: '/finance/dashboard/rep-accounts', icon: Users },
];

const integrationsNavItems = [
  { name: 'QuickBooks', href: '/finance/dashboard/quickbooks', icon: RefreshCcw },
];

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Create New', href: '/admin/dashboard/create-new', icon: FolderPlus },
  { name: 'Users & Roles', href: '/admin/dashboard/users', icon: Users },
  { name: 'Expense', href: '/admin/dashboard/expenses', icon: Receipt },
  { name: 'Sales', href: '/admin/dashboard/sales', icon: BarChart4 },
  { name: 'Commission', href: '/admin/dashboard/commissions', icon: Percent },
  { name: 'Vendor Payment', href: '/admin/dashboard/vendor-payments', icon: Wallet },
  { name: 'Inventory', href: '/admin/dashboard/inventory', icon: Package },
  { name: 'Purchase Orders (PO)', href: '/admin/dashboard/purchase-orders', icon: ShoppingCart },
  { name: 'Shipments', href: '/admin/dashboard/shipments', icon: Truck },
  { name: 'Driver Payments', href: '/admin/dashboard/driver-earnings', icon: Wallet },
  { name: 'Physicians & Surgeries', href: '/admin/dashboard/physicians', icon: Stethoscope },
  { name: 'Notifications', href: '/admin/dashboard/notifications', icon: Bell },
  { name: 'Support / Help', href: '/admin/dashboard/support', icon: HelpCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B101E] border-r border-[#1E293B] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 h-screen",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <Image
                src="/logo.png"
                alt="H.O.L.E APP Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-wide">H.O.L.E APP</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-white lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 gap-6 scrollbar-thin scrollbar-thumb-[#1E293B]">
          <NavSection title="MAIN" items={mainNavItems} pathname={pathname} />

          {pathname.startsWith('/admin') ? (
            <NavSection title="ADMIN" items={adminNavItems} pathname={pathname} />
          ) : (
            <>
              <NavSection title="FINANCE" items={financeNavItems} pathname={pathname} />
              <NavSection title="ANALYTICS" items={analyticsNavItems} pathname={pathname} />
              <NavSection title="INTEGRATIONS" items={integrationsNavItems} pathname={pathname} />
            </>
          )}

          <div className="mt-auto pt-6">
            <NavSection title="SYSTEM" items={[{ name: 'Settings', href: '/settings', icon: Settings }]} pathname={pathname} />
          </div>
        </div>
      </aside>
    </>
  );
}

function NavSection({
  title,
  items,
  pathname
}: {
  title: string,
  items: any[],
  pathname: string
}) {
  return (
    <div>
      <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[#475569]">
        {title}
      </h3>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#00E5FF]/10 text-[#00E5FF]"
                  : "text-gray-400 hover:bg-[#1E293B]/50 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive ? "text-[#00E5FF]" : "text-gray-500 group-hover:text-gray-300"
                  )}
                />
                <span className="text-[13px]">{item.name}</span>
              </div>
              {item.badge && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
