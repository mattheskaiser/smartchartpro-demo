import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cnas/[id]/availability - Get CNA availability
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const availability = await prisma.cnaAvailability.findMany({
      where: {
        cnaId: params.id,
        isActive: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { shiftType: 'asc' }],
    });

    // Transform to the format expected by the frontend
    const formattedAvailability: { [key: string]: string[] } = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Initialize all days
    dayNames.forEach(day => {
      formattedAvailability[day] = [];
    });

    // Populate with actual availability
    availability.forEach((avail: any) => {
      const dayName = dayNames[avail.dayOfWeek];
      if (dayName) {
        formattedAvailability[dayName].push(avail.shiftType);
      }
    });

    return NextResponse.json(formattedAvailability);
  } catch (error) {
    console.error('Error fetching CNA availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

// PUT /api/cnas/[id]/availability - Update CNA availability
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const availability = body; // { [dayName]: [shiftTypes] }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Delete existing availability
    await prisma.cnaAvailability.deleteMany({
      where: { cnaId: params.id },
    });

    // Create new availability records
    const availabilityRecords: {
      cnaId: string;
      shiftType: string;
      dayOfWeek: number;
      isActive: boolean;
    }[] = [];

    Object.entries(availability).forEach(([dayName, shiftTypes]) => {
      const dayOfWeek = dayNames.indexOf(dayName);
      if (dayOfWeek !== -1 && Array.isArray(shiftTypes)) {
        shiftTypes.forEach((shiftType: string) => {
          availabilityRecords.push({
            cnaId: params.id,
            shiftType,
            dayOfWeek,
            isActive: true,
          });
        });
      }
    });

    if (availabilityRecords.length > 0) {
      await prisma.cnaAvailability.createMany({
        data: availabilityRecords,
      });
    }

    // Return the updated availability in the same format
    const updatedAvailability = await prisma.cnaAvailability.findMany({
      where: {
        cnaId: params.id,
        isActive: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { shiftType: 'asc' }],
    });

    const formattedAvailability: { [key: string]: string[] } = {};
    dayNames.forEach(day => {
      formattedAvailability[day] = [];
    });

    updatedAvailability.forEach((avail: any) => {
      const dayName = dayNames[avail.dayOfWeek];
      if (dayName) {
        formattedAvailability[dayName].push(avail.shiftType);
      }
    });

    return NextResponse.json(formattedAvailability);
  } catch (error) {
    console.error('Error updating CNA availability:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
