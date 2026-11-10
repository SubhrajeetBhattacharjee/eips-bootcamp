import Link from 'next/link';

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
    return <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full border border-primary/20 object-cover" />;
  }
  const cleanName = (name && name.toLowerCase() !== 'learner' && name.toLowerCase() !== 'explorer') ? name : 'Builder';
  const initials = cleanName.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'B';
  const colors = [
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  ];
  const idx = (cleanName.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full ${colors[idx]} border border-border flex items-center justify-center text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export function LeaderboardPreview({ leaderboard }: LeaderboardPreviewProps) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 sm:p-6 flex flex-col h-full shadow-xs hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-bold text-base">
          Leaderboard <span className="text-muted-foreground font-normal text-sm">(Top 5)</span>
        </h3>
        <Link href="/dashboard/leaderboard">
          <button className="text-primary dark:text-emerald-400 text-xs font-bold hover:underline transition-colors cursor-pointer">
            View All
          </button>
        </Link>
      </div>

      <ul className="space-y-2">
        {leaderboard.slice(0, 5).map((entry, index) => {
          const entryDisplayName = (entry.name && entry.name.toLowerCase() !== 'learner' && entry.name.toLowerCase() !== 'explorer')
            ? entry.name
            : (entry.handle ? entry.handle.replace('@', '') : 'Builder');

          return (
            <li
              key={entry.userId}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/60 transition-colors"
            >
              {/* Rank */}
              <div className="w-6 text-center flex-shrink-0">
                {index < 3 ? (
                  <span className="text-lg leading-none">{medalEmoji[index]}</span>
                ) : (
                  <span className="text-muted-foreground text-sm font-bold font-mono">{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <Avatar name={entryDisplayName} avatarUrl={entry.avatarUrl} />

              {/* Username */}
              <span className="text-foreground text-sm font-semibold flex-1 truncate">
                {entryDisplayName}
              </span>

              {/* XP */}
              <span className="text-primary dark:text-emerald-400 text-sm font-mono font-bold flex-shrink-0">
                {entry.xp.toLocaleString()} XP
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LeaderboardPreview;
