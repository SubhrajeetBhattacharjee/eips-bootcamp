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
      {/* Applications Grid */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/10 rounded-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-400 border-opacity-50 mb-4" />
            <p className="text-gray-400 text-sm">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400 text-lg">No applications found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {applications.map((application) => (
              <ApplicationRow
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
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