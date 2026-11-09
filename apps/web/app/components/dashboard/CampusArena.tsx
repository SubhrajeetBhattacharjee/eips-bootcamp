'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  Video, 
  Copy, 
  Check, 
  Share2, 
  Trophy, 
  Star, 
  ShieldCheck, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import type { ActivityItem, LeaderboardEntry, ActiveModuleInfo, EventItem } from '@/app/lib/dashboard';

interface CampusArenaProps {
  referralCode: string;
  referralsCount: number;
  referralXp?: number;
  xp: number;
  leaderboard: LeaderboardEntry[];
  recentActivity: ActivityItem[];
  progressPercent?: number;
  activeModule?: ActiveModuleInfo | null;
  upcomingEvents?: EventItem[];
}

const medalEmoji: Record<number, string> = {
  0: '🥇',
  1: '🥈',
  2: '🥉',
};

export function CampusArena({
  referralCode,
  referralsCount,
  referralXp = 0,
  xp,
  leaderboard,
  recentActivity,
  progressPercent = 0,
  activeModule,
  upcomingEvents = [],
}: CampusArenaProps) {
  const [copied, setCopied] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'xp' | 'cap'>('all');

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const link = typeof window !== 'undefined' ? `${window.location.origin}/ref/${referralCode}` : `https://ethshala.org/ref/${referralCode}`;
    if (navigator.share) {
      navigator.share({ title: 'Join ETHShala Campus Cohort', url: link }).catch(() => handleCopy());
    } else {
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredActivity = recentActivity.filter((item) => {
    if (activityFilter === 'all') return true;
    return item.icon === activityFilter;
  });

  // Circular progress math
  const cleanProgress = Math.max(0, Math.min(100, progressPercent));
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cleanProgress / 100) * circumference;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2 pb-12">
      
      {/* =========================================================================
          LEFT STUDIO: Open sections for Active Track, Workshops & Activity (7 cols)
          ========================================================================= */}
      <div className="lg:col-span-7 flex flex-col space-y-10">
        
        {/* SECTION A: Active Protocol Lab Journey */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-emerald-400">
                {activeModule?.isSubscribed ? 'Active Protocol Track' : 'Featured Track'}
              </span>
            </div>
            
            <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
              {activeModule?.isSubscribed ? 'Subscribed' : 'Protocol Track'}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-1.5">
              {activeModule?.title || 'What is Ethereum? Fundamentals & Architecture'}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              {activeModule?.description || 'Understand EVM opcode architecture, state transition verification, and smart contract design patterns.'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-muted-foreground">Module Progress</span>
              <span className="text-primary dark:text-emerald-400 font-mono font-bold">
                {activeModule?.progressPercent ?? 0}% Complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary via-emerald-400 to-[#61d9b9] rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(4, activeModule?.progressPercent ?? 0)}%` }}
              />
            </div>
          </div>

          {/* Next Lesson Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                {activeModule?.nextLesson ? String(activeModule.nextLesson.orderIndex ?? 1).padStart(2, '0') : '01'}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {activeModule?.isSubscribed ? 'Next Lab' : 'Recommended Lesson'}
                </p>
                <p className="text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
                  {activeModule?.nextLesson?.title || (activeModule?.isSubscribed ? 'Complete All Lessons' : 'Start Intro Lesson')}
                </p>
              </div>
            </div>

            <Link
              href={activeModule?.isSubscribed ? `/dashboard/my-modules?moduleId=${activeModule.id}` : '/dashboard/marketplace'}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs cursor-pointer group"
            >
              <span>{activeModule?.isSubscribed ? 'Resume Lab' : 'Explore Modules'}</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-border/60" />

        {/* SECTION B: Campus Workshop Schedule */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Video size={18} className="text-primary dark:text-emerald-400" />
                <span>Upcoming Campus Workshops</span>
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">Live protocol calls and hands-on developer tracks</p>
            </div>

            <Link 
              href="/dashboard/events"
              className="text-primary dark:text-emerald-400 text-xs font-bold hover:underline transition-colors"
            >
              All Events →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((evt) => {
                const eventDate = new Date(evt.date);
                const day = String(eventDate.getDate()).padStart(2, '0');
                const month = eventDate.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
                const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div 
                    key={evt.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl hover:bg-accent/60 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-xl border flex flex-col items-center justify-center font-bold leading-none shrink-0 shadow-xs bg-[#bbf7d0] dark:bg-[#064e3b]/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700">
                        <span className="text-base font-black">{day}</span>
                        <span className="text-[9px] uppercase font-mono tracking-wider mt-0.5">{month}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          {evt.module?.title || 'Campus Protocol Workshop'} · <span className="text-primary dark:text-emerald-400 font-semibold">{timeStr}</span>
                        </p>
                      </div>
                    </div>

                    <a
                      href={evt.link || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-accent border border-border text-xs font-bold text-foreground transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      <span>Join Call</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                );
              })
            ) : (
              <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">No Live Workshops Scheduled Today</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-md leading-relaxed">
                      Weekly core developer AMAs and live coding tracks are announced regularly. Continue your self-paced modules in the meantime.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/marketplace"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card hover:bg-accent border border-border text-xs font-bold text-foreground transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <Layers size={13} className="text-primary dark:text-emerald-400" />
                  <span>Browse Modules</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-border/60" />

        {/* SECTION C: Real-Time Protocol Activity Stream */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Recent Protocol Activity</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Real-time milestones from you and your campus peers</p>
            </div>

            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
              {(['all', 'xp', 'cap'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivityFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activityFilter === filter
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {filteredActivity.length > 0 ? (
              filteredActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon === 'xp' ? <Star size={15} /> : <ShieldCheck size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                      <span className="text-[10px] text-muted-foreground font-mono shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-xs text-muted-foreground">
                No recent activity for this filter. Start a lab to record progress!
              </div>
            )}
          </div>
        </section>

      </div>

      {/* =========================================================================
          RIGHT STUDIO: Open sections for Leaderboard, Referral & Mastery (5 cols)
          ========================================================================= */}
      <div className="lg:col-span-5 flex flex-col space-y-10 lg:pl-4">
        
        {/* SECTION D: Campus Leaderboard Top Builders */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <span>Top Builders</span>
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">Campus chapter leaderboard</p>
            </div>

            <Link
              href="/dashboard/leaderboard"
              className="text-primary dark:text-emerald-400 text-xs font-bold hover:underline transition-colors"
            >
              All Time →
            </Link>
          </div>

          <div className="space-y-1 pt-1">
            {leaderboard.slice(0, 5).map((entry, index) => {
              const cleanName = (entry.name && entry.name.toLowerCase() !== 'learner' && entry.name.toLowerCase() !== 'explorer')
                ? entry.name
                : (entry.handle ? entry.handle.replace('@', '') : 'Builder');

              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/60 transition-colors"
                >
                  <div className="w-5 text-center font-bold text-sm shrink-0">
                    {index < 3 ? (
                      <span className="text-base">{medalEmoji[index]}</span>
                    ) : (
                      <span className="text-muted-foreground font-mono text-xs">{index + 1}</span>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {cleanName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{cleanName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">@{entry.handle?.replace('@', '') || cleanName.toLowerCase()}</p>
                  </div>

                  <span className="text-xs font-mono font-bold text-primary dark:text-emerald-400 shrink-0">
                    {entry.xp.toLocaleString()} XP
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-border/60" />

        {/* SECTION E: Campus Referral Program */}
        <section className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1.5">
              Campus Growth
            </div>
            <h3 className="text-xl font-black text-foreground tracking-tight">Invite Campus Peers</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Earn +500 XP per student builder onboarded</p>
          </div>

          {/* Referral Code Box */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted/60 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <span className="text-primary dark:text-emerald-400 font-mono font-black tracking-widest text-sm">
                {referralCode}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">YOUR CODE</span>
            </div>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground transition-colors cursor-pointer shadow-xs"
              title="Copy Referral Code"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Referral Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Total Referrals</p>
              <p className="text-xl font-black text-foreground">{referralsCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">XP Earned</p>
              <p className="text-xl font-black text-primary dark:text-emerald-400">{(referralXp ?? (referralsCount * 500)).toLocaleString()}</p>
            </div>
          </div>

          {/* Share CTA */}
          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer group"
          >
            <span>{copied ? 'Link Copied to Clipboard!' : 'Share Referral Link'}</span>
            <Share2 size={13} className="group-hover:rotate-12 transition-transform" />
          </button>
        </section>

        {/* Divider */}
        <hr className="border-border/60" />

        {/* SECTION F: Mastery Radar / Overall Progress */}
        <section className="space-y-4 text-center flex flex-col items-center">
          <h3 className="text-xl font-black text-foreground tracking-tight">Bootcamp Mastery</h3>

          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            <svg width="128" height="128" viewBox="0 0 140 140" className="-rotate-90">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-muted/60"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-primary dark:text-emerald-400 transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))',
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-foreground font-mono">{cleanProgress}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mastery</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Complete the remaining lab assignments to unlock your official <strong className="text-foreground">Ethereum Protocol Fellow</strong> campus credential.
          </p>
        </section>

      </div>

    </div>
  );
}

export default CampusArena;
