'use client';

import { StatisticMolecule } from '@/components/molecules/Statistic.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { WelcomeModalMolecule } from '@/components/molecules/WelcomeModal.molecule';
import { icons } from 'lucide-react';
import { TextAtom } from '@/components/atoms/Text.atom';
import Image from 'next/image';

// Mock active sessions for demo
const MOCK_ACTIVE_SESSIONS = [
  {
    id: 'session_001',
    cna: {
      name: 'Jennifer Rodriguez',
      imageData:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces',
    },
    residentCount: 4,
    duration: '2h 15m',
    startedAt: '6:00 AM',
  },
  {
    id: 'session_002',
    cna: {
      name: 'Michael Thompson',
      imageData:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=faces',
    },
    residentCount: 3,
    duration: '2h 30m',
    startedAt: '5:45 AM',
  },
  {
    id: 'session_003',
    cna: {
      name: 'Sarah Johnson',
      imageData:
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces',
    },
    residentCount: 5,
    duration: '45m',
    startedAt: '7:30 AM',
  },
];

export default function AdminDashboard() {
  const dashboardStats = [
    {
      name: 'Total CNAs',
      value: '6',
      icon: 'UserRound' as keyof typeof icons,
    },
    {
      name: 'Total Residents',
      value: '12',
      icon: 'Users' as keyof typeof icons,
    },
    {
      name: 'Active Sessions',
      value: '3',
      icon: 'Activity' as keyof typeof icons,
    },
  ];

  return (
    <>
      <WelcomeModalMolecule />
      <AdminPageLayoutTemplate
        title="Dashboard Overview"
        subtitle="Monitor your facility's activity and staff performance"
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
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Active Sessions</h2>
            </div>

            <div className="space-y-4">
              {MOCK_ACTIVE_SESSIONS.map(session => (
                <div
                  key={session.id}
                  className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                >
                  {/* CNA Avatar */}
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    {session.cna.imageData ? (
                      <Image
                        src={session.cna.imageData}
                        alt={session.cna.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10">
                        <TextAtom className="text-lg font-semibold text-primary">
                          {session.cna.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                        </TextAtom>
                      </div>
                    )}
                  </div>

                  {/* CNA Details */}
                  <div className="flex-1">
                    <TextAtom className="font-medium text-gray-900">{session.cna.name}</TextAtom>
                    <TextAtom className="text-sm text-gray-500">
                      {session.residentCount} resident{session.residentCount !== 1 ? 's' : ''}
                    </TextAtom>
                  </div>

                  {/* Session Duration */}
                  <div className="text-right">
                    <TextAtom className="text-sm font-medium text-gray-900">
                      {session.duration}
                    </TextAtom>
                    <TextAtom className="text-xs text-gray-500">
                      Started {session.startedAt}
                    </TextAtom>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminPageLayoutTemplate>
    </>
  );
}
