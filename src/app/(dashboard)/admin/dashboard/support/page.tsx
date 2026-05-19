'use client';

import { useState, useEffect } from 'react';
import { useSupports } from "@/hooks/admin/support";
import { DataTable } from "@/components/ui/DataTable";
import {
  Search,
  MessageSquare,
  Users,
  Clock,
  X,
  Mail,
  Calendar,
  User as UserIcon,
  Tag
} from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ISupport } from "@/hooks/admin/support/interface";
import { SupportStatCard } from '@/components/stats-card';

dayjs.extend(relativeTime);

export default function SupportPage() {
  const { supports, meta, loading, setQuery } = useSupports();
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
            <span className="text-[10px] text-muted-foreground">{item.user.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "SUBJECT",
      render: (item: ISupport) => (
        <div className="flex flex-col max-w-[250px]">
          <span className="font-semibold text-foreground truncate">{item.subject}</span>
          <span className="text-[11px] text-muted-foreground truncate italic">{`"${item.message.substring(0, 50)}..."`}</span>
        </div>
      )
    },
    {
      header: "DATE",
      render: (item: ISupport) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{dayjs(item.createdAt).format('MMM DD, YYYY')}</span>
          <span className="text-[10px] text-muted-foreground">{dayjs(item.createdAt).fromNow()}</span>
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
          className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all cursor-pointer group"
        >
          View Details
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

      <div>
        <h1 className="title mb-1">
          Support Center
        </h1>
        <p className="text-xs text-muted-foreground font-medium">
          Manage and respond to user inquiries and feedback
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SupportStatCard
          title="Total Inquiries"
          value={totalMessages}
          icon={<MessageSquare className="h-5 w-5" />}
          color="primary"
          loading={loading}
        />
        <SupportStatCard
          title="Recent (24h)"
          value={newMessagesToday}
          icon={<Clock className="h-5 w-5" />}
          color="emerald"
        />
        <SupportStatCard
          title="Unique Users"
          value={uniqueUsers}
          icon={<Users className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-muted rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex flex-col md:flex-row lg:items-center gap-2 justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h2 className="text-xs font-medium text-foreground">Active Inquiries</h2>
              <span className="text-[10px] font-bold bg-primary/10 text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
                {meta?.totalResult || 0} TOTAL
              </span>
            </div>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search users by name..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md py-2 pl-9 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)] transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

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

function SupportDetailModal({ support, onClose }: { support: ISupport, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl dark:shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground leading-none mb-1">Inquiry Details</h3>
              <p className="text-[10px] text-muted-foreground font-bold tracking-wider">Reference ID: {support._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-5 rounded-2xl border border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  {support.user.profileUrl ? (
                    <Image src={support.user.profileUrl} alt={support.user.fullName} width={48} height={48} className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                      {support.user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-medium text-primary">Submitted By</p>
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
                  <p className="text-[10px] font-medium text-muted-foreground">Date Created</p>
                  <p className="text-sm font-bold text-foreground">{dayjs(support.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">Subject Area</p>
                  <p className="text-sm font-bold text-foreground">{support.subject}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <h4 className="text-[10px] font-medium text-muted-foreground">Message Content</h4>
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
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/10">
              <p className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <UserIcon className="h-3 w-3" /> Designation
              </p>
              <p className="text-xs font-bold text-foreground">{support.user.designation || "Not Specified"}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/10">
              <p className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-2">
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
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-background font-medium text-xs rounded-xl cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

