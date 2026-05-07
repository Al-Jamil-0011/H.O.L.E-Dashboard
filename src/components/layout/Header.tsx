"use client";

import { Bell, Search, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
        
        {/* Search */}
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search vendors, invoices, reps..."
            className="h-9 w-72 rounded-lg border border-border bg-card pl-10 pr-4 text-[13px] text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card focus-within:ring-1 focus-within:ring-primary transition-all">
          <span className="text-[11px] font-semibold text-muted-foreground">Mar 2026</span>
          <Menu className="h-3 w-3 text-muted-foreground" />
        </div>

        <ThemeSwitcher />

        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 ml-2 border-l border-border pl-4 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/30">
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-foreground leading-tight">Finance Mgr</p>
          </div>
        </div>
      </div>
    </header>
  );
}
