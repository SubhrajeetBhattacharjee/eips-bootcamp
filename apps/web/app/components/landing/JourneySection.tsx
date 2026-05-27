import React from 'react';
import { journeySteps } from '../../lib/landing-data';
import { Compass, BookOpen, Users, GitCommit } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'compass': <Compass size={20} className="text-emerald-400" />,
  'book-open': <BookOpen size={20} className="text-emerald-400" />,
  'users': <Users size={20} className="text-emerald-400" />,
  'git-commit': <GitCommit size={20} className="text-emerald-400" />,
};

export function JourneySection() {
  return (
    <section id="journey" className="py-20 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide">Contributor Journey</p>
          <h2 className="text-white font-black text-3xl sm:text-4xl leading-tight">From learner to contributor</h2>
          <p className="text-zinc-500 mt-3">A clear progression that takes you from discovery through active participation and contribution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {journeySteps.map((s, idx) => (
            <div key={s.id} className="relative bg-[#0d0d0d] border border-white/6 rounded-2xl p-6 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  {iconMap[s.icon]}
                </div>
                <div className="flex-1">
                  <div className="text-emerald-400 font-semibold text-xs">Step {s.step}</div>
                  <h3 className="text-white font-bold mt-1">{s.title}</h3>
                </div>
              </div>
              <p className="text-zinc-500 text-sm">{s.description}</p>

              {idx < journeySteps.length - 1 && (
                <div className="absolute right-3 bottom-[-18px] hidden md:block">
                  <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 0V28" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.18" strokeLinecap="round" />
                    <path d="M7 21L14 28L21 21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.22" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default JourneySection;
