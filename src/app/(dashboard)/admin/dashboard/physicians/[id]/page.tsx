"use client";

import Loader from "@/components/loader";
import { useSinglePhysician, useUpdatePhysician } from "@/hooks/admin/physicians";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  FileText,
  Download,
  Building2,
  PenSquareIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AddPhysicianModal } from "../components/AddPhysicianModal";


export default function PhysicianProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { physician, loading: isLoading } = useSinglePhysician(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader size={32} text="Fetching physician data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-8 pb-12">

      {/* TOP NAV & ACTIONS */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard/physicians"
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Physician Profile
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium dark:text-black text-white bg-primary rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <PenSquareIcon className="h-4 w-4" /> Edit Physician
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground bg-card border border-border rounded-lg hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl dark:shadow-sm overflow-hidden">

        {/* PROFILE HEADER */}
        <div className="relative flex flex-col items-start border-b border-border">
          {/* Background Glow */}
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="relative flex items-center gap-6 p-4 z-10">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-4 border-card shadow-xl mx-auto mb-4 overflow-hidden relative">
              <div className={cn(
                "absolute bottom-1 right-1 w-4 h-4 border-2 border-card rounded-full z-20",
                physician?.isDeleted ? "bg-rose-500" : "bg-emerald-500"
              )} />
              {physician?.profileUrl ? (
                <Image
                  src={physician?.profileUrl || ""}
                  fill className="object-cover"
                  alt={physician.fullName} />
              ) : (
                <Stethoscope className="h-10 w-10 text-primary/50" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black text-foreground tracking-tight mb-2">{physician?.fullName}</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                  {physician?.specialty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE BODY */}
        <div className="p-8 space-y-10">

          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Basic Info
            </h3>

            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Practice Name</p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {physician?.practice}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Phone</p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {physician?.contactInfo?.phoneNumber}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cell</p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {physician?.contactInfo?.cellNumber}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Email Address</p>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Mail className="h-4 w-4 text-primary/70" />
                  <a href={`mailto:${physician?.contactInfo?.email}`} className="hover:underline">{physician?.contactInfo?.email}</a>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Birthday</p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {physician?.contactInfo?.dateOfBirth ? new Date(physician?.contactInfo?.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Notes
            </h3>
            <div className="bg-muted/50 border border-border rounded-xl p-5">
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {physician?.noteToSelf || "No notes available."}
              </p>
            </div>
          </section>

          {/* Documents */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Documents
            </h3>
            <div className="grid gap-3">
              {physician?.documents && physician?.documents.length > 0 ? (
                physician?.documents?.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate w-48">{doc.split('/').pop()}</h4>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase">Document File</p>
                      </div>
                    </div>
                    <a href={doc} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-xs italic">
                  No documents uploaded.
                </div>
              )}
            </div>
          </section>

        </div>
      </div>

      <AddPhysicianModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={physician}
      />
    </div>
  );
}
