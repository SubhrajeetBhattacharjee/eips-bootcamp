"use client";

import { ReferralStats } from "../../lib/referrals";

interface Props {
  stats: ReferralStats;
}

export default function ImpactCard({ stats }: Props) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-5 relative overflow-hidden">
      {/* Subtle green glow at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }}
      />

      <h3 className="text-white font-semibold text-base mb-1">
        You&apos;re Making an Impact! 🌱
      </h3>
      <p className="text-gray-400 text-xs leading-relaxed mb-5">
        Every referral helps grow the Ethereum education ecosystem.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="text-white text-xl font-bold">{stats.peopleInspired}</p>
            <p className="text-gray-500 text-[10px] leading-tight">People inspired</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <p className="text-white text-xl font-bold">{stats.communitiesReached}</p>
            <p className="text-gray-500 text-[10px] leading-tight">Communities reached</p>
          </div>
        </div>
      </div>
    </div>
  );
}