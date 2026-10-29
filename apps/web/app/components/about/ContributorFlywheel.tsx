'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Code2, Sparkles, Terminal } from 'lucide-react';
import { gsap } from 'gsap';

interface Stage {
  step: string;
  title: string;
  desc: string;
  color: string;
  activeColor: string;
  badge: string;
  details: string[];
  snippet: string;
}

const stages: Stage[] = [
  {
    step: '01',
    title: 'Protocol Foundations',
    desc: 'EVM mechanics, state trees & transaction lifecycle',
    color: 'border-[#61d9b9]/40 bg-[#075945]/20 text-[#61d9b9]',
    activeColor: 'border-[#61d9b9] bg-[#075945]/40 text-[#61d9b9]',
    badge: 'Beginner Friendly',
    details: [
      'Understand how gas is calculated and blocks are validated',
      'Merkle Patricia tries and state storage internals',
      'Transaction encoding, signatures, and mempool propagation',
    ],
    snippet: `// Ethereum State Transition: S' = APPLY(S, TX)
function executeTx(state, transaction) {
  validateNonce(transaction.sender, transaction.nonce);
  deductGas(transaction.sender, transaction.maxFee);
  return applyStateChange(state, transaction);
}`,
  },
  {
    step: '02',
    title: 'EIP & ERC Standards',
    desc: 'Dissecting standards like ERC-20, ERC-721, ERC-4337',
    color: 'border-[#ffd359]/40 bg-[#ffd359]/10 text-[#ffd359]',
    activeColor: 'border-[#ffd359] bg-[#ffd359]/30 text-[#ffd359]',
    badge: 'Core Standards',
    details: [
      'Anatomy of an EIP: Preamble, Motivation, Specification, Rationale',
      'ERC-4337 Account Abstraction and userOp bundles',
      'EIP-4844 Blob transactions and rollup data availability',
    ],
    snippet: `// ERC-4337 UserOperation validation
struct UserOperation {
  address sender;
  uint256 nonce;
  bytes callData;
  bytes signature;
}`,
  },
  {
    step: '03',
    title: 'Hands-on Campus Sprints',
    desc: 'Live smart contract bootcamps & testnet deployments',
    color: 'border-[#61d9b9]/40 bg-[#075945]/20 text-[#61d9b9]',
    activeColor: 'border-[#61d9b9] bg-[#075945]/40 text-[#61d9b9]',
    badge: 'Offline & Live',
    details: [
      'Interactive contract deployments on Sepolia & Holesky',
      'Debugging EVM reverts using Foundry and Hardhat',
      'Peer-to-peer mentoring at university chapters',
    ],
    snippet: `// Foundry Deployment Script
forge create src/ETHShalaBadge.sol:Badge \\
  --rpc-url https://rpc.sepolia.org \\
  --private-key $DEPLOYER_KEY`,
  },
  {
    step: '04',
    title: 'Governance Review & Build',
    desc: 'Authoring proposals & submitting peer review feedback',
    color: 'border-white/30 bg-white/5 text-white',
    activeColor: 'border-[#ffd359] bg-white/15 text-[#ffd359]',
    badge: 'Ecosystem Impact',
    details: [
      'Following AllCoreDevs and Consensus Layer agendas',
      'Drafting discussions on Ethereum Magicians forum',
      'Submitting pull requests to open-source Ethereum client repos',
    ],
    snippet: `// ACD Discussion & Peer Review Checklist
1. Review specification against security edge cases
2. Benchmark client CPU & memory overhead
3. Submit consensus test vectors to ethereum/tests`,
  },
];

export function ContributorFlywheel() {
  const [activeStep, setActiveStep] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [activeStep]);

  // Optional auto-rotation if user hasn't clicked in a while
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentStage = stages[activeStep];

  return (
    <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#0a1a15] to-[#040907] p-6 sm:p-8 shadow-2xl overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#61d9b9]/15 blur-[100px]" />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#61d9b9]">
            The Contributor Flywheel
          </p>
          <h3 className="font-sans text-xl font-black text-white mt-1">
            From Zero to Core Reviewer
          </h3>
        </div>
        <span className="rounded-lg bg-[#ffd359]/20 border border-[#ffd359]/40 px-2.5 py-1 text-[10px] font-black text-[#ffd359]">
          Interactive Roadmap
        </span>
      </div>

      {/* Interactive 4-step Pills */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stages.map((item, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-300 ${
                isActive
                  ? 'border-[#61d9b9] bg-[#075945]/30 shadow-md ring-1 ring-[#61d9b9]/40'
                  : 'border-white/10 bg-black/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-black ${isActive ? 'text-[#ffd359]' : 'text-white/50'}`}>
                  {item.step}
                </span>
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#61d9b9] animate-pulse" />}
              </div>
              <p className="text-xs font-bold text-white truncate">{item.title}</p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Stage Details Card with GSAP Fade */}
      <div ref={detailRef} className="mt-6 p-5 rounded-2xl border border-white/10 bg-black/50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg border font-mono text-xs font-black ${currentStage.activeColor}`}>
              {currentStage.step}
            </span>
            <h4 className="font-sans text-base font-bold text-white">
              {currentStage.title}
            </h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd359] px-2 py-0.5 rounded-md bg-[#ffd359]/15 border border-[#ffd359]/30">
            {currentStage.badge}
          </span>
        </div>

        <p className="text-xs text-white/70 mb-4 leading-relaxed">
          {currentStage.desc}
        </p>

        {/* Actionable points */}
        <div className="space-y-2 mb-4">
          {currentStage.details.map((detail, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/85">
              <CheckCircle2 size={13} className="text-[#61d9b9] shrink-0 mt-0.5" />
              <span>{detail}</span>
            </div>
          ))}
        </div>

        {/* Interactive Code / Blueprint Window */}
        <div className="rounded-xl border border-white/10 bg-black/70 p-3 overflow-x-auto font-mono text-[11px] text-[#61d9b9]/90">
          <div className="flex items-center gap-1.5 text-white/40 mb-2 pb-1.5 border-b border-white/10">
            <Terminal size={11} />
            <span className="text-[10px] uppercase tracking-wider">Protocol Sandbox</span>
          </div>
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">{currentStage.snippet}</pre>
        </div>
      </div>
    </div>
  );
}
