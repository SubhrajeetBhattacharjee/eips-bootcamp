"use client";

import React from "react";
import { ImpactStats } from "@/app/lib/leaderboard";
import { Users, Award, Globe } from "lucide-react";

interface Props {
  impact: ImpactStats;
}

export default function ImpactCard({ impact }: Props) {
  return (
    <div className="rounded-2xl p-5 border border-border/80 bg-card/95 backdrop-blur-md shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Ecosystem Impact
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center divide-x divide-border/60">
        <div>
          <p className="text-xl font-black text-foreground tracking-tight">
            {impact.activeLearners.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Learners</p>
        </div>

        <div className="pl-3">
          <p className="text-xl font-black text-primary dark:text-emerald-400 tracking-tight">
            {impact.campusAmbassadors.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Fellows</p>
        </div>

        <div className="pl-3">
          <p className="text-xl font-black text-foreground tracking-tight">
            {impact.communities.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Chapters</p>
        </div>
      </div>
    </div>
  );
}

export { ImpactCard };
