"use client";

import { X, CheckCircle2, AlertCircle, DollarSign, Calendar, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useTheme } from "next-themes";


interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    _id: string;
    vendorName: string;
    invoiceNumber: string;
    amount: number;
  } | null;
  onConfirm: () => void;
}

export function ConfirmPaymentModal({ isOpen, onClose, paymentData, onConfirm }: ConfirmPaymentModalProps) {
  const { resolvedTheme } = useTheme();

  if (!isOpen || !paymentData) return null;


  const handleConfirm = () => {
    // Simulating API call
    toast.success(`Payment for ${paymentData.invoiceNumber} processed successfully!`, {
      style: {
        borderRadius: '10px',
        background: resolvedTheme === 'dark' ? '#0F172A' : '#fff',
        color: resolvedTheme === 'dark' ? '#fff' : '#0F172A',
        border: resolvedTheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
      },
      iconTheme: {
        primary: '#10B981',
        secondary: '#fff',
      },
    });
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#0F1423] rounded-2xl shadow-2xl border border-white/5 overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Confirm Payment</h2>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Vendor Disbursement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-[#0B101E] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Vendor</span>
              <span className="text-sm font-bold text-white text-right">{paymentData.vendorName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Invoice #</span>
              <span className="text-sm font-mono font-medium text-gray-300">{paymentData.invoiceNumber}</span>
            </div>
            <div className="pt-3 border-t border-white/5 flex justify-between items-end">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Amount</span>
              <div className="text-2xl font-black text-primary tracking-tight">
                ${paymentData.amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-blue-300/80 font-medium">
              By confirming, you are authorizing the system to mark this invoice as <span className="text-blue-400 font-bold">PAID</span>. This action will update financial reports and vendor balances.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-xs font-bold text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all cursor-pointer "
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[2] px-4 py-3 text-xs font-bold text-[#0B101E] bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2 cursor-pointer "
          >
            <CheckCircle2 className="w-4 h-4" />
            CONFIRM PAYMENT
          </button>
        </div>

      </div>
    </div>
  );
}
