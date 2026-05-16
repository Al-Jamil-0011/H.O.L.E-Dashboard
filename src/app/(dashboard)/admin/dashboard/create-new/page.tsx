"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { useForm } from 'react-hook-form';
import FormField from '@/components/form';
import {
  Building2,
  Briefcase,
  Stethoscope,
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  Mail,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';
import { useFacilities, useCreateFacility, useUpdateFacility, useDeleteFacility } from '@/hooks/admin/facility';
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor } from '@/hooks/admin/vendor';
import { usePractices, useCreatePractice, useUpdatePractice, useDeletePractice } from '@/hooks/admin/practice';
import Image from 'next/image';
import { toast } from 'react-hot-toast';


export default function CreateNewManagementPage() {
  const [activeTab, setActiveTab] = useState<'facilities' | 'vendors' | 'practices'>('facilities');

  // Data hooks
  const { facilities, loading: isLoadingFacilities, refetch: refetchFacilities } = useFacilities();
  const { vendors, loading: isLoadingVendors, refetch: refetchVendors } = useVendors();
  const { practices, loading: isLoadingPractices, refetch: refetchPractices } = usePractices();

  // Mutation hooks
  const { createFacility, loading: isCreatingFacility } = useCreateFacility();
  const { updateFacility, loading: isUpdatingFacility } = useUpdateFacility();
  const { deleteFacility, loading: isDeletingFacility } = useDeleteFacility();

  const { createVendor, loading: isCreatingVendor } = useCreateVendor();
  const { updateVendor, loading: isUpdatingVendor } = useUpdateVendor();
  const { deleteVendor, loading: isDeletingVendor } = useDeleteVendor();

  const { createPractice, loading: isCreatingPractice, error: practiceError } = useCreatePractice();
  const { updatePractice, loading: isUpdatingPractice } = useUpdatePractice();
  const { deletePractice, loading: isDeletingPractice } = useDeletePractice();

  // Modal states
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection state for edit/delete
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'facility' | 'vendor' | 'practice' | null>(null);

  // react-hook-form initializations
  const {
    register: registerFacility,
    handleSubmit: handleSubmitFacility,
    reset: resetFacility,
    formState: { errors: errorsFacility }
  } = useForm({
    defaultValues: { name: '', address: '', email: '', phoneNumber: '', contacts: '' }
  });

  const {
    register: registerVendor,
    handleSubmit: handleSubmitVendor,
    reset: resetVendor,
    formState: { errors: errorsVendor }
  } = useForm({
    defaultValues: { name: '', companyName: '', email: '', phoneNumber: '', profile: null as any }
  });

  const {
    register: registerPractice,
    handleSubmit: handleSubmitPractice,
    reset: resetPractice,
    formState: { errors: errorsPractice }
  } = useForm({
    defaultValues: { practiceName: '', address: '', phone: '', email: '', hours: 0 }
  });

  // Handlers
  const handleEdit = (type: 'facility' | 'vendor' | 'practice', record: any) => {
    setModalMode('edit');
    setSelectedRecord(record);
    if (type === 'facility') {
      resetFacility({
        name: record.name,
        address: record.address,
        email: record.email,
        phoneNumber: record.phoneNumber || '',
        contacts: record.contacts || ''
      });
      setIsFacilityModalOpen(true);
    }
    if (type === 'vendor') {
      resetVendor({
        name: record.name,
        companyName: record.companyName || '',
        email: record.email,
        phoneNumber: record.phoneNumber || '',
        profile: null
      });
      setIsVendorModalOpen(true);
    }
    if (type === 'practice') {
      resetPractice({
        practiceName: record.practiceName,
        address: record.address,
        phone: record.phone,
        email: record.email,
        hours: record.hours || 0
      });
      setIsPracticeModalOpen(true);
    }
  };

  const handleDeleteClick = (type: 'facility' | 'vendor' | 'practice', record: any) => {
    setSelectedRecord(record);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsFacilityModalOpen(false);
    setIsVendorModalOpen(false);
    setIsPracticeModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRecord(null);
    setDeleteType(null);

    resetFacility();
    resetVendor();
    resetPractice();
  };


  const handleFacilitySubmit = async (data: any) => {
    let result;
    if (modalMode === 'add') {
      result = await createFacility(data);
    } else {
      result = await updateFacility(selectedRecord._id, data);
    }
    if (result) {
      toast.success(modalMode === 'add' ? 'Facility added' : 'Facility updated');
      refetchFacilities();
      closeAllModals();
    }
  };

  const handleVendorSubmit = async (data: any) => {
    let result;
    if (modalMode === 'add') {
      result = await createVendor({
        ...data,
        profile: data.profile?.[0] || null
      });
    } else {
      result = await updateVendor(selectedRecord._id, {
        ...data,
        profile: data.profile?.[0] || null
      });
    }
    if (result) {
      toast.success(modalMode === 'add' ? 'Vendor added' : 'Vendor updated');
      refetchVendors();
      closeAllModals();
    }
  };

  const handlePracticeSubmit = async (data: any) => {
    console.log("data", data)
    const formData = {
      ...data,
      hours: Number(data.hours),
    }
    let result;
    if (modalMode === 'add') {
      result = await createPractice(formData);
    } else {
      result = await updatePractice(selectedRecord._id, formData);
    }
    if (result) {
      toast.success(modalMode === 'add' ? 'Practice added' : 'Practice updated');
      refetchPractices();
      closeAllModals();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecord || !deleteType) return;
    let result;
    if (deleteType === 'facility') result = await deleteFacility(selectedRecord._id);
    if (deleteType === 'vendor') result = await deleteVendor(selectedRecord._id);
    if (deleteType === 'practice') result = await deletePractice(selectedRecord._id);

    if (result) {
      toast.success('Record deleted successfully');
      if (deleteType === 'facility') refetchFacilities();
      if (deleteType === 'vendor') refetchVendors();
      if (deleteType === 'practice') refetchPractices();
      closeAllModals();
    }
  };


  const facilityColumns = [
    {
      header: "FACILITY NAME",
      accessorKey: "name" as const, className: "font-semibold text-foreground"
    },
    {
      header: "ADDRESS",
      accessorKey: "address" as const
    },
    {
      header: "EMAIL",
      accessorKey: "email" as const
    },
    {
      header: "CONTACT",
      accessorKey: "phoneNumber" as const
    },
    {
      header: "CREATED DATE",
      render: (item: any) => new Date(item.createdAt).toLocaleDateString(),
      className: "text-muted-foreground"
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit('facility', item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10 cursor-pointer">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteClick('facility', item)} className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors rounded-md hover:bg-rose-500/10 cursor-pointer">
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
        <div className="w-8 h-8 rounded-full relative overflow-hidden">
          <Image
            src={item.profileUrl || 'https://i.pravatar.cc/150'}
            alt={item.name}
            fill
            className="w-8 h-8 rounded-full border border-[var(--border)] object-cover"
          />
        </div>
      )
    },
    {
      header: "VENDOR NAME",
      accessorKey: "name" as const, className: "font-semibold text-foreground"
    },
    {
      header: "COMPANY",
      accessorKey: "companyName" as const,
      className: "text-primary"
    },
    {
      header: "EMAIL",
      accessorKey: "email" as const
    },
    {
      header: "PHONE",
      accessorKey: "phoneNumber" as const
    },
    {
      header: "CREATED DATE",
      render: (item: any) => new Date(item.createdAt).toLocaleDateString(),
      className: "text-muted-foreground"
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit('vendor', item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10 cursor-pointer">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteClick('vendor', item)} className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors rounded-md hover:bg-rose-500/10 cursor-pointer">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const practiceColumns = [
    {
      header: "PRACTICE NAME",
      accessorKey: "practiceName" as const, className: "font-semibold text-foreground"
    },
    {
      header: "ADDRESS",
      accessorKey: "address" as const
    },
    {
      header: "PHONE",
      accessorKey: "phone" as const
    },
    {
      header: "EMAIL",
      accessorKey: "email" as const
    },
    {
      header: "STATUS",
      render: (item: any) => (
        <StatusBadge status={item.isDeleted ? 'Closed' : 'Open'} type={!item.isDeleted ? 'success' : 'error'} />
      )
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit('practice', item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10 cursor-pointer">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteClick('practice', item)} className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors rounded-md hover:bg-rose-500/10 cursor-pointer">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // console.log("practiceError", practiceError)
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">

      {/* header & top add buttons */}
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
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-primary/90 cursor-pointer"
          >
            <Building2 className="h-4 w-4" /> Add Facility
          </button>
          <button
            onClick={() => { setModalMode('add'); setIsVendorModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-primary/90  cursor-pointer"
          >
            <Briefcase className="h-4 w-4" /> Add Vendor
          </button>
          <button
            onClick={() => { setModalMode('add'); setIsPracticeModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--background)] bg-primary rounded-lg shadow-sm transition-all hover:bg-primary/90  cursor-pointer"
          >
            <Stethoscope className="h-4 w-4" /> Add Practice
          </button>
        </div>
      </div>

      {/* table history view */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] dark:shadow-lg flex flex-col overflow-hidden">

        {/* segmented tabs */}
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

        {/* table content */}
        <div className="flex-1 p-0">
          {activeTab === 'facilities' && (
            <div className="animate-in fade-in duration-300">
              <DataTable
                data={facilities}
                columns={facilityColumns}
                loading={isLoadingFacilities}
                className="rounded-none border-0"
                onRowClick={() => { }}
              />
            </div>
          )}
          {activeTab === 'vendors' && (
            <div className="animate-in fade-in duration-300">
              <DataTable
                data={vendors}
                columns={vendorColumns}
                loading={isLoadingVendors}
                className="rounded-none border-0"
                onRowClick={() => { }}
              />
            </div>
          )}
          {activeTab === 'practices' && (
            <div className="animate-in fade-in duration-300">
              <DataTable
                data={practices}
                columns={practiceColumns}
                loading={isLoadingPractices}
                className="rounded-none border-0"
                onRowClick={() => { }}
              />
            </div>
          )}
        </div>
      </div>


      {/* facility modal */}
      {isFacilityModalOpen && (
        <ModalWrapper title={modalMode === 'add' ? 'Add Facility' : 'Edit Facility'} onClose={closeAllModals}>
          <div className="space-y-0">
            <FormField
              name="name"
              label="Facility Name"
              placeholder="e.g. City General Hospital"
              icon={<Building2 className="h-5 w-5" />}
              register={registerFacility}
              errors={errorsFacility}
              validation={{ required: "Facility name is required" }}
            />
            <FormField
              name="address"
              label="Address"
              placeholder="Full street address..."
              icon={<MapPin className="h-5 w-5" />}
              register={registerFacility}
              errors={errorsFacility}
              validation={{ required: "Address is required" }}
            />
            <FormField
              type="email"
              name="email"
              label="Email"
              placeholder="contact@hospital.org"
              icon={<Mail className="h-5 w-5" />}
              register={registerFacility}
              errors={errorsFacility}
              validation={{
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
              }}
            />
            <FormField
              type="tel"
              name="phoneNumber"
              label="Phone Number"
              placeholder="(555) 000-0000"
              icon={<Phone className="h-5 w-5" />}
              register={registerFacility}
              errors={errorsFacility}
              validation={{ required: "Phone number is required" }}
            />
            <FormField
              name="contacts"
              label="Contacts"
              placeholder="Secondary contact or name..."
              icon={<Edit2 className="h-5 w-5" />}
              register={registerFacility}
              errors={errorsFacility}
              validation={{ required: "Contact info is required" }}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold hover:bg-[var(--border)]/70 hover:text-foreground text-muted-foreground bg-[var(--border)] rounded-xl transition-colors cursor-pointer">Cancel</button>
            <button
              onClick={handleSubmitFacility(handleFacilitySubmit)}
              disabled={isCreatingFacility || isUpdatingFacility}
              className="flex-1 py-2.5 text-sm font-bold text-[var(--background)] bg-primary rounded-xl shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCreatingFacility || isUpdatingFacility ? 'Saving...' : 'Save'}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* vendor modal */}
      {isVendorModalOpen && (
        <ModalWrapper title={modalMode === 'add' ? 'Add Vendor' : 'Edit Vendor'} onClose={closeAllModals}>
          <div className="space-y-0">
            <FormField
              type="file"
              name="profile"
              label="Vendor Profile Picture"
              accept="image/*"
              register={registerVendor}
              errors={errorsVendor}
            />
            <div className="grid grid-cols-2 gap-x-4">
              <FormField
                name="name"
                label="Vendor Name"
                placeholder="John Doe"
                icon={<Briefcase className="h-5 w-5" />}
                register={registerVendor}
                errors={errorsVendor}
                validation={{ required: "Vendor name is required" }}
              />
              <FormField
                name="companyName"
                label="Company Name"
                placeholder="MedTech Inc."
                icon={<Building2 className="h-5 w-5" />}
                register={registerVendor}
                errors={errorsVendor}
                validation={{ required: "Company name is required" }}
              />
            </div>
            <FormField
              type="email"
              name="email"
              label="Vendor Email"
              placeholder="vendor@company.com"
              icon={<Mail className="h-5 w-5" />}
              register={registerVendor}
              errors={errorsVendor}
              validation={{
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
              }}
            />
            <FormField
              type="tel"
              name="phoneNumber"
              label="Vendor Phone"
              placeholder="(555) 000-0000"
              icon={<Phone className="h-5 w-5" />}
              register={registerVendor}
              errors={errorsVendor}
              validation={{ required: "Phone number is required" }}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold hover:bg-[var(--border)]/70 hover:text-foreground text-muted-foreground bg-[var(--border)] rounded-xl transition-colors cursor-pointer">Cancel</button>
            <button
              onClick={handleSubmitVendor(handleVendorSubmit)}
              disabled={isCreatingVendor || isUpdatingVendor}
              className="flex-1 py-2.5 text-sm font-bold text-[var(--background)] bg-primary rounded-xl shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCreatingVendor || isUpdatingVendor ? 'Saving...' : 'Save'}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* practice modal */}
      {isPracticeModalOpen && (
        <ModalWrapper title={modalMode === 'add' ? 'Add Practice' : 'Edit Practice'} onClose={closeAllModals}>
          <div className="space-y-0">
            <FormField
              name="practiceName"
              label="Practice Name"
              placeholder="Advanced Orthopedics"
              icon={<Stethoscope className="h-5 w-5" />}
              register={registerPractice}
              errors={errorsPractice}
              validation={{ required: "Practice name is required" }}
            />
            <FormField
              name="address"
              label="Address"
              placeholder="Practice street address..."
              icon={<MapPin className="h-5 w-5" />}
              register={registerPractice}
              errors={errorsPractice}
              validation={{ required: "Address is required" }}
            />
            <FormField
              type="tel"
              name="phone"
              label="Phone Number"
              placeholder="(555) 000-0000"
              icon={<Phone className="h-5 w-5" />}
              register={registerPractice}
              errors={errorsPractice}
              validation={{ required: "Phone number is required" }}
            />
            <FormField
              type="email"
              name="email"
              label="Email"
              placeholder="contact@practice.com"
              icon={<Mail className="h-5 w-5" />}
              register={registerPractice}
              errors={errorsPractice}
              validation={{
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
              }}
            />
            <FormField
              type="number"
              name="hours"
              label="Operating Hours (max 24)"
              placeholder="e.g. 8"
              icon={<Clock className="h-5 w-5" />}
              register={registerPractice}
              errors={errorsPractice}
              validation={{ required: "Operating hours are required" }}
            />
          </div>
          {practiceError && (
            <div className="mt-4">
              <p className="text-red-500 text-sm">{practiceError}</p>
            </div>
          )}
          <div className="mt-4 flex gap-3">
            <button onClick={closeAllModals} className="flex-1 py-2.5 text-sm font-bold hover:bg-[var(--border)]/70 hover:text-foreground text-muted-foreground bg-[var(--border)] rounded-xl transition-colors cursor-pointer">Cancel</button>
            <button
              onClick={handleSubmitPractice(handlePracticeSubmit)}
              disabled={isCreatingPractice || isUpdatingPractice}
              className="flex-1 py-2.5 text-sm font-bold text-[var(--background)] bg-primary rounded-xl shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCreatingPractice || isUpdatingPractice ? 'Saving...' : 'Save'}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* delete modal */}
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
                className="flex-1 py-3 text-sm font-bold hover:bg-[var(--border)]/70 hover:text-foreground text-muted-foreground bg-[var(--border)] hover:bg-[var(--border)] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeletingFacility || isDeletingVendor || isDeletingPractice}
                className="flex-1 py-3 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeletingFacility || isDeletingVendor || isDeletingPractice ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Components

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 text-sm font-bold transition-all relative outline-none  cursor-pointer",
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
            className="p-1.5 rounded-md hover:bg-[var(--border)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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

