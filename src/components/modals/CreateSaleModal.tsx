"use client";

import { X, Calendar, Download, Trash2, Printer, Check, Plus, UploadCloud, ChevronDown, FileText } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSaleModal({ isOpen, onClose }: CreateSaleModalProps) {
  const [saleType, setSaleType] = useState<'sold' | 'consigned'>('sold');
  const [generatePackingSlip, setGeneratePackingSlip] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:py-8 lg:p-12 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[900px] h-full sm:h-auto max-h-[90vh] bg-[#0F1423] rounded-2xl shadow-2xl flex flex-col border border-white/5 overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B101E] shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-wide">Create Sale</h2>
          </div>
        </div>

        {/* Scrollable Body - Web version: 2 columns for wider screens */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0F1423]">
          <div className="p-6 md:p-8">

            {/* SALE TYPE SEGMENT CONTROL */}
            <div className="mb-8">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 block">
                SALE TYPE
              </label>
              <div className="flex bg-[#0B101E] p-1 rounded-lg border border-white/5 w-full max-w-sm">
                <button
                  onClick={() => setSaleType('sold')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                    saleType === 'sold'
                      ? "bg-[#00E5FF] text-[#0B101E] shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  Sold
                </button>
                <button
                  onClick={() => setSaleType('consigned')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                    saleType === 'consigned'
                      ? "bg-[#00E5FF] text-[#0B101E] shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  Consigned
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

              {/* LEFT COLUMN */}
              <div className="space-y-8">

                {/* Shipment Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <span className="text-xs">📦</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">Shipment Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-400">Doctor</label>
                      <input
                        type="text"
                        defaultValue="Dr. Jane Smith"
                        className="w-full bg-[#0B101E] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all placeholder-gray-600"
                        placeholder="Search Doctor"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-400">Facility / Location</label>
                      <div className="relative">
                        <select className="appearance-none w-full bg-[#0B101E] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all cursor-pointer">
                          <option>Search Facility (e.g. City Hospital)</option>
                          <option>City Hospital</option>
                          <option>Metro Medical Center</option>
                        </select>
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <div className="w-4 h-4 rounded bg-white/10 text-[10px] flex items-center justify-center font-bold text-white">+</div>
                        </div>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-400">Procedure Date (DOS)</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full bg-[#0B101E] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <button className="w-full border border-dashed border-[#00E5FF]/30 bg-[#00E5FF]/5 hover:bg-[#00E5FF]/10 text-[#00E5FF] font-medium py-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all mt-2">
                      <Plus className="w-4 h-4" />
                      Add Products from Inventory
                    </button>
                  </div>
                </div>

                {/* Add Representatives */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Add Representatives</h3>
                    <button className="text-[11px] text-[#00E5FF] hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Rep 1 */}
                    <div className="bg-[#0B101E] border border-white/5 rounded-xl p-3 sm:p-4 flex items-center justify-between hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/20">
                          JD
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Jordan Dixon</div>
                          <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase mt-1 w-max">Primary</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 font-medium mb-1">Commission</div>
                        <div className="flex items-center gap-1 bg-[#0F1423] border border-white/10 rounded px-2 py-1">
                          <span className="font-bold text-white text-sm">70</span>
                          <span className="text-gray-500 text-xs">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Rep 2 */}
                    <div className="bg-[#0B101E] border border-white/5 rounded-xl p-3 sm:p-4 hover:border-white/10 transition-colors relative group">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/20">
                            AD
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">Axl Dixon</div>
                            <div className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase mt-1 w-max">Assist</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-gray-400 font-medium mb-1">Commission</div>
                          <div className="flex items-center gap-1 bg-[#0F1423] border border-rose-500/20 rounded px-2 py-1">
                            <span className="font-bold text-white text-sm">30</span>
                            <span className="text-gray-500 text-xs">%</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full text-center text-[10px] font-medium text-rose-500 tracking-wider uppercase mt-4 hover:text-rose-400 transition-colors">
                        remove representative
                      </button>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Total must equal 100% — Currently 100%
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8">

                {/* Billing */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <span className="text-xs">💳</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">Billing</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-400">Vendor</label>
                      <input
                        type="text"
                        defaultValue="MedTech Solutions"
                        className="w-full bg-[#0B101E] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-gray-400">PO Number</label>
                        <input
                          type="text"
                          defaultValue="PO-12345"
                          className="w-full bg-[#0B101E] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-gray-400">Total Bill ($)</label>
                        <input
                          type="text"
                          defaultValue="0.00"
                          className="w-full bg-[#0B101E] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-400">Vendor Payment</label>
                      <input
                        type="text"
                        defaultValue="500.0"
                        className="w-full bg-[#0B101E] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">Attachments</h3>
                    <button className="text-[11px] text-[#00E5FF] hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors">
                      <UploadCloud className="w-3 h-3" /> Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Big Attachment Card with fake preview */}
                    <div className="relative h-32 rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#00E5FF]/50 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10"></div>
                      <div className="absolute inset-0 bg-[#1E293B] bg-[url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="text-sm font-semibold text-white truncate">Doctor_Sheet_v4_Signed.pdf</div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase mt-1">UPLOADED OCT 24, 2023 • 2.4 MB</div>
                      </div>
                      <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white border border-white/10">
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Small Attachment 1 */}
                    <div className="flex items-center justify-between bg-[#0B101E] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">Surgical_Report_Jenkins.pdf</div>
                          <div className="text-[10px] text-gray-500">1.1 MB</div>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-white transition-colors p-2">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Small Attachment 2 */}
                    <div className="flex items-center justify-between bg-[#0B101E] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">Facility_Auth_Letter.docx</div>
                          <div className="text-[10px] text-gray-500">842 KB</div>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-white transition-colors p-2">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="text-sm font-bold text-white mb-2 block">Additional Notes</label>
                  <textarea
                    className="w-full h-24 bg-[#0B101E] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all resize-none placeholder-gray-600 custom-scrollbar"
                    placeholder="Add any specific case details or instructions..."
                  ></textarea>
                  <div className="text-right text-[10px] text-gray-500 mt-1">Write at least 60 characters.</div>
                </div>

                {/* Packing Slip */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Printer className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Packing Slip</h3>
                  </div>
                  <div
                    className="bg-[#0B101E] border border-white/5 hover:border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors"
                    onClick={() => setGeneratePackingSlip(!generatePackingSlip)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                        <Printer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Generate Packing Slip</div>
                        <div className="text-[11px] text-gray-400">PDF Preview generated</div>
                      </div>
                    </div>
                    <div className="p-1">
                      {generatePackingSlip ? (
                        <div className="w-5 h-5 rounded bg-[#00E5FF] text-[#0B101E] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-gray-600 bg-transparent" />
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer (Sticky Bottom) */}
        <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0B101E] shrink-0 mt-auto shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
          <button className="w-full bg-[#00E5FF] hover:bg-cyan-400 text-[#0B101E] font-medium py-3.5 sm:py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm sm:text-base">
            Create Sale Record
          </button>
        </div>

      </div>
    </div>
  );
}
