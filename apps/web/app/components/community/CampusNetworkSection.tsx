// apps/web/app/components/community/CampusNetworkSection.tsx

'use client';

import React, { useState } from 'react';
import { Globe, MapPin, Users, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';

interface College {
  id: string;
  name: string;
  city: string;
  students: number;
  activities?: number;
  status?: string;
  website: string;
  logo: string;
}

const engagedColleges: College[] = [
  {
    id: '1',
    name: 'Hooghly Engineering & Technology College',
    city: 'Hugli-Chuchura, West Bengal',
    students: 6000,
    activities: 2,
    website: 'https://www.hetc.ac.in/',
    logo: '/brand/partners/hetc.png',
  },
  {
    id: '2',
    name: 'Heritage Institute of Technology',
    city: 'Kolkata, West Bengal',
    students: 9000,
    activities: 1,
    website: 'https://heritageit.edu/',
    logo: '/brand/partners/heritage.png',
  },
  {
    id: '3',
    name: 'MCKV Institute of Engineering',
    city: 'Liluah, West Bengal',
    students: 8000,
    activities: 1,
    website: 'https://www.mckvie.edu.in/',
    logo: '/brand/partners/mckvie.jpg',
  },
];

const potentialPartners: College[] = [
  {
    id: '1',
    name: 'Hooghly Engineering & Technology College',
    city: 'Hugli-Chuchura, West Bengal',
    students: 6000,
    activities: 2,
    website: 'https://www.hetc.ac.in/',
    logo: '/brand/partners/hetc.png',
  },
  {
    id: '2',
    name: 'Heritage Institute of Technology',
    city: 'Kolkata, West Bengal',
    students: 9000,
    activities: 1,
    website: 'https://heritageit.edu/',
    logo: '/brand/partners/heritage.png',
  },
  {
    id: '3',
    name: 'Techno Main Salt Lake',
    city: 'Bidhannagar, West Bengal',
    students: 7500,
    website: 'https://www.technomainsaltlake.ticollege.ac.in/',
    logo: '/brand/partners/tmsl.png',
  },
  {
    id: '4',
    name: 'MCKV Institute of Engineering',
    city: 'Liluah, West Bengal',
    students: 8000,
    activities: 1,
    website: 'https://www.mckvie.edu.in/',
    logo: '/brand/partners/mckvie.jpg',
  },
];

export const CampusNetworkSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'engaged' | 'potential'>('engaged');

  const tabs = [
    { id: 'engaged', label: 'Active Campus Chapters' },
    { id: 'potential', label: 'Upcoming Partner Campuses' },
  ];

  const displayData = activeTab === 'potential' ? potentialPartners : engagedColleges;

  return (
    <div className="relative w-full">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-[#075945]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#f8bd36]/10 blur-[140px]" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-gray-200">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#075945]/10 text-[#075945] border border-[#075945]/20">
              <Globe size={15} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#075945]">
              Campus Network
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f8bd36]" />
            <span
              className="font-caveat text-[#f8bd36] text-[20px] font-bold transform -rotate-1 hidden sm:inline-block leading-none"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              ~ connecting students to ecosystem leaders
            </span>
          </div>

          <h2 className="font-sans text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.02] tracking-tight text-[#111]">
            College Partnerships
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#444] max-w-xl font-medium leading-relaxed">
            Collaborating with engineering universities across India to conduct developer bootcamps, workshops, and build student Web3 communities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            const count = tab.id === 'engaged' ? engagedColleges.length : potentialPartners.length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'engaged' | 'potential')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#075945] text-white shadow-md shadow-[#075945]/25 border border-[#075945]'
                    : 'text-[#666] hover:text-[#111] hover:bg-gray-100 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#f8bd36] text-black' : 'bg-gray-100 text-[#666]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Impact Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-gray-200">
        <div className="flex flex-col">
          <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#075945]">
            {engagedColleges.length}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666] mt-1">
            Active Chapters
          </p>
        </div>

        <div className="flex flex-col">
          <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#111]">
            350+
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666] mt-1">
            Students Reached
          </p>
        </div>

        <div className="flex flex-col">
          <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#d97706]">
            8+
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666] mt-1">
            Hands-on Sessions
          </p>
        </div>

        <div className="flex flex-col">
          <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#075945]">
            100% Free
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666] mt-1">
            Open-Source Education
          </p>
        </div>
      </div>

      {/* College Cards Grid with Real Logos & Spacing */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayData.map((college) => (
          <article
            key={`${activeTab}-${college.id}-${college.name}`}
            className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#075945]/40 hover:shadow-2xl hover:shadow-[#075945]/15"
          >
            <div>
              {/* College Header: Logo + External Link */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-2 group-hover:border-[#075945]/40 transition-colors">
                  <img
                    src={college.logo}
                    alt={`${college.name} emblem`}
                    className="h-full w-full object-contain"
                  />
                </div>

                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit official website of ${college.name}`}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-[#555] hover:bg-[#075945] hover:text-white hover:border-[#075945] transition-all"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Title and Location */}
              <h4 className="font-sans text-lg font-bold text-[#111] group-hover:text-[#075945] transition-colors line-clamp-2 leading-snug">
                {college.name}
              </h4>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[#666]">
                <MapPin size={13} className="text-[#075945] shrink-0" />
                <span className="truncate">{college.city}</span>
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">
                  <Users size={12} className="text-[#075945]" />
                  Students
                </p>
                <p className="font-sans text-base font-black text-[#111]">
                  {(college.students / 1000).toFixed(1)}K+
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">
                  <Sparkles size={12} className="text-[#d97706]" />
                  {activeTab === 'potential' ? 'Status' : 'Sessions'}
                </p>
                <p className="font-sans text-base font-black text-[#075945]">
                  {college.activities ? `${college.activities} Conducted` : 'In Discussion'}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Inviting Partnership Banner (Closing CTA) */}
      <div className="mt-14 rounded-2xl border border-[#075945]/30 bg-gradient-to-r from-[#075945] via-[#0a1a16] to-[#040d0b] p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-white">
        <div className="relative z-10 max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#f8bd36]">
            Bring ETHShala to Your Campus
          </p>
          <h3 className="font-sans text-2xl sm:text-3xl font-black text-white mt-2 leading-tight">
            Want to host a hands-on Ethereum workshop for your students?
          </h3>
          <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
            We partner with university clubs, department heads, and campus ambassadors to provide free technical training, developer bounties, and guest speakers.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <a
            href="mailto:contact@ethshala.com"
            className="inline-flex min-h-[50px] items-center gap-2.5 rounded-xl bg-[#61d9b9] px-7 text-[15px] font-black text-black hover:bg-[#7ee3c9] hover:shadow-xl hover:shadow-[#61d9b9]/25 transition-all"
          >
            Partner With Us
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};