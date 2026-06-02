"use client";
// apps/web/app/dashboard/leaderboard/page.tsx

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from '@/app/lib/auth-client';

import {
  fetchLeaderboard,
  fetchDBUser,
  fetchImpactStats,
  getFeaturedContributor,
  FilterPeriod,
  LeaderboardUser,
  FeaturedContributor as FC,
  ImpactStats,
  DBUser,
} from "@/app/lib/leaderboard";

import LeaderboardHero from "@/app/components/leaderboard/Leaderboardhero";
import FeaturedContributor from "@/app/components/leaderboard/FeaturedContributor";
import LeaderboardTable from "@/app/components/leaderboard/Leaderboardtable";
import XPInfoCard from "@/app/components/leaderboard/Xpinfocard";
import ImpactCard from "@/app/components/leaderboard/Impactcard";
import RankProgressCard from "@/app/components/leaderboard/Rankprogresscard";
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "My Learning", href: "/dashboard/learning", icon: "📖" },
  { label: "Bootcamp Modules", href: "/dashboard/bootcamp", icon: "⚡" },
  { label: "Assignments", href: "/dashboard/assignments", icon: "📋" },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: "🏆", active: true },
];
const NAV_CAP = [
  { label: "CAP Status", href: "/dashboard/cap", icon: "🛡️" },
  { label: "Referrals", href: "/dashboard/referrals", icon: "👥" },
  { label: "Rewards", href: "/dashboard/rewards", icon: "🎁" },
  { label: "Wallet", href: "/dashboard/wallet", icon: "💼" },
];
const NAV_ADMIN = [{ label: "Admin Analytics", href: "/dashboard/admin", icon: "📊" }];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const { data: session, isPending } = useSession();
  const currentUser = session?.user;

  const [filter, setFilter] = useState<FilterPeriod>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [featured, setFeatured] = useState<FC | null>(null);
  const [impact, setImpact] = useState<ImpactStats | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Fetch all data ──────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [lb, imp] = await Promise.all([
      fetchLeaderboard(filter),
      fetchImpactStats(),
    ]);
    setLeaderboard(lb);
    setFeatured(getFeaturedContributor(lb));
    setImpact(imp);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Resolve DB user ──────────────────────────────────────────────
  useEffect(() => {
    if (isPending || !currentUser) return;
    fetchDBUser(currentUser.id).then(setDbUser);
  }, [isPending, currentUser]);

  // ── Mark current user row ───────────────────────────────────────────────────
  const currentUserId = dbUser?.id;
  const rowsWithCurrent = leaderboard.map((r) =>
    r.userId === currentUserId ? { ...r, isCurrentUser: true } : r
  );

  // ── Rank progress ───────────────────────────────────────────────────────────
  const currentUserRow = rowsWithCurrent.find((r) => r.isCurrentUser);
  const percentile = currentUserRow
    ? Math.round((currentUserRow.rank / leaderboard.length) * 100)
    : 12;

  return (
    <DashboardShell>
      <LeaderboardHero filter={filter} onFilterChange={setFilter} />

      <div className="px-6 py-6">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="flex gap-6 items-start">
              {/* ── Center column ─────────────────────────────── */}
              <div className="flex-1 min-w-0 space-y-5">
                {/* Featured */}
                {featured && <FeaturedContributor contributor={featured} />}

                {/* Table */}
                <LeaderboardTable users={rowsWithCurrent} />
              </div>

              {/* ── Right sidebar ─────────────────────────────── */}
              <aside className="w-72 xl:w-80 shrink-0 space-y-4 hidden lg:block">
                <XPInfoCard />
                {impact && <ImpactCard impact={impact} />}
                <RankProgressCard
                  rank={currentUserRow?.rank ?? 0}
                  nextRankXp={5000}
                  currentXp={dbUser?.xp ?? 0}
                  percentile={percentile}
                  totalUsers={leaderboard.length}
                />
              </aside>
            </div>
          )}

          {/* Mobile sidebar widgets */}
          {!loading && (
            <div className="lg:hidden mt-6 space-y-4">
              <XPInfoCard />
              {impact && <ImpactCard impact={impact} />}
              <RankProgressCard
                rank={currentUserRow?.rank ?? 0}
                nextRankXp={5000}
                currentXp={dbUser?.xp ?? 0}
                percentile={percentile}
                totalUsers={leaderboard.length}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

// ─── Nav section ─────────────────────────────────────────────────────────────

function NavSection({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; icon: string; active?: boolean }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-white/20 px-3 mb-2">
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
              style={
                item.active
                  ? {
                      background: "rgba(52,211,153,0.12)",
                      color: "#34d399",
                      border: "1px solid rgba(52,211,153,0.2)",
                    }
                  : { color: "rgba(255,255,255,0.45)" }
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4 animate-pulse">
        <div className="h-44 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-96 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
      <div className="w-72 space-y-4 animate-pulse hidden lg:block">
        <div className="h-52 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-40 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }} />
        <div className="h-24 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    </div>
  );
}