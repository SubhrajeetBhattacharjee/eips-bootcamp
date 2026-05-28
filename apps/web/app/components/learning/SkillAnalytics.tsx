// apps/web/components/learning/SkillAnalytics.tsx

import React from 'react';

interface Skill {
  name: string;
  progress: number;
  category: 'technical' | 'soft';
}

const skills: Skill[] = [
  { name: 'Solidity', progress: 100, category: 'technical' },
  { name: 'Smart Contracts', progress: 95, category: 'technical' },
  { name: 'Web3 JS', progress: 85, category: 'technical' },
  { name: 'Security Audits', progress: 70, category: 'technical' },
  { name: 'Problem Solving', progress: 80, category: 'soft' },
  { name: 'Code Review', progress: 75, category: 'soft' },
];

export const SkillAnalytics: React.FC = () => {
  const technicalSkills = skills.filter((s) => s.category === 'technical');
  const softSkills = skills.filter((s) => s.category === 'soft');

  const avgTechnical = Math.round(
    technicalSkills.reduce((a, b) => a + b.progress, 0) / technicalSkills.length
  );
  const avgSoft = Math.round(
    softSkills.reduce((a, b) => a + b.progress, 0) / softSkills.length
  );

  return (
    <div className="group relative bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Progress Tracking
          </p>
          <h3 className="text-xl font-bold text-white mt-1">
            Skill Analytics
          </h3>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white">Technical Skills</p>
            <p className="text-xs font-bold text-emerald-400">{avgTechnical}%</p>
          </div>

          <div className="space-y-2">
            {technicalSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-zinc-300">{skill.name}</p>
                  <p className="text-xs text-emerald-400/70 font-semibold">
                    {skill.progress}%
                  </p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/8">
                  <div
                    className="h-full bg-emerald-500/70 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white">Soft Skills</p>
            <p className="text-xs font-bold text-emerald-400">{avgSoft}%</p>
          </div>

          <div className="space-y-2">
            {softSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-zinc-300">{skill.name}</p>
                  <p className="text-xs text-emerald-400/70 font-semibold">
                    {skill.progress}%
                  </p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/8">
                  <div
                    className="h-full bg-emerald-500/70 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Detailed Analytics Button */}
        <div className="mt-6 pt-4 border-t border-white/8">
          <button className="w-full rounded-lg font-medium text-sm py-2.5 px-4 transition-all duration-200 border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200">
            Detailed Analytics →
          </button>
        </div>
      </div>
    </div>
  );
};