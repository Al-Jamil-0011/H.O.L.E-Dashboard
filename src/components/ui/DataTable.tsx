"use client";

import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, className, onRowClick }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl bg-card", className)}>
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#151B2B]">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "px-6 py-4 font-semibold text-gray-500 uppercase tracking-widest text-[10px] border-b border-[#1E293B]",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E293B]">
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "hover:bg-white/[0.02] transition-colors duration-150 ease-in-out",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={cn("px-6 py-4 text-gray-300 font-medium text-xs", col.className)}
                >
                  {col.render
                    ? col.render(item)
                    : col.accessorKey
                      ? String(item[col.accessorKey] || "")
                      : null
                  }
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status, type = "default" }: {
  status: string,
  type?: "success" | "warning" | "error" | "default"
}) {
  const styles = {
    success: "bg-[#00E5FF]/10 text-[#00E5FF] px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    warning: "bg-amber-500/10 text-amber-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    error: "bg-rose-500/10 text-rose-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
    default: "bg-blue-500/10 text-blue-500 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md"
  };

  return (
    <span className={cn(styles[type])}>
      {status}
    </span>
  );
}
