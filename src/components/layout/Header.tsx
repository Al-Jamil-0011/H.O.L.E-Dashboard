"use client";

import { Bell, Search, User, Menu, LogOut, FileText, BarChart4, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        
        <div className="relative" ref={userDropdownRef}>
          <div 
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-3 ml-2 border-l border-border pl-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/30">
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-foreground leading-tight">Finance Mgr</p>
            </div>
          </div>

          {/* User Dropdown */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-lg z-50">
              <div className="mb-2 border-b border-border p-2">
                <p className="text-sm font-semibold text-foreground">Finance Mgr</p>
                <p className="text-xs text-muted-foreground">finance@holeapp.com</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <Link href="/profile" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <UserCircle className="h-4 w-4" /> View Profile
                </Link>
                <Link href="/sales" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <BarChart4 className="h-4 w-4" /> Sales
                </Link>
                <Link href="/invoices" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <FileText className="h-4 w-4" /> Invoice
                </Link>
                <Link href="/notifications" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Bell className="h-4 w-4" /> Notifications
                </Link>
                <Link href="/settings" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <div className="my-1 border-t border-border"></div>
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
