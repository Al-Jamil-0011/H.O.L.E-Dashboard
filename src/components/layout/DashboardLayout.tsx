"use client";

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black font-sans w-full overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden w-full relative">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-6 lg:p-8 dark:bg-black/50 custom-scrollbar">
          <div className="mx-auto h-full pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
