// apps/web/app/components/admin/KPICard.tsx
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'violet';
}

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    glow: 'shadow-lg shadow-emerald-500/20',
    text: 'text-emerald-400'
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    glow: 'shadow-lg shadow-blue-500/20',
    text: 'text-blue-400'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    glow: 'shadow-lg shadow-purple-500/20',
    text: 'text-purple-400'
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    glow: 'shadow-lg shadow-amber-500/20',
    text: 'text-amber-400'
  },
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    icon: 'text-violet-400',
    glow: 'shadow-lg shadow-violet-500/20',
    text: 'text-violet-400'
  }
};

export function KPICard({ title, value, change, icon: Icon, color }: KPICardProps) {
  const isPositive = change >= 0;
  const colors = colorClasses[color];

  return (
    <div className={`
      relative overflow-hidden rounded-xl border backdrop-blur-xl
      transition-all duration-300 hover:scale-105
      ${colors.bg} ${colors.border} ${colors.glow}
      p-6 min-h-[160px] flex flex-col justify-between
      group cursor-default
    `}>
      {/* Background gradient effect */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br from-transparent via-transparent to-transparent
      `} />
      
      {/* Top section: Icon and Title */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            {title}
          </p>
        </div>
        <div className={`
          p-2.5 rounded-lg transition-all duration-300
          ${colors.bg} ${colors.border}
        `}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>

      {/* Bottom section: Value and Change */}
      <div className="relative z-10">
        <div className="flex items-baseline gap-3 mb-2">
          <p className="text-white text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className={`
            text-sm font-semibold transition-colors duration-300
            ${isPositive ? 'text-emerald-400' : 'text-red-400'}
          `}>
            {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-gray-500 text-sm">vs last month</span>
        </div>
      </div>

      {/* Animated border effect on hover */}
      <div className={`
        absolute inset-0 rounded-xl border opacity-0 group-hover:opacity-100
        transition-opacity duration-300 pointer-events-none
        ${colors.border}
      `} />
    </div>
  );
}