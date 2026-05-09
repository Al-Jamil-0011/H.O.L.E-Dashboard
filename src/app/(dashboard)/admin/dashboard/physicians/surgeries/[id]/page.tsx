"use client";

import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  UserCircle2, 
  FileText, 
  Download,
  Calendar,
  Building2,
  Stethoscope,
  Activity,
  PenSquare,
  Package,
  Layers,
  Link2,
  Syringe,
  Box
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

// MOCK DATA
const mockSurgeryDetails = {
  id: 'sur_001',
  patientName: 'John Doe',
  ptId: '132135454',
  physician: 'Dr. Sarah Jenkins',
  facility: 'St. Jude Medical Center',
  date: '27 March, 2026',
  surgeryType: 'General',
  attachments: [
    { name: 'Surgery Sheet.pdf', type: 'pdf', icon: FileText },
    { name: 'Medical Report.docx', type: 'doc', icon: FileText }
  ],
  materials: {
    screws: ['Pedicle Screw 6.5mm x 45mm QTY (4)'],
    rods: ['Titanium Rod 5.5mm x 100mm QTY (2)'],
    plates: ['Pedicle Screw 6.5mm x 45mm QTY (4)'],
    implants: ['PEEK Inter body Cage QTY (2)'],
    biologics: ['Pedicle Screw 6.5mm x 45mm QTY (1)']
  },
  radiologyImages: [
    { type: 'AP POST', url: '/ap-post.jpg' },
    { type: 'AP PRE', url: '/ap-pre.jpg' },
    { type: 'LATERAL POST', url: '/lat-post.jpg' },
    { type: 'LATERAL PRE', url: '/lat-pre.jpg' }
  ]
};

export default function SurgeryDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  // In a real application, you would fetch details by ID here
  const details = mockSurgeryDetails;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-12 max-w-4xl mx-auto">
      
      {/* TOP NAV & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/admin/dashboard/physicians"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Surgery Details
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#00E5FF] rounded-lg hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <PenSquare className="h-4 w-4" /> Edit Surgery
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-300 bg-[#151B2B] border border-[#1E293B] rounded-lg hover:text-white hover:bg-[#1E293B] transition-colors">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-[#151B2B] border border-[#1E293B] rounded-2xl shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="relative p-8 flex flex-col items-center justify-center text-center border-b border-[#1E293B]">
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#00E5FF]/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="h-20 w-20 rounded-full bg-[#1E293B] flex items-center justify-center border-4 border-[#0B101E] shadow-xl mx-auto mb-4">
              <UserCircle2 className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{details.patientName}</h1>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN: Info & Attachments */}
          <div className="space-y-8">
            
            {/* Surgery Info */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Surgery Info
              </h3>
              
              <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Physician</span>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-gray-400" /> {details.physician}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">PT ID</span>
                  <span className="text-sm font-bold text-white">{details.ptId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Facility</span>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" /> {details.facility}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Date of Surgery</span>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" /> {details.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Surgery Type</span>
                  <span className="text-sm font-bold text-white">{details.surgeryType}</span>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Attachments
              </h3>
              
              <div className="space-y-3">
                {details.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#0B101E] border border-[#1E293B] rounded-xl hover:border-[#334155] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg flex items-center justify-center",
                        file.type === 'pdf' ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        <file.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{file.name}</span>
                    </div>
                    <Download className="h-4 w-4 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
                  </div>
                ))}
              </div>
            </section>

            {/* Radiology Images Grid */}
            <section className="space-y-4 pt-4 border-t border-[#1E293B]">
              <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Radiology Images
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {details.radiologyImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square bg-[#0B101E] border border-[#1E293B] rounded-xl overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B] text-gray-500 group-hover:text-gray-300 transition-colors">
                      {/* Placeholder for actual image */}
                      <Activity className="h-8 w-8 opacity-50" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-black/60 backdrop-blur-sm">
                      <p className="text-[10px] font-bold text-center text-[#00E5FF] tracking-widest">{img.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* RIGHT COLUMN: Materials */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Surgery Materials
              </h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#0B101E] px-2 py-1 rounded-md border border-[#1E293B]">5 ITEMS LOGGED</span>
            </div>

            <div className="space-y-4">
              
              {/* Screws */}
              <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#151B2B] border-b border-[#1E293B] flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-[#00E5FF]" />
                  <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-widest">Screws</span>
                </div>
                <div className="p-4 space-y-2">
                  {details.materials.screws.map((item, idx) => (
                    <div key={idx} className="text-sm font-medium text-gray-300">{item}</div>
                  ))}
                </div>
              </div>

              {/* Rods / Connectors */}
              <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#151B2B] border-b border-[#1E293B] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#00E5FF]" />
                  <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-widest">Rods / Connectors</span>
                </div>
                <div className="p-4 space-y-2">
                  {details.materials.rods.map((item, idx) => (
                    <div key={idx} className="text-sm font-medium text-gray-300">{item}</div>
                  ))}
                </div>
              </div>

              {/* Plates */}
              <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#151B2B] border-b border-[#1E293B] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#00E5FF]" />
                  <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-widest">Plates</span>
                </div>
                <div className="p-4 space-y-2">
                  {details.materials.plates.map((item, idx) => (
                    <div key={idx} className="text-sm font-medium text-gray-300">{item}</div>
                  ))}
                </div>
              </div>

              {/* Implants */}
              <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#151B2B] border-b border-[#1E293B] flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#00E5FF]" />
                  <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-widest">Implants</span>
                </div>
                <div className="p-4 space-y-2">
                  {details.materials.implants.map((item, idx) => (
                    <div key={idx} className="text-sm font-medium text-gray-300">{item}</div>
                  ))}
                </div>
              </div>

              {/* Biologics */}
              <div className="bg-[#0B101E] border border-[#1E293B] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#151B2B] border-b border-[#1E293B] flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-[#00E5FF]" />
                  <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-widest">Biologics</span>
                </div>
                <div className="p-4 space-y-2">
                  {details.materials.biologics.map((item, idx) => (
                    <div key={idx} className="text-sm font-medium text-gray-300">{item}</div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)]">
          Send to Doctor Email <span className="text-[10px]">▶</span>
        </button>
      </div>

    </div>
  );
}
