'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import {
  Vote,
  GitMerge,
  Scale,
  FileCheck,
} from 'lucide-react';

type GovernanceIcon = 'vote' | 'merge' | 'scale' | 'review';

type GovernanceCard = {
  id: number;
  icon: GovernanceIcon;
  title: string;
  description: string;
};

const governanceCards: GovernanceCard[] = [
  {
    id: 1,
    icon: 'vote',
    title: 'Ideas Become Decisions',
    description:
      'Ethereum governance is open and iterative - proposals move through discussion, review, and community consensus.',
  },
  {
    id: 2,
    icon: 'merge',
    title: 'Consensus Over Authority',
    description:
      'No central committee approves change. Contributors, researchers, and builders align through transparent processes.',
  },
  {
    id: 3,
    icon: 'scale',
    title: 'Evaluate Tradeoffs',
    description:
      'Every EIP balances usability, scalability, security, and ecosystem impact.',
  },
  {
    id: 4,
    icon: 'review',
    title: 'Proposal Lifecycle',
    description:
      'Understand how proposals move from Draft → Review → Final → Adoption.',
  },
];

const iconMap: Record<GovernanceIcon, React.ReactNode> = {
  vote: <Vote size={20} className="text-emerald-400" />,
  merge: <GitMerge size={20} className="text-emerald-400" />,
  scale: <Scale size={20} className="text-emerald-400" />,
  review: <FileCheck size={20} className="text-emerald-400" />,
};

const stages = [
  {
    number: '1',
    title: 'Idea',
    overview:
      'A problem, improvement, or proposal is introduced by contributors. Discussion begins informally across forums and community channels.',
  },
  {
    number: '2',
    title: 'Draft',
    overview:
      'The proposal is documented formally as an EIP with specification details, motivation, and implementation considerations.',
  },
  {
    number: '3',
    title: 'Discussion',
    overview:
      'Community members, researchers, and maintainers evaluate tradeoffs, challenge assumptions, and refine the proposal.',
  },
  {
    number: '4',
    title: 'Review',
    overview:
      'Editors and contributors validate completeness, readiness, and ecosystem alignment before finalization.',
  },
  {
    number: '5',
    title: 'Final',
    overview:
      'The proposal becomes finalized and may eventually be implemented across Ethereum clients and infrastructure.',
  },
];

export function GovernanceSection() {
    const [activeStage, setActiveStage] = useState(0);
    const [paused, setPaused] = useState(false);

    // Auto loop
    useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % stages.length);
    }, 2500);

    return () => clearInterval(interval);
    }, [paused]);

  return (
    <section
      id="governance"
      className="py-20 bg-background relative overflow-hidden"
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-12">
          <p className="text-emerald-400 text-sm font-semibold tracking-wide mb-3">
            Governance
          </p>

          <h2 className="text-foreground font-black text-3xl sm:text-4xl leading-tight">
            Understand how Ethereum makes decisions
          </h2>

          <p className="text-muted-foreground mt-3">
            Governance in Ethereum happens through open discussion,
            proposal review, and rough consensus - not centralized control.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10">

          
          <div className="rounded-2xl border border-border bg-card p-8 relative overflow-hidden min-h-[420px]">

      <div className="absolute right-0 top-0 w-56 h-56 bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Timeline */}
      <div className="flex flex-wrap items-center gap-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>

        {stages.map((stage, idx) => (
          <div
            key={stage.number}
            className="flex items-center flex-1 min-w-[90px]"
          >
            <div
              onMouseEnter={() => setActiveStage(idx)}
              onFocus={() => setActiveStage(idx)}
              onClick={() => setActiveStage(idx)}
              className="group cursor-pointer flex flex-col items-center w-[100px] p-2 rounded-xl"
            >
              <div
                className={`
                  w-16 h-16 rounded-xl
                  border
                  flex items-center justify-center
                  font-bold text-xl
                  transition-all duration-300
                  ${
                    activeStage === idx
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,.15)]'
                      : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  }
                `}
              >
                {stage.number}
              </div>

              <span
                className={`
                  mt-4 text-lg transition-colors
                  ${
                    activeStage === idx
                      ? 'text-white'
                      : 'text-muted-foreground'
                  }
                `}
              >
                {stage.title}
              </span>
            </div>

            {idx < stages.length - 1 && (
              <div className="hidden sm:block flex-1 h-px mx-4 bg-gradient-to-r from-emerald-500/40 to-transparent" />
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Overview Panel */}

      <div
        className="
          mt-14
          rounded-xl
          border
          border-emerald-500/10
          bg-white/[0.02]
          p-6
          transition-all
          duration-300
          min-h-[180px]
        "
      >
        <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-3">
          Stage {stages[activeStage].number}
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-4">
          {stages[activeStage].title}
        </h3>

        <p className="text-muted-foreground leading-8 max-w-2xl">
          {stages[activeStage].overview}
        </p>
      </div>

    </div>

          {/* Governance Cards */}
          <div className="grid gap-4">
            {governanceCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    {iconMap[card.icon]}
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground">
                      {card.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-2">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}