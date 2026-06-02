import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';;
import {
  resolveDbUser,
  fetchReferralStats,
  fetchLeaderboard,
  generateReferralCode,
  fetchReferralActivity,
  createEmptyReferralStats,
  type ReferralStats,
  type ReferralActivity as ReferralActivityType,
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

async function getReferralData(): Promise<{ stats: ReferralStats; activity: ReferralActivityType[] }> {
  const empty = { stats: createEmptyReferralStats(), activity: [] };
  try {
      const session = await auth.api.getSession({ headers: await headers() });
  const clerkId = session?.user?.id;
    if (!clerkId) return empty;

    const dbUser = await resolveDbUser(clerkId);
    if (!dbUser) return empty;

    let stats = await fetchReferralStats(dbUser.id);

    // If no referral code yet, generate one
    if (!stats || !stats.referralCode) {
      await generateReferralCode(dbUser.id);
      stats = await fetchReferralStats(dbUser.id);
    }

    const activity = await fetchReferralActivity(dbUser.id);

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
      return { stats, activity };
    }
  } catch {
    // Backend unavailable — return empty
  }
  return empty;
}

export default async function ReferralsPage() {
  const { stats, activity } = await getReferralData();

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
            <ReferralActivity activities={activity} />
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