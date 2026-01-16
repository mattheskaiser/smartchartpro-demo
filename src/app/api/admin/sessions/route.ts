import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllActiveSessions } from '@/lib/session-service';

/**
 * GET /api/admin/sessions - Get all active sessions (admin only)
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const activeSessions = await getAllActiveSessions();

        return NextResponse.json({ sessions: activeSessions });
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch active sessions' },
            { status: 500 }
        );
    }
}
