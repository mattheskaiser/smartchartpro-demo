import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/residents/[id] - Get a specific resident with all details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resident = await prisma.resident.findUnique({
      where: { id: params.id },
    });

    if (!resident) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
    }

    return NextResponse.json(resident);
  } catch (error) {
    console.error('Error fetching resident:', error);
    return NextResponse.json({ error: 'Failed to fetch resident' }, { status: 500 });
  }
}

// PUT /api/residents/[id] - Update a resident
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    console.log('Updating resident:', params.id, 'with data:', body);

    // Handle date fields properly
    const updateData = { ...body };
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    if (updateData.admissionDate) {
      updateData.admissionDate = new Date(updateData.admissionDate);
    }

    const resident = await prisma.resident.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(resident);
  } catch (error) {
    console.error('Error updating resident:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error: 'Failed to update resident',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/residents/[id] - Delete a resident
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.resident.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    return NextResponse.json({ error: 'Failed to delete resident' }, { status: 500 });
  }
}
