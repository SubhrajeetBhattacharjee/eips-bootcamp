import { apiFetch } from './api';

export type CompetitionStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
export type CompetitionDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ParticipantStatus = 'REGISTERED' | 'IN_PROGRESS' | 'SUBMITTED';

export interface ProblemOption {
  id: string;
  text: string;
}

export interface ProblemSubmissionInfo {
  answer: string;
  isCorrect?: boolean;
  scoreEarned?: number;
}

export interface CompetitionProblem {
  id: string;
  title: string;
  orderIndex: number;
  description: string;
  codeSnippet?: string | null;
  type: string;
  options?: ProblemOption[] | null;
  points: number;
  correctOption?: string;
  explanation?: string | null;
  userSubmission?: ProblemSubmissionInfo | null;
}

export interface UserParticipation {
  participantId?: string;
  status?: ParticipantStatus;
  score?: number;
  rank?: number | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  timeTakenSeconds?: number;
  xpAwarded?: number;
  isRegistered: boolean;
  isSubmitted: boolean;
  isInProgress: boolean;
}

export interface CompetitionItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: CompetitionDifficulty;
  status: CompetitionStatus;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  totalPoints: number;
  xpReward: number;
  problemCount: number;
  participantCount: number;
  userParticipation: UserParticipation;
}

export interface CompetitionDetail extends CompetitionItem {
  rules?: string | null;
  problems: CompetitionProblem[];
}

export interface ProblemResultItem {
  problemId: string;
  answer: string;
  correctOption: string;
  isCorrect: boolean;
  scoreEarned: number;
  explanation: string | null;
}

export interface SubmitCompetitionResult {
  success: boolean;
  participantId: string;
  score: number;
  totalPoints: number;
  rank: number;
  timeTakenSeconds: number;
  xpAwarded: number;
  problemResults: ProblemResultItem[];
}

export async function fetchCompetitions(userId?: string): Promise<CompetitionItem[]> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await apiFetch<CompetitionItem[]>(`/competitions${query}`);
  } catch (err) {
    console.error('Failed to fetch competitions:', err);
    return [];
  }
}

export interface CompetitionLeaderboardEntry {
  rank: number;
  participantId: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  college: string;
  score: number;
  timeTakenSeconds: number;
  xpAwarded: number;
  submittedAt: string | null;
  isCurrentUser: boolean;
  problemScores: Record<string, { score: number; isCorrect: boolean }>;
}

export interface CompetitionLeaderboardData {
  competition: {
    id: string;
    title: string;
    slug: string;
    difficulty: CompetitionDifficulty;
    status: CompetitionStatus;
    startTime: string;
    endTime: string;
    totalPoints: number;
    durationMinutes: number;
    participantCount: number;
    totalSubmitted: number;
    problems: Array<{
      id: string;
      title: string;
      orderIndex: number;
      points: number;
    }>;
  };
  currentUserStanding: {
    rank: number | null;
    score: number;
    timeTakenSeconds: number;
    xpAwarded: number;
    isSubmitted: boolean;
  } | null;
  leaderboard: CompetitionLeaderboardEntry[];
}

export async function fetchCompetitionLeaderboard(
  idOrSlug: string,
  userId?: string,
): Promise<CompetitionLeaderboardData | null> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await apiFetch<CompetitionLeaderboardData>(
      `/competitions/${idOrSlug}/leaderboard${query}`,
    );
  } catch (err) {
    console.error('Failed to fetch competition leaderboard:', err);
    return null;
  }
}

export async function fetchCompetitionDetail(
  idOrSlug: string,
  userId?: string,
): Promise<CompetitionDetail | null> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await apiFetch<CompetitionDetail>(`/competitions/${idOrSlug}${query}`);
  } catch (err) {
    console.error('Failed to fetch competition detail:', err);
    return null;
  }
}

export async function registerForCompetition(
  competitionId: string,
  userId: string,
) {
  return await apiFetch<{ success: boolean; message: string }>(
    `/competitions/${competitionId}/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    },
  );
}

export async function startCompetition(
  competitionId: string,
  userId: string,
): Promise<CompetitionDetail> {
  return await apiFetch<CompetitionDetail>(
    `/competitions/${competitionId}/start`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    },
  );
}

export async function submitCompetition(
  competitionId: string,
  userId: string,
  answers: { problemId: string; answer: string }[],
): Promise<SubmitCompetitionResult> {
  return await apiFetch<SubmitCompetitionResult>(
    `/competitions/${competitionId}/submit`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, answers }),
    },
  );
}

export interface CompetitionHistoryStats {
  totalParticipated: number;
  contestsCompleted: number;
  bestRank: number | null;
  podiumFinishes: number;
  totalScoreEarned: number;
  totalPossibleScore: number;
  averageAccuracy: number;
  totalXpEarned: number;
  averageTimeTakenSeconds: number;
}

export interface CompetitionHistoryItem {
  participantId: string;
  competitionId: string;
  title: string;
  slug: string;
  difficulty: CompetitionDifficulty;
  status: ParticipantStatus;
  competitionStatus: CompetitionStatus;
  score: number;
  totalPoints: number;
  percentage: number;
  rank: number | null;
  totalParticipants: number;
  timeTakenSeconds: number;
  xpAwarded: number;
  submittedAt: string | null;
  registeredAt: string;
  solvedProblems: number;
  totalProblems: number;
}

export interface UserCompetitionHistoryData {
  stats: CompetitionHistoryStats;
  history: CompetitionHistoryItem[];
}

export async function fetchUserCompetitionHistory(
  userId: string,
): Promise<UserCompetitionHistoryData | null> {
  try {
    return await apiFetch<UserCompetitionHistoryData>(
      `/competitions/user/${userId}/history`,
    );
  } catch (err) {
    console.error('Failed to fetch user competition history:', err);
    return null;
  }
}

