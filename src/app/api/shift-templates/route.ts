import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { initializeDefaultShifts } from '@/lib/initializeDefaults';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ensure default shifts exist before fetching
    await initializeDefaultShifts();

    const shiftTemplates = await prisma.shiftTemplate.findMany({
      orderBy: [{ sortOrder: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json(shiftTemplates);
  } catch (error) {
    console.error('Error fetching shift templates:', error);
    return NextResponse.json({ error: 'Failed to fetch shift templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startTime, endTime, color, description, sortOrder } = body;

    // Validate required fields
    if (!name || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Name, start time, and end time are required' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM (24-hour format)' },
        { status: 400 }
      );
    }

    const shiftTemplate = await prisma.shiftTemplate.create({
      data: {
        name,
        startTime,
        endTime,
        color: color || '#3B82F6',
        description,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(shiftTemplate, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating shift template:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'A shift with this name already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to create shift template' }, { status: 500 });
  }
}
