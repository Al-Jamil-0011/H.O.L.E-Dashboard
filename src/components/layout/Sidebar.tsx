"use client";
import { MdOutlineLogout } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, customToast } from '@/lib/utils';
import { useState } from 'react';
import {
  LayoutDashboard,
  BarChart4,
  FileText,
  Wallet,
  Percent,
  Receipt,
  Truck,
  Clock,
  Users,
  RefreshCcw,
  Settings,
  Package,
  ShoppingCart,
  Stethoscope,
  Bell,
  HelpCircle,
  X,
  FolderPlus,
  ChevronDown,
} from 'lucide-react';
import { useAuthService } from "@/hooks/auth";





const mainAdminNavItems = [
  {
    name: 'Overview',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
];

const mainFinanceNavItems = [
  {
    name: 'Overview',
    href: '/finance/dashboard',
    icon: LayoutDashboard
  },
];


const financeNavItems = [
  {
    name: 'Sales & Revenue',
    href: '/finance/dashboard/sales',
    icon: BarChart4
  },
  {
    name: 'Commission',
    href: '/finance/dashboard/commissions',
    icon: Percent
  },
  {
    name: 'Invoices',
    href: '/finance/dashboard/invoices',
    icon: FileText
  },
  // {
  //   name: 'Payments',
  //   href: '/finance/dashboard/payments',
  //   icon: CreditCard
  // },
  {
    name: 'Vendor Payments',
    href: '/finance/dashboard/vendor-payments',
    icon: Wallet
  },

  {
    name: 'Expenses',
    href: '/finance/dashboard/expenses',
    icon: Receipt
  },
  {
    name: 'Shipping Costs',
    href: '/finance/dashboard/shipping',
    icon: Truck
  },
];

const analyticsNavItems = [
  {
    name: 'Aging Report',
    href: '/finance/dashboard/aging-reports',
    icon: Clock
  },
  // {
  //   name: 'Financial Reports',
  //   href: '/finance/dashboard/reports',
  //   icon: PieChart
  // },
  {
    name: 'Rep Accounts',
    href: '/finance/dashboard/rep-accounts',
    icon: Users
  },
];

const integrationsNavItems = [
  {
    name: 'QuickBooks',
    href: '/finance/dashboard/quickbooks',
    icon: RefreshCcw
  },
];

const adminNavItems = [
  {
    name: 'Create New',
    href: '/admin/dashboard/create-new',
    icon: FolderPlus
  },
  {
    name: 'Users & Roles',
    href: '/admin/dashboard/users',
    icon: Users
  },
  {
    name: 'Expense',
    href: '/admin/dashboard/expenses',
    icon: Receipt
  },
  {
    name: 'Sales',
    href: '/admin/dashboard/sales',
    icon: BarChart4
  },
  {
    name: 'Commission',
    href: '/admin/dashboard/commissions',
    icon: Percent
  },
  {
    name: 'Vendor Payment',
    href: '/admin/dashboard/vendor-payments',
    icon: Wallet
  },
  {
    name: 'Inventory',
    href: '/admin/dashboard/inventory',
    icon: Package
  },
  {
    name: 'Purchase Orders (PO)',
    href: '/admin/dashboard/purchase-orders',
    icon: ShoppingCart
  },
  {
    name: 'Shipments',
    href: '/admin/dashboard/shipments',
    icon: Truck
  },
  {
    name: 'Driver Payments',
    href: '/admin/dashboard/driver-earnings',
    icon: Wallet
  },
  {
    name: 'Physicians & Surgeries',
    href: '/admin/dashboard/physicians',
    icon: Stethoscope
  },
  {
    name: 'Notifications',
    href: '/admin/dashboard/notifications',
    icon: Bell
  },
  {
    name: 'Support / Help',
    href: '/admin/dashboard/support',
    icon: HelpCircle
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logoutUser } = useAuthService();

  const handleLogout = async () => {
    await logoutUser()
    customToast.success("Logout Successfully");
  };

  const systemAdminNavItems = [
    {
      name: 'Settings',
      icon: Settings,
      subItems: [
        {
          name: 'View Profile',
          href: '/admin/settings/view-profile'
        },
        {
          name: 'About Us',
          href: '/admin/settings/about-us'
        },
        {
          name: 'Privacy Policy',
          href: '/admin/settings/privacy-policy'
        },
        {
          name: 'Terms and Service',
          href: '/admin/settings/terms-of-service'
        },
      ]
    }
  ];
  const systemFinanceNavItems = [
    {
      name: 'Settings',
      icon: Settings,
      subItems: [
        {
          name: 'View Profile',
          href: '/finance/settings/view-profile'
        },
        {
          name: 'About Us',
          href: '/finance/settings/about-us'
        },
        {
          name: 'Privacy Policy',
          href: '/finance/settings/privacy-policy'
        },
        {
          name: 'Terms and Service',
          href: '/finance/settings/terms-of-service'
        },
      ]
    }
  ];

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
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 h-screen",
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
              <span className="text-base font-bold text-foreground tracking-wide">H.O.L.E APP</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 gap-6 scrollbar-thin scrollbar-thumb-border">



          {pathname.startsWith('/admin') ? (
            <NavSection title="MAIN" items={mainAdminNavItems} pathname={pathname} />
          ) : (
            <NavSection title="MAIN" items={mainFinanceNavItems} pathname={pathname} />
          )}

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
            {pathname.startsWith('/admin') ? (
              <NavSection title="SYSTEM" items={systemAdminNavItems} pathname={pathname} />
            ) : (
              <NavSection title="SYSTEM" items={systemFinanceNavItems} pathname={pathname} />
            )}

            <button
              onClick={handleLogout}
              className='flex items-center gap-3 w-full px-2 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer'
            >
              <MdOutlineLogout />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({ item, pathname }: { item: any; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.href ? pathname === item.href : (item.subItems && item.subItems.some((sub: any) => pathname === sub.href));
  const hasSubItems = !!item.subItems;

  if (hasSubItems) {
    return (
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors cursor-pointer",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon
              className={cn(
                "h-[18px] w-[18px] shrink-0",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span className="text-[13px]">{item.name}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
        </button>
        {isOpen && (
          <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-border pl-2">
            {item.subItems.map((sub: any) => (
              <Link
                key={sub.name}
                href={sub.href}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  pathname === sub.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors",
        pathname === item.href
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <item.icon
          className={cn(
            "h-[18px] w-[18px] shrink-0",
            pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
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
        {items.map((item) => (
          <NavItem key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>
    </div>
  );
}

