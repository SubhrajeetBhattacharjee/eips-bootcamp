'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';

import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  Trophy,
  BadgeCheck,
  Users,
  Gift,
  Wallet,
  BarChart2,
  ClipboardList,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} />, },
  { label: 'My Learning', href: '/dashboard/learning', icon: <BookOpen size={18} /> },
  { label: 'Bootcamp Modules', href: '/dashboard/bootcamp', icon: <Layers size={18} /> },
  { label: 'Assignments', href: '/dashboard/assignments', icon: <FileText size={18} /> },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Trophy size={18} /> },
];

const capNav: NavItem[] = [
  { label: 'CAP Status', href: '/dashboard/cap', icon: <BadgeCheck size={18} /> },
  { label: 'Referrals', href: '/dashboard/referrals', icon: <Users size={18} /> },
  { label: 'Rewards', href: '/dashboard/rewards', icon: <Gift size={18} /> },
  // { label: 'Wallet', href: '/dashboard/wallet', icon: <Wallet size={18} /> },
];

const adminNav: NavItem[] = [
  { label: 'Admin Analytics', href: '/dashboard/admin/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Applications', href: '/dashboard/admin/applications', icon: <ClipboardList size={18} /> },
  { label: 'Manage Bootcamp', href: '/dashboard/admin/bootcamp', icon: <Layers size={18} /> },
  { label: 'Manage Assignments', href: '/dashboard/admin/assignments', icon: <FileText size={18} /> },
];

function NavSection({ title, items, pathname, }: { title: string; items: NavItem[], pathname: string; }) {
  return (
    <div className="mb-6">
      <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
        {title}
      </p>

      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href;
          
          return (
          <li key={item.href}>
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
              >
              <span className={`transition-colors ${active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-emerald-400'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <ChevronRight size={14} className="ml-auto text-emerald-500/60" />
              )}
            </Link>
          </li>
          )
      })}
      </ul>

    </div>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname() || '';
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = (user as any)?.role === 'ADMIN' || (user as any)?.role === 'admin' || (user as any)?.role?.role === 'ADMIN' || (user as any)?.role?.role === 'admin' || user?.id === 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[220px] bg-[#0a0a0a] border-r border-white/5 z-50 flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* Ethereum diamond logo placeholder */}
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400" fill="currentColor">
                <polygon points="12,2 20,8 20,16 12,22 4,16 4,8" opacity="0.3" />
                <polygon points="12,2 20,8 12,12" />
                <polygon points="4,8 12,12 12,22" opacity="0.6" />
                <polygon points="20,8 12,12 12,22" opacity="0.8" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none">EIPsInsight</div>
              <div className="text-emerald-400 text-xs font-medium mt-0.5">Academy</div>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-hide">
          <NavSection title="Main" items={mainNav} pathname={pathname}/>
          <NavSection title="CAP Program" items={capNav} pathname={pathname}/>
          {isAdmin && <NavSection title="Admin" items={adminNav} pathname={pathname}/>}
        </nav>

        {/* Upgrade CTA */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="bg-gradient-to-br from-emerald-950/80 to-black border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed mb-3">
              Unlock advanced analytics, exclusive content and priority support.
            </p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 group">
              Upgrade Now
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
