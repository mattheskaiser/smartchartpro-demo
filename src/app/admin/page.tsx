'use client';

import { StatisticMolecule } from '@/components/molecules/Statistic.molecule';
import { ActiveSessionsMolecule } from '@/components/molecules/ActiveSessions.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
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
  return (
    <AdminPageLayoutTemplate
      title="Dashboard Overview"
      subtitle="Monitor your facility's activity and staff performance"
      headerExtra={
        lastUpdated && (
          <p className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>
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
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                  <div className="ml-5 w-0 flex-1">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))
          : dashboardStats.map(stat => (
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
  );
}
