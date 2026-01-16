import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// GET /api/reports - Get charting reports with pagination and optional details
// Query params:
// - page: Page number (default: 1)
// - limit: Items per page (default: 50, max: 100)
// - status: Filter by status (optional)
// - cnaId: Filter by CNA ID (optional)
// - startDate: Filter by start date (optional)
// - endDate: Filter by end date (optional)
// - includeDetails: Include CNA and createdBy relations (default: false)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const status = searchParams.get('status');
    const cnaId = searchParams.get('cnaId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const includeDetails = searchParams.get('includeDetails') === 'true';

    const skip = (page - 1) * limit;

    const where: Prisma.ChartingReportWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (cnaId) {
      where.cnaId = cnaId;
    }

    if (startDate || endDate) {
      where.reportDate = {};
      if (startDate) {
        where.reportDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.reportDate.lte = new Date(endDate);
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.chartingReport.count({ where });

    const reports = await prisma.chartingReport.findMany({
      where,
      include: includeDetails
        ? {
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
        }
        : undefined,
      orderBy: {
        reportDate: 'desc',
      },
      take: limit,
      skip,
    });

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + reports.length < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching charting reports:', error);
    return NextResponse.json({ error: 'Failed to fetch charting reports' }, { status: 500 });
  }
}

// POST /api/reports - Create a new charting report
export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    const body = await request.json();
    console.log('Received report data:', JSON.stringify(body, null, 2));

    const {
      reportDate,
      sessionStartTime,
      sessionEndTime,
      cnaId,
      cnaName,
      cnaCertification,
      totalResidents,
      totalActivities,
      residentsData,
      entriesData,
      pdfData,
    } = body;

    // Validate required fields
    if (!reportDate || !sessionStartTime || !sessionEndTime || !residentsData || !entriesData) {
      console.error('Missing required fields:', {
        reportDate: !!reportDate,
        sessionStartTime: !!sessionStartTime,
        sessionEndTime: !!sessionEndTime,
        residentsData: !!residentsData,
        entriesData: !!entriesData,
      });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating report with data:', {
      reportDate: new Date(reportDate),
      sessionStartTime: new Date(sessionStartTime),
      sessionEndTime: new Date(sessionEndTime),
      cnaId: cnaId || null,
      cnaName: cnaName || null,
      cnaCertification: cnaCertification || null,
      totalResidents,
      totalActivities,
      residentsDataLength: residentsData.length,
      entriesDataLength: entriesData.length,
    });

    const report = await prisma.chartingReport.create({
      data: {
        reportDate: new Date(reportDate),
        sessionStartTime: new Date(sessionStartTime),
        sessionEndTime: new Date(sessionEndTime),
        cnaId: cnaId || null,
        cnaName: cnaName || null,
        cnaCertification: cnaCertification || null,
        createdById: session?.user?.id || null,
        totalResidents,
        totalActivities,
        residentsData,
        entriesData,
        pdfData: pdfData || null,
        status: 'pending',
      },
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

    console.log('Report created successfully:', report.id);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating charting report:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      {
        error: 'Failed to create charting report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
