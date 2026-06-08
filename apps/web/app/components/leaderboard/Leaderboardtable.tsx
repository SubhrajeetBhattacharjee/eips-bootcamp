"use client";
import React from "react";
import { useState } from "react";
import { LeaderboardUser } from "@/app/lib/leaderboard";

interface Props {
  users: LeaderboardUser[];
}

export default function LeaderboardTable({ users }: Props) {
  // expand/collapse state
  const [expanded, setExpanded] = useState(false);
  const displayedUsers = expanded ? users : users.slice(0, 3);

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <table className="w-full table-fixed text-left">
        <thead className="bg-accent/50">
          <tr>
            <th className="px-4 py-3 text-xs text-foreground/50">Rank</th>
            <th className="px-4 py-3 text-xs text-foreground/50">Contributor</th>
            <th className="px-4 py-3 text-xs text-foreground/50">XP</th>
            <th className="px-4 py-3 text-xs text-foreground/50">Streak</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((u) => (
            <tr
              key={u.userId}
              className={"border-t border-border " + (u.isCurrentUser ? "bg-emerald-500/10 ring-1 ring-emerald-400" : "")}
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
                    <div className="text-xs text-foreground/40">{u.handle ?? 'Contributor'}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 align-middle">{u.xp.toLocaleString()}</td>
              <td className="px-4 py-3 align-middle">{u.streak}d</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length > 3 && (
      <div className="p-3 border-t border-border bg-accent/50">
        <button 
        onClick={() => setExpanded((prev) => !prev)} 
        className="w-full py-2 rounded-lg bg-foreground/6 hover:bg-emerald-600 text-sm font-semibold transition-colors"
        >
          {expanded ? "Show less" : "View full leaderboard"}
        </button>
      </div>
      )}
    </div>
  );
}
