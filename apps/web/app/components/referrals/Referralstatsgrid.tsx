"use client";

import ReferralStatCard from "./Referralstatcard";
import { ReferralStats } from "../../lib/referrals";

interface Props {
  stats: ReferralStats;
}

export default function ReferralStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      <ReferralStatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
          </svg>
        }
        label="Total Referrals"
        value={String(stats.totalReferrals)}
        growth={String(stats.monthlyGrowth.totalReferrals)}
        growthLabel=" this month"
      />
      <ReferralStatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="8" r="2" fill="currentColor" />
            <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        }
        label="Pending Joins"
        value={String(stats.pendingJoins)}
        growth={String(stats.monthlyGrowth.pendingJoins)}
        growthLabel=" this month"
      />
      <ReferralStatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
          </svg>
        }
        label="Successful Signups"
        value={String(stats.successfulSignups)}
        growth={String(stats.monthlyGrowth.successfulSignups)}
        growthLabel=" this month"
      />
      <ReferralStatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        }
        label="XP Earned"
        value={stats.xpEarned.toLocaleString()}
        growth={String(stats.monthlyGrowth.xpEarned)}
        growthLabel=" this month"
      />
      <ReferralStatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M8 21H4a2 2 0 01-2-2v-5a2 2 0 012-2h4m6 9H10a2 2 0 01-2-2V9a2 2 0 012-2h4m6 14h-4a2 2 0 01-2-2V3a2 2 0 012-2h4a2 2 0 012 2v16a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        label="Leaderboard Rank"
        value={`#${stats.leaderboardRank}`}
        growthLabel={stats.leaderboardPercentile}
        isRank
      />
    </div>
  );
}