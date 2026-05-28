"use client";
import React from "react";
import { LeaderboardUser } from "@/app/lib/leaderboard";

interface Props {
  users: LeaderboardUser[];
}

export default function LeaderboardTable({ users }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/6">
      <table className="w-full table-fixed text-left">
        <thead className="bg-white/2">
          <tr>
            <th className="px-4 py-3 text-xs text-white/50">Rank</th>
            <th className="px-4 py-3 text-xs text-white/50">Contributor</th>
            <th className="px-4 py-3 text-xs text-white/50">XP</th>
            <th className="px-4 py-3 text-xs text-white/50">Streak</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.userId}
              className={"border-t border-white/4 " + (u.isCurrentUser ? "bg-white/3 ring-1 ring-emerald-400" : "")}
            >
              <td className="px-4 py-3 align-middle">#{u.rank}</td>
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                    {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">{u.name[0]}</div>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">{u.name}</div>
                      {u.isCurrentUser && <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-black font-semibold">You</div>}
                    </div>
                    <div className="text-xs text-white/40">{u.handle ?? 'Contributor'}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 align-middle">{u.xp.toLocaleString()}</td>
              <td className="px-4 py-3 align-middle">{u.streak}d</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 border-t border-white/4 bg-white/2">
        <button className="w-full py-2 rounded-lg bg-white/6 text-sm font-semibold">View full leaderboard</button>
      </div>
    </div>
  );
}
