'use client';

import { Bell, Search, Menu, FileText, BookOpen } from 'lucide-react';
import { useSession, signOut } from '@/app/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../ThemeToggle';
import { useState, useEffect, useRef } from 'react';
import { getUserTotalXp, getRecentNotifications, type AppNotification } from '@/app/actions/topbar';
import { useDisconnect } from 'wagmi';
import { toast } from 'sonner';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const [xp, setXp] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
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
      
      // Fetch modules for search
      fetch(`/api/bootcamp/modules?userId=${user.id}`)
        .then(res => res.json())
        .then(setModules)
        .catch(console.error);
      
      // Poll XP every 15 seconds for real-time updates
      const intervalId = setInterval(() => {
        getUserTotalXp().then(setXp);
      }, 15000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const activeNotifications = notifications.filter(n => new Date(n.createdAt).getTime() > clearedAt);

  const handleClearNotifications = () => {
    const maxTime = notifications.reduce((max, n) => {
      const t = new Date(n.createdAt).getTime();
      return t > max ? t : max;
    }, Date.now());
    
    setClearedAt(maxTime);
    localStorage.setItem('notificationsClearedAt', maxTime.toString());
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/dashboard/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const searchResults = searchQuery.trim() 
    ? modules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Detect outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userDisplayName = (user?.name && user.name.toLowerCase() !== 'learner' && user.name.toLowerCase() !== 'explorer') 
    ? user.name 
    : (user?.email ? user.email.split('@')[0] : 'Student');
  const userRole = (user as any)?.role ? String((user as any).role) : 'STUDENT';

  return (
    <header className="sticky top-0 z-30 h-[64px] bg-background/90 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div 
        ref={searchContainerRef}
        className="flex-1 max-w-[500px] relative"
        onClick={() => setIsMobileSearchOpen(true)}
      >
        <div className="relative group">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary dark:group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search courses, modules, topics... (Press Enter)"
            className="w-full bg-card/90 border border-border rounded-xl pl-3 pr-6 p-2 lg:pl-9 lg:pr-16 lg:py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary dark:focus:border-emerald-400 focus:bg-card focus:shadow-xs transition-all duration-200"
          />
          <div className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="text-[10px] text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5 font-mono group-focus-within:border-primary/40 group-focus-within:text-primary transition-colors">↵</kbd>
          </div>
        </div>

        {/* Search Dropdown */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            {searchResults.length > 0 ? (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-primary dark:text-emerald-400 bg-muted flex items-center gap-2">
                  <BookOpen size={12} />
                  Courses & Modules
                </div>
                {searchResults.map(module => (
                  <Link 
                    key={module.id}
                    href={module.isSubscribed ? `/dashboard/my-modules?moduleId=${module.id}` : `/dashboard/checkout?moduleId=${module.id}`}
                    className="flex flex-col px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-0 group"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                  >
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors">{module.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{module.description}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`
        ml-auto flex items-center gap-3 relative
        ${isMobileSearchOpen ? "hidden lg:flex" : "flex"}
        `}
      >
        <ThemeToggle />
        {/* Notification bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 transition-all duration-200 border rounded-xl cursor-pointer ${showNotifications ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground bg-card hover:bg-accent border-border shadow-xs'}`}
          >
            <Bell size={17} />
            {activeNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-primary dark:bg-emerald-500 text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                {activeNotifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border bg-muted flex justify-between items-center">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {activeNotifications.length > 0 && (
                  <button 
                    onClick={handleClearNotifications}
                    className="text-xs text-primary dark:text-emerald-400 hover:underline font-semibold transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-col max-h-96 overflow-y-auto">
                {activeNotifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
                ) : (
                  activeNotifications.map((n) => (
                    <div key={n.id} className="p-3 border-b border-border hover:bg-accent transition-colors flex gap-3 items-start">
                      <div className={`mt-0.5 p-1.5 rounded-md ${n.type === 'ASSIGNMENT' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-primary/10 text-primary dark:text-emerald-400'}`}>
                        {n.type === 'ASSIGNMENT' ? <FileText size={14} /> : <BookOpen size={14} />}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
                        <span className="text-[10px] text-muted-foreground mt-1">
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
        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 shadow-xs">
          <span className="text-primary dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">XP</span>
          <span className="text-primary dark:text-emerald-400 font-bold text-sm">{xp.toLocaleString()}</span>
        </div>

        {/* User info + Profile button */}
        <div className="flex items-center gap-2.5 relative group cursor-pointer ml-1">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-foreground text-sm font-semibold leading-none">
              {userDisplayName}
            </span>
            <span className="text-primary dark:text-emerald-400 text-[10px] mt-1 font-bold tracking-wide uppercase">{userRole}</span>
          </div>
          <Link href="/dashboard/profile" className="w-9 h-9 rounded-full ring-2 ring-primary/30 overflow-hidden bg-primary/10 flex items-center justify-center hover:ring-primary transition-all">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary dark:text-emerald-400 text-sm font-bold">{userDisplayName.charAt(0).toUpperCase()}</span>
            )}
          </Link>
          <div className="absolute right-0 top-full mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col p-2">
            <Link href="/dashboard/profile" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors text-left">
              Profile
            </Link>
            <button 
              onClick={async () => {
                disconnect();
                const { error } = await signOut();
                if (error) {
                  toast.error("Sign out failed: " + error.message);
                } else {
                  window.location.href = '/sign-in';
                }
              }}
              className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-500/10 rounded-lg transition-colors text-left w-full mt-1 cursor-pointer"
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
