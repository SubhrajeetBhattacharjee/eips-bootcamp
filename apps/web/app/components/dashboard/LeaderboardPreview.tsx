import Link from 'next/link';
import { mockLeaderboard } from '../../lib/dashboard-data';
type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  xp: number;
};

type LeaderboardPreviewProps = {
  leaderboard: LeaderboardEntry[];
};

const medalEmoji: Record<number, string> = {
  0: '🥇',
  1: '🥈',
  2: '🥉',
};

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full border border-white/10" />;
  }
  const initials = name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'U';
  const colors = ['bg-emerald-800', 'bg-blue-800', 'bg-purple-800', 'bg-pink-800', 'bg-orange-800'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full ${colors[idx]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

export function LeaderboardPreview({ leaderboard }: LeaderboardPreviewProps) {
  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base">
          Leaderboard <span className="text-zinc-500 font-normal text-sm">(Top 5)</span>
        </h3>
        <Link href="/dashboard/leaderboard">
          <button className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors">
            View All
          </button>
        </Link>
      </div>

      <ul className="space-y-2.5">
        {leaderboard.slice(0, 5).map((entry, index) => (
          <li
            key={entry.userId}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors"
          >
            {/* Rank */}
            <div className="w-6 text-center flex-shrink-0">
              {index < 3 ? (
                <span className="text-lg leading-none">{medalEmoji[index]}</span>
              ) : (
                <span className="text-zinc-500 text-sm font-bold">{index + 1}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar name={entry.name} avatarUrl={entry.avatarUrl} />

            {/* Username */}
            <span className="text-zinc-200 text-sm font-medium flex-1 truncate">
              {entry.name}
            </span>

            {/* XP */}
            <span className="text-emerald-400 text-sm font-bold flex-shrink-0">
              {entry.xp.toLocaleString()} XP
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaderboardPreview;
