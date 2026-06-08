// apps/web/app/components/rewards/ProgressCard.tsx

'use client';

import React from 'react';

interface ProgressCardProps {
  percentage: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ percentage }) => {
  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-2xl blur-xl" />

      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-100/90 via-slate-200/70 to-slate-300/50
  dark:from-slate-800/80 dark:via-slate-900/60 dark:to-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-6">Your Progress</h3>

        {/* Circular Progress */}
        <div className="flex justify-center mb-6">
          <div className="relative w-36 h-36">
            {/* Background Circle */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-700/50"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#circleGradient)"
                strokeWidth="6"
                strokeDasharray={`${percentage * 3.39} 339`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient
                  id="circleGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-emerald-400">
                {percentage}%
              </span>
              <span className="text-xs text-muted-foreground mt-1">Complete</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-foreground text-sm mb-6">
          You're doing great!
        </p>

        {/* Button */}
        <button className="w-full py-3 rounded-lg border border-emerald-500/50 text-emerald-400 font-bold text-sm uppercase tracking-wider hover:bg-emerald-500/10 hover:border-emerald-500/70 transition-all duration-300 flex items-center justify-center gap-2">
          <span>View My Progress</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};