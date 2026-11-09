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
    <div className="relative overflow-hidden rounded-2xl border border-[#075945]/15 bg-white/85 backdrop-blur-md shadow-xs min-h-[200px]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-20 w-80 h-80 bg-[#075945]/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-[#61d9b9]/15 rounded-full blur-2xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#075945 1px, transparent 1px), linear-gradient(90deg, #075945 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Ethereum crystal placeholder — right side */}
      <div className="absolute right-0 top-0 bottom-0 w-[280px] lg:w-[380px] flex items-center justify-center pointer-events-none">
        {/* Glow base */}
        <div className="absolute bottom-4 right-16 w-48 h-8 bg-[#075945]/15 blur-2xl rounded-full" />
        {/* Crystal box */}
        <div className="relative flex flex-col items-center">
          <div className="relative">
            {/* Outer glow rings */}
            <div className="absolute inset-0 -m-8 rounded-full bg-[#61d9b9]/15 blur-xl" />
            <div className="absolute inset-0 -m-4 rounded-full bg-[#075945]/15 blur-md" />
            {/* Diamond */}
            <svg viewBox="0 0 120 160" className="w-24 sm:w-28 h-32 sm:h-36 drop-shadow-[0_4px_24px_rgba(7,89,69,0.25)]" fill="none">
              <defs>
                <linearGradient id="ethTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#61d9b9" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#075945" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="ethLeft" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="ethRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#075945" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="ethBottomL" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#075945" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#022c22" stopOpacity="0.98" />
                </linearGradient>
                <linearGradient id="ethBottomR" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#047857" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#022c22" stopOpacity="0.98" />
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
              <line x1="20" y1="65" x2="100" y2="65" stroke="#61d9b9" strokeWidth="0.8" opacity="0.7" />
            </svg>
            {/* Glowing platform circle */}
            <div className="mt-1 w-28 h-3 bg-[#075945]/25 rounded-full blur-md mx-auto" />
          </div>
          {/* Particle dots */}
          <div className="absolute -top-4 -left-8 w-1.5 h-1.5 rounded-full bg-[#075945] opacity-50 animate-pulse" />
          <div className="absolute top-8 -right-10 w-1 h-1 rounded-full bg-[#d97706] opacity-60 animate-pulse delay-300" />
          <div className="absolute -bottom-4 -left-6 w-1 h-1 rounded-full bg-[#61d9b9] opacity-70 animate-pulse delay-700" />
        </div>
      </div>

      {/* Main text content */}
      <div className="relative z-10 px-6 sm:px-8 py-7 sm:py-8 max-w-[calc(100%-160px)] sm:max-w-[calc(100%-200px)] lg:max-w-[calc(100%-340px)]">
        <p className="text-[#075945] text-xs font-bold uppercase tracking-wider mb-1.5">Welcome back,</p>
        <h1 className="text-[#171a18] font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-2 flex items-center gap-2.5 sm:gap-3">
          {user.username}
          <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-[#4b5563] text-sm mb-6 font-normal">Continue building Ethereum&apos;s open governance and protocol future.</p>

        {/* Badges & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 mt-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#075945]/10 border border-[#075945]/20 rounded-full px-3.5 py-1.5 backdrop-blur-sm">
              <Shield size={13} className="text-[#075945]" />
              <span className="text-[#075945] text-xs font-bold uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
          
          <div className="h-4 w-px bg-[#075945]/20 hidden sm:block" />
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a 
              href="/dashboard/my-modules" 
              className="flex-1 sm:flex-none text-center bg-[#075945] hover:bg-[#064e3b] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-[#075945]/20"
            >
              Resume Course
            </a>
            <a 
              href="/dashboard/marketplace" 
              className="flex-1 sm:flex-none text-center bg-white hover:bg-stone-50 border border-[#075945]/25 text-[#171a18] hover:text-[#075945] text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-xs"
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
