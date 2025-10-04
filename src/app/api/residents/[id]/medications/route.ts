import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/residents/[id]/medications - Get resident's medications
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const medications = await prisma.medication.findMany({
            where: { residentId: params.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch medications' },
            { status: 500 }
        );
    }
}

// POST /api/residents/[id]/medications - Add new medication
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, dosage, frequency, instructions, startDate, status } = body;

        if (!name || !dosage || !frequency) {
            return NextResponse.json(
                { error: 'Name, dosage, and frequency are required' },
                { status: 400 }
            );
        }

        const medication = await prisma.medication.create({
            data: {
                residentId: params.id,
                name,
                dosage,
                frequency,
                instructions,
                startDate: startDate ? new Date(startDate) : new Date(),
                status: status || 'current',
            },
        });

        return NextResponse.json(medication, { status: 201 });
    } catch (error) {
        console.error('Error creating medication:', error);
        return NextResponse.json(
            { error: 'Failed to create medication' },
            { status: 500 }
        );
    }
}