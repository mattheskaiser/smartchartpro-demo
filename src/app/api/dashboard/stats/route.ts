import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Force dynamic rendering - don't cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Get total CNAs
    const totalCnas = await prisma.cna.count();

    // Get total residents
    const totalResidents = await prisma.resident.count();

    // Get active charting sessions
    const activeSessions = await prisma.chartingSession.count({
      where: { isActive: true },
    });

    return NextResponse.json({
      totalCnas,
      totalResidents,
      activeSessions,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
