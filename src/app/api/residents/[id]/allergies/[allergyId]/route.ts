import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/residents/[id]/allergies/[allergyId] - Update allergy
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; allergyId: string } }
) {
  try {
    const body = await request.json();

    const allergy = await prisma.allergy.update({
      where: {
        id: params.allergyId,
        residentId: params.id,
      },
      data: body,
    });

    return NextResponse.json(allergy);
  } catch (error) {
    console.error('Error updating allergy:', error);
    return NextResponse.json({ error: 'Failed to update allergy' }, { status: 500 });
  }
}

// DELETE /api/residents/[id]/allergies/[allergyId] - Delete allergy
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; allergyId: string } }
) {
  try {
    await prisma.allergy.delete({
      where: {
        id: params.allergyId,
        residentId: params.id,
      },
    });

    return NextResponse.json({ message: 'Allergy deleted successfully' });
  } catch (error) {
    console.error('Error deleting allergy:', error);
    return NextResponse.json({ error: 'Failed to delete allergy' }, { status: 500 });
  }
}
