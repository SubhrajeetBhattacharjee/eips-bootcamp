'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { ThemedLogoGif } from '@/app/components/ThemedLogoGif';
import { Logo } from '../ui/Logo';

import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  Trophy,
  Award,
  Video,
  BadgeCheck,
  Users,
  BarChart2,
  ClipboardList,
  Zap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  toggleSidebar: () => void;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Modules', href: '/dashboard/my-modules', icon: <Layers size={18} /> },
  { label: 'Course Catalog', href: '/dashboard/marketplace', icon: <BookOpen size={18} /> },
  { label: 'Assignments', href: '/dashboard/assignments', icon: <FileText size={18} /> },
  { label: 'Workshops', href: '/dashboard/events', icon: <Video size={18} /> },
  { label: 'Certificates', href: '/dashboard/certificates', icon: <Award size={18} /> },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Trophy size={18} /> },
];

const capNav: NavItem[] = [
  { label: 'Campus Fellowship', href: '/dashboard/cap', icon: <BadgeCheck size={18} /> },
  { label: 'Referrals', href: '/dashboard/referrals', icon: <Users size={18} /> },
];

const adminNav: NavItem[] = [
  { label: 'Admin Analytics', href: '/dashboard/admin/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Applications', href: '/dashboard/admin/applications', icon: <ClipboardList size={18} /> },
  { label: 'Manage ETHShala', href: '/dashboard/admin/bootcamp', icon: <Layers size={18} /> },
  { label: 'Manage Assignments', href: '/dashboard/admin/assignments', icon: <FileText size={18} /> },
  { label: 'Manage Events', href: '/dashboard/admin/events', icon: <Zap size={18} /> },
];

function NavSection({
  title,
  items,
  pathname,
  collapsed,
  onMobileClose,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {title}
        </p>
      )}

      <ul className="space-y-0.5">
        {items.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? item.label : ''}
                onClick={onMobileClose}
                className={`flex items-center ${
                  collapsed ? 'justify-center' : 'gap-3'
                } px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:translate-x-0.5 group ${
                  active
                    ? 'bg-primary/10 text-primary dark:text-emerald-400 font-semibold border border-primary/25 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <span
                  className={`transition-colors ${
                    active
                      ? 'text-primary dark:text-emerald-400'
                      : 'text-muted-foreground group-hover:text-primary dark:group-hover:text-emerald-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`transition-all duration-300 overflow-hidden ${
                    collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                >
                  {item.label}
                </span>
                {active && !collapsed && (
                  <ChevronRight
                    size={14}
                    className="ml-auto text-primary/60 dark:text-emerald-400/60"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname() || '';
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin =
    (user as any)?.role === 'ADMIN' ||
    (user as any)?.role === 'admin' ||
    (user as any)?.role?.role === 'ADMIN' ||
    (user as any)?.role?.role === 'admin';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#075945]/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-card/95 backdrop-blur-xl border-r border-border z-50 
          flex flex-col 
          transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[220px]'}
          w-[220px]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div
          className={`px-4 py-6 border-b border-border transition-all duration-300 ${
            collapsed
              ? 'flex flex-col items-center gap-4'
              : 'flex items-center justify-between'
          }`}
        >
          {/* Brand Area */}
          <Link
            href="/"
            className={`flex items-center transition-all duration-300 ${
              collapsed ? 'justify-center' : 'gap-0'
            }`}
          >
            <div className="relative shrink-0">
              <ThemedLogoGif
                alt="ETHShala"
                width={collapsed ? 32 : 36}
                height={collapsed ? 32 : 36}
                unoptimized
              />
            </div>
            {!collapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <Logo size="sm" />
              </div>
            )}
          </Link>

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            title={collapsed ? 'Expand' : 'Collapse'}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border transition-all duration-200 cursor-pointer ${
              collapsed ? 'mt-2' : ''
            }`}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-hide">
          <NavSection
            title="Curriculum"
            items={mainNav}
            pathname={pathname}
            collapsed={collapsed}
            onMobileClose={onMobileClose}
          />
          <NavSection
            title="Campus Community"
            items={capNav}
            pathname={pathname}
            collapsed={collapsed}
            onMobileClose={onMobileClose}
          />
          {isAdmin && (
            <NavSection
              title="Admin"
              items={adminNav}
              pathname={pathname}
              collapsed={collapsed}
              onMobileClose={onMobileClose}
            />
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
