// apps/web/components/learning/LearningHero.tsx

import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';

interface LearningHeroProps {
  userName?: string;
}

export const LearningHero: React.FC<LearningHeroProps> = ({ userName = 'User' }) => {
  const bootcampCompletion = 72;
  const currentStreak = 5;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#0d1a12] via-[#0a0f0d] to-[#080808] min-h-[160px]">
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

      {/* Content */}
      <div className="relative z-10 px-6 py-8 sm:px-8 flex items-start justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Welcome back, {userName}!</h1>
          <p className="text-zinc-400 text-sm sm:text-base mb-5">
            You're <span className="font-semibold text-emerald-400">{bootcampCompletion}%</span> through the bootcamp. Keep your{' '}
            <span className="font-semibold text-orange-400">{currentStreak}-day streak</span> alive and unlock your potential.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs sm:text-sm text-zinc-400">
                <span className="text-emerald-400 font-semibold">{bootcampCompletion}%</span> Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs sm:text-sm text-zinc-400">
                <span className="text-orange-400 font-semibold">{currentStreak}</span> Day Streak
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};