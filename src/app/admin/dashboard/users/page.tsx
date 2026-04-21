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
  AlertTriangle
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
          <div className="h-8 w-8 rounded-full bg-[#1E293B] overflow-hidden border border-[#334155]">
            <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="font-semibold text-white">{item.name}</div>
            <div className="text-[10px] text-gray-500">{item.email}</div>
          </div>
        </div>
      )
    },
    { header: "PHONE", accessorKey: "phone" as const },
    { 
      header: "ROLE", 
      render: (item: typeof mockUsers[0]) => (
        <span className="text-[#00E5FF] font-medium">{item.role}</span>
      )
    },
    { 
      header: "TERRITORY", 
      render: (item: typeof mockUsers[0]) => (
        <span className={cn(
          "font-medium",
          item.territory === 'Pending' ? "text-amber-500" : "text-gray-300"
        )}>
          {item.territory}
        </span>
      )
    },
    { header: "REG EXP DATE", accessorKey: "regDate" as const, className: "text-gray-400" },
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
          className="px-3 py-1 text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 rounded hover:bg-[#00E5FF]/20 transition-colors"
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
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            User & Role Management
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Manage registered users, roles, territories, and account status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded-lg shadow-sm transition-all hover:bg-cyan-400">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="TOTAL USERS" value={users.length} topBorderColor="border-t-[#00E5FF]" />
        <StatCard title="ACTIVE USERS" value={activeCount} topBorderColor="border-t-emerald-500" />
        <StatCard title="INACTIVE USERS" value={inactiveCount} topBorderColor="border-t-gray-500" />
        <StatCard title="PENDING TERRITORY" value={pendingTerritoryCount} trendColor="text-amber-500" topBorderColor="border-t-amber-500" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-lg flex flex-col overflow-hidden">
        
        {/* FILTER BAR */}
        <div className="p-4 border-b border-[#1E293B] flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1A2234]">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users by name, email, territory..." 
              className="w-full bg-[#0B101E] border border-[#334155] rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
            </div>
            
            <select 
              value={roleFilter} 
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-[#0B101E] border border-[#334155] rounded-md py-1.5 px-3 text-xs font-medium text-white appearance-none focus:outline-none focus:border-[#00E5FF] cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Rep">Rep</option>
              <option value="Manager">Manager</option>
              <option value="Finance">Finance</option>
            </select>
            
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#0B101E] border border-[#334155] rounded-md py-1.5 px-3 text-xs font-medium text-white appearance-none focus:outline-none focus:border-[#00E5FF] cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select 
              value={territoryFilter} 
              onChange={e => setTerritoryFilter(e.target.value)}
              className="bg-[#0B101E] border border-[#334155] rounded-md py-1.5 px-3 text-xs font-medium text-white appearance-none focus:outline-none focus:border-[#00E5FF] cursor-pointer"
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
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0B101E] border-l border-[#1E293B] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
              <h2 className="text-lg font-bold text-white">User Profile Details</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-md hover:bg-[#1E293B] text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body scrollable */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#1E293B]">
              {/* Profile Top */}
              <div className="flex items-center gap-4 mb-8">
                <img src={selectedUser.avatar} className="w-16 h-16 rounded-full border-2 border-[#1E293B] object-cover" alt="" />
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#00E5FF] font-semibold text-sm">{selectedUser.role}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                    <StatusBadge status={selectedUser.status} type={selectedUser.status === 'Active' ? 'success' : 'default'} />
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="space-y-4 mb-8 border border-[#1E293B] bg-[#151B2B] rounded-xl p-4">
                <DetailRow icon={<Mail size={14}/>} label="Email Address" value={selectedUser.email} />
                <DetailRow icon={<Phone size={14}/>} label="Phone Number" value={selectedUser.phone} />
                <DetailRow icon={<Calendar size={14}/>} label="Registration Date" value={selectedUser.regDate} />
                <DetailRow icon={<MapPin size={14}/>} label="Territory" value={selectedUser.territory} highlight={selectedUser.territory === 'Pending'} />
              </div>

              {/* Account Actions Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Account Actions</h4>
                
                <button 
                  onClick={() => setIsTerritoryModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-[#1E293B] bg-[#151B2B] hover:bg-[#1A2234] transition-colors group"
                >
                  <div className="flex items-center gap-3 text-gray-300 group-hover:text-white">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Assign / Update Territory</span>
                  </div>
                  <Edit2 className="h-3 w-3 text-gray-500" />
                </button>

                <div className="flex items-center justify-between p-3 rounded-lg border border-[#1E293B] bg-[#151B2B]">
                  <div className="flex items-center gap-3 text-gray-300">
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
            <div className="p-6 border-t border-[#1E293B] bg-[#151B2B] mt-auto">
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-lg shadow-sm transition-all hover:bg-cyan-400"
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
          <div className="relative bg-[#0B101E] w-full max-w-sm rounded-xl border border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#1E293B] flex justify-between items-center">
              <h3 className="font-bold text-white">Assign Territory</h3>
              <button onClick={() => setIsTerritoryModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Territory / Region</label>
                <select className="w-full bg-[#151B2B] border border-[#334155] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF]">
                  <option>Select Territory...</option>
                  <option value="Northeast">Northeast</option>
                  <option value="West Coast">West Coast</option>
                  <option value="South">South</option>
                  <option value="Midwest">Midwest</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Assign Facility Group (Optional)</label>
                <select className="w-full bg-[#151B2B] border border-[#334155] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF]">
                  <option>No specific facility</option>
                  <option value="Metro Hospitals">Metro Hospitals Network</option>
                  <option value="City Clinics">City Clinics</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-[#151B2B] border-t border-[#1E293B] flex justify-end gap-3">
              <button onClick={() => setIsTerritoryModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
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
                className="px-5 py-2 text-xs font-bold text-[#0B101E] bg-[#00E5FF] rounded-lg shadow-sm transition-all hover:bg-cyan-400"
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
          <div className="relative bg-[#0B101E] w-full max-w-sm rounded-xl border border-rose-500/50 shadow-2xl shadow-rose-900/20 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deactivate Account?</h3>
              <p className="text-sm text-gray-400">
                If you deactivate this user, they will no longer appear in future dropdown selections and reports. Are you sure?
              </p>
            </div>
            <div className="p-4 bg-[#151B2B] border-t border-[#1E293B] flex gap-3">
              <button 
                onClick={() => setIsDeactivateModalOpen(false)} 
                className="flex-1 py-2 text-xs font-bold text-gray-300 bg-[#1E293B] rounded-lg hover:bg-[#334155] transition-colors"
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

    </div>
  );
}

function StatCard({ title, value, trendColor, topBorderColor }: { title: string, value: string | number, trendColor?: string, topBorderColor: string }) {
  return (
    <div className={cn("rounded-xl border border-[#1E293B] border-t-[3px] bg-[#151B2B] p-5 shadow-sm transition-all hover:bg-[#1A2234]", topBorderColor)}>
      <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{title}</h3>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-3xl font-black tracking-tight text-white">{value}</div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value, highlight }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="w-6 flex justify-center text-[#1E293B]">
          {icon}
        </div>
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-medium",
        highlight ? "text-amber-500" : "text-white"
      )}>
        {value}
      </span>
    </div>
  );
}
