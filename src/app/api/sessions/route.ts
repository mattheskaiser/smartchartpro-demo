import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getActiveSession,
  createSession,
  updateSessionData,
  updateSessionStep,
} from '@/lib/session-service';
import { CreateSessionSchema, UpdateSessionSchema } from '@/lib/validations/session.schema';
import { handleApiError, CommonErrors } from '@/lib/api-error';

// Force dynamic rendering - don't cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/sessions - Get current user's active session
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return CommonErrors.unauthorized();
    }

    const activeSession = await getActiveSession(session.user.id);

    if (!activeSession) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({ session: activeSession });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/sessions - Create new charting session
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return CommonErrors.unauthorized();
    }

    if (session.user.role !== 'CNA') {
      return CommonErrors.forbidden();
    }

    // Get cnaId from session or fetch from database
    let cnaId = session.user.cnaId;

    if (!cnaId) {
      // Fetch from database if not in session
      const { prisma } = await import('@/lib/db');
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { cna: true },
      });

      if (!user?.cnaId || !user.cna) {
        return CommonErrors.validationError(
          'CNA account not properly configured. Please contact administrator.'
        );
      }

      cnaId = user.cnaId;
    } else {
      // Verify the CNA still exists
      const { prisma } = await import('@/lib/db');
      const cna = await prisma.cna.findUnique({
        where: { id: cnaId },
      });

      if (!cna) {
        return CommonErrors.validationError(
          'CNA account no longer exists. Please contact administrator.'
        );
      }
    }

    const body = await req.json();

    // Validate request body
    const validatedData = CreateSessionSchema.parse(body);

    const newSession = await createSession(session.user.id, cnaId, validatedData.residentIds);

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already have an active session')) {
      return CommonErrors.conflict(error.message);
    }
    return handleApiError(error);
  }
}

/**
 * PATCH /api/sessions - Update current session
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return CommonErrors.unauthorized();
    }

    const activeSession = await getActiveSession(session.user.id);

    if (!activeSession) {
      return CommonErrors.notFound('Active session');
    }

    const body = await req.json();

    // Validate request body
    const validatedData = UpdateSessionSchema.parse(body);

    if (validatedData.currentStep) {
      await updateSessionStep(activeSession.id, validatedData.currentStep);
    }

    if (validatedData.chartingData !== undefined) {
      await updateSessionData(activeSession.id, validatedData.chartingData);
    }

    // Fetch the updated session with details
    const updatedSession = await getActiveSession(session.user.id);

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    return handleApiError(error);
  }
}
