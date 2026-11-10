'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Code,
  Check,
  Copy,
} from 'lucide-react';
import {
  CompetitionDetail,
  SubmitCompetitionResult,
} from '@/app/lib/competitions';
import { CompetitionResultModal } from './CompetitionResultModal';

interface CompetitionArenaProps {
  competition: CompetitionDetail;
  userId: string;
}

export function CompetitionArena({ competition, userId }: CompetitionArenaProps) {
  const problems = competition.problems || [];
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmitCompetitionResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Initialize any existing submissions if user already started
  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const prob of problems) {
      if (prob.userSubmission?.answer) {
        initial[prob.id] = prob.userSubmission.answer;
      }
    }
    setAnswers(initial);
  }, [problems]);

  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const startedAt = competition.userParticipation?.startedAt
      ? new Date(competition.userParticipation.startedAt).getTime()
      : Date.now();
    const durationMs = competition.durationMinutes * 60 * 1000;
    const expiresAt = startedAt + durationMs;
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  });

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const answerPayload = Object.entries(answers).map(([problemId, answer]) => ({
        problemId,
        answer,
      }));

      const res = await fetch(`/api/competitions/${competition.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          answers: answerPayload,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit contest');
      }

      const result: SubmitCompetitionResult = await res.json();
      setSubmissionResult(result);
      setShowConfirmModal(false);
    } catch (err) {
      console.error(err);
      alert('Error submitting competition. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [answers, competition.id, submitting]);

  // Timer countdown and auto-submission on expiry
  useEffect(() => {
    if (competition.userParticipation?.isSubmitted || submissionResult) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out!
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [competition.userParticipation?.isSubmitted, handleSubmit, submissionResult]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 300; // < 5 minutes

  const activeProblem = problems[activeProblemIdx] || null;
  const totalAnswered = Object.keys(answers).length;

  const handleSelectOption = (optionId: string) => {
    if (!activeProblem) return;
    setAnswers((prev) => ({
      ...prev,
      [activeProblem.id]: optionId,
    }));
  };

  const handleClearSelection = () => {
    if (!activeProblem) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[activeProblem.id];
      return copy;
    });
  };

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (submissionResult) {
    return (
      <CompetitionResultModal
        result={submissionResult}
        competitionTitle={competition.title}
        competitionSlug={competition.slug}
      />
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Contest Top Status Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-emerald-400">
              Live Contest Arena
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {competition.totalPoints} Points Total
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight mt-1">
            {competition.title}
          </h1>
        </div>

        {/* Timer & Submit Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono font-bold text-sm sm:text-base border ${
              isUrgent
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse'
                : 'bg-accent/60 text-foreground border-border'
            }`}
          >
            <Clock size={16} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Send size={13} />
            <span>Submit Contest</span>
          </button>
        </div>
      </div>

      {/* Problem Navigation Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {problems.map((prob, idx) => {
          const isAnswered = !!answers[prob.id];
          const isActive = idx === activeProblemIdx;

          return (
            <button
              key={prob.id}
              onClick={() => setActiveProblemIdx(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : isAnswered
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              <span>Problem {idx + 1}</span>
              <span className="text-[10px] font-mono opacity-80">
                ({prob.points} pts)
              </span>
              {isAnswered && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Problem Card */}
      {activeProblem ? (
        <div className="rounded-2xl bg-card border border-border/80 shadow-xs p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
            <div>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                Problem {activeProblemIdx + 1} of {problems.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
                {activeProblem.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-accent text-foreground font-mono text-xs font-bold border border-border/70">
                {activeProblem.points} Points
              </span>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="prose dark:prose-invert max-w-none text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {activeProblem.description}
          </div>

          {/* Code Snippet Box (if problem has code) */}
          {activeProblem.codeSnippet && (
            <div className="relative rounded-xl bg-muted/60 dark:bg-black/50 border border-border/80 p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[10px] text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5">
                  <Code size={13} />
                  <span>Solidity / Bytecode Reference</span>
                </span>
                <button
                  onClick={() => handleCopySnippet(activeProblem.codeSnippet!)}
                  className="p-1 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-foreground leading-normal whitespace-pre">
                {activeProblem.codeSnippet}
              </pre>
            </div>
          )}

          {/* Multiple Choice Options */}
          {activeProblem.options && Array.isArray(activeProblem.options) && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Your Answer:
              </p>

              <div className="space-y-2.5">
                {activeProblem.options.map((opt) => {
                  const isSelected = answers[activeProblem.id] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-xl text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-emerald-950/20 shadow-xs'
                          : 'border-border/80 bg-card hover:bg-accent/40'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {opt.id}
                      </div>

                      <div className="flex-1 text-xs sm:text-sm text-foreground pt-0.5 leading-relaxed">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {answers[activeProblem.id] && (
                <div className="pt-1">
                  <button
                    onClick={handleClearSelection}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-border/60">
            <button
              onClick={() => setActiveProblemIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeProblemIdx === 0}
              className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-1.5 disabled:opacity-40 hover:bg-accent transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-muted-foreground">
              {totalAnswered} of {problems.length} answered
            </span>

            {activeProblemIdx < problems.length - 1 ? (
              <button
                onClick={() =>
                  setActiveProblemIdx((prev) =>
                    Math.min(problems.length - 1, prev + 1),
                  )
                }
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-1.5 hover:bg-accent transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
              >
                <span>Review & Submit</span>
                <Send size={13} />
              </button>
            )}
          </div>

        </div>
      ) : null}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-7 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center text-xl mx-auto">
              🏆
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground">
                Submit Weekly Arena?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                You have answered <strong>{totalAnswered}</strong> out of{' '}
                <strong>{problems.length}</strong> problems.
              </p>

              {totalAnswered < problems.length && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 text-left">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>
                    You have unanswered questions. Unanswered problems will receive 0 points.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-card hover:bg-accent border border-border text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                Keep Solving
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Evaluating...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

