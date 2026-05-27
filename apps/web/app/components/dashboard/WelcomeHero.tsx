'use client';

import { useUser } from '@clerk/nextjs';
import { Shield, Compass } from 'lucide-react';

export function WelcomeHero() {
  const { user } = useUser();
  const firstName = user?.firstName ?? 'Explorer';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#0d1a12] via-[#0a0f0d] to-[#080808] min-h-[200px]">
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
        <p className="text-zinc-400 text-sm font-medium mb-1">Welcome back,</p>
        <h1 className="text-white font-black text-4xl lg:text-5xl tracking-tight mb-2 flex items-center gap-3">
          {firstName}
          <span className="text-3xl select-none" role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-zinc-400 text-sm mb-6">Continue building Ethereum&apos;s future.</p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-full px-3.5 py-1.5 backdrop-blur-sm">
            <Shield size={13} className="text-emerald-400" />
            <span className="text-white text-xs font-semibold">Student</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-full px-3.5 py-1.5 backdrop-blur-sm">
            <Compass size={13} className="text-emerald-400" />
            <span className="text-white text-xs font-semibold">Level 4 Explorer</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeHero;
