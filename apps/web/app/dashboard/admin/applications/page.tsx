'use client';

import { useSession } from '@/app/lib/auth-client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { ApplicationsHero } from '@/app/components/applications/ApplicationsHero';
import { ApplicationsStats } from '@/app/components/applications/ApplicationsStats';
import { ApplicationsFilters } from '@/app/components/applications/ApplicationsFilters';
import { ApplicationsTable } from '@/app/components/applications/ApplicationsTable';
import ApplicationInsights from '@/app/components/applications/ApplicationInsights';
import TopTracksCard from '@/app/components/applications/TopTracksCard';
import TopCountriesCard from '@/app/components/applications/TopCountriesCard';
import { EthereumCrystal } from '@/app/components/applications/EthereumCrystal';
import type { Application, FilterState } from '@/app/lib/applications';

const ADMIN_ROLE = 'admin';

export default function ApplicationsPage() {
  const { data: session, isPending } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    batch: 'all',
    track: 'all',
    dateRange: { start: null, end: null },
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    acceptanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Check admin access
  useEffect(() => {
    if (!isPending) {
      const user = session?.user;
      const userRole = 'admin'; // Temporary bypass or fetch actual role from profile
      const hasAccess = userRole === ADMIN_ROLE || user?.id === 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ';
      
      setIsAdmin(hasAccess);
      if (hasAccess) {
        fetchApplications();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, session]);

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Fetch through Next.js proxy to securely attach API keys
      const response = await fetch('/api/admin/applications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      if (response?.ok) {
        const data = await response.json();
        processApplications(data);
      } else {
        processApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      processApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const processApplications = (data: Application[]) => {
    setApplications(data);
    calculateStats(data);
    applyFilters(data, filters);
  };

  const calculateStats = (data: Application[]) => {
    const total = data.length;
    const approved = data.filter((a) => a.status === 'approved').length;
    const pending = data.filter((a) => a.status === 'pending').length;
    const rejected = data.filter((a) => a.status === 'rejected').length;
    const acceptanceRate = total > 0 ? (approved / total) * 100 : 0;

    setStats({
      total,
      pending,
      approved,
      rejected,
      acceptanceRate: Math.round(acceptanceRate * 10) / 10,
    });
  };

  const applyFilters = (data: Application[], filterState: FilterState) => {
    let filtered = data;

    // Search filter
    if (filterState.search) {
      const query = filterState.search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.college.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterState.status !== 'all') {
      filtered = filtered.filter((app) => app.status === filterState.status);
    }

    // Batch filter
    if (filterState.batch !== 'all') {
      filtered = filtered.filter((app) => app.batch === filterState.batch);
    }

    // Track filter
    if (filterState.track !== 'all') {
      filtered = filtered.filter((app) => app.track === filterState.track);
    }

    // Date range filter
    if (filterState.dateRange.start || filterState.dateRange.end) {
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.appliedDate);
        if (filterState.dateRange.start && appDate < filterState.dateRange.start) return false;
        if (filterState.dateRange.end && appDate > filterState.dateRange.end) return false;
        return true;
      });
    }

    setFilteredApplications(filtered);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    applyFilters(applications, newFilters);
  };

  const handleExportCSV = () => {
    const csv = [
      ['Name', 'Email', 'College', 'City', 'Track', 'Batch', 'Status', 'Applied Date'],
      ...filteredApplications.map((app) => [
        app.name,
        app.email,
        app.college,
        app.city,
        app.track,
        app.batch,
        app.status,
        new Date(app.appliedDate).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <LoadingScreen text="LOADING APPLICATIONS..." />;
  }

  // Bypassed Login Admin for Testing
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">403 Unauthorized</h1>
          <p className="text-xl text-gray-400">You do not have access to this page.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <ApplicationsHero />

        {/* Stats Cards */}
        <div className="px-6 lg:px-8 py-8">
          <ApplicationsStats stats={stats} loading={loading} />
        </div>

        {/* Filters */}
        <div className="px-6 lg:px-8 py-6 border-b border-white/10">
          <ApplicationsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExportCSV}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 lg:px-8 py-8">
          {/* Table and Insights */}
          <div className="lg:col-span-2">
            <ApplicationsTable applications={filteredApplications} loading={loading} onStatusChange={fetchApplications} />
          </div>

          {/* Right Sidebar Analytics */}
          <div className="space-y-6">
            <ApplicationInsights applications={applications} />
            <TopTracksCard applications={applications} />
            <TopCountriesCard applications={applications} />
          </div>
        </div>
      </div>
    </div>
    </DashboardShell>
  );
}

function getMockApplications(): Application[] {
  return [
    {
      id: '1',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      college: 'IIT Bombay',
      city: 'Bangalore',
      track: 'Smart Contract',
      batch: 'Batch 10',
      status: 'pending',
      appliedDate: '2025-05-12',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
      referralCount: 5,
      xp: 1250,
      leaderboardRank: 42,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'I want to grow in web3 development',
      communityExperience: '2 years of blockchain development',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      college: 'BITS Pilani',
      city: 'Mumbai',
      track: 'Frontend',
      batch: 'Batch 10',
      status: 'pending',
      appliedDate: '2025-05-12',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      referralCount: 3,
      xp: 890,
      leaderboardRank: 78,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'Passionate about building DApps',
      communityExperience: '1 year of frontend development',
    },
    {
      id: '3',
      name: 'Rohit Verma',
      email: 'rohit.verma@example.com',
      college: 'Delhi University',
      city: 'Delhi',
      track: 'Smart Contract',
      batch: 'Batch 10',
      status: 'approved',
      appliedDate: '2025-05-11',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit',
      referralCount: 8,
      xp: 2100,
      leaderboardRank: 15,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'Lead the Ethereum revolution',
      communityExperience: '3 years of blockchain experience',
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      college: 'IIIT Hyderabad',
      city: 'Hyderabad',
      track: 'Frontend',
      batch: 'Batch 10',
      status: 'approved',
      appliedDate: '2025-05-11',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
      referralCount: 6,
      xp: 1680,
      leaderboardRank: 28,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'Build amazing web3 products',
      communityExperience: '2 years of full stack development',
    },
    {
      id: '5',
      name: 'Divyansh Singh',
      email: 'divyansh.singh@example.com',
      college: 'CoEP Pune',
      city: 'Pune',
      track: 'DevOps',
      batch: 'Batch 10',
      status: 'rejected',
      appliedDate: '2025-05-10',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Divyansh',
      referralCount: 2,
      xp: 450,
      leaderboardRank: 256,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'Infrastructure excellence',
      communityExperience: 'Early-stage blockchain interest',
    },
    {
      id: '6',
      name: 'Ananya Gupta',
      email: 'ananya.gupta@example.com',
      college: 'Jadavpur University',
      city: 'Kolkata',
      track: 'Smart Contract',
      batch: 'Batch 9',
      status: 'approved',
      appliedDate: '2025-05-09',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
      referralCount: 7,
      xp: 1920,
      leaderboardRank: 22,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'Contribute to Ethereum ecosystem',
      communityExperience: '2.5 years of smart contract dev',
    },
    {
      id: '7',
      name: 'Karthik Nair',
      email: 'karthik.nair@example.com',
      college: 'Anna University',
      city: 'Chennai',
      track: 'Frontend',
      batch: 'Batch 9',
      status: 'pending',
      appliedDate: '2025-05-09',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
      referralCount: 4,
      xp: 1050,
      leaderboardRank: 95,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'Modern web3 development',
      communityExperience: '1.5 years of React development',
    },
    {
      id: '8',
      name: 'Ishita Malhotra',
      email: 'ishita.malhotra@example.com',
      college: 'Amity University',
      city: 'Noida',
      track: 'DevOps',
      batch: 'Batch 9',
      status: 'rejected',
      appliedDate: '2025-05-08',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita',
      referralCount: 1,
      xp: 320,
      leaderboardRank: 412,
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      whyJoinCAP: 'Learn DevOps in web3',
      communityExperience: 'Cloud infrastructure background',
    },
  ];
}