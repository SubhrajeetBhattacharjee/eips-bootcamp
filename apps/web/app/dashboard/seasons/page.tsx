'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/app/lib/auth-client';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { SeasonsHero } from '@/app/components/seasons/SeasonsHero';
import { SeasonHallOfFame } from '@/app/components/seasons/SeasonHallOfFame';
import { SeasonLeaderboardTable } from '@/app/components/seasons/SeasonLeaderboardTable';
import {
  fetchAllSeasons,
  fetchSeasonBySlug,
  fetchCurrentSeason,
  SeasonListItem,
  SeasonResponse,
} from '@/app/lib/seasons';
import { Trophy, Archive, Sparkles, Calendar } from 'lucide-react';

export default function SeasonsDashboardPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [seasonsList, setSeasonsList] = useState<SeasonListItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('season-alpha');
  const [seasonData, setSeasonData] = useState<SeasonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all seasons list initially
  useEffect(() => {
    async function loadList() {
      try {
        const list = await fetchAllSeasons();
        setSeasonsList(list);
        const active = list.find((s) => s.isActive);
        if (active) {
          setSelectedSlug(active.slug);
        }
      } catch (err) {
        console.error('Failed to load seasons list:', err);
      }
    }
    loadList();
  }, []);

  // Load specific season details whenever selectedSlug or session changes
  useEffect(() => {
    async function loadSeason() {
      setLoading(true);
      try {
        const userId = session?.user?.id;
        const res = await fetchSeasonBySlug(selectedSlug, userId);
        setSeasonData(res);
      } catch (err) {
        console.error('Failed to load season details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!isSessionPending && selectedSlug) {
      loadSeason();
    }
  }, [selectedSlug, session, isSessionPending]);

  if (isSessionPending || (loading && !seasonData)) {
    return <LoadingScreen text="Loading Season Rankings & Hall of Fame..." />;
  }

  if (!seasonData) {
    return null;
  }

  const topThree = seasonData.leaderboard.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Seasons Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/60">
          {seasonsList.map((s) => {
            const isSelected = s.slug === selectedSlug;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSlug(s.slug)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {s.isActive ? (
                  <Sparkles size={13} className={isSelected ? 'text-primary-foreground' : 'text-primary'} />
                ) : s.isConcluded ? (
                  <Archive size={13} />
                ) : (
                  <Calendar size={13} />
                )}
                <span>{s.name.split(':')[0]}</span>
                {s.isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          ETHShala Seasonal League System
        </div>
      </div>

      {/* Season Hero */}
      <SeasonsHero
        season={seasonData.season}
        timeRemainingSeconds={seasonData.timeRemainingSeconds}
        totalParticipants={seasonData.totalParticipants}
        currentUserStanding={seasonData.currentUserStanding}
      />

      {/* Hall of Fame Podium for Top 3 */}
      {topThree.length > 0 && <SeasonHallOfFame topThree={topThree} />}

      {/* Full Leaderboard Table */}
      <SeasonLeaderboardTable entries={seasonData.leaderboard} />
    </div>
  );
}

