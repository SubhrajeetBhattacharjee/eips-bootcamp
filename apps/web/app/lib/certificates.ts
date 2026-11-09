import { apiFetch } from './api';

export type CertificateType = 'COMPLETION' | 'DISTINCTION' | 'PODIUM' | 'CHAMPION';

export interface CertificateCompetitionInfo {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  totalPoints: number;
  durationMinutes: number;
}

export interface CompetitionCertificateItem {
  id: string;
  certificateNumber: string;
  type: CertificateType;
  recipientName: string;
  title: string;
  score: number;
  totalPoints: number;
  rank: number | null;
  timeTakenSeconds: number;
  issuedAt: string;
  competition: CertificateCompetitionInfo;
}

export interface VerifiedCertificateData {
  isValid: boolean;
  id: string;
  certificateNumber: string;
  type: CertificateType;
  recipientName: string;
  title: string;
  score: number;
  totalPoints: number;
  rank: number | null;
  timeTakenSeconds: number;
  issuedAt: string;
  metadata?: any;
  issuer: {
    name: string;
    authority: string;
    network: string;
  };
  competition: CertificateCompetitionInfo;
  recipient: {
    username?: string;
    college?: string;
    walletAddress?: string | null;
  };
}

export async function fetchUserCertificates(
  userId: string,
): Promise<CompetitionCertificateItem[]> {
  try {
    return await apiFetch<CompetitionCertificateItem[]>(
      `/certificates/user/${userId}`,
    );
  } catch (err) {
    console.error('Failed to fetch user certificates:', err);
    return [];
  }
}

export async function verifyCertificate(
  idOrNumber: string,
): Promise<VerifiedCertificateData | null> {
  try {
    return await apiFetch<VerifiedCertificateData>(
      `/certificates/${idOrNumber}`,
    );
  } catch (err) {
    console.error('Failed to verify certificate:', err);
    return null;
  }
}

export async function claimCertificate(
  competitionId: string,
  userId: string,
): Promise<CompetitionCertificateItem | null> {
  try {
    return await apiFetch<CompetitionCertificateItem>(
      `/certificates/claim/${competitionId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      },
    );
  } catch (err) {
    console.error('Failed to claim certificate:', err);
    return null;
  }
}

