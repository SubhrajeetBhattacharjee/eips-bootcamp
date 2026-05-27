// apps/web/app/leaderboard/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Filter, Search, TrendingUp, Award, Flame, Crown } from 'lucide-react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { mockLeaderboard } from '../../lib/dashboard-data';
import { useUser } from '@clerk/nextjs';

type SortType = 'xp' | 'rank';

// Generate extended mock data for leaderboard
const generateExtendedLeaderboard = () => {
  const extended = [...mockLeaderboard];
  const names = [
    'Sophia Williams',
    'Noah Brown',
    'Olivia Davis',
    'Liam Miller',
    'Emma Wilson',
    'Benjamin Moore',
    'Ava Taylor',
    'Lucas Anderson',
    'Isabella Jackson',
    'Mason White',
    'Harper Harris',
    'James Martin',
    'Amelia Lee',
    'Benjamin Johnson',
    'Charlotte Brown',
  ];

  for (let i = 6; i <= 20; i++) {
    extended.push({
      rank: i,
      username: names[i - 6],
      xp: Math.floor(Math.random() * 30000) + 5000,
    });
  }

  return extended.sort((a, b) => b.xp - a.xp).map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

const allLeaderboardUsers = generateExtendedLeaderboard();

export default function LeaderboardPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('xp');

  // Filter and sort
  const filteredUsers = allLeaderboardUsers
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === 'xp') return b.xp - a.xp;
      if (sortType === 'rank') return a.rank - b.rank;
      return 0;
    });

  // Find current user's rank
  const currentUserRank = allLeaderboardUsers.find(
    (u) => u.username === user?.firstName
  );

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
            <ChevronLeft size={20} />
            Back to Dashboard
          </button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-gray-400">
              Compete globally. Earn XP. Build your reputation.
            </p>
          </div>

          {currentUserRank && (
            <div className="relative group">
              <div
                className={`
                  rounded-xl border border-emerald-500/30
                  bg-gradient-to-br from-emerald-500/10 to-emerald-500/5
                  backdrop-blur p-6 min-w-max
                `}
              >
                <p className="text-xs text-emerald-400 uppercase font-semibold mb-2">
                  Your Rank
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    #{currentUserRank.rank}
                  </span>
                  <span className="text-emerald-400 text-lg">
                    {currentUserRank.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-3 rounded-lg
                border border-gray-700 bg-gray-900/50
                text-white placeholder-gray-500
                focus:outline-none focus:border-emerald-500/50 focus:bg-gray-900
                transition-all duration-200
              `}
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="flex gap-2">
          {(['xp', 'rank'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSortType(type)}
              className={`
                px-4 py-3 rounded-lg font-medium text-sm
                transition-all duration-200
                ${sortType === type
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-600'
                }
              `}
            >
              {type === 'xp' ? 'XP' : 'Rank'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="relative group">
        <div
          className={`
            rounded-2xl border border-gray-700/50
            bg-gradient-to-br from-gray-900/50 to-gray-900/20
            backdrop-blur-xl
            overflow-hidden
          `}
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-gray-900/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    XP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.rank}
                    className={`
                      transition-all duration-200
                      hover:bg-gray-800/30
                      ${user.rank <= 3 ? 'bg-gray-800/10' : ''}
                    `}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-10 h-10 rounded-lg font-bold
                            flex items-center justify-center
                            ${user.rank === 1
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : user.rank === 2
                              ? 'bg-gray-400/20 text-gray-300'
                              : user.rank === 3
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-purple-500/20 text-purple-400'
                            }
                          `}
                        >
                          {user.rank === 1 ? <Crown size={20} /> : user.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-gray-950 text-sm">
                          {user.username.charAt(0)}
                        </div>
                        <p className="font-semibold text-white">{user.username}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-emerald-400">
                        {user.xp.toLocaleString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-700/30">
            {filteredUsers.map((user) => (
              <div
                key={user.rank}
                className={`
                  p-4 transition-all duration-200
                  hover:bg-gray-800/30
                  ${user.rank <= 3 ? 'bg-gray-800/10' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`
                        w-10 h-10 rounded-lg font-bold
                        flex items-center justify-center flex-shrink-0
                        ${user.rank === 1
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : user.rank === 2
                          ? 'bg-gray-400/20 text-gray-300'
                          : user.rank === 3
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-purple-500/20 text-purple-400'
                        }
                      `}
                    >
                      {user.rank === 1 ? <Crown size={20} /> : user.rank}
                    </div>
                    <p className="font-semibold text-white truncate">
                      {user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">XP</p>
                  <p className="font-bold text-emerald-400">
                    {user.xp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No users found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </DashboardShell>
  );
}