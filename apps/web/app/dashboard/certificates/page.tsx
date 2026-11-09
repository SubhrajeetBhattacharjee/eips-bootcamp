'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { CertificatesGrid } from '@/app/components/certificates/CertificatesGrid';
import {
  CompetitionCertificateItem,
  fetchUserCertificates,
} from '@/app/lib/certificates';
import { Award, Trophy, RefreshCw, ShieldCheck } from 'lucide-react';

export default function CertificatesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [certificates, setCertificates] = useState<CompetitionCertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCertificates = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/certificates?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to load certificates: ${res.status}`);
      }
      const data: CompetitionCertificateItem[] = await res.json();
      setCertificates(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!isSignedIn || !user?.id) {
      router.replace('/sign-in');
      return;
    }

    loadCertificates(user.id);
  }, [isPending, isSignedIn, user?.id, router, loadCertificates]);

  if (isPending || (loading && certificates.length === 0)) {
    return <LoadingScreen text="Retrieving verified credentials..." />;
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="w-full py-16 text-center space-y-4">
          <p className="text-destructive font-bold">{error}</p>
          <button
            onClick={() => user?.id && loadCertificates(user.id)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-2"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-emerald-400" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Verified Credentials // Academic Standards
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Verified Certificates
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-xl leading-relaxed">
              Official verifiable credentials for Ethereum protocol tracks, coursework distinctions, and campus fellowships.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/marketplace"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <Trophy size={14} />
              <span>Explore Courses</span>
            </Link>
          </div>
        </div>

        {/* Certificates Grid */}
        <CertificatesGrid certificates={certificates} />
      </div>
    </DashboardShell>
  );
}

