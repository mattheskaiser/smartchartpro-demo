import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth-helpers';

/**
 * GET /api/admin/cna-accounts - List CNA accounts with pagination
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 50, max: 100)
 * - status: Filter by CNA status (optional)
 * - search: Search by name or email (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { role: 'CNA' };

    if (status) {
      where.cna = { status };
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { cna: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.user.count({ where });

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where,
      include: {
        cna: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            certificationNumber: true,
            status: true,
          },
        },
        chartingSessions: {
          where: { isActive: true },
          select: {
            id: true,
            startTime: true,
            currentStep: true,
          },
          take: 1, // Only get the most recent active session
          orderBy: { startTime: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + users.length < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching CNA accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch CNA accounts' }, { status: 500 });
  }
}

/**
 * POST /api/admin/cna-accounts - Create new CNA account
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { cnaId, email } = body;

    if (!cnaId || !email) {
      return NextResponse.json({ error: 'CNA ID and email are required' }, { status: 400 });
    }

    // Check if CNA exists
    const cna = await prisma.cna.findUnique({
      where: { id: cnaId },
    });

    if (!cna) {
      return NextResponse.json({ error: 'CNA not found' }, { status: 404 });
    }

    // Check if CNA already has a user account
    const existingUser = await prisma.user.findUnique({
      where: { cnaId },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'This CNA already has a user account' }, { status: 409 });
    }

    // Check if email is already in use
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await hashPassword(temporaryPassword);

    // Create user account
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CNA',
        cnaId,
        isActive: true,
        mustChangePassword: true,
      },
      include: {
        cna: true,
      },
    });

    return NextResponse.json(
      {
        user,
        temporaryPassword, // Return this once so admin can share it
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating CNA account:', error);
    return NextResponse.json({ error: 'Failed to create CNA account' }, { status: 500 });
  }
}
