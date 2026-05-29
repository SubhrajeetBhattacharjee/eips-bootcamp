// apps/web/app/components/admin/SystemOverview.tsx
'use client';

import React from 'react';
import {
  Server,
  Database,
  Zap,
  TrendingUp,
  Check,
  AlertCircle
} from 'lucide-react';
import { SystemMetrics } from '@/app/lib/admin';

interface SystemOverviewProps {
  metrics: SystemMetrics;
}

function StatusIndicator({ status }: { status: 'operational' | 'degraded' | 'offline' | 'healthy' | 'warning' | 'critical' }) {
  const configs = {
    operational: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: Check },
    degraded: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', icon: AlertCircle },
    offline: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: AlertCircle },
    healthy: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: Check },
    warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', icon: AlertCircle },
    critical: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: AlertCircle }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bg} ${config.border}`}>
      <Icon className={`w-4 h-4 ${config.text}`} />
      <span className={`text-sm font-medium ${config.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

// Mini sparkline chart
type ChartColorKey = 'emerald' | 'blue' | 'purple';

function MiniChart({ data, color = 'emerald' }: { data: number[]; color?: ChartColorKey }) {
  const colors: Record<ChartColorKey, string> = {
    emerald: '#10B981',
    blue: '#3B82F6',
    purple: '#8B5CF6'
  };

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 100 30" className="w-full h-12">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={colors[color]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  chart?: number[];
  chartColor?: ChartColorKey;
}

function MetricCard({ title, value, change, icon, chart, chartColor }: MetricCardProps) {
  const isPositive = change ? change >= 0 : null;

  return (
    <div className="
      rounded-lg border border-emerald-500/20 bg-emerald-500/5
      p-5 hover:bg-emerald-500/10 transition-all duration-300
    ">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className="text-emerald-400 opacity-60">
          {icon}
        </div>
      </div>

      {chart && (
        <div className="mb-3">
          <MiniChart data={chart} color={chartColor} />
        </div>
      )}

      {change !== undefined && (
        <p className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs last month
        </p>
      )}
    </div>
  );
}

export function SystemOverview({ metrics }: SystemOverviewProps) {
  // Mock chart data for the mini visualizations
  const activeSessionsChart = [45, 52, 48, 61, 55, 67, 72, 68, 75, 82];
  const completionRateChart = [60, 62, 65, 64, 66, 68, 70, 71, 71, 68];
  const approvalRateChart = [70, 72, 74, 76, 75, 77, 78, 79, 79, 76];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* System Health Metrics */}
      <div className="lg:col-span-3 rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-lg shadow-emerald-500/10 p-6">
        <h3 className="text-white font-semibold text-lg mb-6">System Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Server Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-3">Server Status</p>
              <StatusIndicator status={metrics.serverStatus} />
            </div>
            <Server className="w-5 h-5 text-emerald-400/60" />
          </div>

          {/* Database Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-3">Database</p>
              <StatusIndicator status={metrics.databaseStatus} />
            </div>
            <Database className="w-5 h-5 text-emerald-400/60" />
          </div>

          {/* API Response Time */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-3">API Response Time</p>
              <p className="text-white font-semibold text-xl">{metrics.apiResponseTime}ms</p>
              <p className="text-gray-500 text-xs mt-1">Avg. Response Time</p>
            </div>
            <Zap className="w-5 h-5 text-amber-400/60" />
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <MetricCard
        title="Active Sessions"
        value={metrics.activeSessions.toLocaleString()}
        change={12.6}
        icon={<TrendingUp className="w-6 h-6" />}
        chart={activeSessionsChart}
        chartColor="emerald"
      />

      {/* Course Completion Rate */}
      <MetricCard
        title="Course Completion Rate"
        value={`${metrics.courseCompletionRate.toFixed(1)}%`}
        change={8.2}
        icon={<TrendingUp className="w-6 h-6" />}
        chart={completionRateChart}
        chartColor="blue"
      />

      {/* CAP Approval Rate */}
      <MetricCard
        title="CAP Approval Rate"
        value={`${metrics.capApprovalRate.toFixed(1)}%`}
        change={8.2}
        icon={<TrendingUp className="w-6 h-6" />}
        chart={approvalRateChart}
        chartColor="purple"
      />
    </div>
  );
}