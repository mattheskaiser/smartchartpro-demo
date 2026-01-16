import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handleApiError, CommonErrors } from '@/lib/api-error';

// GET /api/residents - Get residents with pagination and filtering
// Query params:
// - page: Page number (default: 1)
// - limit: Items per page (default: 100, max: 200)
// - status: Filter by status (optional)
// - search: Search by name or room (optional)
// - assignedCNA: Filter by assigned CNA (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '100')));
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const assignedCNA = searchParams.get('assignedCNA');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (assignedCNA) {
      where.assignedCNA = assignedCNA;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { room: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.resident.count({ where });

    const residents = await prisma.resident.findMany({
      where,
      select: {
        id: true,
        name: true,
        room: true,
        status: true,
        imageData: true,
        adlNeeds: true,
        assignedCNA: true,
        dateOfBirth: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
      take: limit,
      skip,
    });

    // Transform imageData to imageUrl for frontend compatibility
    const transformedResidents = residents.map(resident => ({
      ...resident,
      imageUrl: resident.imageData || null,
    }));

    return NextResponse.json({
      residents: transformedResidents,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + residents.length < totalCount,
      },
    });
  } catch (error) {
    return handleApiError(error);
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
      return CommonErrors.validationError('Missing required fields: name, room, emergencyContactName');
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
    return handleApiError(error);
  }
}
