'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Flame, Zap, ArrowRight, Share2, BookOpen, Layers, RefreshCw } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import type { StreakDay } from '@/app/lib/dashboard';

const quirkyQuotes = [
  (name: string) => `Welcome back, ${name}! My heart says decentralization, but my terminal says 'Out of Gas'. Let's debug this smart contract together! ⛽💻`,
  (name: string) => `psst ${name}... Once we deploy this contract to the blockchain, it's immutable forever. No pressure, no panic. Ready to build? 🔒✨`,
  (name: string) => `${name}! I just spent an hour explaining Zero-Knowledge proofs to my roommate. They still have zero knowledge. Let's code! 🧠🔮`,
  (name: string) => `Welcome back, ${name}! EVM opcode: 0xFD (REVERT). My developer spirit: 100% unstoppable. Let's conquer the execution layer! ⚡🛠️`,
  (name: string) => `Hey ${name}! I told the mempool your transaction is VIP. Ready to inspect EIP blob space and roll up some L2s? 📦🚀`,
  (name: string) => `${name}! Proof of Work? Exhausting. Proof of Stake? Sustainable. Proof that we are shipping epic smart contracts today? Guaranteed. 🦄🔥`,
  (name: string) => `Welcome back, ${name}! If a transaction occurs and isn't included in the state trie, did it even happen? Let's verify on-chain! 🌲⛓️`,
  (name: string) => `${name}! Just audited our bytecode line by line. Reentrancy guard: armed. Overflow checks: solid. Let's start learning! 🛡️💎`,
  (name: string) => `Welcome back, ${name}! 12 seconds per Ethereum block, but our learning velocity is breaking the speed of light. Let's build! ⏱️⚡`,
  (name: string) => `Hey ${name}! Account Abstraction means no seed-phrase anxiety ever again. Let's dive into ERC-4337 and write some magic! 🔑🪄`,
  (name: string) => `Welcome back, ${name}! Hard forks may split blockchains, but nothing can break our study streak. Let's crack the next module! 🍴🚀`,
  (name: string) => `${name}! State trie is clean, RPC nodes are synced, and the EVM is ready. Let's make decentralized history! ☕🌐`,
];

interface CampusCommandHubProps {
  user: {
    username: string;
    role: string;
  };
  xp: number;
  referralsCount: number;
  capStatus: string;
  rank: number | null;
  streak: number;
  streakDays: StreakDay[];
  leagueTier?: string;
  leagueRank?: number | null;
  referralCode?: string;
}

export function CampusCommandHub({
  user,
  xp,
  referralsCount,
  capStatus,
  rank,
  streak,
  streakDays,
  leagueTier = 'BRONZE',
  leagueRank,
  referralCode,
}: CampusCommandHubProps) {
  const [selectedDay, setSelectedDay] = useState<StreakDay | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isHyped, setIsHyped] = useState(false);

  // Dynamic Level Calculation matching core XP engine
  const levelInfo = React.useMemo(() => {
    if (xp >= 5000) return { level: 6, title: 'Protocol Architect' };
    if (xp >= 2500) return { level: 5, title: 'Core Contributor' };
    if (xp >= 1200) return { level: 4, title: 'EIP Developer' };
    if (xp >= 600) return { level: 3, title: 'Protocol Explorer' };
    if (xp >= 250) return { level: 2, title: 'Apprentice Coder' };
    return { level: 1, title: 'Novice Builder' };
  }, [xp]);

  const streakBoostInfo = React.useMemo(() => {
    if (streak >= 30) return { text: '3.0x Legendary Boost Active · Milestone 30 Days Achieved! 🚀', hasBoost: true };
    if (streak >= 14) return { text: '2.0x Boost Active · Next Milestone at 30 Days (+1,000 XP)', hasBoost: true };
    if (streak >= 7) return { text: '1.5x Boost Active · Next Milestone at 14 Days (+500 XP)', hasBoost: true };
    if (streak >= 3) return { text: '1.2x Boost Active · Next Milestone at 7 Days (+250 XP)', hasBoost: true };
    return { text: 'Complete daily quests and labs to unlock streak multipliers! 🔥', hasBoost: false };
  }, [streak]);

  useEffect(() => {
    // Pick a random quirky quote on initial client load
    setQuoteIndex(Math.floor(Math.random() * quirkyQuotes.length));
  }, []);

  const handleNextQuote = () => {
    setIsHyped(true);
    setQuoteIndex((prev) => (prev + 1) % quirkyQuotes.length);
    setTimeout(() => setIsHyped(false), 500);
  };

  const handleShareStreak = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ethshala.org';
    const link = referralCode ? `${origin}/ref/${referralCode}` : origin;
    const text = `🔥 I'm on a ${streak}-day Ethereum learning streak on ETHShala! Join the campus developer cohort: ${link}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success('Streak shared to clipboard!');
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* =========================================================================
          SECTION 1: HERO MASTHEAD (Clean, open, seamless, no outer box)
          ========================================================================= */}
      <section className="relative w-full pt-2 pb-4">
        
        {/* Soft Ambient Green Glow behind Hero (no box boundaries) */}
        <div className="pointer-events-none absolute -top-16 left-1/4 w-[500px] h-64 rounded-full bg-primary/8 dark:bg-emerald-500/10 blur-[140px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Clean Heading, Subtitle & Primary Actions */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start">
            
            {/* Subtle Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-emerald-400">
                Ethereum Protocol Track // Campus Builder
              </span>
            </div>

            {/* Clean, Bold Headline */}
            <h1 className="text-foreground font-black text-4xl sm:text-5xl lg:text-5xl tracking-tight leading-[1.08] mb-3">
              <span className="block text-muted-foreground font-medium text-2xl sm:text-3xl mb-1">
                Welcome back,
              </span>
              <span>{user.username}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-sm sm:text-base mb-5 max-w-lg leading-relaxed">
              Hands-on EIP protocol tracks, smart contracts, and real campus mentorship.
            </p>

            {/* Network & Community Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/70 dark:bg-accent/40 border border-border/70 text-xs font-medium text-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-primary dark:text-emerald-400">Network Active</span>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-muted-foreground">Joined by 1,200+ student developers</span>
            </div>

            {/* Actions: Same line, no wrap */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-nowrap overflow-x-auto scrollbar-hide py-1 max-w-full">
              <Link
                href="/dashboard/my-modules"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-primary/25 cursor-pointer group shrink-0 whitespace-nowrap"
              >
                <BookOpen size={15} />
                <span>Resume Course</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/marketplace"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Layers size={15} className="text-primary dark:text-emerald-400" />
                <span>Explore Modules</span>
              </Link>

              <div className="shrink-0 whitespace-nowrap inline-flex items-center">
                <ConnectButton />
              </div>
            </div>

          </div>

          {/* Right: Big Quirky Dialogue Box on the LEFT + 3D Student Builder on the RIGHT */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-5 lg:gap-6 w-full relative">
            
            {/* The Big Quirky Dialogue Bubble (covers the empty left side!) */}
            <div 
              onClick={handleNextQuote}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNextQuote(); }}
              title="Click to roll another quirky thought! 🎲"
              className={`animate-float-slow relative w-full sm:w-[320px] lg:w-[360px] xl:w-[400px] p-5 sm:p-6 rounded-3xl bg-card/95 dark:bg-[#0d221b]/95 backdrop-blur-md border border-border/80 dark:border-emerald-500/30 shadow-[0_16px_40px_rgba(7,89,69,0.12)] dark:shadow-[0_16px_44px_rgba(16,185,129,0.2)] cursor-pointer transition-all duration-300 select-none group ${
                isHyped ? 'scale-105 -rotate-1 ring-2 ring-primary/40' : 'hover:scale-[1.02]'
              }`}
            >
              {/* Quirky Quote with animated text transition */}
              <p 
                key={quoteIndex} 
                className="animate-[fade-in_0.3s_ease-out] text-sm sm:text-base font-semibold text-foreground leading-relaxed tracking-tight"
              >
                &ldquo;{quirkyQuotes[quoteIndex](user.username)}&rdquo;
              </p>

              {/* Bottom interactive action bar */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 text-primary dark:text-emerald-400 font-bold">
                  <span>⛓️ on-chain thoughts</span>
                </span>
                <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                  <span>tap to roll</span>
                  <RefreshCw size={11} className={isHyped ? 'animate-spin text-primary' : 'group-hover:rotate-45 transition-transform'} />
                </span>
              </div>

              {/* Speech Bubble Tail on the RIGHT (desktop), pointing right at the student character */}
              <div className="hidden sm:block absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-card/95 dark:bg-[#0d221b]/95 border-t border-r border-border/80 dark:border-emerald-500/30 rotate-45 transform" />

              {/* Speech Bubble Tail on BOTTOM (mobile), pointing down at the student character */}
              <div className="sm:hidden absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-card/95 dark:bg-[#0d221b]/95 border-b border-r border-border/80 dark:border-emerald-500/30 rotate-45 transform" />
            </div>

            {/* Student 3D Builder Illustration */}
            <div 
              onClick={handleNextQuote}
              className="relative w-60 sm:w-68 lg:w-72 xl:w-76 shrink-0 aspect-square flex items-center justify-center cursor-pointer select-none"
              title="Click to hear what they are thinking!"
            >
              {/* Soft ambient emerald glow behind the character */}
              <div className={`absolute inset-4 rounded-full bg-gradient-to-tr from-primary/20 via-[#61d9b9]/20 to-amber-500/15 blur-3xl transition-all duration-500 ${isHyped ? 'opacity-100 scale-110' : 'opacity-80'}`} />

              {/* Student Illustration */}
              <img
                src="/student-builder-transparent.webp"
                alt="Student Builder"
                className={`relative z-10 w-full h-full object-contain drop-shadow-[0_16px_36px_rgba(7,89,69,0.22)] dark:drop-shadow-[0_16px_40px_rgba(16,185,129,0.3)] transition-transform duration-300 ${
                  isHyped ? 'scale-105 rotate-1' : 'hover:scale-[1.02]'
                }`}
              />

              {/* Minimal floating tech badge */}
              <div className="absolute bottom-1 left-2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 dark:bg-card/85 backdrop-blur-md border border-border text-[11px] font-mono font-bold text-primary dark:text-emerald-400 shadow-xs">
                <Sparkles size={12} className="text-amber-500" />
                <span>EIP-4844 // Blobs ⚡</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 2: DAILY STREAK & BUILDER METRICS (Seamless horizontal flow)
          ========================================================================= */}
      <section className="border-y border-border/60 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Interactive Builder Streak Engine (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl select-none">🔥</span>
                <span className="text-foreground font-black text-2xl tracking-tight">
                  {streak} {streak === 1 ? 'Day' : 'Days'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    streak > 0
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {streak > 0 ? 'Streak Active' : 'Start Today'}
                </span>
              </div>

              <button
                onClick={handleShareStreak}
                title="Share Streak"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <Share2 size={15} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-emerald-400 mb-3">
              <Zap size={13} className={streakBoostInfo.hasBoost ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'} />
              <span>{streakBoostInfo.text}</span>
            </div>

            {/* 7-Day Week Bar */}
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {streakDays.map((sd, idx) => {
                const isToday = idx === streakDays.length - 1;
                const isSelected = selectedDay?.date === sd.date;

                return (
                  <button
                    key={sd.date + idx}
                    onClick={() => setSelectedDay(sd)}
                    className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      sd.active
                        ? 'bg-amber-500/15 dark:bg-amber-500/25 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-xs'
                        : 'bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted'
                    } ${isToday ? 'ring-2 ring-primary/40' : ''} ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
                  >
                    <span className="text-[10px] text-muted-foreground font-medium mb-0.5">{sd.day}</span>
                    <span className="text-xs">
                      {sd.active ? '🔥' : '·'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected day tooltip */}
            {selectedDay && (
              <div className="text-xs text-muted-foreground flex items-center justify-between pt-1">
                <span className="font-medium text-foreground">{selectedDay.fullDay} ({selectedDay.date}):</span>
                <span className={selectedDay.active ? 'text-primary dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
                  {selectedDay.active ? (selectedDay.xp > 0 ? `+${selectedDay.xp} XP earned` : 'Active session') : 'Rest day'}
                </span>
              </div>
            )}

          </div>

          {/* Right: Core Metrics HUD (7 cols) - Clean open stats without rounded card boxes */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x-0 sm:divide-x divide-border/60">
            
              {/* Metric 1: Total XP */}
              <div className="sm:pl-4 first:pl-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Total XP</p>
                <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{xp.toLocaleString()}</p>
                <p className="text-xs font-semibold text-primary dark:text-emerald-400 mt-0.5">Level {levelInfo.level} · {levelInfo.title}</p>
              </div>

            {/* Metric 2: Campus Rank */}
            <Link href="/dashboard/leaderboard" className="sm:pl-4 block group hover:opacity-90 transition-opacity">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5 flex items-center justify-between">
                <span>Campus Rank</span>
                <span className="text-[9px] font-mono text-primary dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </p>
              <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {rank ? `#${rank}` : 'Top 10'}
              </p>
              <p className="text-xs font-semibold text-primary dark:text-emerald-400 mt-0.5">
                Cohort Leaderboard
              </p>
            </Link>

            {/* Metric 3: Referrals */}
            <div className="sm:pl-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Referrals</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{referralsCount}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">Peers Invited</p>
            </div>

            {/* Metric 4: CAP Status */}
            <div className="sm:pl-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Fellowship</p>
              <p className="text-2xl sm:text-3xl font-black text-primary dark:text-emerald-400 tracking-tight">{capStatus}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{user.role}</p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default CampusCommandHub;
