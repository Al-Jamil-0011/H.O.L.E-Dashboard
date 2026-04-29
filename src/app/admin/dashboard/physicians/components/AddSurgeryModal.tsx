"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";

interface AddSurgeryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSurgeryModal({ isOpen, onClose }: AddSurgeryModalProps) {
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
            Add Surgery
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-[#1E293B]">
          
          {/* Surgery Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Surgery Info</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Physician</label>
                <select className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors appearance-none">
                  <option value="">Select Physician...</option>
                  <option value="dr_smith">Dr. John Smith</option>
                  <option value="dr_johnson">Dr. Emily Johnson</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Patient Identifier (PT ID)</label>
                <input type="text" placeholder="e.g. PT-123456" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Facility</label>
                <input type="text" placeholder="Hospital or Clinic name" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Date of Surgery</label>
                <input type="date" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors [color-scheme:dark]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Surgery Type</label>
                <input type="text" placeholder="Specific procedure name" className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
            </div>
          </section>

          {/* Surgery Materials */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Surgery Materials</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Screws</label>
                <input type="text" placeholder="Details..." className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Plates</label>
                <input type="text" placeholder="Details..." className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Rods/Connectors</label>
                <input type="text" placeholder="Details..." className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Implants</label>
                <input type="text" placeholder="Details..." className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Biologics</label>
                <input type="text" placeholder="Details..." className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
            </div>
          </section>

          {/* Radiology & Clinical Images */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Radiology & Clinical Images</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-dashed border-[#334155] rounded-xl p-4 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
                <Upload className="h-5 w-5 text-[#00E5FF] mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-300 uppercase">AP POST</p>
              </div>
              <div className="border border-dashed border-[#334155] rounded-xl p-4 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
                <Upload className="h-5 w-5 text-[#00E5FF] mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-300 uppercase">AP PRE</p>
              </div>
              <div className="border border-dashed border-[#334155] rounded-xl p-4 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
                <Upload className="h-5 w-5 text-[#00E5FF] mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-300 uppercase">LATERAL POST</p>
              </div>
              <div className="border border-dashed border-[#334155] rounded-xl p-4 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
                <Upload className="h-5 w-5 text-[#00E5FF] mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-300 uppercase">LATERAL PRE</p>
              </div>
              <div className="col-span-2 border border-dashed border-[#334155] rounded-xl p-4 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
                <Upload className="h-5 w-5 text-[#00E5FF] mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-300 uppercase">PATIENT STICKER</p>
              </div>
            </div>
          </section>

          {/* Documents & Notes */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Documents & Notes</h3>
            
            <div className="border border-dashed border-[#334155] rounded-xl p-6 text-center hover:bg-[#151B2B] hover:border-[#00E5FF]/50 transition-colors cursor-pointer group">
              <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2 group-hover:text-[#00E5FF]" />
              <p className="text-sm font-bold text-gray-300">Upload Other Files</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Case Notes</label>
              <textarea 
                placeholder="Enter surgical notes, complications, or specific instructions..."
                rows={4}
                className="w-full bg-[#151B2B] border border-[#334155] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#00E5FF] transition-colors resize-none"
              ></textarea>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#1E293B] bg-[#0B101E] space-y-3">
          <button className="w-full py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2">
            Save Surgery <span className="text-[10px]">▶</span>
          </button>
          <button onClick={onClose} className="w-full py-3 text-sm font-bold text-gray-300 bg-transparent border border-[#334155] rounded-xl hover:bg-[#1E293B] transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </>
  );
}
