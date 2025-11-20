import { UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { DASHBOARD_STATS, RECENT_ACTIVITY } from '@/constants/admin';
import { StatisticMolecule } from '@/components/molecules/Statistic.molecule';

const stats = [...DASHBOARD_STATS];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor your facility's activity and staff performance
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
          <StatisticMolecule name={stat.name} icon={stat.icon} value={stat.value} key={stat.name} />
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
                        <UserIcon
                          className={clsx(
                            'h-5 w-5',
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
