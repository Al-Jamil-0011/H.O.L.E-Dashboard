"use client";

import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, User, Briefcase, DollarSign, Receipt, 
  MapPin, CheckCircle2, AlertCircle, Users, BadgeDollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// MOCK DATA based on exact screenshot
const mockCommissionData = {
  id: 'C-1001',
  rep: {
    name: 'Sarah Johnson',
    title: 'Senior Sales Representative',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2776&auto=format&fit=crop'
  },
  financials: {
    totalCommissionDue: 420.00,
    status: 'UNPAID', // UNPAID
    saleAmount: 4200.00,
    rate: '10.00%',
    date: 'Oct 24, 2023',
  },
  context: {
    saleId: '#S1024',
    facility: 'City Hospital',
    territory: 'Northwest Region',
  },
  openBills: [
    { id: '#INV-2356', date: 'Oct 12, 2026', amount: 2400.00, status: 'PAID' }
  ],
  split: {
    reps: [
      { name: 'Marcus Aurelius', percentage: '30%' },
      { name: 'Lucius Vorenus', percentage: '30%' },
    ],
    totalPool: 252.00,
  }
};

export default function CommissionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Using mock data for demo
  const data = mockCommissionData;

  return (
    <div className="flex justify-center w-full pb-24 animate-in fade-in duration-500">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex items-center gap-4 border-b border-[#1E293B] pb-6">
          <button 
            onClick={() => router.push('/admin/dashboard/commissions')}
            className="p-2.5 bg-[#1E293B] hover:bg-[#334155] rounded-xl transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Commission Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - MAIN DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TRANSACTION DETAILS (FINANCIALS) */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#00E5FF]" /> Transaction Details
              </h2>
              
              <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Commission Due</p>
                    <p className="text-5xl font-black text-[#00E5FF] tracking-tight">
                      ${data.financials.totalCommissionDue.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-bold tracking-widest">{data.financials.status}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1E293B]">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sale Amount</p>
                    <p className="text-lg font-bold text-white">${data.financials.saleAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Rate</p>
                    <p className="text-lg font-bold text-[#00E5FF]">{data.financials.rate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-lg font-bold text-white">{data.financials.date}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TRANSACTION DETAILS (CONTEXT) */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#00E5FF]" /> Transaction Details
              </h2>
              
              <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] overflow-hidden shadow-sm">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                    <span className="text-sm font-medium text-gray-400">Sale ID</span>
                    <span className="text-lg font-bold text-amber-500">{data.context.saleId}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                    <span className="text-sm font-medium text-gray-400">Facility</span>
                    <span className="text-lg font-bold text-white">{data.context.facility}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-sm font-medium text-gray-400">Territory</span>
                    <span className="text-lg font-bold text-white">{data.context.territory}</span>
                  </div>
                </div>

                {/* OPEN BILLS TABLE */}
                <div className="m-6 mt-0 bg-[#0B101E] rounded-xl border border-[#1E293B] overflow-hidden">
                  <div className="p-4 border-b border-[#1E293B] flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold text-gray-300">Open Bills</span>
                  </div>
                  
                  <div className="p-4 grid grid-cols-3 gap-4 border-b border-[#1E293B] bg-[#151B2B]">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bill ID</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Amount</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Status</span>
                  </div>
                  
                  <div className="p-4">
                    {data.openBills.map((bill, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-4 items-center">
                        <div>
                          <p className="text-sm font-bold text-white">{bill.id}</p>
                          <p className="text-[10px] text-gray-500">{bill.date}</p>
                        </div>
                        <div className="text-sm font-bold text-white text-center">
                          ${bill.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-white tracking-widest">{bill.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="space-y-8">
            
            {/* REPRESENTATIVE CARD */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#00E5FF]" /> Representative
              </h2>
              
              <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-6 shadow-sm flex items-center gap-5">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0 bg-[#1E293B]">
                  <img src={data.rep.image} alt={data.rep.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{data.rep.name}</h3>
                  <p className="text-xs text-gray-400">{data.rep.title}</p>
                </div>
              </div>
            </div>

            {/* SPLIT COMMISSION */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-[#00E5FF]" /> Split Commission
              </h2>
              
              <div className="bg-[#151B2B] rounded-2xl border border-[#1E293B] p-6 shadow-sm space-y-4">
                {data.split.reps.map((rep, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#1E293B] flex items-center justify-center border border-[#334155]">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-300">{rep.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{rep.percentage} Split</span>
                  </div>
                ))}
                
                <div className="pt-6 mt-2 border-t border-[#1E293B]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400">Total Commission Pool</span>
                    <span className="text-lg font-black text-emerald-500">${data.split.totalPool.toFixed(2)}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 italic">Auto-calculated based on region tier 2 and product margins.</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-4">
              <button 
                onClick={() => toast.success('Commission successfully marked as paid!')}
                className="w-full py-4 text-sm font-bold text-amber-500 bg-[#151B2B] border border-amber-500/50 rounded-xl hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              >
                <BadgeDollarSign className="h-5 w-5" /> Mark Paid
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
