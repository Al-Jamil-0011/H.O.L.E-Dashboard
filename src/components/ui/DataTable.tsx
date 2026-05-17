"use client";

import { cn } from "@/lib/utils";
import React from "react";
import ResponsivePagination from 'react-responsive-pagination';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  pagination?: {
    currentPage: number;
    totalPage: number;
    totalResult: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyText = "No data available",
  className,
  onRowClick,
  pagination,
}: DataTableProps<T>) {

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-border bg-card",
        className
      )}
    >
      <table className="w-full text-left text-sm whitespace-nowrap">

        {/* HEADER */}
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold border-b border-border",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-border">

          {/* LOADING */}
          {loading &&
            Array.from({ length: 8 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="animate-pulse border-b border-border">
                {columns.map((_, colIndex) => (
                  <td key={`skeleton-col-${colIndex}`} className="px-4 py-4">
                    <div className={cn("h-4 bg-muted rounded", colIndex === 0 ? "w-3/4 max-w-[200px]" : "w-1/2 max-w-[100px]")}></div>
                  </td>
                ))}
              </tr>
            ))}

          {/* DATA */}
          {!loading &&
            data?.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-muted/50"
                )}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-4 py-3 text-foreground text-xs font-medium",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(item)
                      : col.accessorKey
                        ? String(item[col.accessorKey] ?? "-")
                        : "-"}
                  </td>
                ))}
              </tr>
            ))}

          {/* EMPTY STATE */}
          {!loading && data?.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-muted-foreground text-sm"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION SECTION */}
      {pagination && pagination.totalPage > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Showing <span className="text-foreground font-black">{data?.length || 0}</span> of <span className="text-foreground font-black">{pagination.totalResult}</span> Results
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs font-medium">Previous</span>
              </button>

              <div className="custom-pagination">
                <ResponsivePagination
                  current={pagination.currentPage}
                  total={pagination.totalPage}
                  onPageChange={pagination.onPageChange}
                  maxWidth={400}
                />
              </div>

              <button
                disabled={pagination.currentPage === pagination.totalPage}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                <span className="text-xs font-medium">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function StatusBadge({ status, type = "default" }: {
  status: string,
  type?: "success" | "accepted" | "pending" | "rejected" | "picked_up" | "delivered" | "warning" | "error" | "default" | "inventory"
}) {
  const styles = {
    success: "bg-primary/10 text-primary px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    warning: "bg-amber-500/10 text-amber-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    error: "bg-rose-500/10 text-rose-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    accepted: "bg-green-500/10 text-green-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    pending: "bg-yellow-500/10 text-yellow-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    rejected: "bg-red-500/10 text-red-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    picked_up: "bg-blue-500/10 text-blue-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    delivered: "bg-green-500/10 text-green-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    default: "bg-blue-500/10 text-blue-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    inventory: "bg-purple-500/10 text-purple-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md"
  };

  return (
    <span className={cn(styles[type])}>
      {status?.split("_")[0]}
    </span>
  );
}
