"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { 
  Building2, 
  Briefcase, 
  Stethoscope, 
  UploadCloud,
  X,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const MOCK_FACILITIES = [
  { id: '1', name: 'City General Hospital', address: '123 Main St, NY', email: 'contact@citygen.org', contact: '(555) 111-2222', created: 'Jan 10, 2026' },
  { id: '2', name: 'Metro Clinic', address: '456 West Ave, LA', email: 'info@metroclinic.com', contact: '(555) 222-3333', created: 'Jan 15, 2026' }
];

const MOCK_VENDORS = [
  { id: '1', avatar: 'https://i.pravatar.cc/150?u=v1', name: 'John Doe', company: 'MedTech Inc.', email: 'john@medtech.com', phone: '(555) 333-4444', created: 'Feb 12, 2026' },
  { id: '2', avatar: 'https://i.pravatar.cc/150?u=v2', name: 'Sarah Connor', company: 'OrthoSupply', email: 'sarah@orthosupply.com', phone: '(555) 444-5555', created: 'Mar 01, 2026' }
];

const MOCK_PRACTICES = [
  { id: '1', name: 'Advanced Orthopedics', address: '789 Oak Dr, Boston', phone: '(555) 555-6666', email: 'info@advortho.com', status: 'Open' },
  { id: '2', name: 'Peak Spine Center', address: '321 Pine St, Chicago', phone: '(555) 666-7777', email: 'hello@peakspine.com', status: 'Closed' }
];

export default function CreateNewManagementPage() {
  const [activeTab, setActiveTab] = useState<'facilities' | 'vendors' | 'practices'>('facilities');
  
  // Modal states
  const [modalMode, setModalMode] = useState<'add'|'edit'>('add');
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handlers
  const handleEdit = (type: 'facility'|'vendor'|'practice', record: any) => {
    setModalMode('edit');
    if (type === 'facility') setIsFacilityModalOpen(true);
    if (type === 'vendor') setIsVendorModalOpen(true);
    if (type === 'practice') setIsPracticeModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsFacilityModalOpen(false);
    setIsVendorModalOpen(false);
    setIsPracticeModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  // -------------------------
  // TABLE COLUMNS
  // -------------------------
  
  const facilityColumns = [
    { header: "FACILITY NAME", accessorKey: "name" as const, className: "font-semibold text-foreground" },
    { header: "ADDRESS", accessorKey: "address" as const },
    { header: "EMAIL", accessorKey: "email" as const },
    { header: "CONTACT", accessorKey: "contact" as const },
    { header: "CREATED DATE", accessorKey: "created" as const, className: "text-muted-foreground" },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit('facility', item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={handleDeleteClick} className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors rounded-md hover:bg-rose-500/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const vendorColumns = [
    { 
      header: "PROFILE", 
      render: (item: any) => (
        <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full border border-[var(--border)] object-cover" />
      )
    },
    { header: "VENDOR NAME", accessorKey: "name" as const, className: "font-semibold text-foreground" },
    { header: "COMPANY", accessorKey: "company" as const, className: "text-primary" },
    { header: "EMAIL", accessorKey: "email" as const },
    { header: "PHONE", accessorKey: "phone" as const },
    { header: "CREATED DATE", accessorKey: "created" as const, className: "text-muted-foreground" },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit('vendor', item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={handleDeleteClick} className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors rounded-md hover:bg-rose-500/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const practiceColumns = [
    { header: "PRACTICE NAME", accessorKey: "name" as const, className: "font-semibold text-foreground" },
    { header: "ADDRESS", accessorKey: "address" as const },
    { header: "PHONE", accessorKey: "phone" as const },
    { header: "EMAIL", accessorKey: "email" as const },
    { 
      header: "STATUS", 
      render: (item: any) => (
        <StatusBadge status={item.status} type={item.status === 'Open' ? 'success' : 'error'} />
      )
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit('practice', item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={handleDeleteClick} className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors rounded-md hover:bg-rose-500/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      
      {/* HEADER & TOP ADD BUTTONS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">
            Create New Management
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Manage Facilities, Vendors, and Practices
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => { setModalMode('add'); setIsFacilityModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400"
          >
            <Building2 className="h-4 w-4" /> Add Facility
          </button>
          <button 
            onClick={() => { setModalMode('add'); setIsVendorModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400"
          >
            <Briefcase className="h-4 w-4" /> Add Vendor
          </button>
          <button 
            onClick={() => { setModalMode('add'); setIsPracticeModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-cyan-400"
          >
            <Stethoscope className="h-4 w-4" /> Add Practice
          </button>
        </div>
      </div>

      {/* BELOW SECTION - TABLE HISTORY VIEW */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg flex flex-col overflow-hidden min-h-[500px]">
        
        {/* SEGMENTED TABS */}
        <div className="flex items-center border-b border-[var(--border)] bg-[var(--muted)] p-1">
          <TabButton 
            active={activeTab === 'facilities'} 
            onClick={() => setActiveTab('facilities')}
            label="Facilities"
          />
          <TabButton 
            active={activeTab === 'vendors'} 
            onClick={() => setActiveTab('vendors')}
            label="Vendors"
          />
          <TabButton 
            active={activeTab === 'practices'} 
            onClick={() => setActiveTab('practices')}
            label="Practices"
          />
        </div>

        {/* TABLE CONTENT */}
        <div className="flex-1 p-0">
          {activeTab === 'facilities' && (
            <div className="animate-in fade-in duration-300">
              <DataTable data={MOCK_FACILITIES} columns={facilityColumns} className="rounded-none border-0" />
            </div>
          )}
          {activeTab === 'vendors' && (
            <div className="animate-in fade-in duration-300">
              <DataTable data={MOCK_VENDORS} columns={vendorColumns} className="rounded-none border-0" />
            </div>
          )}
          {activeTab === 'practices' && (
            <div className="animate-in fade-in duration-300">
              <DataTable data={MOCK_PRACTICES} columns={practiceColumns} className="rounded-none border-0" />
            </div>
          )}
        </div>
      </div>

      {/* -------------------- MODALS -------------------- */}

      {/* FACILITY MODAL */}
      {isFacilityModalOpen && (
        <ModalWrapper title={modalMode === 'add' ? 'Add Facility' : 'Edit Facility'} onClose={closeAllModals}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Facility Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. City General Hospital" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Address <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="Full street address..." className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Email <span className="text-rose-500">*</span></label>
              <input type="email" placeholder="contact@hospital.org" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Contact <span className="text-gray-600 font-medium normal-case tracking-normal">(optional)</span></label>
              <input type="tel" placeholder="(555) 000-0000" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold text-muted-foreground bg-[var(--muted)] hover:bg-[var(--border)] rounded-xl transition-colors">Cancel</button>
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold text-[var(--background)] bg-primary rounded-xl shadow-sm hover:bg-cyan-400 transition-all">Save</button>
          </div>
        </ModalWrapper>
      )}

      {/* VENDOR MODAL */}
      {isVendorModalOpen && (
        <ModalWrapper title={modalMode === 'add' ? 'Add Vendor' : 'Edit Vendor'} onClose={closeAllModals}>
           <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Vendor Profile Picture</label>
              <div className="w-full h-24 border-2 border-dashed border-[var(--border)] rounded-xl bg-[var(--card)] hover:bg-[var(--muted)] transition-colors flex flex-col items-center justify-center cursor-pointer group">
                <UploadCloud className="h-5 w-5 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                <p className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Drag & drop or browse</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Vendor Name <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="John Doe" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Company Name <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="MedTech Inc." className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Vendor Email <span className="text-rose-500">*</span></label>
              <input type="email" placeholder="vendor@company.com" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Vendor Phone <span className="text-rose-500">*</span></label>
              <input type="tel" placeholder="(555) 000-0000" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold text-muted-foreground bg-[var(--muted)] hover:bg-[var(--border)] rounded-xl transition-colors">Cancel</button>
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold text-[var(--background)] bg-primary rounded-xl shadow-sm hover:bg-cyan-400 transition-all">Save</button>
          </div>
        </ModalWrapper>
      )}

      {/* PRACTICE MODAL */}
      {isPracticeModalOpen && (
        <ModalWrapper title={modalMode === 'add' ? 'Add Practice' : 'Edit Practice'} onClose={closeAllModals}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Practice Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="Advanced Orthopedics" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Address <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="Practice street address..." className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Phone Number <span className="text-rose-500">*</span></label>
              <input type="tel" placeholder="(555) 000-0000" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Email <span className="text-rose-500">*</span></label>
              <input type="email" placeholder="contact@practice.com" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[var(--primary)] transition-colors" />
            </div>
            <div className="flex items-center justify-between bg-[var(--card)] border border-[var(--border)] rounded-xl p-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status Toggle</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-500">Open</span>
                {/* Modern Toggle Mockup */}
                <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center p-0.5 cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm ml-auto" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold text-muted-foreground bg-[var(--muted)] hover:bg-[var(--border)] rounded-xl transition-colors">Cancel</button>
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold text-[var(--background)] bg-primary rounded-xl shadow-sm hover:bg-cyan-400 transition-all">Save</button>
          </div>
        </ModalWrapper>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeAllModals} />
          <div className="relative bg-[var(--background)] w-full max-w-sm rounded-2xl border border-rose-500/30 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Record?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this record? This action cannot be undone.
              </p>
            </div>
            <div className="p-5 flex gap-3 bg-[var(--card)] border-t border-[var(--border)]">
              <button 
                onClick={closeAllModals} 
                className="flex-1 py-3 text-sm font-bold text-muted-foreground bg-[var(--border)] hover:bg-[var(--border)] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={closeAllModals}
                className="flex-1 py-3 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ------ HELPER COMPONENTS ------

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 text-sm font-bold transition-all relative outline-none",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(0,229,255,0.4)]" />
      )}
    </button>
  );
}

function ModalWrapper({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--background)] w-full max-w-lg rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--border)] text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

