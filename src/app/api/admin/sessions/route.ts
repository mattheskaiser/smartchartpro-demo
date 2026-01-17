import { NextResponse } from 'next/server';
import { getAllActiveSessions } from '@/lib/session-service';

// Force dynamic rendering - don't cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/sessions - Get all active sessions
 */
export async function GET() {
  try {
    const activeSessions = await getAllActiveSessions();

    const response = NextResponse.json({ sessions: activeSessions });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch active sessions' }, { status: 500 });
  }
}
