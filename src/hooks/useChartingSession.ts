import { useState, useEffect, useCallback } from 'react';
import { ChartingSession } from '@/types/session';

export function useChartingSession() {
    const [session, setSession] = useState<ChartingSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch active session on mount
    const fetchSession = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/sessions');

            if (!response.ok) {
                throw new Error('Failed to fetch session');
            }

            const data = await response.json();
            setSession(data.session);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load session');
            setSession(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    // Create new session
    const createSession = useCallback(async (residentIds: string[]) => {
        try {
            const response = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ residentIds }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create session');
            }

            const data = await response.json();
            setSession(data.session);
            return data.session;
        } catch (err) {
            throw err;
        }
    }, []);

    // Update session
    const updateSession = useCallback(
        async (updates: { currentStep?: string; chartingData?: any }) => {
            if (!session) return;

            try {
                const response = await fetch('/api/sessions', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                });

                if (!response.ok) {
                    throw new Error('Failed to update session');
                }

                const data = await response.json();
                setSession(data.session);
                return data.session;
            } catch (err) {
                throw err;
            }
        },
        [session]
    );

    // End session
    const endSession = useCallback(
        async (reportId?: string) => {
            if (!session) return;

            try {
                const response = await fetch(`/api/sessions/${session.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reportId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to end session');
                }

                setSession(null);
                return true;
            } catch (err) {
                throw err;
            }
        },
        [session]
    );

    return {
        session,
        isLoading,
        error,
        createSession,
        updateSession,
        endSession,
        refetch: fetchSession,
    };
}
