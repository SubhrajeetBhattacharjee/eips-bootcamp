'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useSession, signOut } from '@/app/lib/auth-client';

import Link from 'next/link';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 h-[60px] bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden text-zinc-400 hover:text-white transition-colors p-1"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar toggle (decorative) */}
      <button className="hidden lg:flex text-zinc-600 hover:text-zinc-300 transition-colors p-1">
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-[500px]">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search courses, modules, topics..."
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-16 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40 focus:bg-white/8 transition-all duration-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="text-[10px] text-zinc-600 bg-white/5 border border-white/8 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 rounded-lg transition-all duration-200">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-emerald-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
            3
          </span>
        </button>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">XP</span>
          <span className="text-emerald-300 font-bold text-sm">2,450</span>
        </div>

        {/* User info + Profile button */}
        <div className="flex items-center gap-2.5 relative group cursor-pointer">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-white text-sm font-semibold leading-none">
              {user?.name ?? 'User'}
            </span>
            <span className="text-zinc-500 text-xs mt-0.5">Student</span>
          </div>
          <Link href="/dashboard/profile" className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30 overflow-hidden bg-emerald-500/10 flex items-center justify-center">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-emerald-400 text-xs font-bold">{user?.name?.charAt(0) || 'U'}</span>
            )}
          </Link>
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col p-2">
            <Link href="/dashboard/profile" className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
              Profile
            </Link>
            <button 
              onClick={async () => {
                const { error } = await signOut();
                if (error) {
                  alert("Sign out failed: " + error.message);
                } else {
                  window.location.href = '/sign-in';
                }
              }}
              className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left w-full"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
