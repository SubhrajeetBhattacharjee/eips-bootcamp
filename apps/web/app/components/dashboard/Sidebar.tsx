'use client';

import { useState, useEffect } from 'react';
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
  BadgeCheck,
  Users,
  Gift,
  Wallet,
  BarChart2,
  ClipboardList,
  Zap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
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
  collapsed: boolean;
  toggleSidebar: () => void;
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
  { label: 'Manage ETHShala', href: '/dashboard/admin/bootcamp', icon: <Layers size={18} /> },
  { label: 'Manage Assignments', href: '/dashboard/admin/assignments', icon: <FileText size={18} /> },
  { label: 'Manage Events', href: '/dashboard/admin/events', icon: <Zap size={18} /> },
];

function NavSection({ title, items, pathname, collapsed }: { title: string; items: NavItem[], pathname: string; collapsed:boolean; }) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </p>
      )}

      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href;
          
          return (
          <li key={item.href}>
            <Link
                href={item.href}
                title={collapsed ? item.label : ''}
                className={`flex items-center
                  ${collapsed ? 'justify-center' : 'gap-3'}
                  px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:translate-x-1 group
                  ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-[0_0_15px_rgba(255,255,255,0.02)]'
                  }`}
              >
              <span className={`transition-colors ${active ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-emerald-400'}`}>
                {item.icon}
              </span>
              <span className={`
                  transition-all duration-300 overflow-hidden
                  ${collapsed 
                      ? 'w-0 opacity-0'
                      : 'w-auto opacity-100'
                  }
                `}>
                {item.label}
              </span>
              {active && !collapsed && (
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

export function Sidebar({ mobileOpen, onMobileClose, collapsed, toggleSidebar, }: SidebarProps) {
  const pathname = usePathname() || '';

  const [showUpgradeCTA, setShowUpgradeCTA] = useState(true);
  // Check if the upgrade CTA was previously dismissed and whether the dismissal period is still active
  useEffect(() => {
  const dismissedAt = localStorage.getItem("upgrade-cta-dismissed");

  if (dismissedAt) {
    const expiry = Number(dismissedAt);
    
    // Hide CTA if the user dismissed it within the last 7 days
    if (Date.now() < expiry) {
      setShowUpgradeCTA(false);
    } else {
      // Remove expired dismissal so the CTA can be shown again
      localStorage.removeItem("upgrade-cta-dismissed");
    }
  }
}, []);

  // Store CTA dismissal timestamp with a 7-day expiry and hide the CTA immediately
  const dismissUpgradeCTA = () => {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  localStorage.setItem(
    "upgrade-cta-dismissed",
    String(Date.now() + sevenDays)
  );

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
        className={`fixed top-0 left-0 h-screen bg-card border-r border-border z-50 
          flex flex-col 
          transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[220px]'}
          w-[220px]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >

        <div className={`px-4 py-6 border-b border-border transition-all duration-300 ${collapsed ? 'flex flex-col items-center gap-4' : 'flex items-center justify-between'}`}>
          
          {/* Brand Area */}
          <Link href="/" className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="relative shrink-0" >
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
            title={collapsed ? "Expand" : "Collapse"}
            className={`
              p-1.5 
              rounded-lg
              text-muted-foreground
              hover:text-foreground
              hover:bg-accent
              border border-transparent
              hover:border-border
              transition-all duration-200
              ${collapsed ? 'mt-2' : ''}
            `}
          >
            {collapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
        </div>
        

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-hide">
          <NavSection title="Main" items={mainNav} pathname={pathname} collapsed={collapsed}/>
          <NavSection title="CAP Program" items={capNav} pathname={pathname} collapsed={collapsed}/>
          {isAdmin && <NavSection title="Admin" items={adminNav} pathname={pathname} collapsed={collapsed}/>}
        </nav>

        {/* Upgrade CTA */}
        {showUpgradeCTA && !collapsed && (
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
