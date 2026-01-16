import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { endSession, forceEndSession } from '@/lib/session-service';
import { handleApiError, CommonErrors } from '@/lib/api-error';

/**
 * GET /api/sessions/[id] - Get specific session
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return CommonErrors.unauthorized();
    }

    const chartingSession = await prisma.chartingSession.findUnique({
      where: { id: params.id },
      include: {
        cna: {
          select: {
            id: true,
            name: true,
            email: true,
            certificationNumber: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!chartingSession) {
      return CommonErrors.notFound('Session');
    }

    // Check authorization - user can only view their own session unless admin
    if (session.user.role !== 'ADMIN' && chartingSession.userId !== session.user.id) {
      return CommonErrors.forbidden();
    }

    return NextResponse.json({ session: chartingSession });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/sessions/[id] - End session
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return CommonErrors.unauthorized();
    }

    const chartingSession = await prisma.chartingSession.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        userId: true,
        isActive: true,
      },
    });

    if (!chartingSession) {
      return CommonErrors.notFound('Session');
    }

    // Check authorization
    if (session.user.role !== 'ADMIN' && chartingSession.userId !== session.user.id) {
      return CommonErrors.forbidden();
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
    return handleApiError(error);
  }
}
