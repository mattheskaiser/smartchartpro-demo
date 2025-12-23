import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts/[id] - Get a specific shift
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const shift = await prisma.shiftAssignment.findUnique({
            where: { id: params.id },
            include: {
                cna: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        imageData: true,
                    },
                },
                residentAssignments: {
                    include: {
                        resident: {
                            select: {
                                id: true,
                                name: true,
                                room: true,
                                imageData: true,
                                adlNeeds: true,
                            },
                        },
                    },
                },
            },
        });

        if (!shift) {
            return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
        }

        return NextResponse.json(shift);
    } catch (error) {
        console.error('Error fetching shift:', error);
        return NextResponse.json({ error: 'Failed to fetch shift' }, { status: 500 });
    }
}

// PUT /api/shifts/[id] - Update a shift assignment
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { cnaId, residentIds, notes, status } = body;

        // Update the shift
        const shift = await prisma.shiftAssignment.update({
            where: { id: params.id },
            data: {
                cnaId: cnaId || null,
                notes,
                status: status || (cnaId ? 'scheduled' : 'unassigned'),
            },
        });

        // Update resident assignments if provided
        if (residentIds !== undefined) {
            // Remove existing assignments
            await prisma.residentAssignment.deleteMany({
                where: { shiftAssignmentId: params.id },
            });

            // Create new assignments
            if (residentIds.length > 0) {
                await prisma.residentAssignment.createMany({
                    data: residentIds.map((residentId: string) => ({
                        shiftAssignmentId: params.id,
                        residentId,
                    })),
                });
            }
        }

        // Fetch the updated shift with relations
        const updatedShift = await prisma.shiftAssignment.findUnique({
            where: { id: params.id },
            include: {
                cna: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        imageData: true,
                    },
                },
                residentAssignments: {
                    include: {
                        resident: {
                            select: {
                                id: true,
                                name: true,
                                room: true,
                                imageData: true,
                                adlNeeds: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(updatedShift);
    } catch (error) {
        console.error('Error updating shift:', error);
        return NextResponse.json({ error: 'Failed to update shift' }, { status: 500 });
    }
}

// DELETE /api/shifts/[id] - Delete a shift assignment
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.shiftAssignment.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Shift deleted successfully' });
    } catch (error) {
        console.error('Error deleting shift:', error);
        return NextResponse.json({ error: 'Failed to delete shift' }, { status: 500 });
    }
}