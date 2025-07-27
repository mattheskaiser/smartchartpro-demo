import { ClockIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const stats = [
  { name: 'Total CNAs', value: '12', icon: UserIcon },
  { name: 'Active CNAs', value: '8', icon: ClockIcon },
  { name: 'Total Residents', value: '45', icon: UserGroupIcon },
];

const recentActivity = [
  {
    id: 1,
    cna: 'Sarah Johnson',
    action: 'Completed ADL round',
    timestamp: '2 hours ago',
    status: 'completed',
  },
  {
    id: 2,
    cna: 'Michael Chen',
    action: 'Started shift',
    timestamp: '3 hours ago',
    status: 'active',
  },
  {
    id: 3,
    cna: 'Emily Davis',
    action: 'Updated resident status',
    timestamp: '4 hours ago',
    status: 'completed',
  },
];

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
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-6 flow-root">
            <ul role="list" className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
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
                          <div className="text-sm font-medium text-gray-900">{activity.cna}</div>
                          <p className="mt-0.5 text-sm text-gray-500">{activity.timestamp}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{activity.action}</p>
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