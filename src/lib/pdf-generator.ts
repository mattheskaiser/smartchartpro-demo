// Client-side PDF generation utility
// This avoids the React PDF + Next.js SSR compatibility issues

import { pdf } from '@react-pdf/renderer';

export async function generateChartingReportPDF(props: any): Promise<string> {
    // Dynamic import to ensure this only runs on client
    const { ChartingReportPDF } = await import('@/components/pdf/ChartingReportPDF');
    const React = await import('react');

    // Create the PDF element
    const pdfElement = React.createElement(ChartingReportPDF, props);

    // Generate PDF
    const pdfBlob = await pdf(pdfElement).toBlob();
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to base64
    return buffer.toString('base64');
}
