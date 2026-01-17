import { prisma } from '@/lib/db';

/**
 * Get user's active session if exists
 */
export async function getActiveSession(userId: string) {
  return prisma.chartingSession.findFirst({
    where: {
      userId,
      isActive: true,
    },
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
}

/**
 * Create a new charting session
 */
export async function createSession(userId: string, cnaId: string, residentIds: string[]) {
  // Check if user already has an active session
  const existingSession = await getActiveSession(userId);
  if (existingSession) {
    throw new Error(
      'You already have an active session. Please complete it before starting a new one.'
    );
  }

  return prisma.chartingSession.create({
    data: {
      userId,
      cnaId,
      residentIds,
      isActive: true,
      currentStep: 'adls', // Session starts at adls once residents are selected
    },
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
}

/**
 * Update session step (start -> adls -> review)
 */
export async function updateSessionStep(sessionId: string, step: 'start' | 'adls' | 'review') {
  return prisma.chartingSession.update({
    where: { id: sessionId },
    data: { currentStep: step },
  });
}

/**
 * Update session charting data
 */
export async function updateSessionData(sessionId: string, data: Record<string, unknown>) {
  return prisma.chartingSession.update({
    where: { id: sessionId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { chartingData: data as any },
  });
}

/**
 * End a charting session and generate report
 */
export async function endSession(sessionId: string, reportId: string) {
  return prisma.chartingSession.update({
    where: { id: sessionId },
    data: {
      isActive: false,
      endTime: new Date(),
      reportId,
    },
  });
}

/**
 * Check if user can start a new session
 */
export async function canStartNewSession(userId: string): Promise<boolean> {
  const activeSession = await getActiveSession(userId);
  return !activeSession;
}

/**
 * Get session to resume
 */
export async function resumeSession(userId: string) {
  return getActiveSession(userId);
}

/**
 * Get all active sessions (for admin dashboard)
 */
export async function getAllActiveSessions() {
  const sessions = await prisma.chartingSession.findMany({
    where: { isActive: true },
    include: {
      cna: {
        select: {
          id: true,
          name: true,
          email: true,
          certificationNumber: true,
          imageData: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: { startTime: 'desc' },
  });

  // Filter out sessions with missing CNAs or users and end them
  const validSessions = [];
  for (const session of sessions) {
    if (!session.cna || !session.user) {
      console.warn(`Ending invalid session ${session.id} - missing CNA or user`);
      await prisma.chartingSession.update({
        where: { id: session.id },
        data: { isActive: false, endTime: new Date() },
      });
    } else {
      validSessions.push(session);
    }
  }

  return validSessions;
}

/**
 * Force end a session (admin only)
 */
export async function forceEndSession(sessionId: string) {
  return prisma.chartingSession.update({
    where: { id: sessionId },
    data: {
      isActive: false,
      endTime: new Date(),
    },
  });
}
