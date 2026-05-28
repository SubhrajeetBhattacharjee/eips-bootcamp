"use client";

import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: string;
  growth?: string;
  growthLabel?: string;
  isRank?: boolean;
}

export default function ReferralStatCard({ icon, label, value, growth, growthLabel, isRank }: Props) {
  return (
    <div className="group relative rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-5 hover:border-emerald-500/20 hover:bg-[#0f0f0f] transition-all duration-300 overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-4 text-emerald-400">
        {icon}
      </div>

      {/* Label */}
      <p className="text-gray-500 text-xs font-medium mb-1.5">{label}</p>

      {/* Value */}
      <p className={`text-2xl font-bold mb-2 ${isRank ? "text-white" : "text-white"}`}>
        {value}
      </p>


      {/* Growth */}
      {growth && (
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-emerald-400 text-xs font-medium">{growth}%</span>
          {growthLabel && <span className="text-gray-600 text-xs">{growthLabel}</span>}
        </div>
      )}
    </div>
  );
}