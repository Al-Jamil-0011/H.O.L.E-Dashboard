"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Mail, Phone, MapPin, Calendar, User, FileText, CreditCard, Car, Download, Eye, File, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useChangeUserStatus, useSingleUser } from '@/hooks/admin/users';
import { VerifyBadge } from '@/components/verify-bedge';
import { StatusBadge } from '@/components/ui/DataTable';
import toast from 'react-hot-toast';
import Loader from '@/components/loader';
import { IUser } from '@/hooks/admin/users/interface';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const { changeUserStatus, loading: changingStatus } = useChangeUserStatus();
  const { user, loading: userLoading, error, refetch } = useSingleUser(params.id as string);

  console.log(user);





  const toggleStatus = async () => {
    if (!user) return;
    const success = await changeUserStatus(user?._id, user?.status === 'active' ? 'inactive' : 'active');
    if (success) {
      refetch();
      toast.success(`User ${user?.status === 'active' ? 'deactivated' : 'activated'} successfully`);
    } else {
      toast.error(`Failed to ${user?.status === 'active' ? 'deactivate' : 'activate'} user`);
    }
    setIsDeactivateModalOpen(false);
  };

  if (userLoading) {
    return <div className='flex items-center justify-center w-full h-[60vh]'>
      <Loader size={32} text='Processing details...' />
    </div>
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full dark:bg-[#1E293B] text-gray-400 hover:text-white dark:hover:bg-[#334155] transition-colors cursor-pointer hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5 text-primary" />
          </button>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full relative overflow-hidden border-2 border-[#1E293B]">
              <Image src={user?.profileUrl || '/default-avatar.png'} alt={user?.fullName || 'N/A'} fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-1">{user?.fullName}</h1>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {user?.role}
                </span>
                {/* <span className="w-1.5 h-1.5 rounded-full bg-gray-600" /> */}
                <StatusBadge status={user?.status as IUser['status']} type={user?.status === 'active' ? 'success' : 'error'} />
                <VerifyBadge isVerified={user?.isVerified} showLabel size='sm' />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1E293B] border border-[#334155] rounded-lg shadow-sm transition-colors hover:bg-[#334155]">
            <Edit className="h-4 w-4" />
            Edit Profile
          </button> */}
          <button
            onClick={() => setIsDeactivateModalOpen(true)}
            disabled={changingStatus}
            className={cn(`flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg shadow-sm transition-colors hover:bg-rose-500 hover:text-white cursor-pointer`,
              user?.status === 'inactive' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            {user?.status === 'active' ? 'Deactivate Driver' : 'Activate Driver'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
        {/* LEFT SIDE (Main Info Card) */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">

          <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm">
            <h3 className="text-xs font-bold tracking-widest text-[#00E5FF] uppercase mb-4">Bio</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {user?.bio}
            </p>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#151B2B] p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-bold tracking-widest text-[#00E5FF] uppercase mb-2">Driver Information</h3>

            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Address" value={user?.email || 'N/A'} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone Number" value={user?.phoneNumber || 'N/A'} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={user?.address || 'N/A'} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={user?.dateOfBirth || 'N/A'} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Gender" value={user?.gender || 'N/A'} />
            <div className="my-2 h-px bg-[#1E293B]" />
            <InfoRow icon={<CreditCard className="h-4 w-4" />} label="National ID Number" value={user?.nidInfo?.nidNumber || "N/A"} valueColor="text-[#00E5FF]" />
            <InfoRow icon={<FileText className="h-4 w-4" />} label="Driving License" value={user?.drivingInfo?.licenseNumber || "N/A"} valueColor="text-amber-500" />
            <InfoRow icon={<Car className="h-4 w-4" />} label="Car Plate Number" value={"XYZ-9876"} />
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
                  <FileCard name={user?.nidInfo?.frontPhoto || "N/A"} size="1.2 MB" type="pdf" router={router} />
                  <FileCard name={user?.nidInfo?.backPhoto || "N/A"} size="845 KB" type="image" router={router} />
                </div>
              </div>

              {/* Driving License */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-300 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-500" />
                  Driving License
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileCard name={user?.drivingInfo?.frontPhoto || "N/A"} size="2.1 MB" type="image" router={router} />
                  <FileCard name={user?.drivingInfo?.backPhoto || "N/A"} size="1.8 MB" type="image" router={router} />
                </div>
              </div>

              {/* Driver & Car Picture */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-300 flex items-center gap-2">
                  <Car className="h-4 w-4 text-purple-400" />
                  Driver & Car Picture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileCard name={user?.driverAndCarInfo?.platePhoto || "N/A"} size="4.2 MB" type="image" router={router} />
                  <FileCard name={user?.driverAndCarInfo?.carPhoto || "N/A"} size="3.5 MB" type="image" router={router} />
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
                className={cn("flex-1 py-3 text-sm font-bold text-white bg-rose-500 rounded-lg shadow-sm transition-all hover:bg-rose-600", changingStatus && "opacity-50 cursor-not-allowed")}
              >
                {changingStatus ? "Changing..." : "Confirm"}
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

function FileCard({ name, size, type, router }: { name: string, size: string, type: 'pdf' | 'image', router: AppRouterInstance }) {
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

        <button onClick={() => router.push(name)} disabled={!name || name === 'N/A'} className="p-1.5 text-gray-500 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="View">
          <Eye size={16} />
        </button>

        <button
          onClick={async () => {
            const toastId = toast.loading('Preparing download...');
            try {
              const response = await fetch(name);
              if (!response.ok) throw new Error('Download failed');
              const blob = await response.blob();
              const blobUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = name.split('/').pop() || 'download';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(blobUrl);
              toast.success('Download started!', { id: toastId });
            } catch (error) {
              console.error('Download failed:', error);
              toast.dismiss(toastId);
              // Fallback to opening the URL directly if fetching the blob fails (e.g. CORS)
              const link = document.createElement('a');
              link.href = name;
              link.download = name.split('/').pop() || 'download';
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
          disabled={!name || name === 'N/A'}
          className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download"
        >
          <Download size={16} />
        </button>

      </div>
    </div>
  );
}
