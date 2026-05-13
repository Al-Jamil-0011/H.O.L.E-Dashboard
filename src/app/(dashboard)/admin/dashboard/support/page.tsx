'use client';

import { useState, useEffect } from 'react';
import { useSupports } from "@/hooks/admin/support";
import { DataTable } from "@/components/ui/DataTable";
import {
  Search,
  MessageSquare,
  Users,
  Clock,
  Eye,
  X,
  Mail,
  Calendar,
  User as UserIcon,
  Tag
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ISupport } from "@/hooks/admin/support/interface";

dayjs.extend(relativeTime);

export default function SupportPage() {
  const { supports, meta, loading, query, setQuery } = useSupports();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupport, setSelectedSupport] = useState<ISupport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery((prev) => ({ ...prev, searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setQuery]);

  const handleViewDetails = (support: ISupport) => {
    setSelectedSupport(support);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: "USER",
      render: (item: ISupport) => (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-border bg-muted flex-shrink-0">
            {item.user.profileUrl ? (
              <Image
                src={item.user.profileUrl}
                alt={item.user.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                {item.user.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground truncate">{item.user.fullName}</span>
            <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">{item.user.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "SUBJECT",
      render: (item: ISupport) => (
        <div className="flex flex-col max-w-[250px]">
          <span className="font-semibold text-foreground truncate">{item.subject}</span>
          <span className="text-[11px] text-muted-foreground truncate italic">"{item.message.substring(0, 50)}..."</span>
        </div>
      )
    },
    {
      header: "DATE",
      render: (item: ISupport) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{dayjs(item.createdAt).format('MMM DD, YYYY')}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{dayjs(item.createdAt).fromNow()}</span>
        </div>
      )
    },
    {
      header: "ACTIONS",
      render: (item: ISupport) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(item);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all cursor-pointer group"
        >
          <Eye className="h-3 w-3 transition-transform group-hover:scale-110" />
          VIEW DETAILS
        </button>
      )
    }
  ];

  // Stats calculation
  const totalMessages = meta?.totalResult || 0;
  const uniqueUsers = Array.from(new Set(supports.map(s => s.user._id))).length;
  const newMessagesToday = supports.filter(s => dayjs(s.createdAt).isAfter(dayjs().subtract(24, 'hour'))).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700  pb-20">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-1">
            Support <span className="text-primary">Center</span>
          </h1>
          <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            Manage and respond to user inquiries and feedback
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by subject or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Inquiries"
          value={totalMessages}
          icon={<MessageSquare className="h-5 w-5" />}
          color="primary"
        />
        <StatCard
          title="Recent (24h)"
          value={newMessagesToday}
          icon={<Clock className="h-5 w-5" />}
          color="emerald"
        />
        <StatCard
          title="Unique Users"
          value={uniqueUsers}
          icon={<Users className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Active Inquiries</h2>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
            {meta?.totalResult || 0} TOTAL
          </span>
        </div>

        <DataTable
          data={supports}
          columns={columns as any}
          loading={loading}
          onRowClick={handleViewDetails}
          className="border-0 rounded-none"
          pagination={meta ? {
            currentPage: meta.currentPage,
            totalPage: meta.totalPage,
            totalResult: meta.totalResult,
            onPageChange: (page) => setQuery(prev => ({ ...prev, page }))
          } : undefined}
        />
      </div>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedSupport && (
        <SupportDetailModal
          support={selectedSupport}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string,
  value: number | string,
  icon: React.ReactNode,
  color: "primary" | "emerald" | "purple"
}) {
  const colors = {
    primary: "text-primary bg-primary/10 border-primary/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  };

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-6 hover:bg-muted/10 transition-all group">
      <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 opacity-20",
        color === "primary" ? "bg-primary" : color === "emerald" ? "bg-emerald-500" : "bg-purple-500"
      )} />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-black text-foreground">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-xl border transition-transform", colors[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function SupportDetailModal({ support, onClose }: { support: ISupport, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground leading-none mb-1">Inquiry Details</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Reference ID: {support._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-5 rounded-2xl border border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  {support.user.profileUrl ? (
                    <Image src={support.user.profileUrl} alt={support.user.fullName} width={48} height={48} className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-black">
                      {support.user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">Submitted By</p>
                  <p className="text-base font-bold text-foreground">{support.user.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{support.user.email}</span>
              </div>
            </div>

            <div className="space-y-4 md:border-l md:border-border md:pl-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">Date Created</p>
                  <p className="text-sm font-bold text-foreground">{dayjs(support.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">Subject Area</p>
                  <p className="text-sm font-bold text-foreground">{support.subject}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Message Content</h4>
            </div>
            <div className="p-6 bg-card border border-border rounded-2xl relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <MessageSquare className="h-20 w-20" />
              </div>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-medium">
                {support.message}
              </p>
            </div>
          </div>

          {/* User Additional Info */}
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/10">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                <UserIcon className="h-3 w-3" /> Designation
              </p>
              <p className="text-xs font-bold text-foreground">{support.user.designation || "Not Specified"}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/10">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                <Tag className="h-3 w-3" /> Role / Territory
              </p>
              <p className="text-xs font-bold text-foreground">{support.user.role} {support.user.territory ? `(${support.user.territory})` : ""}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-background font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

