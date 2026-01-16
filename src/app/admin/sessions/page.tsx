'use client';

import { useQuery } from '@tanstack/react-query';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { formatDistanceToNow } from 'date-fns';

type ActiveSession = {
    id: string;
    startTime: Date;
    currentStep: string;
    residentIds: string[];
    cna: {
        id: string;
        name: string;
        email: string;
        certificationNumber: string | null;
    };
    user: {
        id: string;
        email: string;
    };
};

export default function ActiveSessionsPage() {
    // Fetch active sessions
    const { data, isLoading, error } = useQuery({
        queryKey: ['active-sessions'],
        queryFn: async () => {
            const response = await fetch('/api/admin/sessions');
            if (!response.ok) throw new Error('Failed to fetch active sessions');
            return response.json();
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const sessions: ActiveSession[] = data?.sessions || [];

    const getStepBadge = (step: string) => {
        switch (step) {
            case 'start':
                return <BadgeAtom variant="info">Starting</BadgeAtom>;
            case 'adls':
                return <BadgeAtom variant="warning">Charting</BadgeAtom>;
            case 'review':
                return <BadgeAtom variant="success">Reviewing</BadgeAtom>;
            default:
                return <BadgeAtom>{step}</BadgeAtom>;
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <TextAtom variant="h1" weight="semibold">
                        Active Charting Sessions
                    </TextAtom>
                    <TextAtom variant="small" color="muted" className="mt-2">
                        Monitor CNAs currently performing charting activities
                    </TextAtom>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DynamicIconAtom name="Activity" size="sm" className="text-green-500" />
                        <TextAtom variant="small">
                            {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
                        </TextAtom>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <LoadingStateMolecule message="Loading active sessions..." />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <EmptyStateMolecule
                            iconName="Activity"
                            title="Error loading sessions"
                            description="There was an error loading the active sessions. Please try refreshing the page."
                        />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <EmptyStateMolecule
                            iconName="Activity"
                            title="No active sessions"
                            description="There are currently no CNAs performing charting activities. Sessions will appear here when CNAs start charting."
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map(session => (
                            <CardAtom key={session.id} padding="none">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                                    <DynamicIconAtom
                                                        name="UserRound"
                                                        className="text-green-600"
                                                        size="md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <TextAtom className="font-semibold text-gray-900">
                                                        {session.cna.name}
                                                    </TextAtom>
                                                    {getStepBadge(session.currentStep)}
                                                    <BadgeAtom variant="success">
                                                        <DynamicIconAtom name="Activity" size="sm" className="mr-1" />
                                                        Active
                                                    </BadgeAtom>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <DynamicIconAtom name="Mail" size="sm" className="mr-2" />
                                                        {session.user.email}
                                                    </div>
                                                    {session.cna.certificationNumber && (
                                                        <div className="flex items-center text-gray-600">
                                                            <DynamicIconAtom name="Award" size="sm" className="mr-2" />
                                                            Cert: {session.cna.certificationNumber}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center text-gray-600">
                                                        <DynamicIconAtom name="Users" size="sm" className="mr-2" />
                                                        {session.residentIds.length} resident
                                                        {session.residentIds.length !== 1 ? 's' : ''}
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <DynamicIconAtom name="Clock" size="sm" className="mr-2" />
                                                        Started{' '}
                                                        {formatDistanceToNow(new Date(session.startTime), {
                                                            addSuffix: true,
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <TextAtom variant="small" className="text-green-600 font-medium">
                                                    In Progress
                                                </TextAtom>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardAtom>
                        ))}
                    </div>
                )}
            </div>

            {/* Auto-refresh indicator */}
            {sessions.length > 0 && (
                <div className="mt-6 text-center">
                    <TextAtom variant="small" className="text-gray-500">
                        <DynamicIconAtom name="RefreshCw" size="sm" className="inline mr-1" />
                        Auto-refreshing every 30 seconds
                    </TextAtom>
                </div>
            )}
        </div>
    );
}
