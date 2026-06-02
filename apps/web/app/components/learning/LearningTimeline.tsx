import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const LearningTimeline = ({ timeline }: { timeline?: any[] }) => {
  const steps = timeline || [];

  return (
    <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-base">Bootcamp Timeline</h3>
        <Link href="/dashboard/bootcamp">
          <button className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1">
            View All <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      <div className="flex-1 relative">
        {steps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            No modules available yet.
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/50 before:via-white/10 before:to-transparent">
            {steps.slice(0, 4).map((step, index) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';
              const isLocked = step.status === 'NOT_STARTED';

              return (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-[#0d0d0d] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isCompleted ? 'border-emerald-500 text-emerald-500' : isInProgress ? 'border-emerald-400/50 text-emerald-400/50' : 'border-white/10 text-white/10'}`}>
                    {isCompleted ? <CheckCircle size={14} /> : <Circle size={14} />}
                  </div>

                  {/* Card */}
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors z-10">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-bold ${isLocked ? 'text-zinc-500' : 'text-white'}`}>{step.title}</h4>
                      {!isLocked && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {isCompleted ? 'Done' : 'Active'}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs line-clamp-2 ${isLocked ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};