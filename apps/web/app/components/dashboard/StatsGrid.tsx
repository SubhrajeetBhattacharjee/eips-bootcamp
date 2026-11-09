import { StatsCard } from './StatsCard';
import type { StatCard } from '../../lib/dashboard-data';

type StatsGridProps = {
  xp: number;
  referralsCount: number;
  capStatus: string;
  rank: number | null;
};

export function StatsGrid({ xp, referralsCount, capStatus, rank }: StatsGridProps) {
  const stats: StatCard[] = [
    {
      id: 'xp',
      label: 'XP Earned',
      value: xp.toLocaleString(),
      change: 'Current total XP',
      changePositive: true,
      color: 'emerald',
    },
    {
      id: 'referrals',
      label: 'Referrals',
      value: referralsCount,
      change: 'People you brought in',
      changePositive: true,
      color: 'emerald',
    },
    {
      id: 'cap',
      label: 'CAP Status',
      value: capStatus,
      change: 'Current application state',
      changePositive: true,
      color: 'emerald',
    },
    {
      id: 'rank',
      label: 'Leaderboard Rank',
      value: rank ?? '--',
      change: 'Your current placement',
      changePositive: true,
      color: 'purple',
    },
  ];

  return (
    <div className="bg-white/85 backdrop-blur-md border border-[#075945]/15 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#075945]/10">
      {stats.map((stat) => (
        <StatsCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

export default StatsGrid;
