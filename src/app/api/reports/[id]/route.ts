import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// GET /api/reports/[id] - Get a specific charting report
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = await prisma.chartingReport.findUnique({
      where: { id: params.id },
      include: {
        cna: {
          select: {
            id: true,
            name: true,
            email: true,
            certificationNumber: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching charting report:', error);
    return NextResponse.json({ error: 'Failed to fetch charting report' }, { status: 500 });
  }
}

// PATCH /api/reports/[id] - Update a charting report
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, reviewedBy, reviewedAt, notes } = body;

    const updateData: Prisma.ChartingReportUpdateInput = {};

    if (status) updateData.status = status;
    if (reviewedBy !== undefined) updateData.reviewedBy = reviewedBy;
    if (reviewedAt !== undefined) updateData.reviewedAt = reviewedAt ? new Date(reviewedAt) : null;
    if (notes !== undefined) updateData.notes = notes;

    const report = await prisma.chartingReport.update({
      where: { id: params.id },
      data: updateData,
      include: {
        cna: {
          select: {
            id: true,
            name: true,
            email: true,
            certificationNumber: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error updating charting report:', error);
    return NextResponse.json({ error: 'Failed to update charting report' }, { status: 500 });
  }
}

// DELETE /api/reports/[id] - Delete a charting report
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.chartingReport.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting charting report:', error);
    return NextResponse.json({ error: 'Failed to delete charting report' }, { status: 500 });
  }
}
