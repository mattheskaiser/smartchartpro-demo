import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { initializeDefaultShifts } from '@/lib/initializeDefaults';

export async function GET() {
  try {
    // Ensure default shifts exist before fetching
    await initializeDefaultShifts();

    // Update sortOrder for existing shifts that have sortOrder = 0
    await updateShiftSortOrders();

    const shiftTemplates = await prisma.shiftTemplate.findMany({
      orderBy: [{ sortOrder: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json(shiftTemplates);
  } catch (error) {
    console.error('Error fetching shift templates:', error);
    return NextResponse.json({ error: 'Failed to fetch shift templates' }, { status: 500 });
  }
}

// Helper function to update sortOrder for existing shifts
async function updateShiftSortOrders() {
  try {
    // Get all shifts with sortOrder = 0 (default)
    const shiftsToUpdate = await prisma.shiftTemplate.findMany({
      where: { sortOrder: 0 },
    });

    // Update each shift with calculated sortOrder based on start time
    for (const shift of shiftsToUpdate) {
      const [hours, minutes] = shift.startTime.split(':').map(Number);
      const sortOrder = hours * 60 + minutes; // Convert to minutes since midnight

      await prisma.shiftTemplate.update({
        where: { id: shift.id },
        data: { sortOrder },
      });
    }
  } catch (error) {
    console.error('Error updating shift sort orders:', error);
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
