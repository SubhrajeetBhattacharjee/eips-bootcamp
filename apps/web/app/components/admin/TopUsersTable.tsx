// apps/web/app/components/admin/TopUsersTable.tsx
'use client';

import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { TopUser } from '@/app/lib/admin';

interface TopUsersTableProps {
  users: TopUser[];
}

// Simple avatar generator based on user name
function Avatar({ name, avatar }: { name: string; avatar?: string; }) {
  const colors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-cyan-500'
  ];
  
  const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  const color = colors[hash % colors.length];
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
        ) : (
      <div className={`
      w-10 h-10 rounded-full flex items-center justify-center
      text-foreground text-sm font-semibold ${color}
      `}>
        {initials}
      </div>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="
        w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600
        flex items-center justify-center text-foreground font-bold text-sm
        shadow-lg shadow-amber-500/50
      ">
        🏆
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="
        w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600
        flex items-center justify-center text-foreground font-bold text-sm
        shadow-lg shadow-slate-500/50
      ">
        {rank}
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="
        w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-800
        flex items-center justify-center text-foreground font-bold text-sm
        shadow-lg shadow-orange-500/50
      ">
        {rank}
      </div>
    );
  }

  return (
    <div className="
      w-10 h-10 flex items-center justify-center
      text-muted-foreground font-semibold text-sm
    ">
      {rank}
    </div>
  );
}

export function TopUsersTable({ users }: TopUsersTableProps) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-background/40 backdrop-blur-xl overflow-hidden shadow-lg shadow-emerald-500/10">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-emerald-500/10">
        <h3 className="text-foreground font-semibold text-lg">Top Users by XP</h3>
        <a href="/dashboard/leaderboard" className="
          flex items-center gap-1 text-emerald-400 text-sm font-medium
          hover:text-emerald-300 transition-colors group
        ">
          View Leaderboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-500/10 bg-emerald-500/5">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rank</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">XP Earned</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modules Completed</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Streak</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/10">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-emerald-500/5 transition-colors duration-200 group"
              >
                {/* Rank */}
                <td className="px-6 py-5">
                  <RankBadge rank={user.rank} />
                </td>

                {/* User */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} avatar={user.avatar} />
                    <div>
                      <p className="text-foreground font-medium text-sm">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {user.username}
                      </p>
                    </div>
                  </div>
                </td>

                {/* XP Earned */}
                <td className="px-6 py-5 text-right">
                  <p className="text-emerald-400 font-semibold text-sm">
                    {user.xpEarned.toLocaleString()} XP
                  </p>
                </td>

                {/* Modules */}
                <td className="px-6 py-5 text-right">
                  <p className="text-foreground text-sm">
                    {user.modulesCompleted}
                  </p>
                </td>

                {/* Streak */}
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <p className="text-foreground text-sm">
                      {user.streak} days
                    </p>
                  </div>
                </td>

                {/* Joined */}
                <td className="px-6 py-5 text-right">
                  <p className="text-muted-foreground text-sm">
                    {user.joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}