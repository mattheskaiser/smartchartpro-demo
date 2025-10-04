import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/residents/[id]/allergies - Get resident's allergies
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const allergies = await prisma.allergy.findMany({
      where: { residentId: params.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(allergies);
  } catch (error) {
    console.error('Error fetching allergies:', error);
    return NextResponse.json({ error: 'Failed to fetch allergies' }, { status: 500 });
  }
}

// POST /api/residents/[id]/allergies - Add new allergy
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, severity, reaction } = body;

    if (!name || !severity) {
      return NextResponse.json({ error: 'Name and severity are required' }, { status: 400 });
    }

    const allergy = await prisma.allergy.create({
      data: {
        residentId: params.id,
        name,
        severity,
        reaction,
      },
    });

    return NextResponse.json(allergy, { status: 201 });
  } catch (error) {
    console.error('Error creating allergy:', error);
    return NextResponse.json({ error: 'Failed to create allergy' }, { status: 500 });
  }
}
