"use client";

import { Bell, Search, User, Menu, LogOut, FileText, BarChart4, Settings, UserCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import Link from 'next/link';
import { useAuthService } from '@/hooks/auth';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useNotificationService } from '@/hooks/notifications';
import { useMyProfile } from '@/hooks/admin/users';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);


interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);


  const { logoutUser } = useAuthService();
  const token = Cookies.get("token");
  const decoded: any = token ? jwt.decode(token) : null;
  const role = decoded?.role?.toLowerCase();

  const { profile, loading: profileLoading } = useMyProfile();

  const handleLogout = async () => {
    await logoutUser()
    toast.success("Logout Successfully");
  };

  const { notifications, unreadCount, fetchAllNotifications, fetchUnreadCount } = useNotificationService();

  useEffect(() => {
    fetchUnreadCount();
    fetchAllNotifications(1, 5);
  }, [fetchUnreadCount, fetchAllNotifications]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationDropdownOpen(false);
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
        {/* <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card focus-within:ring-1 focus-within:ring-primary transition-all">
          <span className="text-[11px] font-semibold text-muted-foreground">Mar 2026</span>
          <Menu className="h-3 w-3 text-muted-foreground" />
        </div> */}

        <ThemeSwitcher />

        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
            className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-2xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    {unreadCount} NEW
                  </span>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications?.length > 0 ? (
                  notifications.slice(0, 5).map((notif: any) => (
                    <div key={notif._id} className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                          <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors truncate">
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                            {dayjs(notif.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </div>

              <Link
                href={`/${profile?.role}/dashboard/notifications`}
                onClick={() => setIsNotificationDropdownOpen(false)}
                className="block p-4 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border uppercase tracking-widest"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>

        <div className="relative" ref={userDropdownRef}>
          <div
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-3 ml-2 border-l border-border pl-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/30 relative">
              {profile?.profileUrl ? (
                <Image
                  src={profile.profileUrl}
                  alt={profile.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary uppercase font-bold text-xs">
                  {profile?.fullName ? profile.fullName.charAt(0) : <User className="h-4 w-4" />}
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-foreground leading-tight">
                {profileLoading ? "Loading..." : profile?.fullName ? profile?.fullName.slice(0, 10) + "..." : "User"}
              </p>
            </div>
          </div>

          {/* User Dropdown */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-lg z-50">
              <div className="mb-2 border-b border-border p-2">
                <p className="text-sm font-semibold text-foreground">{profile?.fullName ? profile?.fullName.slice(0, 10) : "User"}</p>
                <p className="text-xs text-muted-foreground">{profile?.email || "email@example.com"}</p>
              </div>

              <div className="flex flex-col gap-1" onClick={() => setIsUserDropdownOpen(false)}>
                <Link href={`/${profile?.role}/settings/view-profile`} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <UserCircle className="h-4 w-4" /> View Profile
                </Link>
                <Link href={`/${profile?.role}/dashboard/sales`} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <BarChart4 className="h-4 w-4" /> Sales
                </Link>
                <Link href={`/${profile?.role}/dashboard/invoices`} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <FileText className="h-4 w-4" /> Invoice
                </Link>
                <Link href={`/${profile?.role}/dashboard/notifications`} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Bell className="h-4 w-4" /> Notifications
                </Link>
                <Link href={`/${profile?.role}/settings`} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <div className="my-1 border-t border-border"></div>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer">
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
