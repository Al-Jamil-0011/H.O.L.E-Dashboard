"use client";

import { useState } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddPhysicianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPhysicianModal({ isOpen, onClose }: AddPhysicianModalProps) {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const availableSpecialties = ["Ortho", "Neuro", "Pain", "Spine", "Peds", "DPM"];

  const toggleSpecialty = (spec: string) => {
    setSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0B101E] border-l border-[#1E293B] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#1E293B]">
              <X className="h-5 w-5" />
            </button>
            Add Physician
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-[#1E293B]">
          
          {/* Basic Information */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Basic Information</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Full Name</label>
                <input type="text" placeholder="Dr. Jane Smith" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Practice Name</label>
                <input type="text" placeholder="Central Orthopedics" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Specialty</label>
                <div className="flex flex-wrap gap-2">
                  {availableSpecialties.map(spec => (
                    <button
                      key={spec}
                      onClick={() => toggleSpecialty(spec)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all",
                        specialties.includes(spec) 
                          ? "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50" 
                          : "bg-[#151B2B] text-gray-400 border-[#334155] hover:bg-[#1E293B]"
                      )}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contact</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Phone Number</label>
                <input type="text" placeholder="(555) 123-4567" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Cell</label>
                <input type="text" placeholder="(555) 987-6543" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Email Address</label>
                <input type="email" placeholder="physician@example.com" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Date of Birth</label>
                <input type="date" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors [color-scheme:dark]" />
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Documents (Optional)</h3>
            
            <div className="space-y-3">
              <div className="border border-dashed border-[#334155] rounded-xl p-6 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
                <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2 group-hover:text-[#00E5FF]" />
                <p className="text-sm font-bold text-gray-300">Business Card</p>
                <p className="text-[10px] text-gray-500">Upload scan or photo</p>
              </div>
              
              <div className="border border-dashed border-[#334155] rounded-xl p-6 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
                <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2 group-hover:text-[#00E5FF]" />
                <p className="text-sm font-bold text-gray-300">Profile Picture</p>
                <p className="text-[10px] text-gray-500">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Note</h3>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Note to Self</label>
              <textarea 
                placeholder="Add private notes about this physician..."
                rows={4}
                className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors resize-none"
              ></textarea>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#1E293B] bg-[#0B101E] space-y-3">
          <button className="w-full py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            Save Physician
          </button>
          <button onClick={onClose} className="w-full py-3 text-sm font-bold text-gray-300 bg-transparent border border-[#334155] rounded-xl hover:bg-[#1E293B] transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </>
  );
}
