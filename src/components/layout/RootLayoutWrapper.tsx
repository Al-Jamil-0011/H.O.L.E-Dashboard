"use client";

import { usePathname } from 'next/navigation';
import { DashboardLayout } from './DashboardLayout';

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if the current route is an auth route
  const isAuthRoute = pathname?.startsWith('/auth');

  // If it's an auth route, don't show the dashboard layout
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Otherwise, wrap with the dashboard layout
  return <DashboardLayout>{children}</DashboardLayout>;
}
