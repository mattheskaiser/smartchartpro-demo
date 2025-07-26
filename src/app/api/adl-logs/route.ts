import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('residentId');

    const logs = await prisma.aDLLog.findMany({
      where: residentId ? { residentId } : undefined,
      include: {
        resident: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching ADL logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ADL logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { residentId, activityType, assistance, notes } = body;

    const log = await prisma.aDLLog.create({
      data: {
        residentId,
        activityType,
        assistance,
        notes,
      },
      include: {
        resident: true,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating ADL log:', error);
    return NextResponse.json(
      { error: 'Failed to create ADL log' },
      { status: 500 }
    );
  }
} 