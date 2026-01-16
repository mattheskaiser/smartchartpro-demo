'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { toast } from '@/lib/toast';
import { formatDistanceToNow } from 'date-fns';

type CNAAccount = {
    id: string;
    email: string;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    cna: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        certificationNumber: string | null;
        status: string;
    } | null;
    chartingSessions: Array<{
        id: string;
        startTime: Date;
        currentStep: string;
    }>;
};

export default function CNAAccountsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);

    // Fetch CNA accounts
    const { data, isLoading, error } = useQuery({
        queryKey: ['cna-accounts'],
        queryFn: async () => {
            const response = await fetch('/api/admin/cna-accounts');
            if (!response.ok) throw new Error('Failed to fetch CNA accounts');
            return response.json();
        },
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`/api/admin/cna-accounts/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetPassword: true }),
            });
            if (!response.ok) throw new Error('Failed to reset password');
            return response.json();
        },
        onSuccess: (data, userId) => {
            queryClient.invalidateQueries({ queryKey: ['cna-accounts'] });
            setResettingPasswordId(null);

            // Show temporary password
            toast({
                title: 'Password Reset Successfully',
                description: `New temporary password: ${data.temporaryPassword}`,
                type: 'success',
                duration: 10000,
            });
        },
        onError: () => {
            setResettingPasswordId(null);
            toast({
                title: 'Failed to reset password',
                description: 'There was an error resetting the password. Please try again.',
                type: 'error',
            });
        },
    });

    // Toggle active status mutation
    const toggleActiveMutation = useMutation({
        mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
            const response = await fetch(`/api/admin/cna-accounts/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive }),
            });
            if (!response.ok) throw new Error('Failed to update account status');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cna-accounts'] });
            toast({
                title: 'Account status updated',
                type: 'success',
            });
        },
        onError: () => {
            toast({
                title: 'Failed to update account status',
                type: 'error',
            });
        },
    });

    const handleResetPassword = (userId: string) => {
        setResettingPasswordId(userId);
        resetPasswordMutation.mutate(userId);
    };

    const handleToggleActive = (userId: string, currentStatus: boolean) => {
        toggleActiveMutation.mutate({ userId, isActive: !currentStatus });
    };

    const users: CNAAccount[] = data?.users || [];

    return (
        <div className="mx-auto max-w-7xl">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <TextAtom variant="h1" weight="semibold">
                        CNA Accounts
                    </TextAtom>
                    <TextAtom variant="small" color="muted" className="mt-2">
                        Manage CNA user accounts, passwords, and access permissions
                    </TextAtom>
                </div>
                {!isLoading && (
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <ButtonAtom
                            variant="primary"
                            onClick={() => router.push('/admin/cna-accounts/new')}
                        >
                            <DynamicIconAtom name="Plus" size="sm" className="-ml-0.5 mr-1.5" />
                            Create Account
                        </ButtonAtom>
                    </div>
                )}
            </div>

            <div className="mt-8">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <LoadingStateMolecule message="Loading CNA accounts..." />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <EmptyStateMolecule
                            iconName="UserRound"
                            title="Error loading accounts"
                            description="There was an error loading the CNA accounts. Please try refreshing the page."
                        />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <EmptyStateMolecule
                            iconName="UserRound"
                            title="No CNA accounts found"
                            description="Get started by creating user accounts for your CNAs so they can log in and start charting."
                            actionLabel="Create Account"
                            onAction={() => router.push('/admin/cna-accounts/new')}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {users.map(user => (
                            <CardAtom key={user.id} padding="none">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <DynamicIconAtom
                                                        name="UserRound"
                                                        className="text-primary"
                                                        size="md"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <TextAtom className="font-semibold text-gray-900">
                                                        {user.cna?.name || 'Unknown CNA'}
                                                    </TextAtom>
                                                    <BadgeAtom variant={user.isActive ? 'success' : 'error'}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </BadgeAtom>
                                                    {user.chartingSessions.length > 0 && (
                                                        <BadgeAtom variant="info">
                                                            <DynamicIconAtom name="Activity" size="sm" className="mr-1" />
                                                            In Session
                                                        </BadgeAtom>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <DynamicIconAtom name="Mail" size="sm" className="mr-2" />
                                                        {user.email}
                                                    </div>
                                                    {user.cna?.certificationNumber && (
                                                        <div className="flex items-center text-gray-600">
                                                            <DynamicIconAtom name="Award" size="sm" className="mr-2" />
                                                            Cert: {user.cna.certificationNumber}
                                                        </div>
                                                    )}
                                                    {user.lastLoginAt && (
                                                        <div className="flex items-center text-gray-600">
                                                            <DynamicIconAtom name="Clock" size="sm" className="mr-2" />
                                                            Last login:{' '}
                                                            {formatDistanceToNow(new Date(user.lastLoginAt), {
                                                                addSuffix: true,
                                                            })}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center text-gray-600">
                                                        <DynamicIconAtom name="Calendar" size="sm" className="mr-2" />
                                                        Created:{' '}
                                                        {formatDistanceToNow(new Date(user.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <ButtonAtom
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleResetPassword(user.id)}
                                                disabled={resettingPasswordId === user.id}
                                                isLoading={resettingPasswordId === user.id}
                                            >
                                                <DynamicIconAtom name="KeyRound" size="sm" className="mr-1" />
                                                Reset Password
                                            </ButtonAtom>

                                            <ButtonAtom
                                                variant={user.isActive ? 'ghost' : 'outline'}
                                                size="sm"
                                                onClick={() => handleToggleActive(user.id, user.isActive)}
                                            >
                                                <DynamicIconAtom
                                                    name={user.isActive ? 'Ban' : 'Check'}
                                                    size="sm"
                                                    className="mr-1"
                                                />
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </ButtonAtom>
                                        </div>
                                    </div>
                                </div>
                            </CardAtom>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
