import { auth } from "@clerk/nextjs/server";
import {
  resolveDbUser,
  fetchReferralStats,
  fetchLeaderboard,
  generateReferralCode,
  MOCK_REFERRAL_STATS,
  MOCK_ACTIVITY,
  type ReferralStats,
} from "../../lib/referrals";

import DashboardShell from "../../components/dashboard/DashboardShell";
import ReferralHero from "../../components/referrals/Referralhero";
import ReferralCodeCard from "../../components/referrals/ReferralCodeCard";
import ShareReferralCard from "../../components/referrals/Sharereferralcard";
import ReferralStatsGrid from "../../components/referrals/Referralstatsgrid";
import ReferralActivity from "../../components/referrals/Referralactivity";
import XPInfoCard from "../../components/referrals/Xpinfocard";
import ImpactCard from "../../components/referrals/Impactcard";

export const metadata = {
  title: "Referrals | EIPsInsight Bootcamp",
  description: "Invite builders and grow the Ethereum ecosystem.",
};

async function getReferralData(): Promise<ReferralStats> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return MOCK_REFERRAL_STATS;

    const dbUser = await resolveDbUser(clerkId);
    if (!dbUser) return MOCK_REFERRAL_STATS;

    let stats = await fetchReferralStats(dbUser.id);

    // If no referral code yet, generate one
    if (!stats || !stats.referralCode) {
      await generateReferralCode(dbUser.id);
      stats = await fetchReferralStats(dbUser.id);
    }

    // Merge leaderboard rank
    if (stats) {
      const leaderboard = await fetchLeaderboard();
      if (leaderboard) {
        const myEntry = leaderboard.find((e) => e.userId === dbUser.id);
        if (myEntry) {
          stats.leaderboardRank = myEntry.rank;
          const percentile = Math.round((myEntry.rank / leaderboard.length) * 100);
          stats.leaderboardPercentile = `Top ${percentile}%`;
        }
      }
      return stats;
    }
  } catch {
    // Backend unavailable — use mock
  }
  return MOCK_REFERRAL_STATS;
}

export default async function ReferralsPage() {
  const stats = await getReferralData();

  return (
    <DashboardShell>
      <div className="space-y-5">
        {/* Hero */}
        <ReferralHero />

        {/* Main layout: left content + right sidebar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT: Main content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Referral Code Card */}
            <ReferralCodeCard stats={stats} />

            {/* Stats Grid */}
            <ReferralStatsGrid stats={stats} />

            {/* Activity Section */}
            <ReferralActivity activities={MOCK_ACTIVITY} />
          </div>

          {/* RIGHT: Sidebar widgets */}
          <div className="lg:w-[300px] xl:w-[320px] flex-shrink-0 space-y-4">
            <ShareReferralCard stats={stats} />
            <XPInfoCard />
            <ImpactCard stats={stats} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}