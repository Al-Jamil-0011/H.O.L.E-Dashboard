"use client";

import Loader from "@/components/loader";
import { useSinglePhysician } from "@/hooks/admin/physicians";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Stethoscope,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Download,
  Building2,
  Trash2,
  Edit
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";


export default function PhysicianProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { physician, loading: isLoading } = useSinglePhysician(id);

  console.log("physician", physician);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader size={32} text="Fetching physician data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-12">

      {/* TOP NAV & ACTIONS */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard/physicians"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Physician Profile
        </Link>

        <div className="flex items-center gap-2">
          {/* <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-300 bg-[#151B2B] border border-[#1E293B] rounded-lg hover:text-white hover:bg-[#1E293B] transition-colors">
            Assign Facility
          </button> */}
          <div className="flex items-center bg-[#151B2B] border border-[#1E293B] rounded-lg p-1">
            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors" title="Edit">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors" title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#151B2B] border border-[#1E293B] rounded-2xl shadow-xl overflow-hidden">

        {/* PROFILE HEADER */}
        <div className="relative flex flex-col items-start border-b border-[#1E293B]">
          {/* Background Glow */}
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#00E5FF]/5 to-transparent pointer-events-none" />

          <div className="relative flex items-center gap-6 p-4 z-10">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#1E293B] to-[#0B101E] flex items-center justify-center border-4 border-[#0B101E] shadow-xl mx-auto mb-4 overflow-hidden relative">
              <div className={cn(
                "absolute bottom-1 right-1 w-4 h-4 border-2 border-[#0B101E] rounded-full z-20",
                physician.isDeleted ? "bg-rose-500" : "bg-emerald-500"
              )} />
              {physician.profileUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${physician.profileUrl}`}
                  fill className="object-cover"
                  alt={physician.fullName} />
              ) : (
                <Stethoscope className="h-10 w-10 text-[#00E5FF]/50" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black text-white tracking-tight mb-2">{physician.fullName}</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#00E5FF]/20">
                  {physician.specialty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE BODY */}
        <div className="p-8 space-y-10">

          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Basic Info
            </h3>

            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Practice Name</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  {physician.practice}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {physician.contactInfo?.phoneNumber}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Cell</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {physician.contactInfo?.cellNumber}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</p>
                <div className="flex items-center gap-2 text-sm font-medium text-[#00E5FF]">
                  <Mail className="h-4 w-4 text-[#00E5FF]/70" />
                  <a href={`mailto:${physician.contactInfo?.email}`} className="hover:underline">{physician.contactInfo?.email}</a>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Birthday</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {physician.contactInfo?.dateOfBirth ? new Date(physician.contactInfo.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Notes
            </h3>
            <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl p-5">
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                {physician.noteToSelf || "No notes available."}
              </p>
            </div>
          </section>

          {/* Documents */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Documents
            </h3>
            <div className="grid gap-3">
              {physician.documents && physician.documents.length > 0 ? (
                physician.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#0B101E] border border-[#1E293B] rounded-xl group hover:border-[#334155] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors truncate w-48">{doc.split('/').pop()}</h4>
                        <p className="text-[10px] font-medium text-gray-500 uppercase">Document File</p>
                      </div>
                    </div>
                    <a href={doc} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border border-dashed border-[#1E293B] rounded-xl text-gray-600 text-xs italic">
                  No documents uploaded.
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
