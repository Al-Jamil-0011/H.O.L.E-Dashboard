"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ApproveExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApproveExpenseModal({ isOpen, onClose, onConfirm }: ApproveExpenseModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="bg-card rounded-2xl dark:shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">

          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
            <CheckCircle2 className="h-8 w-8 text-[#00E5FF]" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">Confirm Approval</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 px-4">
            This expense will be approved and automatically synced with QuickBooks Online.
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-full py-3.5 bg-[#00E5FF] hover:bg-cyan-400 text-background rounded-xl text-xs font-medium transition-colors dark:shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer "
            >
              Confirm & Sync
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-transparent border dark:border-[#27272A] border-primary/50 hover:text-red-500 dark:hover:text-foreground dark:hover:bg-[#27272A] text-foreground rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface RejectExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function RejectExpenseModal({ isOpen, onClose, onSubmit }: RejectExpenseModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="bg-card rounded-2xl dark:shadow-2xl p-6 animate-in zoom-in-95 duration-200">

          <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">Reason for Rejection</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Please specify why this expense is being rejected.
          </p>

          <div className="mb-6 space-y-2">
            <label className="text-xs font-bold text-foreground ">Comments</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide additional feedback for the employee..."
              className="w-full h-32 bg-background dark:bg-background border dark:border-[#27272A] border-gray-300 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#00E5FF] transition-colors resize-none mt-1"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-transparent border dark:border-[#27272A] border-primary/50 hover:text-red-500 dark:hover:text-foreground dark:hover:bg-[#27272A] text-foreground rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSubmit(reason);
                onClose();
                setReason("");
              }}
              disabled={!reason.trim()}
              className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-colors dark:shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
