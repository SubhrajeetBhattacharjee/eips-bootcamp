'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Share2,
  ExternalLink,
  X,
  ShieldCheck,
} from 'lucide-react';
import { CompetitionCertificateItem, CertificateType } from '@/app/lib/certificates';

interface CertificateViewModalProps {
  certificate: CompetitionCertificateItem;
  onClose: () => void;
}

export function CertificateViewModal({
  certificate,
  onClose,
}: CertificateViewModalProps) {
  const [copied, setCopied] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  );

  const verificationUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/verify/certificate/${certificate.certificateNumber}`
      : `/verify/certificate/${certificate.certificateNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Excited to have earned my verified ${certificate.type} Certificate from @ETHShala for ${certificate.title}! 🏆 Verified on-chain & campus protocol standards.\n\n${verificationUrl}`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const getSeal = (type: CertificateType) => {
    switch (type) {
      case 'CHAMPION':
        return {
          label: 'Champion Seal',
          color: 'text-amber-500 border-amber-500/40 bg-amber-500/10',
          icon: '👑',
          title: 'CERTIFICATE OF CHAMPIONSHIP',
        };
      case 'PODIUM':
        return {
          label: 'Podium Distinction',
          color: 'text-purple-500 border-purple-500/40 bg-purple-500/10',
          icon: '🥈',
          title: 'CERTIFICATE OF EXCELLENCE',
        };
      case 'DISTINCTION':
        return {
          label: 'Honors Distinction',
          color: 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10',
          icon: '🎖️',
          title: 'CERTIFICATE OF DISTINCTION',
        };
      default:
        return {
          label: 'Verified Completion',
          color: 'text-primary border-primary/40 bg-primary/10',
          icon: '📜',
          title: 'CERTIFICATE OF COMPLETION',
        };
    }
  };

  const seal = getSeal(certificate.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/85 backdrop-blur-md overflow-y-auto">
      
      {/* Outer Card Dialog */}
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl p-4 sm:p-8 my-auto max-h-[95vh] overflow-y-auto">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20">
              Verified Credential
            </span>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              ID: {certificate.certificateNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-card hover:bg-accent border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy verification link"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share Link'}</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#000000] text-white hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-opacity cursor-pointer"
              title="Share on X"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">Share on X</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            THE VISUAL CERTIFICATE DOCUMENT
            ========================================================================= */}
        <div
          id="printable-certificate"
          className="relative w-full rounded-2xl bg-[#fcfbf7] dark:bg-[#091a14] border-8 border-double border-amber-600/30 p-6 sm:p-12 text-center text-foreground shadow-sm overflow-hidden"
        >
          {/* Subtle Guilloche Corner Accents */}
          <div className="pointer-events-none absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-600/40 rounded-tl-xl" />
          <div className="pointer-events-none absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-600/40 rounded-tr-xl" />
          <div className="pointer-events-none absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-600/40 rounded-bl-xl" />
          <div className="pointer-events-none absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-600/40 rounded-br-xl" />

          {/* Crest / Header */}
          <div className="space-y-1 mb-6">
            <div className="inline-flex items-center gap-2 text-primary dark:text-emerald-400 text-xs sm:text-sm font-mono font-black uppercase tracking-[0.25em]">
              <span>ETHSHALA PROTOCOL LEARNING FELLOWSHIP</span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Official Ethereum Developer Standards & Verification
            </p>
          </div>

          {/* Certificate Title */}
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-foreground uppercase mb-6">
            {seal.title}
          </h2>

          {/* Recipient Statement */}
          <p className="text-xs sm:text-sm font-serif italic text-muted-foreground mb-2">
            This certifies that
          </p>

          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground decoration-amber-500/40 pb-2">
            {certificate.recipientName}
          </h3>

          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto my-3" />

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6 font-serif">
            has successfully demonstrated protocol engineering intuition, EVM execution mastery,
            and competitive coding problem solving in the official timed arena:
          </p>

          {/* Competition Title Box */}
          <div className="inline-block p-4 rounded-xl bg-accent/40 border border-border/80 max-w-xl mb-6">
            <p className="text-sm sm:text-base font-bold text-foreground">
              {certificate.title}
            </p>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
              Difficulty: {certificate.competition.difficulty} Track
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto mb-8 font-mono">
            <div className="p-2 sm:p-3 rounded-lg bg-card/60 border border-border/60">
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Final Score</p>
              <p className="text-sm sm:text-base font-black text-foreground">
                {certificate.score} / {certificate.totalPoints}
              </p>
            </div>

            <div className="p-2 sm:p-3 rounded-lg bg-card/60 border border-border/60">
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Official Rank</p>
              <p className="text-sm sm:text-base font-black text-primary dark:text-emerald-400">
                {certificate.rank ? `#${certificate.rank}` : 'Completed'}
              </p>
            </div>

            <div className="p-2 sm:p-3 rounded-lg bg-card/60 border border-border/60">
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Time Taken</p>
              <p className="text-sm sm:text-base font-black text-foreground">
                {formatTime(certificate.timeTakenSeconds)}
              </p>
            </div>
          </div>

          {/* Bottom Row: Seal & Signatures */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border/60 text-left">
            
            {/* Left: Verification Metadata */}
            <div className="text-[10px] font-mono text-muted-foreground space-y-1">
              <p>
                <strong>Certificate ID:</strong> {certificate.certificateNumber}
              </p>
              <p>
                <strong>Issued Date:</strong> {formattedDate}
              </p>
              <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck size={12} /> Authenticity Cryptographically Verified
              </p>
            </div>

            {/* Center: Distinction Seal */}
            <div
              className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center text-center text-xl shadow-xs shrink-0 ${seal.color}`}
            >
              <span>{seal.icon}</span>
              <span className="text-[7px] font-mono font-bold uppercase tracking-tighter mt-0.5">
                VERIFIED
              </span>
            </div>

            {/* Right: Signature */}
            <div className="text-center sm:text-right font-serif text-xs">
              <div className="font-serif italic font-black text-foreground text-sm tracking-wide">
                ETHShala Council
              </div>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Protocol Learning Committee
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

