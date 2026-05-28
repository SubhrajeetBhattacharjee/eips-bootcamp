"use client";

import { XP_REWARDS } from "../../lib/referrals";

const ICONS = [
  // Person join
  <svg key="join" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
  </svg>,
  // Checkmark/onboarding
  <svg key="onboard" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Module/book
  <svg key="module" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V5a2 2 0 012-2h14a2 2 0 012 2v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Assignment
  <svg key="assignment" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Session/live
  <svg key="session" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export default function XPInfoCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-5">
      <h3 className="text-white font-semibold text-base mb-4">How You Earn XP</h3>

      <div className="space-y-3">
        {XP_REWARDS.map((reward, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
              {ICONS[idx]}
            </div>
            <span className="text-gray-300 text-xs flex-1">{reward.label}</span>
            <span
              className="text-sm font-bold flex-shrink-0"
              style={{ color: "#10b981" }}
            >
              +{reward.xp} XP
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.04]">
        <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors inline-flex items-center gap-1.5">
          View all ways to earn XP
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}