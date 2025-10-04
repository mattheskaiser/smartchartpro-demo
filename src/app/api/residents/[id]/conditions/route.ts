import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/residents/[id]/conditions - Get resident's conditions
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conditions = await prisma.condition.findMany({
      where: { residentId: params.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(conditions);
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return NextResponse.json({ error: 'Failed to fetch conditions' }, { status: 500 });
  }
}

// POST /api/residents/[id]/conditions - Add new condition
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, diagnosedDate, status, notes } = body;

    if (!name || !status) {
      return NextResponse.json({ error: 'Name and status are required' }, { status: 400 });
    }

    const condition = await prisma.condition.create({
      data: {
        residentId: params.id,
        name,
        diagnosedDate: diagnosedDate ? new Date(diagnosedDate) : null,
        status,
        notes,
      },
    });

    return NextResponse.json(condition, { status: 201 });
  } catch (error) {
    console.error('Error creating condition:', error);
    return NextResponse.json({ error: 'Failed to create condition' }, { status: 500 });
  }
}
