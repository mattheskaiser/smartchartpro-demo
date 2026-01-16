import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
            cna: true,
            user: true,
        },
    });
}

/**
 * Create a new charting session
 */
export async function createSession(
    userId: string,
    cnaId: string,
    residentIds: string[]
) {
    // Check if user already has an active session
    const existingSession = await getActiveSession(userId);
    if (existingSession) {
        throw new Error('You already have an active session. Please complete it before starting a new one.');
    }

    return prisma.chartingSession.create({
        data: {
            userId,
            cnaId,
            residentIds,
            isActive: true,
            currentStep: 'start',
        },
        include: {
            cna: true,
            user: true,
        },
    });
}

/**
 * Update session step (start -> adls -> review)
 */
export async function updateSessionStep(
    sessionId: string,
    step: 'start' | 'adls' | 'review'
) {
    return prisma.chartingSession.update({
        where: { id: sessionId },
        data: { currentStep: step },
    });
}

/**
 * Update session charting data
 */
export async function updateSessionData(sessionId: string, data: any) {
    return prisma.chartingSession.update({
        where: { id: sessionId },
        data: { chartingData: data },
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
    return prisma.chartingSession.findMany({
        where: { isActive: true },
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
                },
            },
        },
        orderBy: { startTime: 'desc' },
    });
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
