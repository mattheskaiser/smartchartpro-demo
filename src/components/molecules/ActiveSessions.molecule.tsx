'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TextAtom } from '@/components/atoms/Text.atom';

type ActiveSession = {
  id: string;
  userId: string;
  cnaId: string;
  residentIds: string[];
  startTime: string;
  endTime: string | null;
  isActive: boolean;
  currentStep: 'start' | 'adls' | 'review';
  chartingData: unknown;
  reportId: string | null;
  cna: {
    id: string;
    name: string;
    email: string;
    certificationNumber: string;
    imageData: string | null;
  };
  user: {
    id: string;
    email: string;
  };
};

type ActiveSessionsProps = {
  refreshTrigger?: number;
};

export const ActiveSessionsMolecule = ({ refreshTrigger }: ActiveSessionsProps) => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveSessions = async () => {
    try {
      const response = await fetch('/api/admin/sessions');

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch sessions:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, [refreshTrigger]);

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins}m`;
    }

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Active Sessions</h2>
          <div className="mt-6 py-8 text-center">
            <TextAtom className="text-gray-500">Loading...</TextAtom>
          </div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Active Sessions</h2>
          <div className="mt-6 py-8 text-center">
            <TextAtom className="text-gray-500">No active charting sessions</TextAtom>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Active Sessions</h2>
        </div>

        <div className="space-y-4">
          {sessions.map(session => (
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
                  {session.residentIds.length} resident{session.residentIds.length !== 1 ? 's' : ''}
                </TextAtom>
              </div>

              {/* Session Duration */}
              <div className="text-right">
                <TextAtom className="text-sm font-medium text-gray-900">
                  {formatDuration(session.startTime)}
                </TextAtom>
                <TextAtom className="text-xs text-gray-500">
                  Started{' '}
                  {new Date(session.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TextAtom>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
