"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import {
  Search,
  Filter,
  ChevronDown,
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

const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@invictus.com', phone: '(555) 123-4567', role: 'Rep', territory: 'Northeast', regDate: 'Jan 15, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@invictus.com', phone: '(555) 234-5678', role: 'Manager', territory: 'Northeast', regDate: 'Feb 02, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Michael Chen', email: 'michael@invictus.com', phone: '(555) 345-6789', role: 'Rep', territory: 'Pending', regDate: 'Mar 10, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Amanda Davis', email: 'amanda@invictus.com', phone: '(555) 456-7890', role: 'Finance', territory: 'All Regions', regDate: 'Nov 05, 2025', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'David Wilson', email: 'david@invictus.com', phone: '(555) 567-8901', role: 'Rep', territory: 'South', regDate: 'Dec 12, 2025', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'Jessica Taylor', email: 'jessica@invictus.com', phone: '(555) 678-9012', role: 'Rep', territory: 'West Coast', regDate: 'Apr 02, 2026', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export default function UsersManagementPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [territoryFilter, setTerritoryFilter] = useState('All');

  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isTerritoryModalOpen, setIsTerritoryModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isRepModalOpen, setIsRepModalOpen] = useState(false);
  const [selectedRepIds, setSelectedRepIds] = useState<string[]>([]);
  const [repSearch, setRepSearch] = useState('');

  // Filters logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.territory.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesTerritory = territoryFilter === 'All' || u.territory === territoryFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesTerritory;
  });

  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;
  const pendingTerritoryCount = users.filter(u => u.territory === 'Pending').length;

  const handleToggleStatus = () => {
    if (!selectedUser) return;
    if (selectedUser.status === 'Active') {
      setIsDeactivateModalOpen(true);
    } else {
      // Reactivate directly
      updateUserStatus('Active');
    }
  };

  const updateUserStatus = (newStatus: string) => {
    setUsers(users.map(u => u.id === selectedUser?.id ? { ...u, status: newStatus } : u));
    if (selectedUser) setSelectedUser({ ...selectedUser, status: newStatus });
    setIsDeactivateModalOpen(false);
  };

  const columns = [
    {
      header: "USER",
      render: (item: typeof mockUsers[0]) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[var(--border)] overflow-hidden border border-[var(--border)]">
            <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{item.name}</div>
            <div className="text-[10px] text-muted-foreground">{item.email}</div>
          </div>
        </div>
      )
    },
    { header: "PHONE", accessorKey: "phone" as const },
    {
      header: "ROLE",
      render: (item: typeof mockUsers[0]) => (
        <span className="text-accent-teal font-medium">{item.role}</span>
      )
    },
    {
      header: "TERRITORY",
      render: (item: typeof mockUsers[0]) => (
        <span className={cn(
          "font-medium",
          item.territory === 'Pending' ? "text-amber-500" : "text-muted-foreground"
        )}>
          {item.territory}
        </span>
      )
    },
    { header: "REG EXP DATE", accessorKey: "regDate" as const, className: "text-muted-foreground" },
    {
      header: "STATUS",
      render: (item: typeof mockUsers[0]) => {
        const type = item.status === 'Active' ? 'success' : 'default';
        return <StatusBadge status={item.status} type={item.status === 'Active' ? 'success' : 'default'} />;
      }
    },
    {
      header: "ACTIONS",
      render: (item: typeof mockUsers[0]) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedUser(item); }}
          className="px-3 py-1 text-[10px] font-bold text-accent-teal bg-accent-teal/10 rounded hover:bg-accent-teal/20 transition-colors"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            User & Role Management
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Manage registered users, roles, territories, and account status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-accent-teal rounded-lg shadow-sm transition-all hover:bg-cyan-400">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="TOTAL USERS" value={users.length} topBorderColor="border-t-[var(--accent-teal)]" />
        <StatCard title="ACTIVE USERS" value={activeCount} topBorderColor="border-t-emerald-500" />
        <StatCard title="INACTIVE USERS" value={inactiveCount} topBorderColor="border-t-gray-500" />
        <StatCard title="PENDING TERRITORY" value={pendingTerritoryCount} trendColor="text-amber-500" topBorderColor="border-t-amber-500" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg flex flex-col overflow-hidden">

        {/* FILTER BAR */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/40">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by name, email, territory..."
              className="w-full bg-background border border-border rounded-md py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-teal transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
            </div>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-[var(--background)] border border-[var(--border)] rounded-md py-1.5 px-3 text-xs font-medium text-foreground appearance-none focus:outline-none focus:border-[var(--accent-teal)] cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Rep">Rep</option>
              <option value="Manager">Manager</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[var(--background)] border border-[var(--border)] rounded-md py-1.5 px-3 text-xs font-medium text-foreground appearance-none focus:outline-none focus:border-[var(--accent-teal)] cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={territoryFilter}
              onChange={e => setTerritoryFilter(e.target.value)}
              className="bg-[var(--background)] border border-[var(--border)] rounded-md py-1.5 px-3 text-xs font-medium text-foreground appearance-none focus:outline-none focus:border-[var(--accent-teal)] cursor-pointer"
            >
              <option value="All">All Territories</option>
              <option value="Northeast">Northeast</option>
              <option value="West Coast">West Coast</option>
              <option value="South">South</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="p-0">
          <DataTable
            data={filteredUsers}
            columns={columns}
            onRowClick={(item) => setSelectedUser(item)}
            className="rounded-none border-0"
          />
        </div>
      </div>

      {/* RIGHT SIDE DRAWER */}
      {selectedUser && (
        <div className="relative z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedUser(null)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--background)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-foreground">User Profile Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-md hover:bg-[var(--border)] text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body scrollable */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[var(--border)]">
              {/* Profile Top */}
              <div className="flex items-center gap-4 mb-8">
                <img src={selectedUser.avatar} className="w-16 h-16 rounded-full border-2 border-[var(--border)] object-cover" alt="" />
                <div>
                  <h3 className="text-xl font-black tracking-tight text-foreground">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-accent-teal font-semibold text-sm">{selectedUser.role}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                    <StatusBadge status={selectedUser.status} type={selectedUser.status === 'Active' ? 'success' : 'default'} />
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="space-y-4 mb-8 border border-[var(--border)] bg-[var(--card)] rounded-xl p-4">
                <DetailRow icon={<Mail size={14} />} label="Email Address" value={selectedUser.email} />
                <DetailRow icon={<Phone size={14} />} label="Phone Number" value={selectedUser.phone} />
                <DetailRow icon={<Calendar size={14} />} label="Registration Date" value={selectedUser.regDate} />
                <DetailRow icon={<MapPin size={14} />} label="Territory" value={selectedUser.territory} highlight={selectedUser.territory === 'Pending'} />
              </div>

              {/* Account Actions Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Account Actions</h4>

                <button
                  onClick={() => setIsTerritoryModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Assign / Update Territory</span>
                  </div>
                  <Edit2 className="h-3 w-3 text-muted-foreground" />
                </button>

                {selectedUser.role === 'Manager' && (
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
                    <div className="text-sm font-medium">Account Status ({selectedUser.status})</div>
                  </div>
                  <button
                    onClick={handleToggleStatus}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                      selectedUser.status === 'Active' ? "bg-emerald-500" : "bg-gray-500"
                    )}
                  >
                    <span className={cn(
                      "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
                      selectedUser.status === 'Active' ? "translate-x-2" : "-translate-x-2"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] mt-auto">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 text-sm font-bold text-[var(--background)] bg-accent-teal rounded-lg shadow-sm transition-all hover:bg-cyan-400"
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
              <button onClick={() => setIsTerritoryModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Territory / Region</label>
                <select className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--accent-teal)]">
                  <option>Select Territory...</option>
                  <option value="Northeast">Northeast</option>
                  <option value="West Coast">West Coast</option>
                  <option value="South">South</option>
                  <option value="Midwest">Midwest</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Assign Facility Group (Optional)</label>
                <select className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--accent-teal)]">
                  <option>No specific facility</option>
                  <option value="Metro Hospitals">Metro Hospitals Network</option>
                  <option value="City Clinics">City Clinics</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-[var(--card)] border-t border-[var(--border)] flex justify-end gap-3">
              <button onClick={() => setIsTerritoryModalOpen(false)} className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedUser) {
                    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, territory: 'Northeast' } : u));
                    setSelectedUser({ ...selectedUser, territory: 'Northeast' });
                  }
                  setIsTerritoryModalOpen(false);
                }}
                className="px-5 py-2 text-xs font-bold text-[var(--background)] bg-accent-teal rounded-lg shadow-sm transition-all hover:bg-cyan-400"
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
            <div className="p-4 bg-[var(--card)] border-t border-[var(--border)] flex gap-3">
              <button
                onClick={() => setIsDeactivateModalOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-muted-foreground bg-[var(--border)] rounded-lg hover:bg-[var(--border)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateUserStatus('Inactive')}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-500 rounded-lg shadow-sm transition-all hover:bg-rose-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD REPRESENTATIVE MODAL (Multi-select) */}
      {isRepModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsRepModalOpen(false)} />
          <div className="relative bg-[var(--background)] w-full max-w-md rounded-xl border border-[var(--border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border)]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-foreground">Assign Representatives</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Manager: {selectedUser?.name}</p>
                </div>
                <button onClick={() => setIsRepModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
              
              {/* Internal Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search representatives..."
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:border-[var(--accent-teal)]"
                  value={repSearch}
                  onChange={(e) => setRepSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Rep List */}
            <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
              {users
                .filter(u => u.role === 'Rep' && u.name.toLowerCase().includes(repSearch.toLowerCase()))
                .map(rep => {
                  const isSelected = selectedRepIds.includes(rep.id);
                  return (
                    <div
                      key={rep.id}
                      onClick={() => {
                        setSelectedRepIds(prev => 
                          isSelected ? prev.filter(id => id !== rep.id) : [...prev, rep.id]
                        );
                      }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1",
                        isSelected ? "bg-accent-teal/5 border border-accent-teal/20" : "hover:bg-muted/50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <img src={rep.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">{rep.name}</div>
                          <div className="text-[10px] text-muted-foreground">{rep.territory}</div>
                        </div>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        isSelected ? "bg-accent-teal border-accent-teal" : "border-[var(--border)] bg-[var(--card)]"
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                      </div>
                    </div>
                  );
                })}
              {users.filter(u => u.role === 'Rep' && u.name.toLowerCase().includes(repSearch.toLowerCase())).length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No representatives found.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[var(--card)] border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {selectedRepIds.length} Selected
              </span>
              <div className="flex gap-3">
                <button onClick={() => setIsRepModalOpen(false)} className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Assigning Reps:', {
                      managerId: selectedUser?.id,
                      selectedRepIds: selectedRepIds
                    });
                    setIsRepModalOpen(false);
                  }}
                  disabled={selectedRepIds.length === 0}
                  className="px-5 py-2 text-xs font-bold text-[var(--background)] bg-accent-teal rounded-lg shadow-sm transition-all hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, trendColor, topBorderColor }: { title: string, value: string | number, trendColor?: string, topBorderColor: string }) {
  return (
    <div className={cn("rounded-xl border border-border border-t-[3px] bg-card p-5 shadow-sm transition-all hover:bg-muted/30", topBorderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{title}</h3>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-3xl font-black tracking-tight text-foreground">{value}</div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value, highlight }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
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

