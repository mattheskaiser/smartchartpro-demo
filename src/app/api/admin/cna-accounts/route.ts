import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth-helpers';
import { CreateCNAAccountSchema } from '@/lib/validations/cna.schema';
import { handleApiError, CommonErrors } from '@/lib/api-error';

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
    const where: Prisma.UserWhereInput = { role: 'CNA' };

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
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/cna-accounts - Create new CNA account
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return CommonErrors.forbidden();
    }

    const body = await req.json();

    // Validate request body
    const validatedData = CreateCNAAccountSchema.parse(body);

    // Check if CNA exists
    const cna = await prisma.cna.findUnique({
      where: { id: validatedData.cnaId },
    });

    if (!cna) {
      return CommonErrors.notFound('CNA');
    }

    // Check if CNA already has a user account
    const existingUser = await prisma.user.findUnique({
      where: { cnaId: validatedData.cnaId },
    });

    if (existingUser) {
      return CommonErrors.conflict('This CNA already has a user account');
    }

    // Check if email is already in use
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return CommonErrors.conflict('Email is already in use');
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await hashPassword(temporaryPassword);

    // Create user account
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: 'CNA',
        cnaId: validatedData.cnaId,
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
    return handleApiError(error);
  }
}
