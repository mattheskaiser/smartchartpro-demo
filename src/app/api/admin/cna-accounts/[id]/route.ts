import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth-helpers';

const prisma = new PrismaClient();

/**
 * GET /api/admin/cna-accounts/[id] - Get specific CNA account
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        cna: true,
        chartingSessions: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching CNA account:', error);
    return NextResponse.json({ error: 'Failed to fetch CNA account' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/cna-accounts/[id] - Update CNA account
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { isActive, resetPassword, email } = body;

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: any = {};

    // Update active status
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    // Update email
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail && existingEmail.id !== params.id) {
        return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
      }

      updateData.email = email;
    }

    // Reset password
    let temporaryPassword: string | undefined;
    if (resetPassword) {
      temporaryPassword = generateTemporaryPassword();
      updateData.password = await hashPassword(temporaryPassword);
      updateData.mustChangePassword = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        cna: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      temporaryPassword, // Only returned if password was reset
    });
  } catch (error) {
    console.error('Error updating CNA account:', error);
    return NextResponse.json({ error: 'Failed to update CNA account' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/cna-accounts/[id] - Delete CNA account (soft delete)
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
    console.error('Error deleting CNA account:', error);
    return NextResponse.json({ error: 'Failed to delete CNA account' }, { status: 500 });
  }
}
