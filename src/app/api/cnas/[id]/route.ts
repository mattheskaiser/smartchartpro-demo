import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cna = await prisma.cna.findUnique({
      where: { id: params.id },
    });

    if (!cna) {
      return NextResponse.json({ error: 'CNA not found' }, { status: 404 });
    }

    return NextResponse.json(cna);
  } catch (error) {
    console.error('Error fetching CNA:', error);
    return NextResponse.json({ error: 'Failed to fetch CNA' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    certificationNumber?: string;
    hireDate?: string;
    notes?: string;
    imageData?: string;
  } = {};

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  try {
    const cna = await prisma.cna.update({
      where: { id: params.id },
      data: {
        ...body,
        hireDate: body.hireDate ? new Date(body.hireDate) : undefined,
      },
    });

    return NextResponse.json(cna);
  } catch (error) {
    console.error('Error updating CNA:', error);
    return NextResponse.json({ error: 'Failed to update CNA' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.cna.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'CNA deleted successfully' });
  } catch (error) {
    console.error('Error deleting CNA:', error);
    return NextResponse.json({ error: 'Failed to delete CNA' }, { status: 500 });
  }
}
