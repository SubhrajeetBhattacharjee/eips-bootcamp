"use client";
import React from "react";
import XPInfoCard from "./Xpinfocard";
import { ImpactStats } from "@/app/lib/leaderboard";

interface Props {
  impact: ImpactStats;
}

export default function ImpactCard({ impact }: Props) {
  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <h3 className="text-sm font-semibold text-white/90 mb-2">Community Impact</h3>
      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
        <div>
          <div className="text-lg font-bold">{impact.activeLearners.toLocaleString()}</div>
          <div className="text-xs text-white/40">Learners</div>
          <div className="text-xs mt-1">
            <span className="text-emerald-400">▲ {impact.activeLearnersDelta}%</span>
          </div>
        </div>
        <div>
          <div className="text-lg font-bold">{impact.campusAmbassadors.toLocaleString()}</div>
          <div className="text-xs text-white/40">Ambassadors</div>
          <div className="text-xs mt-1"><span className="text-emerald-400">▲ {impact.campusAmbassadorsDelta}%</span></div>
        </div>
        <div>
          <div className="text-lg font-bold">{impact.communities.toLocaleString()}</div>
          <div className="text-xs text-white/40">Communities</div>
          <div className="text-xs mt-1"><span className="text-emerald-400">▲ {impact.communitiesDelta}%</span></div>
        </div>
      </div>
      <div className="mt-3">
        <XPInfoCard compact />
      </div>
    </div>
  );
}
