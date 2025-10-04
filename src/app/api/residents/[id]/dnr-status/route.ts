import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/residents/[id]/dnr-status - Get resident's DNR status
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dnrStatus = await prisma.dNRStatus.findUnique({
      where: { residentId: params.id },
    });

    return NextResponse.json(dnrStatus);
  } catch (error) {
    console.error('Error fetching DNR status:', error);
    return NextResponse.json({ error: 'Failed to fetch DNR status' }, { status: 500 });
  }
}

// PUT /api/residents/[id]/dnr-status - Update or create DNR status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    // Handle date fields
    if (body.dnrDate) {
      body.dnrDate = new Date(body.dnrDate);
    }
    if (body.dniDate) {
      body.dniDate = new Date(body.dniDate);
    }

    const dnrStatus = await prisma.dNRStatus.upsert({
      where: { residentId: params.id },
      update: body,
      create: {
        residentId: params.id,
        ...body,
      },
    });

    return NextResponse.json(dnrStatus);
  } catch (error) {
    console.error('Error updating DNR status:', error);
    return NextResponse.json({ error: 'Failed to update DNR status' }, { status: 500 });
  }
}
