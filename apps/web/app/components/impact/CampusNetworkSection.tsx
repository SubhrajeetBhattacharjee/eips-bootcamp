// apps/web/components/community/CampusNetworkSection.tsx

import React, { useState } from 'react';
import { CheckCircle, Handshake, Target, MapPin, Users } from 'lucide-react';

interface College {
  id: string;
  name: string;
  city: string;
  students: number;
  activities?: number;
  status?: string;
}

const engagedColleges: College[] = [
  { id: '1', name: 'Hooghly Engineering & Technology College', city: 'Hugli-Chuchura, West Bengal', students: 6000, activities: 1 },
];

// const activePartnerships: College[] = [
//   { id: '1', name: 'IIT Bombay', city: 'Mumbai', students: 10000, status: 'Workshop Scheduled' },
//   { id: '2', name: 'IISER Pune', city: 'Pune', students: 2200, status: 'Co-hosting Hackathon' },
//   { id: '3', name: 'Christ University', city: 'Bangalore', students: 3500, status: 'Campus Ambassador Program' },
// ];

const potentialPartners: College[] = [
  { id: '1', name: 'Hooghly Engineering & Technology College', city: 'Hugli-Chuchura, West Bengal', students: 6000, activities: 1 },
  { id: '2', name: 'Heritage Institute of Technology', city: 'Kolkata, West Bengal', students: 9000 },
  { id: '3', name: 'Academy of Technology', city: 'Hooghly, West Bengal', students: 8500 },
  { id: '4', name: 'Techno Main Salt Lake', city: 'Bidhannagar, West Bengal', students: 7500 },
];

export const CampusNetworkSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'engaged' | 'active' | 'potential'>('engaged');

  const tabs = [
    { id: 'engaged', label: 'Already Engaged', icon: CheckCircle, color: 'text-emerald-400' },
    // { id: 'active', label: 'Active Partnerships', icon: Handshake, color: 'text-blue-400' },
    { id: 'potential', label: 'Potential Partners', icon: Target, color: 'text-orange-400' },
  ];

  const getDisplayData = () => {
    switch (activeTab) {
      // case 'active':
      //   return activePartnerships;
      case 'potential':
        return potentialPartners;
      default:
        return engagedColleges;
    }
  };

  const displayData = getDisplayData();
  const activeTabConfig = tabs.find(t => t.id === activeTab);
  const TabIcon = activeTabConfig?.icon || CheckCircle;

  return (
    <div className="relative group">
      <div
        className={`
          relative rounded-2xl
          border border-emerald-500/30
          bg-gradient-to-br from-emerald-500/10 to-emerald-500/5
          backdrop-blur-xl
          p-6
          transition-all duration-300
          hover:border-emerald-500/60
          hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
          overflow-hidden
        `}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-emerald-400 to-transparent pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌐</span>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Campus Network
              </p>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              College Partnerships
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'engaged' |
                  //  'active' | 
                   'potential')}
                className={`
                  flex-1 flex items-center gap-2 px-4 py-3 rounded-lg font-medium
                  transition-all duration-200 border
                  text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200'
                      : 'border-border bg-card/60 text-muted-foreground hover:border-emerald-500/40'
                  }
                `}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                <span className="ml-auto text-xs font-bold opacity-70">
                  {tab.id === 'engaged' ? engagedColleges.length : 
                  // tab.id === 'active' ? activePartnerships.length : 
                  potentialPartners.length}
                </span>
              </button>
            ))}
          </div>

          {/* Colleges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayData.map((college) => (
              <div
                key={college.id}
                className={`
                  rounded-lg border border-border
                  bg-card/60 hover:bg-accent
                  p-4 transition-all duration-200
                  group/college
                `}
              >
                {/* College Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {college.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {college.city}
                    </p>
                  </div>
                  {activeTab === 'engaged' && (
                    <div className="flex-shrink-0 p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <CheckCircle size={16} className="text-emerald-400" />
                    </div>
                  )}
                  {activeTab === 'active' && (
                    <div className="flex-shrink-0 p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <Handshake size={16} className="text-blue-400" />
                    </div>
                  )}
                  {activeTab === 'potential' && (
                    <div className="flex-shrink-0 p-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30">
                      <Target size={16} className="text-orange-400" />
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-border bg-background/50 p-2">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Users size={12} />
                      Students
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {(college.students / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="rounded border border-border bg-background/50 p-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      {activeTab === 'active' ? 'Status' : 'Activities'}
                    </p>
                    <p className="text-sm font-bold text-emerald-400">
                      {college.activities ? `${college.activities} +` : college.status || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Engaged</p>
              <p className="text-2xl font-bold text-emerald-400">{engagedColleges.length}</p>
            </div>
            {/* <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Active Partnerships</p>
              <p className="text-2xl font-bold text-blue-400">{activePartnerships.length}</p>
            </div> */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Potential</p>
              <p className="text-2xl font-bold text-orange-400">{potentialPartners.length}</p>
            </div>
          </div>

          {/* CTA Button */}
          {/* <div className="mt-6 pt-6 border-t border-gray-700/50">
            <button
              className={`
                w-full rounded-lg font-medium py-3 px-4
                transition-all duration-200
                border border-emerald-500/50 hover:border-emerald-500/80
                bg-emerald-500/10 hover:bg-emerald-500/20
                text-emerald-300 hover:text-emerald-200
                text-sm
              `}
            >
              {activeTab === 'engaged' && 'View All Engaged Colleges'}
              {activeTab === 'active' && 'Manage Partnerships'}
              {activeTab === 'potential' && 'Reach Out to Partners'}
            </button>
          </div> */}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};