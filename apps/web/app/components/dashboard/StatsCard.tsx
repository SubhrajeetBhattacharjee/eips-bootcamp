'use client';

import { StatCard } from '../../lib/dashboard-data';;

interface StatsCardProps {
  stat: StatCard;
}

const iconMap: Record<string, React.ReactNode> = {
  xp: (
    <div className="w-14 h-14 flex items-center justify-center">
      <svg viewBox="0 0 56 56" className="w-full h-full">
        <defs>
          <filter id="xpGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <polygon
          points="28,4 52,16 52,40 28,52 4,40 4,16"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#xpGlow)"
        />
        <polygon
          points="28,8 48,19 48,37 28,48 8,37 8,19"
          fill="#10b981"
          opacity="0.15"
        />
        <text x="28" y="34" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="800" fontFamily="monospace">
          XP
        </text>
      </svg>
    </div>
  ),
  referrals: (
    <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/20 rounded-full flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-emerald-400" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </div>
  ),
  cap: (
    <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/20 rounded-full flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-emerald-400" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    </div>
  ),
  rank: (
    <div className="w-14 h-14 bg-purple-500/15 border border-purple-500/20 rounded-full flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-purple-400" fill="currentColor">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
      </svg>
    </div>
  ),
};

export function StatsCard({ stat }: StatsCardProps) {
  const isCapStatus = stat.id === 'cap';
  const isRank = stat.id === 'rank';

  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex items-center justify-between hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 cursor-default overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10">
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">{stat.label}</p>
        <p
          className={`font-black text-3xl tracking-tight mb-1 ${
            isCapStatus ? 'text-emerald-400' : isRank ? 'text-white' : 'text-white'
          }`}
        >
          {stat.value}
        </p>
        <p
          className={`text-xs font-medium ${
            isCapStatus ? 'text-zinc-400' : stat.changePositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
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
