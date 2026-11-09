"use client";

import React, { useState } from "react";
import { LeaderboardUser } from "@/app/lib/leaderboard";
import { Star, Award } from "lucide-react";

interface Props {
  users: LeaderboardUser[];
}

const medalEmoji: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export default function LeaderboardTable({ users }: Props) {
  const [showAll, setShowAll] = useState(false);
  const displayedUsers = showAll ? users : users.slice(0, 10);

  return (
    <div className="rounded-2xl overflow-hidden border border-border/80 bg-card/90 backdrop-blur-md shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 w-16 text-center">Rank</th>
              <th className="px-5 py-3.5 min-w-[200px]">Student Builder</th>
              <th className="px-5 py-3.5 w-32 hidden sm:table-cell">Chapter Status</th>
              <th className="px-5 py-3.5 w-28 text-right">Verified XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-sm">
            {displayedUsers.map((u) => {
              const isTopThree = u.rank <= 3;
              const cleanInitial = u.name ? u.name.charAt(0).toUpperCase() : "B";

              return (
                <tr
                  key={u.userId}
                  className={`transition-colors ${
                    u.isCurrentUser
                      ? "bg-primary/10 dark:bg-emerald-500/10 font-medium"
                      : "hover:bg-accent/50"
                  }`}
                >
                  {/* Rank */}
                  <td className="px-5 py-4 text-center align-middle">
                    {isTopThree ? (
                      <span className="text-xl select-none" title={`Rank ${u.rank}`}>
                        {medalEmoji[u.rank]}
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        #{u.rank}
                      </span>
                    )}
                  </td>

                  {/* Student Builder */}
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-border flex items-center justify-center font-bold text-xs text-primary dark:text-emerald-400 shrink-0">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            cleanInitial
                          )}
                        </div>
                        {isTopThree && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center text-[9px]">
                            ★
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm truncate">
                            {u.name}
                          </span>
                          {u.isCurrentUser && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground tracking-wide">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {u.handle || `@builder${u.rank}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Chapter Status */}
                  <td className="px-5 py-4 align-middle hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        u.capStatus === "APPROVED" || u.capStatus === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30"
                          : u.capStatus === "APPLIED" || u.capStatus === "Applied" || u.capStatus === "Pending"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30"
                          : "bg-muted text-muted-foreground border-border/60"
                      }`}
                    >
                      {u.capStatus === "APPROVED" || u.capStatus === "Approved" ? (
                        <>
                          <Award size={11} />
                          <span>Campus Fellow</span>
                        </>
                      ) : u.capStatus === "APPLIED" || u.capStatus === "Applied" || u.capStatus === "Pending" ? (
                        <span>Applicant</span>
                      ) : (
                        <span>Builder</span>
                      )}
                    </span>
                  </td>

                  {/* Verified XP */}
                  <td className="px-5 py-4 text-right align-middle">
                    <span className="font-mono font-black text-sm text-primary dark:text-emerald-400">
                      {u.xp.toLocaleString()} XP
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Show more toggle if users > 10 */}
      {users.length > 10 && (
        <div className="p-3 border-t border-border/60 bg-muted/20 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold text-primary dark:text-emerald-400 hover:underline cursor-pointer py-1"
          >
            {showAll ? "Show Top 10 Only" : `View Full Leaderboard (${users.length} builders)`}
          </button>
        </div>
      )}
    </div>
  );
}

export { LeaderboardTable };
