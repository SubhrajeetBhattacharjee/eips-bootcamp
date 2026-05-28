"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { fetchCAPApplication, type CAPApplication } from "../../lib/Cap";
import CapApplicationForm from "../../components/cap/CapApplicationForm";
import CapStatusCard from "../../components/cap/CapStatusCard";

export default function CAPPage() {
  const [application, setApplication] = useState<CAPApplication | null | undefined>(undefined);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    fetchCAPApplication(user.id).then(setApplication);
  }, [user?.id]);

  const loading = application === undefined;

  return (
    <DashboardShell>
      <div className="space-y-5">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/5 px-6 pt-8 pb-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(52,211,153,0.04) 0%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative flex items-start justify-between gap-6 max-w-5xl">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1"
                style={{
                  background: "rgba(52,211,153,0.12)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  boxShadow: "0 0 24px rgba(52,211,153,0.15)",
                }}
              >
                <StarIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  CAP Program
                </h1>
                <p className="text-white/45 text-sm mt-1.5 max-w-lg leading-relaxed">
                  Join the EIPsInsight Campus Ambassador Program and help grow
                  Ethereum education on your campus.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center w-32 h-24 relative shrink-0">
              <EthereumCrystal />
            </div>
          </div>

          <div
            className="relative mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl max-w-xs"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-emerald-400 text-base">✦</span>
            <div>
              <p className="text-white text-xs font-medium">
                Empower your campus.
              </p>
              <p className="text-white/35 text-xs">
                Earn XP. Unlock perks. Grow your network.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-black/20 px-6 py-10">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <LoadingSkeleton />
            ) : application === null ? (
              <CapApplicationForm onSubmitted={(app) => setApplication(app)} />
            ) : (
              <CapStatusCard application={application} />
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-64 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="h-32 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }} />
    </div>
  );
}

function EthereumCrystal() {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" fill="none">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#glow)" filter="url(#blur)" />
      <polygon points="60,10 80,50 60,42 40,50" fill="rgba(52,211,153,0.8)" />
      <polygon points="60,10 80,50 60,42" fill="rgba(52,211,153,0.5)" />
      <polygon points="40,50 60,42 80,50 60,80" fill="rgba(52,211,153,0.6)" />
      <polygon points="60,42 80,50 60,80" fill="rgba(52,211,153,0.35)" />
      <polygon points="40,50 60,80 60,108" fill="rgba(52,211,153,0.4)" />
      <polygon points="80,50 60,80 60,108" fill="rgba(52,211,153,0.25)" />
      <ellipse cx="60" cy="60" rx="48" ry="18" stroke="rgba(52,211,153,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
