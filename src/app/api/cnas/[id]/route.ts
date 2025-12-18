import { NextRequest, NextResponse } from 'next/server';
import { CNA } from '@/types/cna';

// Mock data - in a real app, this would come from a database
const mockCNAs: CNA[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '(555) 123-4567',
        status: 'active',
        shift: 'Morning',
        residents: 8,
        lastActive: '2 hours ago',
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        hireDate: '2023-01-15',
        certificationNumber: 'CNA-12345',
        notes: 'Excellent with dementia patients',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        phone: '(555) 234-5678',
        status: 'active',
        shift: 'Evening',
        residents: 6,
        lastActive: '1 hour ago',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        hireDate: '2023-03-20',
        certificationNumber: 'CNA-23456',
        notes: 'Specializes in mobility assistance',
        createdAt: '2023-03-20T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
    },
    {
        id: '3',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '(555) 345-6789',
        status: 'inactive',
        shift: 'Night',
        residents: 0,
        lastActive: '2 days ago',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        hireDate: '2022-11-10',
        certificationNumber: 'CNA-34567',
        notes: 'On medical leave',
        createdAt: '2022-11-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
    },
];

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cna = mockCNAs.find(c => c.id === params.id);

        if (!cna) {
            return NextResponse.json({ error: 'CNA not found' }, { status: 404 });
        }

        return NextResponse.json(cna);
    } catch (error) {
        console.error('Error fetching CNA:', error);
        return NextResponse.json({ error: 'Failed to fetch CNA' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data: Partial<CNA> = await request.json();
        const cnaIndex = mockCNAs.findIndex(c => c.id === params.id);

        if (cnaIndex === -1) {
            return NextResponse.json({ error: 'CNA not found' }, { status: 404 });
        }

        // Update CNA
        mockCNAs[cnaIndex] = {
            ...mockCNAs[cnaIndex],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(mockCNAs[cnaIndex]);
    } catch (error) {
        console.error('Error updating CNA:', error);
        return NextResponse.json({ error: 'Failed to update CNA' }, { status: 500 });
    }
}