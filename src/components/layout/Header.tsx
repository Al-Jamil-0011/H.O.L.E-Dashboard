"use client";

import { Bell, Search, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#1E293B] bg-[#0B101E] px-4 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-500 hover:bg-[#151B2B] hover:text-white lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
        
        {/* Search */}
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-hover:text-[#00E5FF] transition-colors" />
          <input
            type="text"
            placeholder="Search vendors, invoices, reps..."
            className="h-9 w-72 rounded-lg border border-[#1E293B] bg-[#151B2B] pl-10 pr-4 text-[13px] text-white outline-none transition-all focus:border-[#00E5FF] focus:bg-[#0B101E] focus:ring-1 focus:ring-[#00E5FF] placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E293B] bg-[#151B2B]">
          <span className="text-[11px] font-semibold text-gray-400">Mar 2026</span>
          <Menu className="h-3 w-3 text-gray-500" />
        </div>

        <button className="relative rounded-full p-2 text-gray-400 hover:bg-[#151B2B] hover:text-white transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 ml-2 border-l border-[#1E293B] pl-4 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 overflow-hidden rounded-full border border-[#00E5FF]/30">
            <div className="flex h-full w-full items-center justify-center bg-[#00E5FF]/10 text-[#00E5FF]">
              <User className="h-4 w-4" />
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-white leading-tight">Finance Mgr</p>
          </div>
        </div>
      </div>
    </header>
  );
}
