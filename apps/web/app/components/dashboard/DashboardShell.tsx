'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }

    return false;
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(
        'sidebar-collapsed',
        String(next)
      );

      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-[#61d9b9] selection:text-black transition-colors duration-200">
      {/* 1. Subtle Engineering Blueprint Grid */}
      <div 
        className="pointer-events-none fixed inset-0 opacity-[0.04] dark:opacity-[0.06] z-0 text-[#075945] dark:text-[#61d9b9]" 
        style={{ 
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', 
          backgroundSize: '36px 36px' 
        }} 
      />

      {/* 2. Soft Ambient Green & Warm Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 right-1/4 h-[500px] w-[700px] rounded-full bg-[#075945]/8 dark:bg-[#10b981]/12 blur-[160px]" />
        <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-[#61d9b9]/10 dark:bg-[#61d9b9]/12 blur-[140px]" />
        <div className="absolute -bottom-20 right-10 h-80 w-80 rounded-full bg-[#f8bd36]/8 dark:bg-[#f8bd36]/6 blur-[150px]" />
      </div>

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content — offset for sidebar */}
      <div className={`
          flex flex-col min-h-screen relative z-10
          transition-all duration-300 ease-in-out
          ${
            collapsed
              ? 'lg:pl-[72px]'
              : 'lg:pl-[220px]'
          }
        `}>
        {/* Topbar */}
        <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
