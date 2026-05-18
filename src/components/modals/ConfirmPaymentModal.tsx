"use client";

import { customToast } from '@/lib/utils';
import { X, CheckCircle2, AlertCircle, Landmark } from 'lucide-react';


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

  if (!isOpen || !paymentData) return null;


  const handleConfirm = () => {
    // Simulating API call
    customToast.success(`Payment for ${paymentData.invoiceNumber} processed successfully!`);
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
      <div className="relative w-full max-w-md bg-white dark:bg-[#0F1423] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/5 overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Confirm Payment</h2>
              <p className="text-[10px] text-gray-500 font-medium ">Vendor Disbursement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 dark:bg-[#0B101E] border border-gray-200 dark:border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Vendor</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white text-right">{paymentData.vendorName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Invoice #</span>
              <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300">{paymentData.invoiceNumber}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-white/5 flex justify-between items-end">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Amount</span>
              <div className="text-2xl font-black text-primary tracking-tight">
                ${paymentData.amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300/80 font-medium">
              By confirming, you are authorizing the system to mark this invoice as <span className="text-blue-600 dark:text-blue-400 font-bold">PAID</span>. This action will update financial reports and vendor balances.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl border border-gray-200 dark:border-white/5 transition-all cursor-pointer "
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            className="flex-[2] px-4 py-3 text-xs font-medium text-white dark:text-[#0B101E] bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2 cursor-pointer "
          >
            <CheckCircle2 className="w-4 h-4" />
            CONFIRM PAYMENT
          </button>
        </div>

      </div>
    </div>
  );
}
