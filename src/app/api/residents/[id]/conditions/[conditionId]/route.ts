import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/residents/[id]/conditions/[conditionId] - Update condition
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; conditionId: string } }
) {
  try {
    const body = await request.json();

    // Handle date fields
    if (body.diagnosedDate) {
      body.diagnosedDate = new Date(body.diagnosedDate);
    }

    const condition = await prisma.condition.update({
      where: {
        id: params.conditionId,
        residentId: params.id,
      },
      data: body,
    });

    return NextResponse.json(condition);
  } catch (error) {
    console.error('Error updating condition:', error);
    return NextResponse.json({ error: 'Failed to update condition' }, { status: 500 });
  }
}

// DELETE /api/residents/[id]/conditions/[conditionId] - Delete condition
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; conditionId: string } }
) {
  try {
    await prisma.condition.delete({
      where: {
        id: params.conditionId,
        residentId: params.id,
      },
    });

    return NextResponse.json({ message: 'Condition deleted successfully' });
  } catch (error) {
    console.error('Error deleting condition:', error);
    return NextResponse.json({ error: 'Failed to delete condition' }, { status: 500 });
  }
}
