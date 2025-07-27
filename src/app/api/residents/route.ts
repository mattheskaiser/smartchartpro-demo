import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const residents = await prisma.resident.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(residents);
  } catch (error) {
    console.error('Error fetching residents:', error);
    return NextResponse.json({ error: 'Failed to fetch residents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, imageUrl, room, status } = body;

    const resident = await prisma.resident.create({
      data: {
        name,
        imageUrl,
        room,
        status,
      },
    });

    return NextResponse.json(resident, { status: 201 });
  } catch (error) {
    console.error('Error creating resident:', error);
    return NextResponse.json({ error: 'Failed to create resident' }, { status: 500 });
  }
}
