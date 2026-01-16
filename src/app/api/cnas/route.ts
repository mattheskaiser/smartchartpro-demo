import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth-helpers';

const prisma = new PrismaClient();

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

    // Automatically create user account with password "1234"
    try {
      // For testing: store plain password "1234" (no hashing)
      await prisma.user.create({
        data: {
          email: body.email,
          password: '1234', // Plain text for testing
          role: 'CNA',
          cnaId: cna.id,
          isActive: true,
          mustChangePassword: false,
        },
      });

      console.log(`User account created for CNA: ${body.email} with password: 1234`);
    } catch (userError) {
      console.error('Error creating user account for CNA:', userError);
      // Don't fail the CNA creation if user creation fails
    }

    return NextResponse.json(cna, { status: 201 });
  } catch (error) {
    console.error('Error creating CNA:', error);
    return NextResponse.json({ error: 'Failed to create CNA' }, { status: 500 });
  }
}
