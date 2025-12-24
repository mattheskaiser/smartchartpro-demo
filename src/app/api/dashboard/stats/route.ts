import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Get total CNAs count
        const totalCnas = await prisma.cna.count();

        // Get active CNAs count (status = 'active')
        const activeCnas = await prisma.cna.count({
            where: {
                status: 'active',
            },
        });

        // Get total residents count
        const totalResidents = await prisma.resident.count();

        // Get current active shifts (today's shifts that are in progress)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const activeShifts = await prisma.shiftAssignment.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
                status: 'in_progress',
            },
        });

        return NextResponse.json({
            totalCnas,
            activeCnas,
            totalResidents,
            activeShifts,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}