"use client";
import React from "react";
import { FilterPeriod } from "@/app/lib/leaderboard";

const TABS: { label: string; value: FilterPeriod }[] = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "month" },
  { label: "This Week", value: "week" },
];

interface Props {
  active: FilterPeriod;
  onChange: (v: FilterPeriod) => void;
}

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 mt-5">
      {TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={
              isActive
                ? {
                    background: "rgba(52,211,153,0.12)",
                    border: "1px solid rgba(52,211,153,0.4)",
                    color: "#34d399",
                    boxShadow: "0 0 12px rgba(52,211,153,0.15)",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.45)",
                  }
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
