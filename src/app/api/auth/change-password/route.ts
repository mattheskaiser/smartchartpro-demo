import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '@/lib/auth-helpers';

const prisma = new PrismaClient();

/**
 * POST /api/auth/change-password - Change user password
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword, confirmPassword } = body;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'New passwords do not match' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify current password (skip if master login)
        if (!session.user.isMasterLogin) {
            const isValid = await verifyPassword(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                );
            }
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                mustChangePassword: false,
            },
        });

        return NextResponse.json({
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
}
