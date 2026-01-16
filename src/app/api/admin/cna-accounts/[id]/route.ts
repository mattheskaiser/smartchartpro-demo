import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth-helpers';
import { UpdateCNAAccountSchema } from '@/lib/validations/cna.schema';
import { handleApiError, CommonErrors } from '@/lib/api-error';

/**
 * GET /api/admin/cna-accounts/[id] - Get specific CNA account
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return CommonErrors.forbidden();
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
          take: 1,
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!user) {
      return CommonErrors.notFound('User');
    }

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/cna-accounts/[id] - Update CNA account
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return CommonErrors.forbidden();
    }

    const body = await req.json();

    // Validate request body
    const validatedData = UpdateCNAAccountSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return CommonErrors.notFound('User');
    }

    const updateData: {
      isActive?: boolean;
      email?: string;
      password?: string;
      mustChangePassword?: boolean;
    } = {};

    // Update active status
    if (typeof validatedData.isActive === 'boolean') {
      updateData.isActive = validatedData.isActive;
    }

    // Update email
    if (validatedData.email && validatedData.email !== user.email) {
      // Check if email is already in use
      const existingEmail = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingEmail && existingEmail.id !== params.id) {
        return CommonErrors.conflict('Email is already in use');
      }

      updateData.email = validatedData.email;
    }

    // Reset password
    let temporaryPassword: string | undefined;
    if (validatedData.resetPassword) {
      temporaryPassword = generateTemporaryPassword();
      updateData.password = await hashPassword(temporaryPassword);
      updateData.mustChangePassword = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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
      },
    });

    return NextResponse.json({
      user: updatedUser,
      temporaryPassword, // Only returned if password was reset
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/cna-accounts/[id] - Delete CNA account (soft delete)
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return CommonErrors.forbidden();
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return CommonErrors.notFound('User');
    }

    // Soft delete by deactivating
    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: 'CNA account deactivated successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
