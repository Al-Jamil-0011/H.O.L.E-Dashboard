"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, CheckCircle2, FileText, Download, Eye, Plus, 
  MessageSquare, Calendar, Building2, User, UserCircle2, 
  Activity, DollarSign, Stethoscope, Briefcase, MapPin, 
  AlertCircle, UploadCloud, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/DataTable';

// Mock Data
const saleDetails = {
  id: '#S-101',
  status: 'PENDING',
  type: 'Sold',
  rep: {
    name: 'Sarah Johnson',
    split: 30,
  },
  rep2: {
    name: 'Mike Chan',
    split: 70,
  },
  shipment: {
    physician: 'Dr. Sarah Jenkins',
    facility: 'Metropolitan General Hospital',
    procedureDate: '03/12/2026',
  },
  billing: {
    vendor: 'Med-Tech',
    poNumber: '12345',
    totalBill: 4200.00,
    commission: 420.00, // 10% of total
    commissionPercent: 10,
    commissionPool: 420.00, // Total to split
  },
  inventory: [
    { name: 'Tapered Stem - Size 4', sn: '002939-A', type: 'Implant' },
    { name: 'Acetabular Cup - 52mm', sn: 'TT3022-B', type: 'Tray' },
    { name: 'Bone Cement', sn: 'BC-9982', type: 'Bio' },
  ],
  documents: [
    { name: 'Packing Slip', type: 'pdf', size: '1.2 MB' },
    { name: 'PO_889_Final.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'Implant_Serial_Photo.jpg', type: 'image', size: '3.4 MB' },
  ],
  notes: {
    repNote: "Lunch meeting with Dr. Smith to discuss the new pharmaceutical lineup and distribution schedule for the downtown clinic. Procedure went smoothly, required an extra cup due to sizing issue during trial.",
  },
  auditTrail: [
    { label: 'Commission Calculated', by: 'System automated process', time: '10:45 AM', date: '03/15/2026', status: 'pending' },
    { label: 'Packing Slip Uploaded', by: 'David Miller', time: '09:20 AM', date: '03/15/2026', status: 'completed' },
    { label: 'Sale Record Created', by: 'Sarah Johnson', time: '08:00 AM', date: '03/15/2026', status: 'completed' },
  ]
};

export default function SaleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [saleStatus, setSaleStatus] = useState(saleDetails.status);
  const [adminNote, setAdminNote] = useState('');
  const [showRepNote, setShowRepNote] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  const handleApprove = () => {
    setSaleStatus('APPROVED');
    setShowApproveModal(false);
    // Add to audit trail (in a real app)
  };

  const handleSubmitNote = () => {
    if (!adminNote.trim()) return;
    setIsSubmittingNote(true);
    setTimeout(() => {
      setIsSubmittingNote(false);
      setNoteSuccess(true);
      setAdminNote('');
      setTimeout(() => setNoteSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in zoom-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#151B2B] p-5 rounded-xl border border-[#1E293B] shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/dashboard/sales')}
            className="p-2 bg-[#1E293B] hover:bg-[#334155] rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">Sale Details</h1>
              <span className="px-2.5 py-0.5 text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 rounded border border-[#00E5FF]/20">
                {saleDetails.id}
              </span>
              <StatusBadge status={saleStatus} type={saleStatus === 'APPROVED' ? 'success' : 'warning'} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRepNote(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium border border-[#334155]"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Rep Note</span>
          </button>
          
          <button 
            onClick={() => {
              document.getElementById('admin-note-section')?.scrollIntoView({ behavior: 'smooth' });
              document.getElementById('admin-note-input')?.focus();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#1E293B] text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium border border-[#334155]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Note</span>
          </button>
          
          {saleStatus !== 'APPROVED' && (
            <button 
              onClick={() => setShowApproveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00E5FF] text-[#0B101E] hover:bg-cyan-400 rounded-lg transition-all text-sm font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve Sale
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - MAIN CONTENT (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. SALE SUMMARY (TOP CARD) */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center">
                <UserCircle2 className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Primary Rep</p>
                <p className="text-base font-bold text-white">{saleDetails.rep.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sale Type</p>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="text-sm font-bold text-white">{saleDetails.type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SHIPMENT INFORMATION */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-[#00E5FF]" />
              Shipment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0B101E] rounded-lg p-3 border border-[#1E293B]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Physician</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <Stethoscope className="h-3 w-3 text-gray-400" />
                  {saleDetails.shipment.physician}
                </p>
              </div>
              <div className="bg-[#0B101E] rounded-lg p-3 border border-[#1E293B]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Facility</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="h-3 w-3 text-gray-400" />
                  {saleDetails.shipment.facility}
                </p>
              </div>
              <div className="bg-[#0B101E] rounded-lg p-3 border border-[#1E293B]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Procedure Date</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  {saleDetails.shipment.procedureDate}
                </p>
              </div>
            </div>
          </div>

          {/* 3. IMPLANT & BILLING */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-[#00E5FF]" />
              Implant & Billing
            </h2>
            
            <div className="bg-[#0B101E] rounded-xl border border-[#1E293B] overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-[#1E293B] border-b border-[#1E293B]">
                <div className="p-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Vendor</p>
                  <p className="text-sm font-bold text-[#00E5FF]">{saleDetails.billing.vendor}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">PO Number</p>
                  <p className="text-sm font-bold text-white">{saleDetails.billing.poNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 divide-x divide-[#1E293B]">
                <div className="p-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Bill</p>
                  <p className="text-xl font-black text-white">${saleDetails.billing.totalBill.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div className="p-4 bg-emerald-500/5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Commission ({saleDetails.billing.commissionPercent}%)</p>
                  <p className="text-xl font-black text-emerald-400">${saleDetails.billing.commission.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  <p className="text-[10px] text-emerald-500/70 font-medium mt-1">OF TOTAL</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. INVENTORY ITEM LIST */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-[#00E5FF]" />
              Inventory Item List
            </h2>
            
            <div className="space-y-2">
              {saleDetails.inventory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#0B101E] border border-[#1E293B] rounded-lg">
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">SN: {item.sn}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#1E293B] text-gray-300 border border-[#334155]">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-3 py-2 bg-[#0B101E] border border-[#1E293B] hover:bg-[#1E293B] rounded-lg text-xs font-bold text-[#00E5FF] transition-colors">
              View All Items
            </button>
          </div>

          {/* 7B. ADMIN NOTE SECTION */}
          <div id="admin-note-section" className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <MessageSquare className="h-4 w-4 text-[#00E5FF]" />
              Feedback & Comment
            </h2>
            
            <div className="bg-[#0B101E] rounded-xl border border-[#1E293B] p-4 space-y-4">
              <textarea 
                id="admin-note-input"
                className="w-full bg-[#151B2B] border border-[#1E293B] rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors resize-none h-24"
                placeholder="Leave a comment for the Rep..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2 max-w-[60%]">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase">Note to Manager</p>
                    <p className="text-[10px] text-gray-500">Comments are logged in the permanent audit trail for this transaction.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleSubmitNote}
                  disabled={isSubmittingNote || noteSuccess}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                    noteSuccess 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-[#00E5FF] text-[#0B101E] hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                  )}
                >
                  {isSubmittingNote ? (
                    <span className="w-4 h-4 border-2 border-[#0B101E] border-t-transparent rounded-full animate-spin"></span>
                  ) : noteSuccess ? (
                    <><CheckCircle2 className="h-4 w-4" /> Sent</>
                  ) : (
                    <>Send Feedback <ChevronLeft className="h-4 w-4 rotate-180" /></>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - SIDEBAR (1/3 width) */}
        <div className="space-y-6">
          
          {/* 5. REPRESENTATIVE SPLIT */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white mb-4">Representative Split</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#0B101E] p-3 rounded-lg border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#1E293B] flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-white">{saleDetails.rep.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-300">{saleDetails.rep.split}% Split</span>
              </div>
              
              <div className="flex items-center justify-between bg-[#0B101E] p-3 rounded-lg border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#1E293B] flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-white">{saleDetails.rep2.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-300">{saleDetails.rep2.split}% Split</span>
              </div>
              
              <div className="pt-4 border-t border-[#1E293B]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-400">Total Commission Pool</span>
                  <span className="text-lg font-black text-emerald-400">${saleDetails.billing.commissionPool.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <p className="text-[9px] text-gray-500 italic">Auto-calculated based on region tier 2 and product margins.</p>
              </div>
            </div>
          </div>

          {/* 6. DOCUMENTS */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white mb-4">Attachments</h2>
            
            <button className="w-full py-2.5 mb-4 bg-[#0B101E] border border-amber-500/50 hover:border-amber-500 rounded-lg text-xs font-bold text-amber-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              <FileText className="h-4 w-4" />
              Preview Packing Slip
            </button>
            
            <div className="space-y-2">
              {saleDetails.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#0B101E] border border-[#1E293B] rounded-lg group hover:border-[#334155] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded flex items-center justify-center shrink-0",
                      doc.type === 'pdf' ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                      {doc.type === 'pdf' ? <FileText className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[120px]">{doc.name}</p>
                      <p className="text-[10px] text-gray-500">{doc.size} • FEB 15</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-[#00E5FF] transition-colors rounded">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. AUDIT TRAIL / ACTIVITY TIMELINE */}
          <div className="bg-[#151B2B] rounded-xl border border-[#1E293B] p-5">
            <h2 className="text-sm font-bold text-white mb-4">Audit Trail</h2>
            
            <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#1E293B]">
              {saleDetails.auditTrail.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className={cn(
                    "absolute left-[-16px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#151B2B] shrink-0",
                    idx === 0 && event.status === 'pending' ? "bg-emerald-500" :
                    idx === 1 ? "bg-blue-500" : "bg-amber-500"
                  )}>
                    {idx === 0 ? <CheckCircle2 className="h-3 w-3 text-white" /> :
                     idx === 1 ? <UploadCloud className="h-3 w-3 text-white" /> :
                     <Activity className="h-3 w-3 text-white" />}
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="text-xs font-bold text-white">{event.label}</p>
                    <p className="text-[10px] text-gray-500">By {event.by}</p>
                    <p className="text-[10px] text-gray-600 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {event.date} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 9. PRIMARY ACTIONS (BOTTOM / STICKY) */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 bg-[#151B2B]/90 backdrop-blur-md border-t border-[#1E293B] z-40 flex items-center justify-end gap-3 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {saleStatus !== 'APPROVED' && (
          <button className="px-6 py-2.5 text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg transition-colors">
            Reject
          </button>
        )}
        {saleStatus !== 'APPROVED' ? (
          <button 
            onClick={() => setShowApproveModal(true)}
            className="px-8 py-2.5 text-sm font-bold text-[#0B101E] bg-[#00E5FF] hover:bg-cyan-400 rounded-lg transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve Sale
          </button>
        ) : (
          <div className="px-6 py-2.5 text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Sale Approved
          </div>
        )}
      </div>

      {/* 7A. REP ADDITIONAL NOTE MODAL */}
      {showRepNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#151B2B] border border-[#1E293B] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#1E293B] bg-[#181E2E]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#00E5FF]" />
                Rep Note
              </h3>
              <button 
                onClick={() => setShowRepNote(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <div className="p-5">
              <div className="bg-[#0B101E] border border-[#1E293B] rounded-lg p-4 relative">
                <div className="absolute -left-2 top-4 w-4 h-4 bg-[#0B101E] border-l border-t border-[#1E293B] rotate-[-45deg]"></div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-[#1E293B] flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{saleDetails.rep.name}</p>
                    <p className="text-[10px] text-gray-500">March 15, 2026 - 08:05 AM</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                  {saleDetails.notes.repNote}
                </p>
              </div>
              <button 
                onClick={() => setShowRepNote(false)}
                className="w-full mt-5 py-2 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE CONFIRMATION MODAL */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#151B2B] border border-[#1E293B] rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00E5FF]/20">
                <CheckCircle2 className="h-8 w-8 text-[#00E5FF]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Approve Sale</h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to approve sale {saleDetails.id}? 
                The commission will be moved to the Finance module.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 py-2.5 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApprove}
                  className="flex-1 py-2.5 bg-[#00E5FF] hover:bg-cyan-400 text-[#0B101E] rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                >
                  Confirm Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
