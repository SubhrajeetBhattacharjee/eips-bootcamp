'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';

interface Stats {
  totalAssignments: number;
  completedAssignments: number;
  pendingReview: number;
  totalXpEarned: number;
}

interface AssignmentStatsProps {
  stats: Stats;
}

export function AssignmentStats({ stats }: AssignmentStatsProps) {
  const statCards = [
    {
      label: 'Total Assignments',
      value: stats.totalAssignments,
      icon: AlertCircle,
      bgColor: 'from-cyan-500/20 to-cyan-600/10',
      borderColor: 'border-cyan-500/20',
      iconColor: 'text-cyan-400',
      hoverColor: 'hover:border-cyan-500/50 hover:shadow-cyan-500/20',
    },
    {
      label: 'Completed',
      value: stats.completedAssignments,
      icon: CheckCircle2,
      bgColor: 'from-emerald-500/20 to-emerald-600/10',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
      hoverColor: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20',
    },
    {
      label: 'Pending Review',
      value: stats.pendingReview,
      icon: Clock,
      bgColor: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/20',
      iconColor: 'text-blue-400',
      hoverColor: 'hover:border-blue-500/50 hover:shadow-blue-500/20',
    },
    {
      label: 'Total XP Earned',
      value: stats.totalXpEarned,
      icon: Zap,
      bgColor: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/20',
      iconColor: 'text-amber-400',
      hoverColor: 'hover:border-amber-500/50 hover:shadow-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`group bg-gradient-to-br ${card.bgColor} border ${card.borderColor} rounded-xl p-6 transition-all duration-300 ${card.hoverColor} hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-gray-400 text-sm mb-2 font-medium">{card.label}</div>
                <div className="text-3xl font-bold text-white">{card.value}</div>
              </div>
              <div className={`flex-shrink-0 p-3 rounded-lg bg-white/5 ${card.iconColor}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}