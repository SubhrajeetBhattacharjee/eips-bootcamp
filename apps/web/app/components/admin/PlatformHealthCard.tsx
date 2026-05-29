// apps/web/app/components/admin/PlatformHealthCard.tsx
'use client';

import React from 'react';
import { PlatformHealthData } from '@/app/lib/admin';
import { TrendingUp } from 'lucide-react';

interface PlatformHealthCardProps {
  data: PlatformHealthData;
}

type ColorKey = 'emerald' | 'blue' | 'purple';

function SparklineChart({ data, color = 'emerald' }: { data: number[]; color?: ColorKey }) {
  const colors: Record<ColorKey, string> = {
    emerald: '#10B981',
    blue: '#3B82F6',
    purple: '#8B5CF6'
  };

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 100 40" className="w-full h-16">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors[color]} stopOpacity="0.4" />
          <stop offset="100%" stopColor={colors[color]} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <polyline
        points={points.join(' ')}
        fill={`url(#grad-${color})`}
        stroke={colors[color]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlatformHealthCard({ data }: PlatformHealthCardProps) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-lg shadow-emerald-500/10 p-6">
      <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        Platform Health
      </h3>

      <div className="space-y-6">
        {/* User Growth */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-medium">User Growth</p>
            <span className="text-emerald-400 text-sm font-semibold">+12.4%</span>
          </div>
          <SparklineChart data={data.userGrowth} color="emerald" />
        </div>

        {/* Retention Rate */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-medium">Retention Rate</p>
            <span className="text-white text-lg font-bold">{data.retentionRate}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.retentionRate}%` }}
            />
          </div>
        </div>

        {/* Referral Conversion */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-medium">Referral Conversion</p>
            <span className="text-white text-lg font-bold">{data.referralConversion}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.referralConversion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}