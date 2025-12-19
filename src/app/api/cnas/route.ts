import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const cnas = await prisma.cna.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(cnas);
    } catch (error) {
        console.error('Error fetching CNAs:', error);
        return NextResponse.json({ error: 'Failed to fetch CNAs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    let body: {
        name?: string;
        email?: string;
        phone?: string;
        shift?: string;
        certificationNumber?: string;
        hireDate?: string;
        notes?: string;
        imageData?: string;
    } = {};

    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate required fields
    if (!body.name || !body.email || !body.shift) {
        return NextResponse.json(
            { error: 'Name, email, and shift are required' },
            { status: 400 }
        );
    }

    try {
        const cna = await prisma.cna.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                shift: body.shift,
                certificationNumber: body.certificationNumber,
                hireDate: body.hireDate ? new Date(body.hireDate) : null,
                notes: body.notes,
                imageData: body.imageData || null,
            },
        });

        return NextResponse.json(cna, { status: 201 });
    } catch (error) {
        console.error('Error creating CNA:', error);
        return NextResponse.json({ error: 'Failed to create CNA' }, { status: 500 });
    }
}