import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/residents/[id]/medications/[medicationId] - Update medication
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; medicationId: string } }
) {
    try {
        const body = await request.json();

        // Handle date fields
        if (body.startDate) {
            body.startDate = new Date(body.startDate);
        }
        if (body.endDate) {
            body.endDate = new Date(body.endDate);
        }

        const medication = await prisma.medication.update({
            where: {
                id: params.medicationId,
                residentId: params.id,
            },
            data: body,
        });

        return NextResponse.json(medication);
    } catch (error) {
        console.error('Error updating medication:', error);
        return NextResponse.json(
            { error: 'Failed to update medication' },
            { status: 500 }
        );
    }
}

// DELETE /api/residents/[id]/medications/[medicationId] - Delete medication
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; medicationId: string } }
) {
    try {
        await prisma.medication.delete({
            where: {
                id: params.medicationId,
                residentId: params.id,
            },
        });

        return NextResponse.json({ message: 'Medication deleted successfully' });
    } catch (error) {
        console.error('Error deleting medication:', error);
        return NextResponse.json(
            { error: 'Failed to delete medication' },
            { status: 500 }
        );
    }
}