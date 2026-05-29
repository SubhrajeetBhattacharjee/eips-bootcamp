// apps/web/app/components/admin/CapAnalyticsCard.tsx
'use client';

import React from 'react';
import { CAPAnalyticsData } from '@/app/lib/admin';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface CapAnalyticsCardProps {
  data: CAPAnalyticsData;
}

function DonutChart({ approved, rejected, pending, total }: { approved: number; rejected: number; pending: number; total: number }) {
  const circumference = 2 * Math.PI * 45;
  
  const approvedPercent = (approved / total) * 100;
  const rejectedPercent = (rejected / total) * 100;
  const pendingPercent = (pending / total) * 100;

  let approvedOffset = 0;
  const rejectedOffset = (approvedPercent / 100) * circumference;
  const pendingOffset = ((approvedPercent + rejectedPercent) / 100) * circumference;

  return (
    <div className="relative w-40 h-40 mx-auto mb-6">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {/* Approved (green) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#10B981"
          strokeWidth="8"
          strokeDasharray={`${(approvedPercent / 100) * circumference} ${circumference}`}
          strokeLinecap="round"
        />
        
        {/* Rejected (red) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#EF4444"
          strokeWidth="8"
          strokeDasharray={`${(rejectedPercent / 100) * circumference} ${circumference}`}
          strokeDashoffset={-(rejectedOffset)}
          strokeLinecap="round"
        />
        
        {/* Pending (amber) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="8"
          strokeDasharray={`${(pendingPercent / 100) * circumference} ${circumference}`}
          strokeDashoffset={-(pendingOffset)}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <p className="text-white font-bold text-2xl">{total}</p>
        <p className="text-gray-400 text-xs">Total Apps</p>
      </div>
    </div>
  );
}

export function CapAnalyticsCard({ data }: CapAnalyticsCardProps) {
  const total = data.applications;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-lg shadow-emerald-500/10 p-6">
      <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-amber-400" />
        CAP Program
      </h3>

      {/* Donut Chart */}
      <DonutChart
        approved={data.approved}
        rejected={data.rejected}
        pending={data.pending}
        total={total}
      />

      {/* Legend */}
      <div className="space-y-3">
        {/* Approved */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-sm">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{data.approved}</span>
            <span className="text-gray-500 text-xs">
              ({((data.approved / total) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{data.pending}</span>
            <span className="text-gray-500 text-xs">
              ({((data.pending / total) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Rejected */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-gray-400 text-sm">Rejected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{data.rejected}</span>
            <span className="text-gray-500 text-xs">
              ({((data.rejected / total) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}