"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Plus, Filter, MoreVertical, Stethoscope, MapPin, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AddPhysicianModal } from './components/AddPhysicianModal';
import { AddSurgeryModal } from './components/AddSurgeryModal';

// MOCK DATA
const mockPhysicians = [
  { id: 'dr_john_smith', name: 'Dr. John Smith', specialty: 'Orthopedic Surgeon', practice: 'City Hospital', phone: '(212) 555-0100', email: 'jsmith@cityhospital.org', tags: ['Ortho'] },
  { id: 'dr_emily_johnson', name: 'Dr. Emily Johnson', specialty: 'Pediatrician', practice: 'Greenwood Clinic', phone: '(555) 123-4567', email: 'emily.j@greenwood.com', tags: ['Peds'] },
  { id: 'dr_michael_davis', name: 'Dr. Michael Davis', specialty: 'Neurosurgeon', practice: 'Downtown Medical Center', phone: '(555) 987-6543', email: 'mdavis@downtown.org', tags: ['Neuro', 'Spine'] },
];

const mockSurgeries = [
  { id: 'sur_001', patientName: 'Michael Johnson', procedure: 'Knee Replacement 1', date: 'Oct 24, 2026', time: '08:30 AM', facility: 'General Hospital', physicianId: 'dr_john_smith' },
  { id: 'sur_002', patientName: 'Sarah Williams', procedure: 'Spinal Fusion', date: 'Nov 02, 2026', time: '10:00 AM', facility: 'City Hospital', physicianId: 'dr_michael_davis' },
  { id: 'sur_003', patientName: 'David Brown', procedure: 'ACL Reconstruction', date: 'Nov 15, 2026', time: '01:30 PM', facility: 'Greenwood Clinic', physicianId: 'dr_john_smith' },
];

export default function PhysiciansAndSurgeriesPage() {
  const [activeTab, setActiveTab] = useState<'physicians' | 'surgeries'>('physicians');
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddPhysicianOpen, setIsAddPhysicianOpen] = useState(false);
  const [isAddSurgeryOpen, setIsAddSurgeryOpen] = useState(false);

  const filteredPhysicians = mockPhysicians.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty.toLowerCase().includes(search.toLowerCase()) ||
    p.practice.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSurgeries = mockSurgeries.filter(s => 
    s.patientName.toLowerCase().includes(search.toLowerCase()) ||
    s.facility.toLowerCase().includes(search.toLowerCase()) ||
    s.procedure.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {activeTab === 'physicians' ? 'Physicians' : 'All Surgeries'}
          </h1>
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            {activeTab === 'physicians' ? 'Manage doctors & surgeries' : 'Manage all scheduled and completed surgeries'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#151B2B] p-1 rounded-xl border border-[#1E293B]">
            <button 
              onClick={() => setActiveTab('physicians')}
              className={cn(
                "px-5 py-2 text-sm font-bold rounded-lg transition-all",
                activeTab === 'physicians' ? "bg-[#1E293B] text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              )}
            >
              Physicians
            </button>
            <button 
              onClick={() => setActiveTab('surgeries')}
              className={cn(
                "px-5 py-2 text-sm font-bold rounded-lg transition-all",
                activeTab === 'surgeries' ? "bg-[#1E293B] text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              )}
            >
              Surgeries
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND ADD BUTTON */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder={activeTab === 'physicians' ? "Search by PT/PT, Surgeon, or facility..." : "Search by patient, facility or procedure..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151B2B] border border-[#1E293B] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] transition-all shadow-sm"
          />
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-300 bg-[#151B2B] border border-[#1E293B] rounded-xl hover:text-white hover:bg-[#1E293B] transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
        <button 
          onClick={() => activeTab === 'physicians' ? setIsAddPhysicianOpen(true) : setIsAddSurgeryOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all hover:bg-cyan-400"
        >
          <Plus className="h-4 w-4" /> 
          {activeTab === 'physicians' ? 'Add Physician' : 'Add Surgery'}
        </button>
      </div>

      {/* LIST LAYOUT */}
      <div className="space-y-3">
        {activeTab === 'physicians' ? (
          /* PHYSICIANS CARDS */
          filteredPhysicians.map(physician => (
            <div key={physician.id} className="group relative flex items-center justify-between p-4 bg-[#151B2B] border border-[#1E293B] rounded-2xl hover:border-[#00E5FF]/30 transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.05)]">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0B101E] flex items-center justify-center border border-[#334155] overflow-hidden">
                  <Stethoscope className="h-6 w-6 text-[#00E5FF]/50" />
                  {/* <Image src="..." /> */}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{physician.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[#00E5FF]">
                    <span>{physician.specialty}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-gray-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {physician.practice}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  {physician.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] uppercase tracking-wider border border-[#00E5FF]/20">
                      {tag}
                    </span>
                  ))}
                </div>
                {/* 3 DOT MENU & ACTIONS */}
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/admin/dashboard/physicians/${physician.id}`} className="px-4 py-1.5 text-xs font-bold text-gray-300 bg-[#1E293B] rounded-lg hover:text-white hover:bg-[#334155] transition-colors">
                    View Profile
                  </Link>
                  <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* SURGERIES CARDS */
          filteredSurgeries.map(surgery => (
            <div key={surgery.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#151B2B] border border-[#1E293B] rounded-2xl hover:border-[#00E5FF]/30 transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.05)]">
              <div className="flex items-start gap-4">
                <div className="relative mt-1 h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{surgery.patientName}</h3>
                  <p className="text-[11px] font-medium text-gray-400">{surgery.procedure}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {surgery.facility}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {surgery.date} • {surgery.time}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex justify-end">
                <Link href={`/admin/dashboard/physicians/surgeries/${surgery.id}`} className="px-5 py-2 text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-lg hover:bg-[#00E5FF]/20 transition-colors">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODALS */}
      <AddPhysicianModal isOpen={isAddPhysicianOpen} onClose={() => setIsAddPhysicianOpen(false)} />
      <AddSurgeryModal isOpen={isAddSurgeryOpen} onClose={() => setIsAddSurgeryOpen(false)} />

    </div>
  );
}
