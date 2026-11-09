'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Trophy,
  ExternalLink,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import {
  CompetitionCertificateItem,
  CertificateType,
} from '@/app/lib/certificates';
import { CertificateViewModal } from './CertificateViewModal';

interface CertificatesGridProps {
  certificates: CompetitionCertificateItem[];
}

export function CertificatesGrid({ certificates }: CertificatesGridProps) {
  const [selectedCert, setSelectedCert] =
    useState<CompetitionCertificateItem | null>(null);

  if (certificates.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-card border border-border/80 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-3xl mx-auto mb-4">
          📜
        </div>
        <h3 className="text-lg font-bold text-foreground">
          No Certificates Earned Yet
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
          Complete your enrolled modules and assignments to earn your official verifiable credential,
          campus distinction seals, and public verification link.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs"
          >
            <span>Explore Courses & Modules</span>
          </Link>
        </div>
      </div>
    );
  }

  const getTypeBadge = (type: CertificateType) => {
    switch (type) {
      case 'CHAMPION':
        return (
          <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <span>👑</span> Champion
          </span>
        );
      case 'PODIUM':
        return (
          <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <span>🥈</span> Podium Finisher
          </span>
        );
      case 'DISTINCTION':
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span>🎖️</span> Honors Distinction
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border flex items-center gap-1">
            <span>📜</span> Completion
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert) => {
          const formattedDate = new Date(cert.issuedAt).toLocaleDateString(
            'en-US',
            {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            },
          );

          return (
            <div
              key={cert.id}
              className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all group relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getTypeBadge(cert.type)}
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formattedDate}
                  </span>
                </div>

                <h3 className="text-base font-black text-foreground group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {cert.title}
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Issued to: <strong className="text-foreground">{cert.recipientName}</strong>
                </p>

                <div className="mt-4 p-3 rounded-xl bg-accent/40 border border-border/60 flex items-center justify-between text-xs font-mono">
                  <span>Score: <strong className="text-foreground">{cert.score}/{cert.totalPoints}</strong></span>
                  <span className="text-primary dark:text-emerald-400 font-bold">
                    {cert.rank ? `Rank #${cert.rank}` : 'Verified'}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
                  {cert.certificateNumber}
                </span>

                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Eye size={13} />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedCert && (
        <CertificateViewModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}

