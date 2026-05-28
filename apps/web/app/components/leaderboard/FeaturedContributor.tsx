"use client";
import React from "react";
import { FeaturedContributor as FC } from "@/app/lib/leaderboard";

interface Props {
  contributor: FC;
}

const BADGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "CAP Ambassador": { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)", text: "#34d399" },
  Researcher: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.6)" },
  Educator: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.6)" },
  "Community Builder": { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.6)" },
};

export default function FeaturedContributor({ contributor }: Props) {
  const {
    name,
    avatarUrl,
    badges,
    description,
    xp,
    streak,
    rank,
    weeklyGrowth,
    sparkline,
  } = contributor;

  return (
    <div className="relative rounded-2xl overflow-hidden flex flex-col sm:flex-row items-stretch gap-6 p-6" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: "0 0 0 1px rgba(52,211,153,0.06), 0 24px 48px rgba(0,0,0,0.5)" }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)" }} />

      <div className="flex flex-col items-center justify-center shrink-0 w-28">
        <div className="relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl">👑</div>
          <div className="w-24 h-24 rounded-full" style={{ padding: "3px", background: "conic-gradient(from 0deg, #34d399, #059669, #34d399)", boxShadow: "0 0 24px rgba(52,211,153,0.4)" }}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <AvatarPlaceholder name={name} size={90} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold tracking-[0.15em] mb-2" style={{ color: "rgba(52,211,153,0.7)" }}>TOP CONTRIBUTOR THIS WEEK</p>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">{name}</h2>
          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#34d399" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>

        {badges[0] && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-3" style={{ ...BADGE_COLORS["CAP Ambassador"], border: `1px solid ${BADGE_COLORS["CAP Ambassador"].border}` }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            {badges[0]}
          </span>
        )}

        <p className="text-sm text-white/45 leading-relaxed mb-4 max-w-xs">{description}</p>

        <div className="flex flex-wrap gap-2">
          {badges.slice(1).map((b) => {
            const style = BADGE_COLORS[b] ?? { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.5)" };
            return (
              <span key={b} className="text-xs px-3 py-1 rounded-full" style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text }}>{b}</span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-8 shrink-0">
        <StatBlock label="XP EARNED" value={xp.toLocaleString()} sub="Total XP" accent />
        <StatBlock label="STREAK" value={`${streak}`} sub={`Days 🔥`} />
        <StatBlock label="RANK" value={`#${rank}`} sub="All Time" />
      </div>

      <div className="hidden lg:flex flex-col items-end justify-between shrink-0 w-32">
        <Sparkline data={sparkline} />
        <div className="text-right mt-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
          <p className="text-emerald-400 font-bold text-sm">↑ {weeklyGrowth}%</p>
          <p className="text-white/30 text-[10px]">vs last week</p>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold tracking-widest text-white/30 mb-1">{label}</p>
      <p className="text-3xl font-bold leading-none mb-1" style={{ color: accent ? "#34d399" : "#fff" }}>{value}</p>
      <p className="text-xs text-white/35">{sub}</p>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const W = 120; const H = 56; const pad = 4;
  const pts = data.map((v, i) => { const x = pad + (i / (data.length - 1)) * (W - pad * 2); const y = H - pad - v * (H - pad * 2); return `${x},${y}`; });
  const polyline = pts.join(" "); const first = pts[0]; const last = pts[pts.length - 1]; const [lastX] = last.split(","); const [firstX] = first.split(","); const area = `M${firstX},${H} L${pts.join(" L")} L${lastX},${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity="0.3" /><stop offset="100%" stopColor="#34d399" stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill="url(#sg)" />
      <polyline points={polyline} stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={parseFloat(pts[pts.length - 1].split(",")[0])} cy={parseFloat(pts[pts.length - 1].split(",")[1])} r="3" fill="#34d399" style={{ filter: "drop-shadow(0 0 4px #34d399)" }} />
    </svg>
  );
}

function AvatarPlaceholder({ name, size }: { name: string; size: number }) {
  const initials = name.split(/[\s.]+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return <div className="flex items-center justify-center font-bold text-emerald-300" style={{ width: size, height: size, background: "linear-gradient(135deg,#064e3b,#065f46)", fontSize: size * 0.32 }}>{initials}</div>;
}
