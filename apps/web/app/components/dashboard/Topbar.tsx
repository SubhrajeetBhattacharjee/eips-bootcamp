'use client';

import { Bell, Search, Menu, FileText, BookOpen } from 'lucide-react';
import { useSession, signOut } from '@/app/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserTotalXp, getRecentNotifications, type AppNotification } from '@/app/actions/topbar';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [xp, setXp] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [clearedAt, setClearedAt] = useState<number>(0);

  useEffect(() => {
    // Load last cleared time
    const saved = localStorage.getItem('notificationsClearedAt');
    if (saved) setClearedAt(parseInt(saved, 10));

    if (user) {
      // Initial fetch
      getUserTotalXp().then(setXp);
      getRecentNotifications().then(setNotifications);
      
      // Poll XP every 15 seconds for real-time updates
      const intervalId = setInterval(() => {
        getUserTotalXp().then(setXp);
      }, 15000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const activeNotifications = notifications.filter(n => new Date(n.createdAt).getTime() > clearedAt);

  const handleClearNotifications = () => {
    const now = Date.now();
    setClearedAt(now);
    localStorage.setItem('notificationsClearedAt', now.toString());
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/dashboard/learning?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[60px] bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden text-zinc-400 hover:text-white transition-colors p-1"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-[500px]">
        <div className="relative group">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search courses, modules, topics... (Press Enter)"
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-16 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="text-[10px] text-zinc-600 bg-white/5 border border-white/8 rounded px-1.5 py-0.5 font-mono group-focus-within:border-emerald-500/30 group-focus-within:text-emerald-500/70 transition-colors">↵</kbd>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 relative">
        {/* Notification bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-all duration-200 border rounded-lg ${showNotifications ? 'bg-white/10 text-white border-white/20' : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border-white/8'}`}
          >
            <Bell size={17} />
            {activeNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-emerald-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                {activeNotifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {activeNotifications.length > 0 && (
                  <button 
                    onClick={handleClearNotifications}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-col max-h-96 overflow-y-auto">
                {activeNotifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-zinc-500">No new notifications</div>
                ) : (
                  activeNotifications.map((n) => (
                    <div key={n.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 items-start">
                      <div className={`mt-0.5 p-1.5 rounded-md ${n.type === 'ASSIGNMENT' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {n.type === 'ASSIGNMENT' ? <FileText size={14} /> : <BookOpen size={14} />}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm text-zinc-200 leading-snug">{n.title}</p>
                        <span className="text-[10px] text-zinc-500 mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">XP</span>
          <span className="text-emerald-300 font-bold text-sm">{xp.toLocaleString()}</span>
        </div>

        {/* User info + Profile button */}
        <div className="flex items-center gap-2.5 relative group cursor-pointer ml-2">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-white text-sm font-semibold leading-none">
              {user?.name ?? 'User'}
            </span>
            <span className="text-zinc-500 text-[11px] mt-1 font-medium tracking-wide uppercase">Student</span>
          </div>
          <Link href="/dashboard/profile" className="w-9 h-9 rounded-full ring-2 ring-emerald-500/30 overflow-hidden bg-emerald-500/10 flex items-center justify-center hover:ring-emerald-400 transition-all">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-emerald-400 text-sm font-bold">{user?.name?.charAt(0) || 'U'}</span>
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
              className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left w-full mt-1"
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
