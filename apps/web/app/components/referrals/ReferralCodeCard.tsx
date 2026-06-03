"use client";

import { useState } from "react";
import { ReferralStats } from "../../lib/referrals";

interface Props {
  stats: ReferralStats;
}

export default function ReferralCodeCard({ stats }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Join EIPsInsight", url: stats.referralLink });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0d0d0d] mb-4">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* LEFT: Code section */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <p className="text-sm text-gray-400 font-medium mb-3 uppercase tracking-widest text-xs">
            Your Referral Code
          </p>

          {/* Glowing code */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-4xl font-black tracking-wider"
              style={{
                color: "#10b981",
                textShadow: "0 0 20px rgba(16,185,129,0.6), 0 0 40px rgba(16,185,129,0.3)",
                fontFamily: "monospace",
              }}
            >
              {stats.referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-gray-400 hover:text-emerald-400"
              title="Copy code"
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[260px]">
            Share your code and earn XP when your friends join and complete their onboarding.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: copied ? "linear-gradient(135deg, #059669, #047857)" : "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                boxShadow: copied ? "0 0 30px rgba(16,185,129,0.6)" : "0 0 20px rgba(16,185,129,0.3)",
                transform: copied ? "scale(0.95)" : "scale(1)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
              </svg>
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Share Link
            </button>
          </div>
        </div>

        {/* CENTER: Ethereum crystal */}
        <div className="hidden md:flex items-center justify-center relative py-6">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
          />
          <EthereumCrystal />
        </div>

        {/* RIGHT: Analytics */}
        <div className="p-6 md:p-8 flex flex-col justify-center gap-5 border-t md:border-t-0 md:border-l border-white/[0.06]">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-white">{stats.totalClicks}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">Successful Referrals</p>
            <p className="text-3xl font-bold text-white">{stats.successfulSignups}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">XP Earned</p>
            <p
              className="text-3xl font-bold"
              style={{
                color: "#10b981",
                textShadow: "0 0 20px rgba(16,185,129,0.5)",
              }}
            >
              {stats.xpEarned.toLocaleString()} XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EthereumCrystal() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Glow rings */}
      <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 65%)" }} />
      <div className="absolute w-36 h-36 rounded-full border border-emerald-500/10 animate-spin" style={{ animationDuration: "20s" }} />
      <div className="absolute w-28 h-28 rounded-full border border-emerald-500/15" />

      <svg width="100" height="130" viewBox="0 0 100 130" fill="none" className="relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
        {/* Ethereum diamond */}
        <polygon points="50,4 92,50 50,72 8,50" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="1.5" />
        <polygon points="50,4 92,50 50,72 8,50" fill="none" stroke="#34d399" strokeWidth="0.8" strokeOpacity="0.5" />
        <polygon points="50,72 92,50 50,126 8,50" fill="#10b981" fillOpacity="0.07" stroke="#10b981" strokeWidth="1.5" />
        {/* Inner highlight */}
        <polygon points="50,4 92,50 50,38 8,50" fill="#10b981" fillOpacity="0.2" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="50" y1="4" x2="50" y2="126" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.3" />
        {/* Bright edges */}
        <polygon points="50,4 92,50 50,72 8,50" fill="none" stroke="#6ee7b7" strokeWidth="0.5" strokeOpacity="0.4" />
      </svg>

      {/* Platform glow below */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.4) 0%, transparent 70%)" }}
      />
    </div>
  );
}