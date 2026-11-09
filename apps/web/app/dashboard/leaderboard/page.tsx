"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from '@/app/lib/auth-client';
import {
  fetchLeaderboardData,
  FilterPeriod,
  LeaderboardUser,
  FeaturedContributor as FC,
  ImpactStats,
} from "@/app/lib/leaderboard";

import { LeaderboardHero } from "@/app/components/leaderboard/Leaderboardhero";
import FeaturedContributor from "@/app/components/leaderboard/FeaturedContributor";
import LeaderboardTable from "@/app/components/leaderboard/Leaderboardtable";
import ImpactCard from "@/app/components/leaderboard/Impactcard";
import RankProgressCard from "@/app/components/leaderboard/Rankprogresscard";
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { Users, ArrowRight } from "lucide-react";

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const sessionUser = session?.user;

  const [filter, setFilter] = useState<FilterPeriod>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [featured, setFeatured] = useState<FC | null>(null);
  const [impact, setImpact] = useState<ImpactStats | null>(null);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (selectedFilter: FilterPeriod) => {
    setLoading(true);
    const data = await fetchLeaderboardData(selectedFilter);
    setLeaderboard(data.leaderboard);
    setFeatured(data.featured);
    setImpact(data.impact);
    setCurrentUser(data.currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(filter);
  }, [filter, loadData]);

  const currentRank = currentUser?.rank ?? 0;
  const currentXp = currentUser?.xp ?? 0;
  const percentile = (currentRank > 0 && leaderboard.length > 0)
    ? Math.max(1, Math.round((currentRank / leaderboard.length) * 100))
    : 10;

  const displayName = sessionUser?.name || currentUser?.name || (sessionUser?.email ? sessionUser.email.split('@')[0] : 'Student Builder');

  return (
    <DashboardShell>
      <div className="space-y-6">
        <LeaderboardHero
          filter={filter}
          onFilterChange={setFilter}
          totalBuilders={leaderboard.length}
        />

        <div className="pt-2 pb-12">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Center Column: Top Contributor + Leaderboard Table */}
              <div className="lg:col-span-8 space-y-6">
                {featured && <FeaturedContributor contributor={featured} />}
                <LeaderboardTable users={leaderboard} />
              </div>

              {/* Right Sidebar: Standing, Real Impact, and Campus Referral Boost */}
              <aside className="lg:col-span-4 space-y-5">
                <RankProgressCard
                  rank={currentRank}
                  currentXp={currentXp}
                  percentile={percentile}
                  totalUsers={leaderboard.length}
                  userName={displayName}
                />

                {impact && <ImpactCard impact={impact} />}

                {/* Campus Referral CTA */}
                <div className="rounded-2xl p-5 border border-border/80 bg-card/95 backdrop-blur-md shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Invite Campus Peers</h4>
                      <p className="text-[11px] text-muted-foreground">+500 XP per student builder</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Help build your university Ethereum developer chapter and accelerate your leaderboard standing.
                  </p>

                  <Link
                    href="/dashboard/referrals"
                    className="w-full py-2 px-3 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Get Referral Link</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
      <div className="lg:col-span-8 space-y-6">
        <div className="h-44 rounded-2xl bg-card/60 border border-border/60" />
        <div className="h-96 rounded-2xl bg-card/60 border border-border/60" />
      </div>
      <div className="lg:col-span-4 space-y-5">
        <div className="h-48 rounded-2xl bg-card/60 border border-border/60" />
        <div className="h-36 rounded-2xl bg-card/60 border border-border/60" />
      </div>
    </div>
  );
}
