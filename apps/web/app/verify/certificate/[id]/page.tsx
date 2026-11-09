import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Trophy,
  ExternalLink,
  GraduationCap,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  VerifiedCertificateData,
  verifyCertificate,
} from '@/app/lib/certificates';

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await verifyCertificate(id);

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fcfbf7] dark:bg-[#091a14] text-foreground">
        <div className="max-w-md w-full p-8 rounded-3xl bg-card border border-border text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center text-3xl mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-xl font-bold">Invalid or Expired Certificate</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We could not verify certificate <strong>{id}</strong> against our Ethereum developer credential registry.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
            >
              Go to ETHShala Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  const formattedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-[#091a14] text-foreground py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Verification Status Pill Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Official Verified Credential
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Certificate Registry ID: {cert.certificateNumber}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Learn on ETHShala</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Certificate Visual Document */}
        <div className="relative w-full rounded-3xl bg-card border-8 border-double border-amber-600/30 p-8 sm:p-14 text-center shadow-xl overflow-hidden">
          {/* Subtle Corner Accents */}
          <div className="pointer-events-none absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-600/40 rounded-tl-xl" />
          <div className="pointer-events-none absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-600/40 rounded-tr-xl" />
          <div className="pointer-events-none absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-600/40 rounded-bl-xl" />
          <div className="pointer-events-none absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-600/40 rounded-br-xl" />

          {/* Heading */}
          <div className="space-y-1 mb-6">
            <p className="text-xs font-mono font-black uppercase tracking-[0.25em] text-primary dark:text-emerald-400">
              ETHSHALA PROTOCOL LEARNING FELLOWSHIP
            </p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Official Verified Ethereum Developer Standards
            </p>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-foreground uppercase mb-6">
            CERTIFICATE OF {cert.type}
          </h2>

          <p className="text-xs sm:text-sm font-serif italic text-muted-foreground mb-2">
            This officially certifies that
          </p>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground pb-2">
            {cert.recipientName}
          </h3>

          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto my-3" />

          {cert.recipient.college && (
            <p className="text-xs font-mono text-muted-foreground flex items-center justify-center gap-1.5 mb-4">
              <GraduationCap size={14} />
              <span>{cert.recipient.college}</span>
            </p>
          )}

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6 font-serif">
            has demonstrated verified protocol engineering intuition, EVM execution understanding,
            and competitive problem solving in the official timed arena:
          </p>

          <div className="inline-block p-4 rounded-xl bg-accent/40 border border-border max-w-xl mb-6">
            <p className="text-base font-bold text-foreground">{cert.title}</p>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
              Difficulty: {cert.competition.difficulty} Track
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8 font-mono">
            <div className="p-3 rounded-xl bg-card border border-border">
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Final Score</p>
              <p className="text-base font-black text-foreground">{cert.score} / {cert.totalPoints}</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Official Rank</p>
              <p className="text-base font-black text-primary dark:text-emerald-400">
                {cert.rank ? `#${cert.rank}` : 'Completed'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border">
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Time Taken</p>
              <p className="text-base font-black text-foreground">{formatTime(cert.timeTakenSeconds)}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border text-left">
            <div className="text-[10px] font-mono text-muted-foreground space-y-1">
              <p><strong>Certificate ID:</strong> {cert.certificateNumber}</p>
              <p><strong>Issued Date:</strong> {formattedDate}</p>
              <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 size={12} /> Cryptographically Authenticated
              </p>
            </div>

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

