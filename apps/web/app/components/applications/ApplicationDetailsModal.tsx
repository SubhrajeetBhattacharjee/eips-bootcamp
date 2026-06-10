'use client';

import { useState } from 'react';
import { X, ExternalLink, TrendingUp } from 'lucide-react';
import { getStatusColor } from '@/app/lib/applications';
import type { Application } from '@/app/lib/applications';

function Avatar({ name, avatarUrl, className }: { name: string; avatarUrl?: string; className?: string }) {
  if (avatarUrl && avatarUrl.trim() !== '') {
    return <img src={avatarUrl} alt={name} className={className} />;
  }
  const initials = name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'U';
  const colors = ['bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300', 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300', 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={`${className} ${colors[idx]} flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

interface ApplicationDetailsModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export function ApplicationDetailsModal({
  application,
  isOpen,
  onClose,
  onStatusChange,
}: ApplicationDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(application.status);

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      setStatus('approved');
      if (onStatusChange) onStatusChange();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      setStatus('rejected');
      if (onStatusChange) onStatusChange();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Are you sure you want to revoke this application? This will downgrade the user and delete their application.')) {
      return;
    }
    
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/applications/${application.id}`, {
        method: 'DELETE',
      });
      // Removing it from local status view, but since it's deleted, closing modal is best
      if (onStatusChange) onStatusChange();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      {/* Modal */}
      <div className="bg-background border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-background/50 backdrop-blur-sm border-b border-border px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={application.name}
              avatarUrl={application.avatar}
              className="w-12 h-12 rounded-full border border-emerald-500/30 object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{application.name}</h2>
              <p className="text-muted-foreground text-sm">{application.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          {/* Personal Info */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-400 rounded-full" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <InfoItem label="Full Name" value={application.name} />
              <InfoItem label="Email" value={application.email} />
              <InfoItem label="College" value={application.college} />
              <InfoItem label="City" value={application.city} />
              <InfoItem label="Track" value={application.track} />
              <InfoItem label="Batch" value={application.batch} />
            </div>
          </section>

          {/* Social Profiles */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-400 rounded-full" />
              Social Profiles
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <SocialLink label="LinkedIn" url={application.linkedin} />
              <SocialLink label="Twitter/X" url={application.twitter} />
              <SocialLink label="GitHub" url={application.github} />
            </div>
          </section>

          {/* Why Join CAP */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-400 rounded-full" />
              Why Join CAP?
            </h3>
            <div className="p-4 bg-accent border border-border rounded-lg">
              <p className="text-foreground leading-relaxed">{application.whyJoinCAP}</p>
            </div>
          </section>

          {/* Community Experience */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-400 rounded-full" />
              Community Experience
            </h3>
            <div className="p-4 bg-accent border border-border rounded-lg">
              <p className="text-foreground leading-relaxed">{application.communityExperience}</p>
            </div>
          </section>

          {/* Referral Metrics */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-400 rounded-full" />
              Referral Metrics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                icon="👥"
                label="Referrals"
                value={application.referralCount}
              />
              <MetricCard
                icon="⚡"
                label="XP Earned"
                value={application.xp}
              />
              <MetricCard
                icon="📊"
                label="Leaderboard Rank"
                value={`#${application.leaderboardRank}`}
              />
            </div>
          </section>

          {/* Current Status */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-400 rounded-full" />
              Current Status
            </h3>
            <div className="inline-block">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(status)}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </section>

          {/* Decision Buttons */}
          {(status === 'pending' || status === 'approved') && (
            <section className="border-t border-border pt-8">
              <div className="flex gap-4">
                {status === 'pending' && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={isUpdating}
                      className="flex-1 px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 font-semibold hover:bg-emerald-500/30 transition-all duration-200 disabled:opacity-50"
                    >
                      ✓ Approve Application
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={isUpdating}
                      className="flex-1 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50"
                    >
                      ✕ Reject Application
                    </button>
                  </>
                )}
                {status === 'approved' && (
                  <button
                    onClick={handleRevoke}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50"
                  >
                    ⚠ Revoke CAP Status
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-foreground font-medium">{value}</p>
    </div>
  );
}

function SocialLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-accent border border-border rounded-lg hover:bg-accent transition-all duration-200 flex items-center justify-between group"
    >
      <span className="text-sm text-foreground">{label}</span>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
    </a>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="p-4 bg-accent border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-muted-foreground uppercase">{label}</p>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}