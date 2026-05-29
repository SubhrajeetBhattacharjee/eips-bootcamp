// apps/web/app/components/admin/GrowthChart.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GrowthChartData } from '@/app/lib/admin';

interface GrowthChartProps {
  data: GrowthChartData[];
}

function ChartVisualization({ data }: { data: GrowthChartData[] }) {
  const padding = { top: 40, right: 30, bottom: 40, left: 60 };
  const width = 1000;
  const height = 300;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Get min/max values for scaling
  const users = data.map(d => d.users);
  const activeLearnersCount = data.map(d => d.activeLearnersCount);
  const xpAwarded = data.map(d => d.xpAwarded);

  const maxUsers = Math.max(...users);
  const maxActive = Math.max(...activeLearnersCount);
  const maxXP = Math.max(...xpAwarded);

  // Create path for line
  const createPath = (values: number[], max: number) => {
    const points = values.map((val, i) => {
      const x = padding.left + (i / (values.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - (val / max) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <svg width={width} height={height} className="w-full h-auto">
      <defs>
        <linearGradient id="usersGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((ratio) => {
        const y = padding.top + chartHeight * (1 - ratio);
        return (
          <line
            key={`grid-${ratio}`}
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke="#10B981"
            strokeWidth="1"
            opacity="0.1"
            strokeDasharray="4"
          />
        );
      })}

      {/* Y-axis */}
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={padding.top + chartHeight}
        stroke="#10B981"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* X-axis */}
      <line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={width - padding.right}
        y2={padding.top + chartHeight}
        stroke="#10B981"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Y-axis labels */}
      <text x={padding.left - 45} y={padding.top + 5} fontSize="12" fill="#9CA3AF" textAnchor="end">
        10K
      </text>
      <text x={padding.left - 45} y={padding.top + chartHeight / 2 + 5} fontSize="12" fill="#9CA3AF" textAnchor="end">
        8K
      </text>
      <text x={padding.left - 45} y={padding.top + chartHeight + 5} fontSize="12" fill="#9CA3AF" textAnchor="end">
        6K
      </text>

      {/* X-axis labels (show every ~5th date) */}
      {data.map((d, i) => {
        if (i % 5 !== 0 && i !== data.length - 1) return null;
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        return (
          <text
            key={`x-label-${i}`}
            x={x}
            y={padding.top + chartHeight + 25}
            fontSize="12"
            fill="#9CA3AF"
            textAnchor="middle"
          >
            {d.date.split(' ')[1]}
          </text>
        );
      })}

      {/* Lines with gradients */}
      {/* Users line with fill */}
      <path
        d={createPath(users, maxUsers)}
        fill="none"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Active Learners line */}
      <path
        d={createPath(activeLearnersCount, maxActive)}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* XP Awarded line */}
      <path
        d={createPath(xpAwarded, maxXP)}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GrowthChart({ data }: GrowthChartProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-lg shadow-emerald-500/10">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-emerald-500/10">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1">Platform Growth Overview</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-400">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-gray-400">Active Learners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-gray-400">XP Awarded</span>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="relative">
          <button className="
            flex items-center gap-2 px-3 py-2 rounded-lg
            bg-emerald-500/10 border border-emerald-500/30
            text-emerald-400 hover:bg-emerald-500/20
            transition-all duration-300 text-sm font-medium
            group
          ">
            <span className="capitalize">{period}</span>
            <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-emerald-500/20 rounded-lg shadow-xl overflow-hidden hidden group-hover:block">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as typeof period)}
                className={`
                  w-full px-4 py-2 text-left text-sm transition-colors
                  ${period === p
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400'
                  }
                `}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 overflow-x-auto">
        <ChartVisualization data={data} />
      </div>
    </div>
  );
}