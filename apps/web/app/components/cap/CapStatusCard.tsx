"use client";

// app/components/cap/CapStatusCard.tsx

import React from "react";
import Link from "next/link";
import { CAPApplication } from "../../lib/Cap";

interface Props {
  application: CAPApplication;
}

export default function CapStatusCard({ application }: Props) {
  const { status } = application;

  if (status === "PENDING") return <PendingCard application={application} />;
  if (status === "APPROVED") return <ApprovedCard application={application} />;
  if (status === "REJECTED") return <RejectedCard />;

  return null;
}

// ─── PENDING ─────────────────────────────────────────────────────────────────

function PendingCard({ application }: { application: CAPApplication }) {
  return (
    <StatusWrapper
      accentColor="rgba(245,158,11,1)"
      glowColor="rgba(245,158,11,0.15)"
      borderColor="rgba(245,158,11,0.2)"
    >
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto"
        style={{
          background: "rgba(245,158,11,0.12)",
          border: "2px solid rgba(245,158,11,0.3)",
          boxShadow: "0 0 32px rgba(245,158,11,0.2)",
        }}
      >
        <ClockIcon />
      </div>

      {/* Badge */}
      <StatusBadge label="PENDING" color="rgba(245,158,11,1)" bg="rgba(245,158,11,0.12)" border="rgba(245,158,11,0.3)" />

      {/* Text */}
      <h3 className="text-2xl font-semibold text-foreground mt-4 mb-2">
        Your application is under review.
      </h3>
      <p className="text-foreground/45 text-sm max-w-sm mx-auto leading-relaxed">
        We&apos;ll notify you once our team reviews your submission. This typically
        takes 3–7 working days.
      </p>

      {/* Meta */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <MetaItem
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          }
          label="Applied on"
          value={application.appliedOn ?? "—"}
        />
        <div className="w-px h-8 bg-accent" />
        <MetaItem
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          }
          label="Expected response"
          value={application.expectedResponse ?? "—"}
        />
      </div>
    </StatusWrapper>
  );
}

// ─── APPROVED ────────────────────────────────────────────────────────────────

function ApprovedCard({ application }: { application: CAPApplication }) {
  const perks = [
    { icon: "🎁", label: "Special Perks" },
    { icon: "🛡️", label: "Ambassador Badge" },
    { icon: "⭐", label: "More XP Rewards" },
    { icon: "🌐", label: "Network Access" },
  ];

  return (
    <StatusWrapper
      accentColor="rgba(52,211,153,1)"
      glowColor="rgba(52,211,153,0.1)"
      borderColor="rgba(52,211,153,0.2)"
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["🎉", "✨", "🎊", "💫"].map((e, i) => (
          <span
            key={i}
            className="absolute text-lg animate-bounce"
            style={{
              top: `${15 + i * 15}%`,
              left: i % 2 === 0 ? `${8 + i * 3}%` : `${75 + i * 3}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: "2s",
              opacity: 0.6,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto relative"
        style={{
          background: "rgba(52,211,153,0.12)",
          border: "2px solid rgba(52,211,153,0.4)",
          boxShadow: "0 0 48px rgba(52,211,153,0.3)",
        }}
      >
        <ShieldCheckIcon />
      </div>

      {/* Badge */}
      <StatusBadge label="APPROVED" color="rgba(52,211,153,1)" bg="rgba(52,211,153,0.12)" border="rgba(52,211,153,0.3)" />

      {/* Text */}
      <h3 className="text-2xl font-semibold text-foreground mt-4 mb-2">
        Congratulations! 🎉
      </h3>
      <p className="text-foreground/45 text-sm max-w-sm mx-auto leading-relaxed">
        You are now part of the{" "}
        <span className="text-emerald-400 font-medium">
          EthShala Campus Ambassador Program.
        </span>{" "}
        Start spreading Ethereum education on your campus.
      </p>

      {/* Perks grid */}
      <div className="grid grid-cols-2 gap-3 mt-8 max-w-xs mx-auto">
        {perks.map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{
              background: "rgba(52,211,153,0.07)",
              border: "1px solid rgba(52,211,153,0.15)",
            }}
          >
            <span className="text-base">{p.icon}</span>
            <span className="text-xs text-foreground/60 font-medium">{p.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/referrals"
        className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #34d399, #059669)",
          color: "#000",
          boxShadow: "0 0 24px rgba(52,211,153,0.35)",
        }}
      >
        Go to Referrals
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </Link>
    </StatusWrapper>
  );
}

// ─── REJECTED ────────────────────────────────────────────────────────────────

function RejectedCard() {
  return (
    <StatusWrapper
      accentColor="rgba(239,68,68,1)"
      glowColor="rgba(239,68,68,0.08)"
      borderColor="rgba(239,68,68,0.2)"
    >
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "2px solid rgba(239,68,68,0.3)",
          boxShadow: "0 0 32px rgba(239,68,68,0.15)",
        }}
      >
        <XCircleIcon />
      </div>

      {/* Badge */}
      <StatusBadge label="NOT APPROVED" color="rgba(239,68,68,1)" bg="rgba(239,68,68,0.1)" border="rgba(239,68,68,0.25)" />

      {/* Text */}
      <h3 className="text-2xl font-semibold text-foreground mt-4 mb-2">
        Application not approved this cycle.
      </h3>
      <p className="text-foreground/45 text-sm max-w-sm mx-auto leading-relaxed">
        Don&apos;t worry — keep learning and building. You can reapply in a future
        cycle. Every application improves your chances.
      </p>

      {/* Encouragement */}
      <div
        className="mt-8 rounded-xl px-5 py-4 max-w-xs mx-auto text-left"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p className="text-xs text-foreground/40 leading-relaxed">
          💡 <span className="text-foreground/60">Tip:</span> Complete more bootcamp
          modules, contribute to EIPs, and grow your community presence before
          reapplying.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Back to Dashboard
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </Link>
    </StatusWrapper>
  );
}

// ─── Shared wrappers / primitives ────────────────────────────────────────────

function StatusWrapper({
  children,
  accentColor,
  glowColor,
  borderColor,
}: {
  children: React.ReactNode;
  accentColor: string;
  glowColor: string;
  borderColor: string;
}) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden text-center px-8 py-12"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
          border: `1px solid ${borderColor}`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 0 80px ${glowColor}, 0 32px 64px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Top accent */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: 0.7,
          }}
        />
        {children}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  color,
  bg,
  border,
}: {
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <span
      className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {label}
    </span>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 text-foreground/30 text-xs mb-1">
        {icon}
        {label}
      </div>
      <p className="text-foreground font-medium text-sm">{value}</p>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
}