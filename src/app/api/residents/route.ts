import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/residents - Get all residents
export async function GET() {
  try {
    const residents = await prisma.resident.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Transform imageData to imageUrl for frontend compatibility
    const transformedResidents = residents.map(resident => ({
      ...resident,
      imageUrl: resident.imageData || null,
    }));

    return NextResponse.json(transformedResidents);
  } catch (error) {
    console.error('Error fetching residents:', error);
    return NextResponse.json({ error: 'Failed to fetch residents' }, { status: 500 });
  }
}

// POST /api/residents - Create a new resident
export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    room?: string;
    dateOfBirth?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    imageData?: string;
  } = {};

  try {
    body = await request.json();
    const { name, room, dateOfBirth, emergencyContactName, emergencyContactPhone, imageData } =
      body;

    // Validate required fields
    if (!name || !room || !emergencyContactName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create resident with all fields
    const resident = await prisma.resident.create({
      data: {
        name,
        room,
        emergencyContactName,
        emergencyContactPhone,
        status: 'independent',
        imageData: imageData || null,
        adlNeeds: [],
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
      },
    });

    // Transform imageData to imageUrl for frontend compatibility
    const transformedResident = {
      ...resident,
      imageUrl: resident.imageData || null,
    };

    return NextResponse.json(transformedResident, { status: 201 });
  } catch (error) {
    console.error('Error creating resident:', error);
    console.error('Request body:', body);
    return NextResponse.json(
      {
        error: 'Failed to create resident',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
