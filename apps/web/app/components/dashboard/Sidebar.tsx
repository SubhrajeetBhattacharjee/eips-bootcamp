'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { ThemedLogoGif } from "@/app/components/ThemedLogoGif";

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
  { label: 'My Modules', href: '/dashboard/my-modules', icon: <Layers size={18} /> },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: <BookOpen size={18} /> },
  { label: 'My Learning', href: '/dashboard/learning', icon: <Trophy size={18} /> },
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
  { label: 'Manage Events', href: '/dashboard/admin/events', icon: <Zap size={18} /> },
];

function NavSection({ title, items, pathname, }: { title: string; items: NavItem[], pathname: string; }) {
  return (
    <div className="mb-6">
      <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {title}
      </p>

      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href;
          
          return (
          <li key={item.href}>
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:translate-x-1 group
                  ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-[0_0_15px_rgba(255,255,255,0.02)]'
                  }`}
              >
              <span className={`transition-colors ${active ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-emerald-400'}`}>
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
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(true);
  // Added the CTA state and effect
  useEffect(() => {
    const isDismissed = localStorage.getItem('upgrade-cta-dismissed');

    if (isDismissed === 'true') {
      setShowUpgradeCTA(false);
    }
  }, []);
  // Add the CTA dismiss handler
  const dismissUpgradeCTA = () => {
  localStorage.setItem('upgrade-cta-dismissed', 'true');
  setShowUpgradeCTA(false);
};

  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = (user as any)?.role === 'ADMIN' || (user as any)?.role === 'admin' || (user as any)?.role?.role === 'ADMIN' || (user as any)?.role?.role === 'admin' || user?.id === 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[220px] bg-card border-r border-border z-50 flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            {/* EIPsInsight Logo Added */}
              <div className="relative bottom-1.5" >
                <ThemedLogoGif
                  alt="EIPsInsight"
                  width={45}
                  height={45}
                  unoptimized
                />
              </div>
            <div>
              <div className="text-foreground font-bold text-sm leading-none">EIPsInsight</div>
              <div className="text-emerald-400 text-xs font-medium mt-0.5">Bootcamp</div>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-hide">
          <NavSection title="Main" items={mainNav} pathname={pathname}/>
          <NavSection title="CAP Program" items={capNav} pathname={pathname}/>
          {isAdmin && <NavSection title="Admin" items={adminNav} pathname={pathname}/>}
        </nav>

        {/* Upgrade CTA */}
        {showUpgradeCTA && (
        <div className="px-3 py-4 border-t border-border">
          <div className="relative bg-gradient-to-br from-emerald-500/10 to-accent dark:from-emerald-950/80 dark:to-black border border-emerald-500/20 rounded-xl p-4">
            {/* Close button */}
            <button
              onClick={dismissUpgradeCTA}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close upgrade banner"
              >
                <X size={14} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed mb-3">
              Unlock advanced analytics, exclusive content and priority support.
            </p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 group">
              Upgrade Now
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
