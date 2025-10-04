import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/residents/[id]/specialists/[specialistId] - Update specialist
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; specialistId: string } }
) {
  try {
    const body = await request.json();

    const specialist = await prisma.specialist.update({
      where: {
        id: params.specialistId,
        residentId: params.id,
      },
      data: body,
    });

    return NextResponse.json(specialist);
  } catch (error) {
    console.error('Error updating specialist:', error);
    return NextResponse.json({ error: 'Failed to update specialist' }, { status: 500 });
  }
}

// DELETE /api/residents/[id]/specialists/[specialistId] - Delete specialist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; specialistId: string } }
) {
  try {
    await prisma.specialist.delete({
      where: {
        id: params.specialistId,
        residentId: params.id,
      },
    });

    return NextResponse.json({ message: 'Specialist deleted successfully' });
  } catch (error) {
    console.error('Error deleting specialist:', error);
    return NextResponse.json({ error: 'Failed to delete specialist' }, { status: 500 });
  }
}
