import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardGroupedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
