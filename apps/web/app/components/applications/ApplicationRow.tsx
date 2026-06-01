'use client';

import { useState } from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import { getStatusColor, getTrackColor, getStatusIcon } from '@/app/lib/applications';
import type { Application } from '@/app/lib/applications';

interface ApplicationRowProps {
  application: Application;
  onViewDetails: (application: Application) => void;
  onStatusChange: () => void;
}

export function ApplicationRow({ application, onViewDetails, onStatusChange }: ApplicationRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formattedDate = new Date(application.appliedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  const time = new Date(application.appliedDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await fetch(`/api/admin/applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      onStatusChange();
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
      onStatusChange();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="hover:bg-white/5 transition-colors duration-200 group">
      {/* Applicant */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={application.avatar}
            alt={application.name}
            className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover"
          />
          <div className="min-w-0">
            <p className="font-medium text-white text-sm truncate">{application.name}</p>
            <p className="text-xs text-gray-500 truncate">{application.city}, India</p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-300 truncate max-w-xs">{application.email}</p>
      </td>

      {/* Track */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border ${getTrackColor(application.track)}`}
        >
          {application.track}
        </span>
      </td>

      {/* Batch */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-300">{application.batch}</p>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(application.status)}`}>
          <span>{getStatusIcon(application.status)}</span>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </td>

      {/* Applied Date */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-300">
          <p>{formattedDate}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* View Details */}
          <button
            onClick={() => onViewDetails(application)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group/btn"
            title="View details"
          >
            <Eye className="w-4 h-4 text-gray-400 group-hover/btn:text-emerald-400" />
          </button>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group/btn"
            >
              <MoreVertical className="w-4 h-4 text-gray-400 group-hover/btn:text-emerald-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-black/95 border border-white/10 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm z-50">
                <button
                  onClick={() => {
                    handleApprove();
                    setShowMenu(false);
                  }}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 text-left text-sm text-emerald-400 hover:bg-emerald-500/20 transition-colors duration-150 disabled:opacity-50"
                >
                  ✓ Approve Application
                </button>
                <button
                  onClick={() => {
                    handleReject();
                    setShowMenu(false);
                  }}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/20 transition-colors duration-150 disabled:opacity-50 border-t border-white/10"
                >
                  ✕ Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}