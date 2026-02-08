'use client';

import { StatisticMolecule } from '@/components/molecules/Statistic.molecule';
import { ActiveSessionsMolecule } from '@/components/molecules/ActiveSessions.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { WelcomeModalMolecule } from '@/components/molecules/WelcomeModal.molecule';
import { useEffect, useState } from 'react';
import { icons } from 'lucide-react';

type DashboardStats = {
  totalCnas: number;
  totalResidents: number;
  activeSessions: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date());
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const dashboardStats = stats
    ? [
      {
        name: 'Total CNAs',
        value: stats.totalCnas.toString(),
        icon: 'UserRound' as keyof typeof icons,
      },
      {
        name: 'Total Residents',
        value: stats.totalResidents.toString(),
        icon: 'Users' as keyof typeof icons,
      },
      {
        name: 'Active Sessions',
        value: stats.activeSessions.toString(),
        icon: 'Activity' as keyof typeof icons,
      },
    ]
    : [];

  if (loading) {
    return <PageLoaderMolecule message="Loading dashboard..." />;
  }

  return (
    <>
      <WelcomeModalMolecule />
      <AdminPageLayoutTemplate
        title="Dashboard Overview"
        subtitle="Monitor your facility's activity and staff performance"
        headerExtra={
          lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )
        }
        actionButton={{
          label: 'Refresh',
          onClick: fetchStats,
          icon: 'RefreshCw',
          disabled: loading,
        }}
      >
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {dashboardStats.map(stat => (
            <StatisticMolecule
              key={stat.name}
              name={stat.name}
              icon={stat.icon}
              value={stat.value}
            />
          ))}
        </div>

        {/* Active Sessions */}
        <ActiveSessionsMolecule refreshTrigger={refreshTrigger} />
      </AdminPageLayoutTemplate>
    </>
  );
}
