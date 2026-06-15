"use client";
import React from "react";
import FilterTabs from "./Filtertabs";
import { FilterPeriod } from "@/app/lib/leaderboard";

interface Props {
  filter: FilterPeriod;
  onFilterChange: (v: FilterPeriod) => void;
}

export default function LeaderboardHero({ filter, onFilterChange }: Props) {
  return (
    <div className="relative overflow-hidden px-8 pt-8 pb-6" style={{
      background: "linear-gradient(180deg, rgba(52,211,153,0.04) 0%, transparent 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Leaderboard</h1>
          </div>
          <p className="text-foreground/40 text-sm ml-[52px]">Top contributors in the EthShala ecosystem.</p>
          <div className="ml-[52px]"><FilterTabs active={filter} onChange={onFilterChange} /></div>
        </div>

        <div className="hidden md:block relative w-52 h-40 shrink-0 -mt-4">
          <EthereumCrystalHero />
        </div>
      </div>
    </div>
  );
}

function EthereumCrystalHero() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(52,211,153,0.18) 0%, transparent 70%)", filter: "blur(8px)" }} />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-36 h-8 rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(52,211,153,0.12) 0%, transparent 70%)", border: "1px solid rgba(52,211,153,0.15)" }} />
      <svg viewBox="0 0 160 180" width="160" height="180" fill="none" className="relative z-10" style={{ filter: "drop-shadow(0 0 24px rgba(52,211,153,0.5))" }}>
        <defs>
          <linearGradient id="c1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="c2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#065f46" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="c3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <polygon points="80,10 115,65 80,52 45,65" fill="url(#c1)" />
        <polygon points="80,10 115,65 80,52" fill="url(#c2)" opacity="0.7" />
        <polygon points="45,65 80,52 115,65 80,108" fill="url(#c3)" />
        <polygon points="80,52 115,65 80,108" fill="url(#c2)" opacity="0.5" />
        <polygon points="45,65 80,108 80,158" fill="url(#c1)" opacity="0.55" />
        <polygon points="115,65 80,108 80,158" fill="url(#c2)" opacity="0.4" />
        <line x1="80" y1="10" x2="80" y2="158" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      </svg>
    </div>
  );
}
