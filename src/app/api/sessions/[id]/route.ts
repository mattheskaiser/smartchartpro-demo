import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { endSession, forceEndSession } from '@/lib/session-service';

const prisma = new PrismaClient();

/**
 * GET /api/sessions/[id] - Get specific session
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chartingSession = await prisma.chartingSession.findUnique({
      where: { id: params.id },
      include: {
        cna: true,
        user: true,
      },
    });

    if (!chartingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check authorization - user can only view their own session unless admin
    if (session.user.role !== 'ADMIN' && chartingSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ session: chartingSession });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

/**
 * DELETE /api/sessions/[id] - End session
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chartingSession = await prisma.chartingSession.findUnique({
      where: { id: params.id },
    });

    if (!chartingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check authorization
    if (session.user.role !== 'ADMIN' && chartingSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get reportId from request body if provided
    const body = await req.json().catch(() => ({}));
    const { reportId } = body;

    let updatedSession;
    if (reportId) {
      updatedSession = await endSession(params.id, reportId);
    } else {
      updatedSession = await forceEndSession(params.id);
    }

    return NextResponse.json({
      message: 'Session ended successfully',
      session: updatedSession,
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}
