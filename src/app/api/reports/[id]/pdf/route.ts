import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Fetch the report
    const report = await prisma.chartingReport.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        pdfData: true,
        reportDate: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (!report.pdfData) {
      return NextResponse.json({ error: 'PDF not available for this report' }, { status: 404 });
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(report.pdfData, 'base64');

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="charting-report-${report.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to serve PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
