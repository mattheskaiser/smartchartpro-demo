import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/residents/[id]/specialists - Get resident's specialists
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const specialists = await prisma.specialist.findMany({
            where: { residentId: params.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(specialists);
    } catch (error) {
        console.error('Error fetching specialists:', error);
        return NextResponse.json(
            { error: 'Failed to fetch specialists' },
            { status: 500 }
        );
    }
}

// POST /api/residents/[id]/specialists - Add new specialist
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, specialty, phone, email, notes } = body;

        if (!name || !specialty) {
            return NextResponse.json(
                { error: 'Name and specialty are required' },
                { status: 400 }
            );
        }

        const specialist = await prisma.specialist.create({
            data: {
                residentId: params.id,
                name,
                specialty,
                phone,
                email,
                notes,
            },
        });

        return NextResponse.json(specialist, { status: 201 });
    } catch (error) {
        console.error('Error creating specialist:', error);
        return NextResponse.json(
            { error: 'Failed to create specialist' },
            { status: 500 }
        );
    }
}