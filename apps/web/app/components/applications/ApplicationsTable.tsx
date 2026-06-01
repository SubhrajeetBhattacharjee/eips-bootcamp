'use client';

import { useState } from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import { ApplicationRow } from '@/app/components/applications/ApplicationRow';
import { ApplicationDetailsModal } from '@/app/components/applications/ApplicationDetailsModal';
import { getStatusColor, getTrackColor } from '@/app/lib/applications';
import type { Application } from '@/app/lib/applications';

interface ApplicationsTableProps {
  applications: Application[];
  loading: boolean;
  onStatusChange: () => void;
}

export function ApplicationsTable({ applications, loading, onStatusChange }: ApplicationsTableProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  return (
    <>
      {/* Table Container */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-300">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header Row */}
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Track
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-400 border-opacity-50" />
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <ApplicationRow
                    key={application.id}
                    application={application}
                    onViewDetails={handleViewDetails}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}