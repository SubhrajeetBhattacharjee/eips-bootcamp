"use client";
import React from "react";
import { XP_WAYS } from "@/app/lib/leaderboard";

export default function XPInfoCard({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? "text-xs text-foreground/40" : "rounded-xl p-4"} style={compact ? {} : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className={compact ? "" : "text-sm font-semibold text-foreground/90 mb-3"}>How XP is Earned</div>
      <ul className={compact ? "text-xs text-foreground/40 space-y-1" : "text-sm text-foreground/40 space-y-3"}>
        {XP_WAYS.map((w) => (
          <li key={w.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white/2 text-emerald-400">{w.icon}</div>
              <div>{w.label}</div>
            </div>
            <div className="text-emerald-400 font-semibold">+{w.xp} XP</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
