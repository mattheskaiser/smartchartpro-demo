import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shiftTemplate = await prisma.shiftTemplate.findUnique({
      where: { id: params.id },
    });

    if (!shiftTemplate) {
      return NextResponse.json({ error: 'Shift template not found' }, { status: 404 });
    }

    return NextResponse.json(shiftTemplate);
  } catch (error) {
    console.error('Error fetching shift template:', error);
    return NextResponse.json({ error: 'Failed to fetch shift template' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, startTime, endTime, color, description, sortOrder, isActive } = body;

    // Validate time format if provided
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (startTime && !timeRegex.test(startTime)) {
      return NextResponse.json(
        { error: 'Invalid start time format. Use HH:MM (24-hour format)' },
        { status: 400 }
      );
    }
    if (endTime && !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Invalid end time format. Use HH:MM (24-hour format)' },
        { status: 400 }
      );
    }

    const shiftTemplate = await prisma.shiftTemplate.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(color && { color }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(shiftTemplate);
  } catch (error: unknown) {
    console.error('Error updating shift template:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Shift template not found' }, { status: 404 });
      }

      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A shift with this name already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: 'Failed to update shift template' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if this shift template is being used in any assignments
    const assignmentCount = await prisma.shiftAssignment.count({
      where: {
        shiftType: {
          in: await prisma.shiftTemplate
            .findUnique({
              where: { id: params.id },
              select: { name: true },
            })
            .then(template => (template ? [template.name] : [])),
        },
      },
    });

    if (assignmentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete shift template that is currently in use' },
        { status: 409 }
      );
    }

    await prisma.shiftTemplate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting shift template:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Shift template not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to delete shift template' }, { status: 500 });
  }
}
