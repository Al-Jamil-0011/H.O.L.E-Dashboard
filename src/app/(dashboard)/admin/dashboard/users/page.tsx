"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn, customToast } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import {
  Search,
  Filter,
  UserPlus,
  X,
  MapPin,
  ShieldAlert,
  Mail,
  Phone,
  Calendar,
  Edit2,
  AlertTriangle,
  Users,
  Check
} from 'lucide-react';
import { useUsers, useUserSummary, useChangeUserStatus } from '@/hooks/admin/users';
import { IUser } from '@/hooks/admin/users/interface';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';
import { VerifyBadge } from '@/components/verify-bedge';
import { UserStatCard } from '@/components/stats-card';
import { IDetailRowProps } from '@/components/stats-card/interface';

const getInitials = (name: string) => {
  if (!name) return 'NA';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

export default function UsersManagementPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [territoryFilter, setTerritoryFilter] = useState('All');

  const { users: allUsers, loading: usersLoading, refetch, setQuery, meta } = useUsers();
  const { summary, loading: statLoading, refetch: summaryRefetch } = useUserSummary();
  const { changeUserStatus, loading: changingStatus } = useChangeUserStatus();

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isTerritoryModalOpen, setIsTerritoryModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isRepModalOpen, setIsRepModalOpen] = useState(false);
  const [selectedRepIds, setSelectedRepIds] = useState<string[]>([]);
  const [repSearch, setRepSearch] = useState('');

  // Sync local search and role to the useUsers query hook
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery((prev) => {
        const newRole = roleFilter === 'All' ? "" : roleFilter.toLowerCase();
        const newStatus = statusFilter === 'All' ? "" : statusFilter.toLowerCase();
        const newTerritory = territoryFilter === 'All' ? "" : territoryFilter;

        if (
          prev.searchTerm === search &&
          prev.role === newRole &&
          prev.status === newStatus &&
          prev.territory === newTerritory
        ) {
          return prev;
        }

        return {
          ...prev,
          page: 1,
          searchTerm: search,
          role: newRole,
          status: newStatus,
          territory: newTerritory,
        };
      });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, roleFilter, statusFilter, territoryFilter, setQuery]);

  const handleToggleStatus = (user: IUser, currentStatus: string) => {
    setSelectedUser(user);
    setIsDetailsDrawerOpen(false);
    if (currentStatus === 'active') {
      setIsDeactivateModalOpen(true);
    } else {
      updateUserStatus('active', user._id);
    }
  };

  const updateUserStatus = async (newStatus: "active" | "inactive" | "blocked", userId: string) => {
    const success = await changeUserStatus(userId, newStatus);

    if (success) {
      refetch();
      summaryRefetch();
      customToast.success(success?.message || 'User status updated successfully');
      if (selectedUser?._id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } else {
      customToast.error('User status updated failed');
    }
    setIsDeactivateModalOpen(false);
  };

  const columns = [
    {
      header: "USER",
      render: (item: IUser) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-[var(--border)] relative bg-primary/10 flex items-center justify-center">
            {item.profileUrl ? (
              <Image
                src={item.profileUrl}
                alt={item.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-xs ">
                {getInitials(item.fullName)}
              </span>
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground">{item.fullName}</div>
            <div className="text-[10px] text-muted-foreground">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      header: "PHONE",
      render: (item: IUser) => (
        <span className="text-muted-foreground">{item.phoneNumber || 'N/A'}</span>
      )
    },
    {
      header: "ROLE",
      render: (item: IUser) => (
        <span className={cn(
          "px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md",
          item.role === 'driver'
            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
            : item.role === 'manager'
              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              : item.role === 'admin'
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20"
        )}>
          {item.role}
        </span>
      )
    },
    {
      header: "TERRITORY",
      render: (item: IUser) => (
        <span className="font-medium text-muted-foreground">
          {item.territory || 'N/A'}
        </span>
      )
    },
    {
      header: "STATUS",
      render: (item: IUser) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(item, item.status); }}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none",
              item.status === 'active' ? "bg-[#00E5FF]" : "bg-gray-600"
            )}
            title={`Click to ${item.status === 'active' ? 'deactivate' : 'activate'}`}
            disabled={changingStatus}
          >
            <span className={cn(
              "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
              item.status === 'active' ? "translate-x-2" : "-translate-x-2"
            )} />
          </button>
          <span className={cn("text-xs font-medium capitalize", item.status === 'active' ? "text-gray-300" : "text-gray-500")}>
            {item.status}
          </span>
        </div>
      )
    },
    {
      header: "ACTIONS",
      render: (item: IUser) => (
        <div className="flex items-center gap-2">
          {
            item?.role === "driver" ? (
              <Link href={`/admin/dashboard/users/${item._id}`} onClick={(e) => e.stopPropagation()}>
                <button className="px-3 py-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors cursor-pointer flex items-center gap-1">
                  <FaEye /> Details
                </button>
              </Link>
            ) : <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(item);
                setIsDetailsDrawerOpen(true);
              }}
              className="px-3 py-1.5 text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors cursor-pointer flex items-center gap-1">
              <FaEye /> Details
            </button>
          }
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title mb-1">
            User & Role Management
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium ">
            Manage registered users, roles, territories, and account status
          </p>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UserStatCard
          title="TOTAL USERS"
          value={summary?.totalUsers}
          loading={statLoading}
          topBorderColor="border-t-[var(--primary)]"
        />

        <UserStatCard
          title="ACTIVE USERS"
          value={summary?.activeUsers}
          loading={statLoading}
          topBorderColor="border-t-emerald-500"
        />

        <UserStatCard
          title="INACTIVE USERS"
          value={summary?.inactiveUsers}
          loading={statLoading}
          topBorderColor="border-t-red-500"
        />

        <UserStatCard
          title="THIS MONTH USERS"
          value={summary?.thisMonthUsers}
          trendColor="text-amber-500"
          loading={statLoading}
          topBorderColor="border-t-amber-500"
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-gray-200 dark:border-[#1E293B] dark:bg-[#151B2B] dark:shadow-lg flex flex-col overflow-hidden">
        {/* FILTER BAR */}
        <div className="flex flex-col gap-4 bg-muted/40">

          <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/40">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md py-2 pl-9 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)]  transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-semibold ">Filters</span>
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-background border border-border rounded-md py-1.5 px-3 text-xs font-medium text-foreground appearance-none focus:outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option className="cursor-pointer" value="All">All Roles</option>
                <option className="cursor-pointer" value="Representative">Representative</option>
                <option className="cursor-pointer" value="Manager">Manager</option>
                <option className="cursor-pointer" value="Admin">Admin</option>
                <option className="cursor-pointer" value="Driver">Driver</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-background border border-border rounded-md py-1.5 px-3 text-xs font-medium text-foreground appearance-none focus:outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option className="cursor-pointer!" value="All">All Status</option>
                <option className="cursor-pointer" value="Active">Active</option>
                <option className="cursor-pointer" value="Inactive">Inactive</option>
              </select>

              <select
                value={territoryFilter}
                onChange={e => setTerritoryFilter(e.target.value)}
                className="bg-background border border-border rounded-md py-1.5 px-3 text-xs font-medium text-foreground appearance-none focus:outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option className="cursor-pointer" value="All">All Territories</option>
                <option className="cursor-pointer" value="Northeast">Northeast</option>
                <option className="cursor-pointer" value="West Coast">West Coast</option>
                <option className="cursor-pointer" value="South">South</option>
                <option className="cursor-pointer" value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="p-0">
            <DataTable
              data={allUsers}
              columns={columns}
              loading={usersLoading}
              className='border-none dark:border dark:border-border'
              onRowClick={() => { }}
              pagination={meta ? {
                currentPage: meta.currentPage,
                totalPage: meta.totalPage,
                totalResult: meta.totalResult,
                onPageChange: (page) => setQuery(prev => ({ ...prev, page }))
              } : undefined}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE DRAWER */}
      {selectedUser && isDetailsDrawerOpen && (
        <div className="relative z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => { setSelectedUser(null); setIsDetailsDrawerOpen(false); }}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--background)] border-l border-[var(--border)] dark:shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">User Profile Details</h2>
              <button
                onClick={() => { setSelectedUser(null); setIsDetailsDrawerOpen(false); }}
                className="p-1.5 rounded-md hover:bg-[var(--border)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body scrollable */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[var(--border)]">
              {/* Profile Top */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full relative border-2 border-[var(--border)] overflow-hidden bg-primary/10 flex items-center justify-center">
                  {selectedUser.profileUrl ? (
                    <Image src={selectedUser.profileUrl} alt="" fill className="object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-2xl ">
                      {getInitials(selectedUser.fullName)}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-black tracking-tight text-foreground">{selectedUser.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary font-semibold text-sm capitalize">{selectedUser.role}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                    <StatusBadge status={selectedUser.status} type={selectedUser.status === 'active' ? 'success' : 'default'} />
                    <VerifyBadge isVerified={selectedUser.isVerified} showLabel size='sm' />
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="space-y-4 mb-8 border border-border bg-card rounded-xl p-4">
                <DetailRow
                  icon={<Mail size={14} />}
                  label="Email Address"
                  value={selectedUser.email}
                />
                <DetailRow
                  icon={<Phone size={14} />}
                  label="Phone Number"
                  value={selectedUser.phoneNumber || 'N/A'}
                />
                <DetailRow
                  icon={<Calendar size={14} />}
                  label="Registration Date"
                  value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                />
                <DetailRow
                  icon={<MapPin size={14} />}
                  label="Territory"
                  value={selectedUser.territory || 'Pending'}
                  highlight={!selectedUser.territory}
                />
              </div>

              {/* Account Actions Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Account Actions</h4>

                <button
                  onClick={() => setIsTerritoryModalOpen(true)}
                  className="w-full flex items-center cursor-pointer! justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Assign / Update Territory</span>
                  </div>
                  <Edit2 className="h-3 w-3 text-muted-foreground" />
                </button>

                {selectedUser.role === 'manager' && (
                  <button
                    onClick={() => {
                      setRepSearch('');
                      setSelectedRepIds([]);
                      setIsRepModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Add Representative</span>
                    </div>
                    <UserPlus className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}

                <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" />
                    <div className="text-sm font-medium capitalize">Account Status ({selectedUser.status})</div>
                  </div>
                  <button
                    onClick={() => { if (selectedUser) handleToggleStatus(selectedUser, selectedUser.status); }}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                      selectedUser.status === 'active' ? "bg-emerald-500" : "bg-gray-500"
                    )}
                    disabled={changingStatus}
                  >
                    <span className={cn(
                      "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
                      selectedUser.status === 'active' ? "translate-x-2" : "-translate-x-2"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-border bg-card mt-auto">
              <button
                onClick={() => { setSelectedUser(null); setIsDetailsDrawerOpen(false); }}
                className="w-full cursor-pointer py-2.5 text-sm font-medium text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERRITORY ASSIGNMENT MODAL */}
      {isTerritoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTerritoryModalOpen(false)} />
          <div className="relative bg-[var(--background)] w-full max-w-sm rounded-xl border border-[var(--border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-bold text-foreground">Assign Territory</h3>
              <button onClick={() => setIsTerritoryModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 ">Territory / Region</label>
                <select className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] cursor-pointer transition-colors">
                  <option className="cursor-pointer">Select Territory...</option>
                  <option className="cursor-pointer" value="Northeast">Northeast</option>
                  <option className="cursor-pointer" value="West Coast">West Coast</option>
                  <option className="cursor-pointer" value="South">South</option>
                  <option className="cursor-pointer" value="Midwest">Midwest</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-[var(--card)] border-t border-[var(--border)] flex justify-end gap-3">
              <button onClick={() => setIsTerritoryModalOpen(false)} className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsTerritoryModalOpen(false);
                }}
                className="px-5 py-2 text-xs font-medium text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEACTIVATION WARNING MODAL */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeactivateModalOpen(false)} />
          <div className="relative bg-[var(--background)] w-full max-w-sm rounded-xl border border-rose-500/50 shadow-2xl shadow-rose-900/20 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Deactivate Account?</h3>
              <p className="text-sm text-muted-foreground">
                If you deactivate this user, they will no longer appear in future dropdown selections and reports. Are you sure?
              </p>
            </div>
            <div className="p-4 bg-card border-t border-border flex gap-3">
              <button
                onClick={() => setIsDeactivateModalOpen(false)}
                className="flex-1 py-2 text-xs font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                disabled={changingStatus}
              >
                Cancel
              </button>
              <button
                onClick={() => selectedUser && updateUserStatus('inactive', selectedUser._id)}
                className="flex-1 py-2 text-xs font-medium text-white bg-rose-500 rounded-lg shadow-sm transition-all hover:bg-rose-600 disabled:opacity-50 cursor-pointer"
                disabled={changingStatus}
              >
                {changingStatus ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPRESENTATIVE ASSIGNMENT MODAL */}
      {isRepModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsRepModalOpen(false)} />
          <div className="relative bg-[var(--background)] w-full max-w-md rounded-xl border border-[var(--border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[var(--border)] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-foreground">Add Representative</h3>
                <p className="text-[10px] text-muted-foreground  font-semibold mt-0.5">
                  Assign representatives to {selectedUser?.fullName}
                </p>
              </div>
              <button onClick={() => setIsRepModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--primary)]  transition-colors"
                  value={repSearch}
                  onChange={(e) => setRepSearch(e.target.value)}
                />
              </div>

              {/* Rep List */}
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-[var(--border)]">
                {allUsers
                  .filter(u =>
                    u.role === 'representative' &&
                    (u.fullName.toLowerCase().includes(repSearch.toLowerCase()) || u.email.toLowerCase().includes(repSearch.toLowerCase()))
                  )
                  .map(rep => {
                    const isSelected = selectedRepIds.includes(rep._id);
                    return (
                      <div
                        key={rep._id}
                        onClick={() => {
                          setSelectedRepIds(prev =>
                            prev.includes(rep._id) ? prev.filter(id => id !== rep._id) : [...prev, rep._id]
                          );
                        }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "bg-primary/10 border-primary"
                            : "bg-[var(--card)] border-[var(--border)] hover:border-gray-500"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className='h-8 w-8 relative rounded-full overflow-hidden border border-[var(--border)] bg-primary/10 flex items-center justify-center'>
                            {rep.profileUrl ? (
                              <Image src={rep.profileUrl} alt="" fill className="object-cover" />
                            ) : (
                              <span className="text-primary font-bold text-xs ">
                                {getInitials(rep.fullName)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{rep.fullName}</div>
                            <div className="text-[10px] text-muted-foreground">{rep.email}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary border-primary" : "border-[var(--border)]"
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-background" />}
                        </div>
                      </div>
                    );
                  })}
                {allUsers.filter(u => u.role === 'representative' && (u.fullName.toLowerCase().includes(repSearch.toLowerCase()) || u.email.toLowerCase().includes(repSearch.toLowerCase()))).length === 0 && (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No representatives found matching your search.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-[var(--card)] border-t border-[var(--border)] flex justify-end gap-3">
              <button onClick={() => setIsRepModalOpen(false)} className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsRepModalOpen(false);
                }}
                className="px-5 py-2 text-xs font-medium text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedRepIds.length === 0}
              >
                Confirm Assignment ({selectedRepIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  )
}



function DetailRow({ icon, label, value, highlight }: IDetailRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-6 flex justify-center text-[var(--border)]">
          {icon}
        </div>
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-medium",
        highlight ? "text-amber-500" : "text-foreground"
      )}>
        {value}
      </span>
    </div>
  );
}
