'use client';

import clsx from 'clsx';
import { RECENT_ACTIVITY } from '@/constants/admin';
import { StatisticMolecule } from '@/components/molecules/Statistic.molecule';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { useEffect, useState } from 'react';
import { icons } from 'lucide-react';

type DashboardStats = {
  totalCnas: number;
  activeCnas: number;
  totalResidents: number;
  activeSessions: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date());
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
        name: 'Active CNAs',
        value: stats.activeCnas.toString(),
        icon: 'UserCheck' as keyof typeof icons,
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
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitor your facility's activity and staff performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            <DynamicIconAtom
              name="RefreshCw"
              size="sm"
              className={clsx('mr-2', loading && 'animate-spin')}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
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

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-6 flow-root">
            <ul role="list" className="-mb-8">
              {RECENT_ACTIVITY.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== RECENT_ACTIVITY.length - 1 ? (
                      <span
                        className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      <div
                        className={clsx(
                          'relative h-10 w-10 flex-none rounded-full flex items-center justify-center',
                          activity.status === 'completed'
                            ? 'bg-green-100'
                            : activity.status === 'active'
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                        )}
                      >
                        <DynamicIconAtom
                          name="User"
                          size="sm"
                          className={clsx(
                            activity.status === 'completed'
                              ? 'text-green-600'
                              : activity.status === 'active'
                                ? 'text-blue-600'
                                : 'text-gray-600'
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                          <p className="mt-0.5 text-sm text-gray-500">{activity.timestamp}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
