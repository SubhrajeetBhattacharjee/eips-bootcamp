import React from 'react';

export const SkillAnalytics = ({ skills }: { skills?: any[] }) => {
  const allSkills = skills || [
    { name: 'Smart Contracts', progress: 0, category: 'technical' },
    { name: 'Web3 Integration', progress: 0, category: 'technical' },
    { name: 'System Design', progress: 0, category: 'technical' },
    { name: 'Technical Writing', progress: 0, category: 'soft' },
    { name: 'Security Analysis', progress: 0, category: 'soft' }
  ];

  const technicalSkills = allSkills.filter(s => s.category === 'technical');
  const softSkills = allSkills.filter(s => s.category === 'soft');

  const avgTechnical = technicalSkills.length > 0 
    ? Math.round(technicalSkills.reduce((sum, s) => sum + s.progress, 0) / technicalSkills.length) 
    : 0;
    
  const avgSoft = softSkills.length > 0 
    ? Math.round(softSkills.reduce((sum, s) => sum + s.progress, 0) / softSkills.length) 
    : 0;

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-base">Skill Analytics</h3>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Technical Skills */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">Technical Skills</p>
            <p className="text-xs font-bold text-emerald-400">{avgTechnical}% avg</p>
          </div>

          <div className="space-y-3">
            {technicalSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-zinc-300">{skill.name}</p>
                  <p className="text-xs text-emerald-400/70 font-semibold">{skill.progress}%</p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/8">
                  <div
                    className="h-full bg-emerald-500/70 rounded-full transition-all duration-1000"
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
            <p className="text-xs font-semibold text-white uppercase tracking-wider">Soft Skills</p>
            <p className="text-xs font-bold text-emerald-400">{avgSoft}% avg</p>
          </div>

          <div className="space-y-3">
            {softSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-zinc-300">{skill.name}</p>
                  <p className="text-xs text-emerald-400/70 font-semibold">{skill.progress}%</p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/8">
                  <div
                    className="h-full bg-blue-500/70 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};