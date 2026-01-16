import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { UpdateReportSchema } from '@/lib/validations/report.schema';
import { handleApiError, CommonErrors } from '@/lib/api-error';

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
      return CommonErrors.notFound('Report');
    }

    return NextResponse.json(report);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/reports/[id] - Update a charting report
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = UpdateReportSchema.parse(body);

    const updateData: Prisma.ChartingReportUpdateInput = {};

    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.reviewedBy !== undefined) updateData.reviewedBy = validatedData.reviewedBy;
    if (validatedData.reviewedAt !== undefined) {
      updateData.reviewedAt = validatedData.reviewedAt ? new Date(validatedData.reviewedAt) : null;
    }
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

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
    return handleApiError(error);
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
    return handleApiError(error);
  }
}
