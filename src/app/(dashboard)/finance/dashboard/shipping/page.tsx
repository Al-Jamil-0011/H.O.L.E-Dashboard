"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DataTable, StatusBadge } from "@/components/ui/DataTable";
import {
  useShippingCosts,
  useShippingCostSummary,
} from "@/hooks/finance/shipping-cost";

import { IShippingCost } from "@/hooks/finance/shipping-cost/interface";
import { Package, Truck } from "lucide-react";
import { CommonFilterPill, ShippingStatCard } from "@/components/stats-card";

export default function ShippingPage() {
  const [filter, setFilter] = useState("all");

  const { summary, loading: isLoading } = useShippingCostSummary();

  const { shippingCosts, loading, meta, query, setQuery } = useShippingCosts();

  const handleFilterChange = (type: string) => {
    setFilter(type);
    setQuery({
      ...query,
      type: type === "all" ? "" : type,
      page: 1,
    });
  };

  const columns = [
    {
      header: "SHIPMENT ID",
      render: (item: IShippingCost) => (
        <span className="font-medium text-foreground">
          {item.shipmentId || "N/A"}
        </span>
      ),
    },
    // {
    //   header: "CARRIER",
    //   render: (item: IShippingCost) => (
    //     <span className="uppercase">{item.shippingCost?.type || "N/A"}</span>
    //   )
    // },
    {
      header: "CARRIER",
      render: (item: IShippingCost) => (
        <div className="flex items-center gap-2">
          {item.shippingCost?.type === "courier" ? (
            <Truck className="h-4 w-4 text-blue-400" />
          ) : (
            <Package className="h-4 w-4 text-amber-500" />
          )}
          <span
            className={cn(
              "text-xs font-bold capitalize",
              item.shippingCost?.type === "courier"
                ? "text-blue-400"
                : "text-amber-500",
            )}
          >
            {item.shippingCost?.type || "Courier"}
          </span>
        </div>
      ),
    },
    {
      header: "REP",
      render: (item: IShippingCost) => (
        <div className="flex flex-col gap-1">
          {item.createdBy?.fullName || "N/A"}
          <p className="text-[11px] text-muted-foreground font-medium">
            {item.createdBy?.email || "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: "COST",
      render: (item: IShippingCost) => (
        <span className="text-primary font-medium">
          ${item.shippingCost?.totalCost?.toLocaleString() || "0"}
        </span>
      ),
    },
    {
      header: "STATUS",
      render: (item: IShippingCost) => {
        const status = item.shippingCost?.status || "PENDING";
        let type: "success" | "warning" | "error" = "warning";
        if (status === "PAID") type = "success";
        return <StatusBadge status={status} type={type} />;
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Shipping Costs
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium ">
            Track shipment and delivery expenses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground bg-[var(--card)] rounded dark:shadow-sm border border-[var(--border)] transition-colors hover:text-foreground cursor-pointer">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <ShippingStatCard
          title="TOTAL SHIPPING COSTS"
          amount={`$${summary?.totalShippingCost ?? 0}`}
          color="text-rose-500"
          topBorderColor="border-t-[3px] border-t-rose-500"
          loading={isLoading}
        />

        <ShippingStatCard
          title="PENDING PAYMENTS"
          amount={`$${summary?.totalPendingPayments ?? 0}`}
          color="text-amber-500"
          topBorderColor="border-t-[3px] border-t-amber-500"
          loading={isLoading}
        />

        <ShippingStatCard
          title="PAID PAYMENTS"
          amount={`$${summary?.totalPaidPayments ?? 0}`}
          color="text-emerald-500"
          topBorderColor="border-t-[3px] border-t-emerald-500"
          loading={isLoading}
        />

        <ShippingStatCard
          title="SHIPMENTS WITH COST"
          amount={`${summary?.totalShipmentsWithCost ?? 0}`}
          color="text-sky-500"
          topBorderColor="border-t-[3px] border-t-sky-500"
          loading={isLoading}
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] dark:shadow-sm transition-all overflow-hidden flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
          <h2 className="text-sm font-bold text-foreground">All Shipments</h2>
          <div className="flex gap-2 bg-[var(--background)] rounded-lg border border-border w-full sm:w-auto overflow-x-auto p-1">
            <CommonFilterPill
              text="All"
              active={filter === "all"}
              onClick={() => handleFilterChange("all")}
            />

            <CommonFilterPill
              text="FedEx"
              active={filter === "fedex"}
              color="bg-purple-500/20 text-purple-400"
              activeColor="bg-purple-500 text-[var(--background)]"
              onClick={() => handleFilterChange("fedex")}
            />

            <CommonFilterPill
              text="UPS"
              active={filter === "ups"}
              color="bg-amber-500/20 text-amber-500"
              activeColor="bg-amber-500 text-[var(--background)]"
              onClick={() => handleFilterChange("ups")}
            />
            <CommonFilterPill
              text="usps"
              active={filter === "usps"}
              color="bg-indigo-500/20 text-indigo-400"
              activeColor="bg-indigo-500 text-[var(--background)]"
              onClick={() => handleFilterChange("usps")}
            />
            <CommonFilterPill
              text="COURIER"
              active={filter === "courier"}
              color="bg-indigo-500/20 text-indigo-400"
              activeColor="bg-indigo-500 text-[var(--background)]"
              onClick={() => handleFilterChange("courier")}
            />
          </div>
        </div>
        <DataTable
          data={shippingCosts}
          className="border-none rounded-none"
          columns={columns}
          loading={loading}
          pagination={
            meta
              ? {
                  currentPage: meta.currentPage,
                  totalPage: meta.totalPage,
                  totalResult: meta.totalResult,
                  onPageChange: (page) => setQuery({ ...query, page }),
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
