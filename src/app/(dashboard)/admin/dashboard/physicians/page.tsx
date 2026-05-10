"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Plus, Filter, MoreVertical, Stethoscope, MapPin, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable } from '@/components/ui/DataTable';
import { AddPhysicianModal } from './components/AddPhysicianModal';
import { AddSurgeryModal } from './components/AddSurgeryModal';
import { usePhysicians } from '@/hooks/admin/physicians';
import { useSurgeries } from '@/hooks/admin/surgeries';

export default function PhysiciansAndSurgeriesPage() {
  const [activeTab, setActiveTab] = useState<'physicians' | 'surgeries'>('physicians');
  const [search, setSearch] = useState('');

  const { physicians, loading: isPhysiciansLoading, setQuery, refetch: refetchPhysicians } = usePhysicians();
  const { surgeries, loading: isSurgeriesLoading, setQuery: setSurgeriesQuery, refetch: refetchSurgeries } = useSurgeries();

  // DEBOUNCED SEARCH
  useEffect(() => {
    const handler = setTimeout(() => {
      if (activeTab === 'physicians') {
        setQuery(prev => {
          if (prev.searchTerm === search) return prev;
          return { ...prev, searchTerm: search, page: 1 };
        });
      } else {
        setSurgeriesQuery(prev => {
          if (prev.searchTerm === search) return prev;
          return { ...prev, searchTerm: search, page: 1 };
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [search, setQuery, setSurgeriesQuery, activeTab]);

  // Modals state
  const [isAddPhysicianOpen, setIsAddPhysicianOpen] = useState(false);
  const [isAddSurgeryOpen, setIsAddSurgeryOpen] = useState(false);

  const physicianColumns = [
    {
      header: "FULL NAME",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
            <Stethoscope className="h-4 w-4" />
          </div>
          <span className="font-bold text-white">{item.fullName}</span>
        </div>
      )
    },
    {
      header: "SPECIALTY",
      render: (item: any) => {
        const specialty = typeof item.specialty === 'object' ? item.specialty.name : item.specialty;
        return <span className="text-[#00E5FF] font-medium capitalize">{specialty || 'N/A'}</span>;
      }
    },
    {
      header: "PRACTICE",
      render: (item: any) => {
        const practice = typeof item.practice === 'object' ? item.practice.name : item.practice;
        return <span className="text-gray-400">{practice || 'N/A'}</span>;
      }
    },
    {
      header: "CONTACT",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="text-white text-xs">{item.contactInfo?.email}</span>
          <span className="text-gray-500 text-xs pt-2">{item.contactInfo?.phoneNumber}</span>
        </div>
      )
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/dashboard/physicians/${item._id}`} className="px-3 py-1.5 text-[10px] font-bold text-[#00E5FF] border border-[#00E5FF]/20 bg-[#00E5FF]/5 rounded-md hover:bg-[#00E5FF]/10 transition-colors">
            View Profile
          </Link>
          {/* <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button> */}
        </div>
      )
    }
  ];

  const surgeryColumns = [
    {
      header: "PATIENT",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-bold text-white">{item.info?.fullName}</span>
        </div>
      )
    },
    { header: "PROCEDURE", render: (item: any) => <span className="text-gray-400 font-medium">{item.info?.surgeryType}</span> },
    {
      header: "FACILITY",
      render: (item: any) => (
        <span className="text-gray-500 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {typeof item.info?.facility === 'object' ? item.info?.facility?.name : item.info?.facility}
        </span>
      )
    },
    {
      header: "PHYSICIAN",
      render: (item: any) => (
        <span className="text-gray-400 font-medium">
          {typeof item.info?.physician === 'object' ? item.info?.physician?.fullName : item.info?.physician}
        </span>
      )
    },
    {
      header: "DATE",
      render: (item: any) => (
        <span className="text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {item.info?.dateOfSurgery ? new Date(item.info.dateOfSurgery).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      header: "ACTIONS",
      render: (item: any) => (
        <Link href={`/admin/dashboard/physicians/surgeries/${item._id}`} className="px-3 py-1.5 text-[10px] font-bold text-[#00E5FF] border border-[#00E5FF]/20 bg-[#00E5FF]/5 rounded-md hover:bg-[#00E5FF]/10 transition-colors">
          View Details
        </Link>
      )
    }
  ];

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
            {['physicians', 'surgeries'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-5 py-2 text-sm font-bold rounded-lg transition-all capitalize cursor-pointer",
                  activeTab === tab ? "bg-[#1E293B] text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH AND ADD BUTTON */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder={activeTab === 'physicians' ? "Search by name, specialty, or practice..." : "Search by patient, facility or procedure..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151B2B] border border-[#1E293B] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] transition-all shadow-sm"
          />
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-300 bg-[#151B2B] border border-[#1E293B] rounded-xl hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer">
          <Filter className="h-4 w-4" /> Filter
        </button>
        <button
          onClick={() => activeTab === 'physicians' ? setIsAddPhysicianOpen(true) : setIsAddSurgeryOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all hover:bg-cyan-400 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {activeTab === 'physicians' ? 'Add Physician' : 'Add Surgery'}
        </button>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#151B2B] shadow-xl overflow-hidden min-h-[400px]">
        {activeTab === 'physicians' ? (
          <DataTable
            data={physicians}
            columns={physicianColumns}
            loading={isPhysiciansLoading}
            className="rounded-none border-0"
            onRowClick={() => { }}
          />
        ) : (
          <DataTable
            data={surgeries}
            columns={surgeryColumns}
            loading={isSurgeriesLoading}
            className="rounded-none border-0"
            onRowClick={() => { }}
          />
        )}
      </div>

      {/* MODALS */}
      <AddPhysicianModal isOpen={isAddPhysicianOpen} onClose={() => {
        setIsAddPhysicianOpen(false);
        refetchPhysicians();
      }} />
      <AddSurgeryModal isOpen={isAddSurgeryOpen} onClose={() => {
        setIsAddSurgeryOpen(false);
        refetchSurgeries();
      }} />

    </div>
  );
}

