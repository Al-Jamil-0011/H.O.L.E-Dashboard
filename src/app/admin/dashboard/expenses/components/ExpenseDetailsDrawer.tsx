"use client";

import { X, CheckCircle2, ChevronLeft, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpenseItem {
  id: number;
  expense: string;
  category: string;
  amount: string;
  date: string;
  submittedBy: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  role: string;
  submittedTime: string;
  physicianClient: string;
  paidStatus: string;
  description: string;
  attachments: { name: string; size: string; type: 'pdf' | 'jpg' | 'doc' }[];
}

interface ExpenseDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
  onApprove: (expense: ExpenseItem) => void;
  onReject: (expense: ExpenseItem) => void;
}

export function ExpenseDetailsDrawer({ isOpen, onClose, expense, onApprove, onReject }: ExpenseDetailsDrawerProps) {
  if (!isOpen || !expense) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#18181B] border-l border-[#27272A] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[#27272A] bg-[#18181B] shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-bold text-white tracking-tight">Expense Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#27272A] p-5 space-y-6 bg-[#18181B]">

          {/* PROFILE CARD */}
          <div className="bg-[#202024] border border-[#27272A] rounded-2xl p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-700 overflow-hidden shrink-0 border-2 border-[#27272A]">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${expense.submittedBy}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{expense.submittedBy}</h3>
              <p className="text-xs text-[#00E5FF] font-medium mb-1">{expense.role}</p>
              <p className="text-[10px] text-gray-500">Submitted: {expense.submittedTime}</p>
            </div>
          </div>

          {/* TOTAL AMOUNT */}
          <div className="bg-[#202024] border border-[#27272A] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TOTAL AMOUNT</p>
              <p className="text-3xl font-black tracking-tight text-white">{expense.amount}</p>
            </div>
            <span className={cn(
              "px-3 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider",
              expense.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                expense.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            )}>
              {expense.status}
            </span>
          </div>

          {/* EXPENSE DETAILS GRID */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Expense Details</h3>
            <div className="bg-[#202024] border border-[#27272A] rounded-2xl divide-y divide-[#27272A]">
              <div className="flex justify-between p-4">
                <span className="text-xs text-gray-400 font-medium">Physician / Client</span>
                <span className="text-xs text-white font-medium">{expense.physicianClient}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-xs text-gray-400 font-medium">Category</span>
                <span className="text-xs text-white font-medium">{expense.category}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-xs text-gray-400 font-medium">Date of Expense</span>
                <span className="text-xs text-white font-medium">{expense.date}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-xs text-gray-400 font-medium">Paid Status</span>
                <span className="text-xs text-white font-medium">{expense.paidStatus}</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Expense Details</h3>
            <div className="bg-[#202024] border border-[#27272A] rounded-2xl p-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                {expense.description}
              </p>
            </div>
          </div>

          {/* ATTACHMENTS */}
          {expense.attachments && expense.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Attachments</h3>
              <div className="space-y-2">
                {expense.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#202024] border border-[#27272A] rounded-2xl group hover:border-[#3F3F46] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg flex items-center justify-center shrink-0",
                        file.type === 'pdf' ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        {file.type === 'pdf' ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">{file.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{file.size}</p>
                      </div>
                    </div>
                    <button className="h-8 w-8 rounded-full flex items-center justify-center text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* STICKY BOTTOM ACTIONS */}
        {expense.status === 'PENDING' && (
          <div className="p-5 border-t border-[#27272A] bg-[#18181B] shrink-0 flex gap-3">
            <button
              onClick={() => onReject(expense)}
              className="flex-1 py-3.5 bg-transparent border border-[#27272A] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <X className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => onApprove(expense)}
              className="flex-1 py-3.5 bg-[#00E5FF] hover:bg-cyan-400 text-[#0B101E] rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve
            </button>
          </div>
        )}

      </div>
    </>
  );
}
