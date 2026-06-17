'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, } from '@/app/lib/auth-client';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { navLinks } from '../../lib/landing-data';
import { ThemeToggle } from '../ThemeToggle';
import { ThemedLogoGif } from "@/app/components/ThemedLogoGif";
import { Logo } from '../ui/Logo';
interface NavbarProps {
  className?: string;
  showNavLinks?: boolean;
}

export function Navbar({ className, showNavLinks = true,}: NavbarProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${className ?? ""}`}
     >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative bottom-1.5" >
              <ThemedLogoGif
                alt="EthShala"
                width={45}
                height={45}
                unoptimized
              />
             
            </div>
            <div>
              <div className="text-foreground font-bold text-2xl leading-none">
   <Logo/>
              </div>
            </div>
          </Link>

          {/* Desktop nav — center */}
          {showNavLinks && (
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link: { label: string; href: string }) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <ThemeToggle />
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
                <Link href="/dashboard/profile" className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30 overflow-hidden bg-emerald-500/10 flex items-center justify-center">
                  {user?.image ? (
                    <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-emerald-400 text-xs font-bold">{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-1.5 bg-transparent hover:bg-accent border border-border hover:border-foreground/50 text-foreground text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Get Started <ArrowRight size={13} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <button
              className="text-muted-foreground hover:text-foreground p-1.5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link: { label: string; href: string }) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg text-sm font-medium transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-2">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-black font-bold text-sm py-2.5 rounded-lg"
                >
                  Go to Dashboard <ArrowRight size={14} />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="block text-center py-2.5 text-muted-foreground hover:text-foreground text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block text-center bg-emerald-500 text-black font-bold text-sm py-2.5 rounded-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}