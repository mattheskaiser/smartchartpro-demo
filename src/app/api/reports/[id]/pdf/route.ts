import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { ChartingReportPDF } from '@/components/pdf/ChartingReportPDF';
import { createElement } from 'react';
import fs from 'fs';
import path from 'path';

const FACILITY_INFO = {
  name: 'Sunrise Senior Living',
  address: '123 Care Lane, Springfield, IL 62701',
  phone: '(555) 123-4567',
  fax: '(555) 123-4568',
  license: 'IL-SNF-12345',
  npi: '1234567890',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Load the manifest
    const manifestPath = path.join(process.cwd(), 'public', 'demo-reports', 'reports-manifest.json');

    if (!fs.existsSync(manifestPath)) {
      return NextResponse.json(
        { error: 'Demo reports not generated. Run: node scripts/generate-demo-pdfs.js' },
        { status: 404 }
      );
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const reportData = manifest.find((r: any) => r.id === id);

    if (!reportData) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Create the PDF document
    const pdfDocument = createElement(ChartingReportPDF, {
      facilityName: FACILITY_INFO.name,
      facilityAddress: FACILITY_INFO.address,
      facilityPhone: FACILITY_INFO.phone,
      facilityFax: FACILITY_INFO.fax,
      licenseNumber: FACILITY_INFO.license,
      npiNumber: FACILITY_INFO.npi,
      cnaName: reportData.cnaName,
      cnaCertification: reportData.cnaCertification,
      sessionStartTime: new Date(reportData.sessionStartTime),
      selectedResidents: reportData.residents,
      entries: reportData.entries.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      })),
    });

    // Generate PDF stream
    const stream = await renderToStream(pdfDocument);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="charting-report-${reportData.reportDate.split('T')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
