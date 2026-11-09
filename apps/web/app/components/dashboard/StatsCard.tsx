'use client';

import { StatCard } from '../../lib/dashboard-data';
import { Users, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

interface StatsCardProps {
  stat: StatCard;
}

const iconMap: Record<string, React.ReactNode> = {
  xp: (
    <div className="w-11 h-11 rounded-xl bg-[#075945]/10 border border-[#075945]/20 flex items-center justify-center text-[#075945] font-black text-xs font-mono shadow-xs">
      XP
    </div>
  ),
  referrals: (
    <div className="w-11 h-11 bg-[#075945]/10 border border-[#075945]/20 rounded-xl flex items-center justify-center shadow-xs">
      <Users size={20} className="text-[#075945]" />
    </div>
  ),
  cap: (
    <div className="w-11 h-11 bg-[#61d9b9]/20 border border-[#075945]/20 rounded-xl flex items-center justify-center shadow-xs">
      <ShieldCheck size={20} className="text-[#075945]" />
    </div>
  ),
  rank: (
    <div className="w-11 h-11 bg-[#f8bd36]/20 border border-[#d97706]/30 rounded-xl flex items-center justify-center shadow-xs">
      <Trophy size={20} className="text-[#b45309]" />
    </div>
  ),
};

export function StatsCard({ stat }: StatsCardProps) {
  const isCapStatus = stat.id === 'cap';
  const isRank = stat.id === 'rank';

  return (
    <div className="group relative p-5 sm:p-6 flex items-center justify-between hover:bg-[#075945]/[0.03] transition-colors duration-200 cursor-default">
      <div className="relative z-10">
        <p className="text-[#6b7280] text-xs font-bold uppercase tracking-wider mb-1.5">{stat.label}</p>
        <p
          className={`font-black text-2xl sm:text-3xl tracking-tight mb-1 ${
            isCapStatus ? 'text-[#075945]' : isRank ? 'text-[#171a18]' : 'text-[#171a18]'
          }`}
        >
          {stat.value}
        </p>
        <p className="text-xs font-medium text-[#075945]">
          {stat.change}
        </p>
      </div>

      <div className="relative z-10 ml-4 flex-shrink-0">
        {iconMap[stat.id]}
      </div>
    </div>
  );
}

export default StatsCard;
