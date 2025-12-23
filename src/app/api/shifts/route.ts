import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts - Get shifts for a specific date or date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let whereClause = {};

    if (date) {
      // Single date
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause = {
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      };
    } else if (startDate && endDate) {
      // Date range
      whereClause = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    }

    const shifts = await prisma.shiftAssignment.findMany({
      where: whereClause,
      include: {
        cna: {
          select: {
            id: true,
            name: true,
            email: true,
            imageData: true,
          },
        },
        residentAssignments: {
          include: {
            resident: {
              select: {
                id: true,
                name: true,
                room: true,
                imageData: true,
                adlNeeds: true,
              },
            },
          },
        },
      },
      orderBy: [{ date: 'asc' }, { shiftType: 'asc' }],
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
  }
}

// POST /api/shifts - Create a new shift assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, shiftType, cnaId, residentIds, notes } = body;

    // Create the shift assignment
    const shift = await prisma.shiftAssignment.create({
      data: {
        date: new Date(date),
        shiftType,
        cnaId: cnaId || null,
        notes,
        status: cnaId ? 'scheduled' : 'unassigned',
      },
    });

    // Create resident assignments if provided
    if (residentIds && residentIds.length > 0) {
      await prisma.residentAssignment.createMany({
        data: residentIds.map((residentId: string) => ({
          shiftAssignmentId: shift.id,
          residentId,
        })),
      });
    }

    // Fetch the complete shift with relations
    const completeShift = await prisma.shiftAssignment.findUnique({
      where: { id: shift.id },
      include: {
        cna: {
          select: {
            id: true,
            name: true,
            email: true,
            imageData: true,
          },
        },
        residentAssignments: {
          include: {
            resident: {
              select: {
                id: true,
                name: true,
                room: true,
                imageData: true,
                adlNeeds: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(completeShift);
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
  }
}
