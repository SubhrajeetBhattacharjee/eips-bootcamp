// Types and interfaces for Applications Management

export interface Application {
  id: string;
  name: string;
  email: string;
  college: string;
  city: string;
  track: 'Smart Contract' | 'Frontend' | 'DevOps' | 'Blockchain Research';
  batch: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  avatar: string;
  referralCount: number;
  xp: number;
  leaderboardRank: number;
  linkedin: string;
  twitter: string;
  github: string;
  whyJoinCAP: string;
  communityExperience: string;
}

export interface FilterState {
  search: string;
  status: 'all' | 'pending' | 'approved' | 'rejected';
  batch: string;
  track: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  acceptanceRate: number;
}

export interface TrackStats {
  track: string;
  count: number;
}

export interface CountryStats {
  country: string;
  city: string;
  flag: string;
  count: number;
}

// API Integration
export async function fetchApplications(): Promise<Application[]> {
  try {
    const response = await fetch('http://127.0.0.1:4000/cap/applications', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  try {
    const response = await fetch(`http://127.0.0.1:4000/cap/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status.toUpperCase() }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating application:', error);
    return false;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'approved':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'pending':
      return '⏱️';
    case 'approved':
      return '✓';
    case 'rejected':
      return '✕';
    default:
      return '○';
  }
}

export function getTrackColor(track: string): string {
  switch (track) {
    case 'Smart Contract':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'Frontend':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'DevOps':
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'Blockchain Research':
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
}

export function getCountryFlag(city: string): string {
  const countryMap: Record<string, string> = {
    'Bangalore': '🇮🇳',
    'Mumbai': '🇮🇳',
    'Delhi': '🇮🇳',
    'Hyderabad': '🇮🇳',
    'Pune': '🇮🇳',
    'Kolkata': '🇮🇳',
    'Chennai': '🇮🇳',
    'Noida': '🇮🇳',
    'Lagos': '🇳🇬',
    'Jakarta': '🇮🇩',
    'Cairo': '🇪🇬',
  };
  return countryMap[city] || '🌍';
}

export function aggregateTrackStats(applications: Application[]): TrackStats[] {
  const stats = new Map<string, number>();

  applications.forEach((app) => {
    const current = stats.get(app.track) || 0;
    stats.set(app.track, current + 1);
  });

  return Array.from(stats.entries())
    .map(([track, count]) => ({ track, count }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateCountryStats(applications: Application[]): CountryStats[] {
  const stats = new Map<string, number>();

  applications.forEach((app) => {
    const current = stats.get(app.city) || 0;
    stats.set(app.city, current + 1);
  });

  return Array.from(stats.entries())
    .map(([city, count]) => ({
      city,
      country: getCountry(city),
      flag: getCountryFlag(city),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function getCountry(city: string): string {
  const countryMap: Record<string, string> = {
    'Bangalore': 'India',
    'Mumbai': 'India',
    'Delhi': 'India',
    'Hyderabad': 'India',
    'Pune': 'India',
    'Kolkata': 'India',
    'Chennai': 'India',
    'Noida': 'India',
    'Lagos': 'Nigeria',
    'Jakarta': 'Indonesia',
    'Cairo': 'Egypt',
  };
  return countryMap[city] || 'Other';
}