import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getActiveSession,
  createSession,
  updateSessionData,
  updateSessionStep,
} from '@/lib/session-service';

/**
 * GET /api/sessions - Get current user's active session
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeSession = await getActiveSession(session.user.id);

    if (!activeSession) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({ session: activeSession });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

/**
 * POST /api/sessions - Create new charting session
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'CNA') {
      return NextResponse.json(
        { error: 'Only CNAs can create charting sessions' },
        { status: 403 }
      );
    }

    // Get cnaId from session or fetch from database
    let cnaId = session.user.cnaId;

    console.log('Session user:', { id: session.user.id, email: session.user.email, cnaId: session.user.cnaId });

    if (!cnaId) {
      // Fetch from database if not in session (can happen after fresh CNA creation)
      console.log('cnaId not in session, fetching from database...');
      const { prisma } = await import('@/lib/db');
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { cnaId: true },
      });

      console.log('User from DB:', user);

      if (!user?.cnaId) {
        return NextResponse.json({
          error: 'CNA account not properly configured. Please log out and log back in.'
        }, { status: 400 });
      }

      cnaId = user.cnaId;
      console.log('Found cnaId from DB:', cnaId);
    }

    const body = await req.json();
    const { residentIds } = body;

    if (!residentIds || !Array.isArray(residentIds) || residentIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one resident must be selected' },
        { status: 400 }
      );
    }

    const newSession = await createSession(session.user.id, cnaId, residentIds);

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);

    if (error instanceof Error && error.message.includes('already have an active session')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

/**
 * PATCH /api/sessions - Update current session
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeSession = await getActiveSession(session.user.id);

    if (!activeSession) {
      return NextResponse.json({ error: 'No active session found' }, { status: 404 });
    }

    const body = await req.json();
    const { currentStep, chartingData } = body;

    let updatedSession = activeSession;

    if (currentStep) {
      updatedSession = await updateSessionStep(activeSession.id, currentStep);
    }

    if (chartingData !== undefined) {
      updatedSession = await updateSessionData(activeSession.id, chartingData);
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
