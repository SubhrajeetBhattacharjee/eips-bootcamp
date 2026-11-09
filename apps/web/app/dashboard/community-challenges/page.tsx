'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/app/lib/auth-client';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { CommunityChallengesHero } from '@/app/components/community-challenges/CommunityChallengesHero';
import { CommunityChallengeCard } from '@/app/components/community-challenges/CommunityChallengeCard';
import {
  fetchCommunityChallenges,
  CommunityChallengeItem,
  CommunityChallengesResponse,
} from '@/app/lib/community-challenges';

export default function CommunityChallengesPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [data, setData] = useState<CommunityChallengesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  useEffect(() => {
    async function loadChallenges() {
      setLoading(true);
      try {
        const userId = session?.user?.id;
        const res = await fetch(
          `/api/community-challenges${userId ? `?userId=${userId}` : ''}`,
        );
        if (res.ok) {
          const json: CommunityChallengesResponse = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load community challenges:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!isSessionPending) {
      loadChallenges();
    }
  }, [session, isSessionPending]);

  if (isSessionPending || (loading && !data)) {
    return <LoadingScreen text="Loading Community Challenges..." />;
  }

  const challenges = data?.challenges || [];
  const stats = data?.stats || { total: 0, active: 0, completed: 0 };

  const filtered = challenges.filter((c) => {
    if (filter === 'ACTIVE') return c.status === 'ACTIVE';
    if (filter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  const handleUpdate = (updated: CommunityChallengeItem) => {
    if (!data) return;
    const updatedList = data.challenges.map((c) =>
      c.id === updated.id ? updated : c,
    );
    setData({
      ...data,
      challenges: updatedList,
      stats: {
        total: updatedList.length,
        active: updatedList.filter((c) => c.status === 'ACTIVE').length,
        completed: updatedList.filter((c) => c.status === 'COMPLETED').length,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <CommunityChallengesHero stats={stats} />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/50">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Missions ({stats.total})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'ACTIVE'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'COMPLETED'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          Ecosystem Goals
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((challenge) => (
            <CommunityChallengeCard
              key={challenge.id}
              challenge={challenge}
              userId={session?.user?.id}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-card border border-border/50 max-w-xl mx-auto space-y-3">
          <p className="text-sm font-bold text-foreground">
            No {filter.toLowerCase()} challenges found
          </p>
          <p className="text-xs text-muted-foreground">
            Check back soon for new collective community missions!
          </p>
        </div>
      )}
    </div>
  );
}

