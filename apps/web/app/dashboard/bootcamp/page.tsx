'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { ModuleCard } from '@/app/components/bootcamp/ModuleCard';
import { ModuleDetail } from '@/app/components/bootcamp/ModuleDetail';
import Link from 'next/link';


export default function BootcampPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      id: '1',
      section: '1',
      title: 'Introduction to EIPs',
      description: 'Learn the fundamentals of Ethereum Improvement Proposals and their role in the ecosystem.',
      lessons: 3,
      completed: 3,
      xpReward: 150,
      duration: '45 min',
      color: 'from-emerald-500/20 to-emerald-600/10',
    },
    {
      id: '2',
      section: '2',
      title: 'EIP Structure & Components',
      description: 'Master the anatomy of a well-written EIP including all required sections and formatting standards.',
      lessons: 4,
      completed: 2,
      xpReward: 200,
      duration: '1 hour',
      color: 'from-cyan-500/20 to-cyan-600/10',
    },
    {
      id: '3',
      section: '3',
      title: 'Writing Clear Specifications',
      description: 'Develop the skills to write precise and unambiguous technical specifications that meet EIP standards.',
      lessons: 5,
      completed: 1,
      xpReward: 250,
      duration: '1.5 hours',
      color: 'from-blue-500/20 to-blue-600/10',
    },
    {
      id: '4',
      section: '4',
      title: 'EIP Review Process',
      description: 'Understand the peer review cycle, community feedback, and the path to EIP acceptance.',
      lessons: 3,
      completed: 0,
      xpReward: 200,
      duration: '1 hour',
      color: 'from-violet-500/20 to-violet-600/10',
    },
    {
      id: '5',
      section: '5',
      title: 'Real-World EIP Examples',
      description: 'Analyze successful EIPs across different categories and learn from best practices.',
      lessons: 4,
      completed: 0,
      xpReward: 300,
      duration: '2 hours',
      color: 'from-pink-500/20 to-pink-600/10',
    },
    {
      id: '6',
      section: '6',
      title: 'Advanced Topics & Security',
      description: 'Explore advanced EIP concepts including security considerations and consensus mechanisms.',
      lessons: 5,
      completed: 0,
      xpReward: 350,
      duration: '2.5 hours',
      color: 'from-orange-500/20 to-orange-600/10',
    },
  ];

  const selectedModuleData = modules.find(m => m.id === selectedModule);

  

  return (
    <DashboardShell>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {selectedModuleData ? (
            <ModuleDetail 
              module={selectedModuleData} 
              onBack={() => setSelectedModule(null)}
              lessons={getLessonsByModule(selectedModuleData.id)}
            />
          ) : (
            <div className="p-8 max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-12">
                {/*Add a back to dashboard button here similar to back to modules */}
                <Link href="/dashboard">
                    <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
                    <ChevronLeft size={20} />
                        Back to Dashboard
                    </button>
                </Link>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                  <BookOpen size={16} />
                  BOOTCAMP
                </div>
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  EIP Mastery Bootcamp
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Master Ethereum Improvement Proposals through structured learning. Complete modules, earn XP, and join the EIP contributor community.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Total Modules</div>
                  <div className="text-3xl font-bold text-emerald-400">{modules.length}</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">In Progress</div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {modules.filter(m => m.completed > 0 && m.completed < m.lessons).length}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Total XP</div>
                  <div className="text-3xl font-bold text-blue-400">1,250</div>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    onClick={() => setSelectedModule(module.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    {/*</div>*/}
    </DashboardShell>
  );
}

function getLessonsByModule(moduleId: string) {
  const lessonMap: Record<string, any[]> = {
    '1': [
      {
        id: '1.1',
        title: 'What is an EIP?',
        duration: '12 min',
        completed: true,
        description: 'Understand the definition and purpose of Ethereum Improvement Proposals',
      },
      {
        id: '1.2',
        title: 'EIP Categories and Types',
        duration: '15 min',
        completed: true,
        description: 'Explore different types of EIPs: Core, Networking, Interface, etc.',
      },
      {
        id: '1.3',
        title: 'Why EIPs Matter',
        duration: '18 min',
        completed: true,
        description: 'Learn how EIPs shape the future of Ethereum',
      },
    ],
    '2': [
      {
        id: '2.1',
        title: 'Required Sections Overview',
        duration: '14 min',
        completed: true,
        description: 'Understand all required sections in an EIP document',
      },
      {
        id: '2.2',
        title: 'Header and Metadata',
        duration: '16 min',
        completed: true,
        description: 'Format EIP headers and YAML metadata correctly',
      },
      {
        id: '2.3',
        title: 'Motivation and Specification',
        duration: '20 min',
        completed: false,
        description: 'Write compelling motivation and technical specifications',
      },
      {
        id: '2.4',
        title: 'Rationale and Implementation',
        duration: '18 min',
        completed: false,
        description: 'Explain design decisions and implementation details',
      },
    ],
    '3': [
      {
        id: '3.1',
        title: 'Abstract Best Practices',
        duration: '13 min',
        completed: true,
        description: 'Write concise, effective abstracts',
      },
      {
        id: '3.2',
        title: 'Motivation: Tell the Story',
        duration: '15 min',
        completed: false,
        description: 'Craft a compelling problem statement',
      },
      {
        id: '3.3',
        title: 'Technical Precision',
        duration: '17 min',
        completed: false,
        description: 'Write unambiguous technical specifications',
      },
      {
        id: '3.4',
        title: 'Rationale: Explain Why',
        duration: '16 min',
        completed: false,
        description: 'Document your design decisions',
      },
      {
        id: '3.5',
        title: 'Security Considerations',
        duration: '20 min',
        completed: false,
        description: 'Address potential security implications',
      },
    ],
    '4': [
      {
        id: '4.1',
        title: 'Submitting an EIP',
        duration: '14 min',
        completed: false,
        description: 'Navigate the submission process',
      },
      {
        id: '4.2',
        title: 'Community Feedback',
        duration: '18 min',
        completed: false,
        description: 'Incorporate community comments effectively',
      },
      {
        id: '4.3',
        title: 'From Draft to Final',
        duration: '16 min',
        completed: false,
        description: 'Understand the EIP lifecycle and approval process',
      },
    ],
    '5': [
      {
        id: '5.1',
        title: 'Analyzing EIP-1559',
        duration: '22 min',
        completed: false,
        description: 'Deep dive into a major EIP that changed Ethereum',
      },
      {
        id: '5.2',
        title: 'Token Standards: EIP-20 & EIP-721',
        duration: '25 min',
        completed: false,
        description: 'Learn from the most successful EIPs',
      },
      {
        id: '5.3',
        title: 'Case Study: Protocol Upgrades',
        duration: '20 min',
        completed: false,
        description: 'How EIPs drive major protocol changes',
      },
      {
        id: '5.4',
        title: 'Case Study: Standards & Extensions',
        duration: '18 min',
        completed: false,
        description: 'Standards that shaped the Web3 ecosystem',
      },
    ],
    '6': [
      {
        id: '6.1',
        title: 'Consensus and Finality',
        duration: '24 min',
        completed: false,
        description: 'Advanced consensus mechanisms in EIPs',
      },
      {
        id: '6.2',
        title: 'Security Analysis Deep Dive',
        duration: '28 min',
        completed: false,
        description: 'Comprehensive security considerations',
      },
      {
        id: '6.3',
        title: 'Formal Verification',
        duration: '26 min',
        completed: false,
        description: 'Mathematical proofs for EIP specifications',
      },
      {
        id: '6.4',
        title: 'Performance & Scalability',
        duration: '22 min',
        completed: false,
        description: 'Optimize EIPs for network efficiency',
      },
      {
        id: '6.5',
        title: 'Contributing to Ethereum',
        duration: '20 min',
        completed: false,
        description: 'Your path forward as an EIP contributor',
      },
    ],
  };

  return lessonMap[moduleId] || [];
}