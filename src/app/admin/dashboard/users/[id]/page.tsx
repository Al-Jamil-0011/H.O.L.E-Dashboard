"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, AlertTriangle, Mail, Phone, MapPin, Calendar, User, FileText, CreditCard, Car, Download, Eye, File, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  // Mock data for Driver
  const [driver, setDriver] = useState({
    id: params.id as string,
    name: 'Daniel Carter',
    role: 'Driver',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=5',
    bio: 'Professional medical logistics driver with 5+ years of experience in safely transporting sensitive medical equipment and supplies across regions.',
    email: 'daniel.c@invictus.com',
    phone: '(555) 789-0123',
    address: '123 Logistics Way, New York, NY 10001',
    dob: '15 Mar 1988',
    gender: 'Male',
    nid: 'NID-9876543210',
    licenseNumber: 'DL-ABC123456',
    carPlate: 'XYZ-9876',
  });

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const toggleStatus = () => {
    setDriver({ ...driver, status: driver.status === 'Active' ? 'Inactive' : 'Active' });
    setIsDeactivateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 mt-1 rounded-full bg-[#1E293B] text-gray-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-4">
            <img src={driver.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-[#1E293B] object-cover" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-1">{driver.name}</h1>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {driver.role}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <button 
                  onClick={() => setIsDeactivateModalOpen(true)}
                  className="flex items-center gap-2 group"
                >
                  <div className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                    driver.status === 'Active' ? "bg-[#00E5FF]" : "bg-gray-600"
                  )}>
                    <span className={cn(
                      "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
                      driver.status === 'Active' ? "translate-x-2" : "-translate-x-2"
                    )} />
                  </div>
                  <span className={cn("text-xs font-bold uppercase tracking-wider", driver.status === 'Active' ? "text-[#00E5FF]" : "text-gray-500 group-hover:text-gray-400")}>
                    {driver.status}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1E293B] border border-[#334155] rounded-lg shadow-sm transition-colors hover:bg-[#334155]">
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
          <button 
            onClick={() => setIsDeactivateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg shadow-sm transition-colors hover:bg-rose-500 hover:text-white"
          >
            <AlertTriangle className="h-4 w-4" />
            Deactivate Driver
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
        {/* LEFT SIDE (Main Info Card) */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          
          <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm">
            <h3 className="text-xs font-bold tracking-widest text-[#00E5FF] uppercase mb-4">Bio</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {driver.bio}
            </p>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-bold tracking-widest text-[#00E5FF] uppercase mb-2">Driver Information</h3>
            
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Address" value={driver.email} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone Number" value={driver.phone} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={driver.address} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={driver.dob} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Gender" value={driver.gender} />
            <div className="my-2 h-px bg-[#1E293B]" />
            <InfoRow icon={<CreditCard className="h-4 w-4" />} label="National ID Number" value={driver.nid} valueColor="text-[#00E5FF]" />
            <InfoRow icon={<FileText className="h-4 w-4" />} label="Driving License" value={driver.licenseNumber} valueColor="text-amber-500" />
            <InfoRow icon={<Car className="h-4 w-4" />} label="Car Plate Number" value={driver.carPlate} />
          </div>

        </div>

        {/* RIGHT SIDE (Documents Section) */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">All Documents</h2>
                <p className="text-xs text-gray-500 mt-1">Manage and verify uploaded driver credentials</p>
              </div>
            </div>
            
            <div className="p-5 space-y-8 flex-1 overflow-y-auto">
              
              {/* NID / Tax ID */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-300 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#00E5FF]" />
                  NID / Tax ID
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileCard name="NID_Front_Scan.pdf" size="1.2 MB" type="pdf" />
                  <FileCard name="Tax_Certificate_2025.jpg" size="845 KB" type="image" />
                </div>
              </div>

              {/* Driving License */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-300 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-500" />
                  Driving License
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileCard name="Driving_License_Front.jpg" size="2.1 MB" type="image" />
                  <FileCard name="Driving_License_Back.jpg" size="1.8 MB" type="image" />
                </div>
              </div>

              {/* Driver & Car Picture */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-300 flex items-center gap-2">
                  <Car className="h-4 w-4 text-purple-400" />
                  Driver & Car Picture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileCard name="Driver_Profile_Photo.jpg" size="4.2 MB" type="image" />
                  <FileCard name="Vehicle_Registration_Photo.jpg" size="3.5 MB" type="image" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* DEACTIVATION WARNING MODAL */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeactivateModalOpen(false)} />
          <div className="relative bg-[#0B101E] w-full max-w-md rounded-xl border border-rose-500/50 shadow-2xl shadow-rose-900/20 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Deactivate this driver?</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-[90%] mx-auto">
                  Are you sure you want to deactivate this driver? <br className="hidden md:block" />
                  This user will not appear in job assignments and reports.
                </p>
              </div>
            </div>
            <div className="p-5 bg-[#151B2B] border-t border-[#1E293B] flex gap-3">
              <button 
                onClick={() => setIsDeactivateModalOpen(false)} 
                className="flex-1 py-3 text-sm font-bold text-gray-300 bg-[#1E293B] rounded-lg hover:bg-[#334155] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => toggleStatus()}
                className="flex-1 py-3 text-sm font-bold text-white bg-rose-500 rounded-lg shadow-sm transition-all hover:bg-rose-600"
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

function InfoRow({ icon, label, value, valueColor = "text-white" }: { icon: React.ReactNode, label: string, value: string, valueColor?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-[11px] font-semibold tracking-wider uppercase">{label}</span>
      </div>
      <div className={cn("text-sm font-medium pl-6", valueColor)}>
        {value}
      </div>
    </div>
  );
}

function FileCard({ name, size, type }: { name: string, size: string, type: 'pdf' | 'image' }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[#1E293B] bg-[#0B101E] group hover:border-[#334155] transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={cn(
          "p-2 rounded-md shrink-0",
          type === 'pdf' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
        )}>
          {type === 'pdf' ? <File size={18} /> : <ImageIcon size={18} />}
        </div>
        <div className="min-w-0 pr-4">
          <p className="text-xs font-medium text-gray-200 truncate" title={name}>{name}</p>
          <p className="text-[10px] text-gray-500">{size}</p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button className="p-1.5 text-gray-500 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-md transition-colors" title="View">
          <Eye size={16} />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors" title="Download">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
