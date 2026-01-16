import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { hashPassword, generateTemporaryPassword } from '@/lib/auth-helpers';

const prisma = new PrismaClient();

/**
 * GET /api/admin/cna-accounts - List all CNA accounts
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            where: { role: 'CNA' },
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
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching CNA accounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch CNA accounts' },
            { status: 500 }
        );
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
            return NextResponse.json(
                { error: 'CNA ID and email are required' },
                { status: 400 }
            );
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
            return NextResponse.json(
                { error: 'This CNA already has a user account' },
                { status: 409 }
            );
        }

        // Check if email is already in use
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email is already in use' },
                { status: 409 }
            );
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
        return NextResponse.json(
            { error: 'Failed to create CNA account' },
            { status: 500 }
        );
    }
}
