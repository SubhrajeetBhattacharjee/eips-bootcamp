'use client';

import { Shield, Compass, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type WelcomeHeroProps = {
  user: {
    username: string;
    role: string;
  };
};

export function WelcomeHero({ user }: WelcomeHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-950/5 via-background to-background dark:from-[#0d1a12] dark:via-[#0a0f0d] dark:to-[#080808] min-h-[200px]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-20 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-400/5 rounded-full blur-2xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Ethereum crystal placeholder — right side */}
      <div className="absolute right-0 top-0 bottom-0 w-[320px] lg:w-[400px] flex items-center justify-center pointer-events-none">
        {/* Glow base */}
        <div className="absolute bottom-0 right-16 w-48 h-8 bg-emerald-500/20 blur-2xl rounded-full" />
        {/* Crystal placeholder box */}
        <div className="relative flex flex-col items-center">
          {/* Ethereum diamond SVG (placeholder for real image) */}
          <div className="relative">
            {/* Outer glow rings */}
            <div className="absolute inset-0 -m-8 rounded-full bg-emerald-500/5 blur-xl" />
            <div className="absolute inset-0 -m-4 rounded-full bg-emerald-500/10 blur-md" />
            {/* Diamond */}
            <svg viewBox="0 0 120 160" className="w-28 h-36 drop-shadow-[0_0_30px_rgba(16,185,129,0.6)]" fill="none">
              <defs>
                <linearGradient id="ethTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="ethLeft" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#065f46" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="ethRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="ethBottomL" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="ethBottomR" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#047857" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
                </linearGradient>
              </defs>
              {/* Top pyramid */}
              <polygon points="60,5 100,65 60,80 20,65" fill="url(#ethTop)" />
              <polygon points="60,5 20,65 60,80" fill="url(#ethLeft)" />
              <polygon points="60,5 100,65 60,80" fill="url(#ethRight)" opacity="0.8" />
              {/* Bottom pyramid */}
              <polygon points="60,80 100,65 60,155" fill="url(#ethBottomR)" />
              <polygon points="60,80 20,65 60,155" fill="url(#ethBottomL)" />
              {/* Center line */}
              <line x1="20" y1="65" x2="100" y2="65" stroke="#34d399" strokeWidth="0.5" opacity="0.5" />
            </svg>
            {/* Glowing platform circle */}
            <div className="mt-1 w-28 h-3 bg-emerald-500/30 rounded-full blur-md mx-auto" />
          </div>
          {/* Particle dots */}
          <div className="absolute -top-4 -left-8 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60 animate-pulse" />
          <div className="absolute top-8 -right-10 w-1 h-1 rounded-full bg-emerald-300 opacity-40 animate-pulse delay-300" />
          <div className="absolute -bottom-4 -left-6 w-1 h-1 rounded-full bg-emerald-500 opacity-50 animate-pulse delay-700" />
        </div>
      </div>

      {/* Main text content */}
      <div className="relative z-10 px-7 py-8 max-w-[calc(100%-200px)] lg:max-w-[calc(100%-320px)]">
        <p className="text-muted-foreground text-sm font-medium mb-1">Welcome back,</p>
        <h1 className="text-foreground font-black text-4xl lg:text-5xl tracking-tight mb-2 flex items-center gap-3">
          {user.username}
          <span className="text-3xl select-none" role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-6">Continue building Ethereum&apos;s future.</p>

        {/* Badges & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-background/40 border border-border rounded-full px-3.5 py-1.5 backdrop-blur-sm">
              <Shield size={13} className="text-emerald-400" />
              <span className="text-foreground text-xs font-semibold">{user.role}</span>
            </div>
          </div>
          
          <div className="h-4 w-px bg-accent hidden sm:block" />
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a 
              href="/dashboard/my-modules" 
              className="flex-1 sm:flex-none text-center bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Resume Course
            </a>
            <a 
              href="/dashboard/marketplace" 
              className="flex-1 sm:flex-none text-center bg-accent hover:bg-accent border border-border hover:border-emerald-500/50 text-foreground text-sm font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              Explore Modules
            </a>
            <div className="flex-1 sm:flex-none hidden sm:block">
              <ConnectButton />
            </div>
          </div>
          <div className="sm:hidden w-full mt-2">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeHero;
