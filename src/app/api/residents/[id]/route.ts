import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/residents/[id] - Get a specific resident with all details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const resident = await prisma.resident.findUnique({
            where: { id: params.id },
        });

        if (!resident) {
            return NextResponse.json(
                { error: 'Resident not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(resident);
    } catch (error) {
        console.error('Error fetching resident:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resident' },
            { status: 500 }
        );
    }
}

// PUT /api/residents/[id] - Update a resident
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const resident = await prisma.resident.update({
            where: { id: params.id },
            data: body,
        });

        return NextResponse.json(resident);
    } catch (error) {
        console.error('Error updating resident:', error);
        return NextResponse.json(
            { error: 'Failed to update resident' },
            { status: 500 }
        );
    }
}

// DELETE /api/residents/[id] - Delete a resident
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.resident.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Resident deleted successfully' });
    } catch (error) {
        console.error('Error deleting resident:', error);
        return NextResponse.json(
            { error: 'Failed to delete resident' },
            { status: 500 }
        );
    }
}