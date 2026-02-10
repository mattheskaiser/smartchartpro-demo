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
import { isDemoMode } from '@/lib/demo-config';

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

    // In demo mode, return no active session to allow starting new sessions
    if (isDemoMode()) {
      return NextResponse.json({ session: null });
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

    const body = await req.json();

    // Validate request body
    const validatedData = CreateSessionSchema.parse(body);

    // In demo mode, return a mock session
    if (isDemoMode()) {
      const mockSession = {
        id: 'demo_session_' + Date.now(),
        userId: session.user.id,
        cnaId: session.user.cnaId || 'cna_001',
        residentIds: validatedData.residentIds,
        isActive: true,
        currentStep: 'adls',
        startTime: new Date(),
        endTime: null,
        chartingData: {},
        reportId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        cna: {
          id: session.user.cnaId || 'cna_001',
          name: session.user.cnaName || 'Demo CNA',
          email: session.user.email || 'cna@demo.com',
          certificationNumber: 'CNA-DEMO-001',
        },
        user: {
          id: session.user.id,
          email: session.user.email || 'cna@demo.com',
          role: 'CNA',
        },
      };

      return NextResponse.json({ session: mockSession }, { status: 201 });
    }

    // Get cnaId from session or fetch from database
    let cnaId = session.user.cnaId;

    if (!cnaId) {
      // Fetch from database if not in session
      const { prisma } = await import('@/lib/db');
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { cnaId: true },
      });

      if (!user?.cnaId) {
        return NextResponse.json({ error: 'CNA ID not found for user' }, { status: 400 });
      }

      cnaId = user.cnaId;
    }

    const newSession = await createSession(session.user.id, cnaId!, validatedData.residentIds);

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

    const body = await req.json();

    // Validate request body
    const validatedData = UpdateSessionSchema.parse(body);

    // In demo mode, return a mock updated session
    if (isDemoMode()) {
      const mockSession = {
        id: 'demo_session_' + Date.now(),
        userId: session.user.id,
        cnaId: session.user.cnaId || 'cna_001',
        residentIds: ['resident_001', 'resident_002'],
        isActive: true,
        currentStep: validatedData.currentStep || 'adls',
        startTime: new Date(),
        endTime: null,
        chartingData: validatedData.chartingData || {},
        reportId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        cna: {
          id: session.user.cnaId || 'cna_001',
          name: session.user.cnaName || 'Demo CNA',
          email: session.user.email || 'cna@demo.com',
          certificationNumber: 'CNA-DEMO-001',
        },
        user: {
          id: session.user.id,
          email: session.user.email || 'cna@demo.com',
          role: 'CNA',
        },
      };

      return NextResponse.json({ session: mockSession });
    }

    const activeSession = await getActiveSession(session.user.id);

    if (!activeSession) {
      return CommonErrors.notFound('Active session');
    }

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
