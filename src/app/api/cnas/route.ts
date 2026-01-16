import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const cnas = await prisma.cna.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cnas);
  } catch (error) {
    console.error('Error fetching CNAs:', error);
    return NextResponse.json({ error: 'Failed to fetch CNAs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
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

  // Validate required fields
  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  try {
    // Check if email already exists in CNA table
    const existingCna = await prisma.cna.findUnique({
      where: { email: body.email },
    });

    if (existingCna) {
      return NextResponse.json({ error: 'A CNA with this email already exists' }, { status: 409 });
    }

    // Check if email already exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const cna = await prisma.cna.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        certificationNumber: body.certificationNumber,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        notes: body.notes,
        imageData: body.imageData || null,
      },
    });

    console.log(`CNA created: ${cna.id} - ${body.email}`);

    // Automatically create user account with password "1234"
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: '1234', // Plain text for testing
          role: 'CNA',
          cnaId: cna.id,
          isActive: true,
          mustChangePassword: false,
        },
      });

      console.log(`User account created for CNA: ${body.email} with password: 1234, userId: ${user.id}, cnaId: ${user.cnaId}`);
    } catch (userError) {
      console.error('Error creating user account for CNA:', userError);
      // Delete the CNA if user creation fails to keep data consistent
      await prisma.cna.delete({ where: { id: cna.id } });
      return NextResponse.json({
        error: 'Failed to create user account for CNA. Please try again.'
      }, { status: 500 });
    }

    // Fetch the complete CNA with user data to return
    const completeCna = await prisma.cna.findUnique({
      where: { id: cna.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(completeCna, { status: 201 });
  } catch (error) {
    console.error('Error creating CNA:', error);
    return NextResponse.json({ error: 'Failed to create CNA' }, { status: 500 });
  }
}
