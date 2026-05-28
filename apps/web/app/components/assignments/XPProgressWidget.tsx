'use client';

import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

interface Stats {
  totalXpEarned: number;
  totalAssignments?: number;
  completedAssignments?: number;
}

interface XPProgressWidgetProps {
  stats: Stats;
}

export function XPProgressWidget({ stats }: XPProgressWidgetProps) {
  const xpPercentage = Math.min((stats.totalXpEarned / 2000) * 100, 100);
  const weeklyXp = Math.floor(stats.totalXpEarned * 0.3);
  const level = Math.floor(stats.totalXpEarned / 500) + 1;

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-cyan-400" />
          <h3 className="text-lg font-bold text-white">XP Progress</h3>
        </div>
        <div className="flex items-center gap-1 text-cyan-400">
          <TrendingUp size={16} />
          <span className="text-sm font-bold">{weeklyXp}</span>
        </div>
      </div>

      {/* Level */}
      <div className="mb-4 p-4 bg-black/30 border border-cyan-500/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Level</span>
          <span className="text-2xl font-bold text-cyan-300">{level}</span>
        </div>
        <p className="text-xs text-gray-500">This Week</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400">Level Progress</span>
          <span className="text-xs font-bold text-cyan-300">
            {Math.floor(xpPercentage)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-sm font-bold text-white">{stats.totalXpEarned}</div>
          <div className="text-xs text-gray-500">Total XP</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-cyan-300">
            {Math.max(2000 - stats.totalXpEarned, 0)}
          </div>
          <div className="text-xs text-gray-500">To Level {level + 1}</div>
        </div>
      </div>
    </div>
  );
}