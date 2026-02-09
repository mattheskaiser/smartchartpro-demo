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
    // Check if email already exists in either table
    const [existingCna, existingUser] = await Promise.all([
      prisma.cna.findUnique({ where: { email: body.email } }),
      prisma.user.findUnique({ where: { email: body.email } }),
    ]);

    if (existingCna) {
      return NextResponse.json({ error: 'A CNA with this email already exists' }, { status: 409 });
    }

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    // Use transaction to ensure both CNA and User are created together
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Create CNA first
      const cna = await tx.cna.create({
        data: {
          name: body.name!,
          email: body.email!,
          phone: body.phone,
          certificationNumber: body.certificationNumber,
          hireDate: body.hireDate ? new Date(body.hireDate) : null,
          notes: body.notes,
          imageData: body.imageData || null,
        },
      });

      // Create user account with password "1234"
      await tx.user.create({
        data: {
          email: body.email!,
          password: '1234', // Plain text for testing
          role: 'CNA',
          cnaId: cna.id,
          isActive: true,
          mustChangePassword: false,
        },
      });

      // Return CNA with user data
      return await tx.cna.findUnique({
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
    });

    console.log(`CNA and user account created successfully: ${body.email}`);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating CNA:', error);

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Server has closed the connection')) {
        return NextResponse.json(
          {
            error: 'Database connection error. Please try again in a moment.',
          },
          { status: 503 }
        );
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            error: 'A user with this email already exists',
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: 'Failed to create CNA' }, { status: 500 });
  }
}
