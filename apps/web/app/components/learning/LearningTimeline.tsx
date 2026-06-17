import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const LearningTimeline = ({ timeline }: { timeline?: any[] }) => {
  const steps = timeline || [];

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-foreground font-bold text-base">EthShala Timeline</h3>
        <Link href="/dashboard/bootcamp">
          <button className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1">
            View All <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      <div className="flex-1 relative">
        {steps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
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
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isCompleted ? 'border-emerald-500 text-emerald-500' : isInProgress ? 'border-emerald-400/50 text-emerald-400/50' : 'border-border text-foreground/10'}`}>
                    {isCompleted ? <CheckCircle size={14} /> : <Circle size={14} />}
                  </div>

                  {/* Card wrapper */}
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-border bg-white/[0.02] hover:bg-white/[0.04] transition-colors z-10">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-bold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{step.title}</h4>
                      {!isLocked && (
                        <Badge variant={isCompleted ? 'success' : 'info'} dot>
                          {isCompleted ? 'Done' : 'Active'}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs line-clamp-2 ${isLocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
    );
    };