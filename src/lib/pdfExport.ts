import { pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';

/**
 * Generate and download a PDF document
 * @param document - React PDF Document component
 * @param filename - Name of the file to download (without extension)
 */
export async function generateAndDownloadPDF(
  document: React.ReactElement,
  filename: string
): Promise<void> {
  try {
    console.log('Generating PDF blob...');
    // Generate PDF blob
    const blob = await pdf(document).toBlob();
    console.log('PDF blob generated:', blob.size, 'bytes');

    // Create download link
    const url = URL.createObjectURL(blob);
    console.log('Created blob URL:', url);

    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;

    // Trigger download
    window.document.body.appendChild(link);
    console.log('Triggering download...');
    link.click();

    // Cleanup
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('PDF download complete');
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate a standardized filename for charting reports
 * @param facilityName - Name of the facility
 * @param date - Date of the charting session
 * @param cnaName - Optional CNA name
 */
export function generateChartingReportFilename(
  facilityName: string,
  date: Date,
  cnaName?: string
): string {
  const dateStr = format(date, 'yyyy-MM-dd');
  const timeStr = format(date, 'HHmm');
  const sanitizedFacility = facilityName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const sanitizedCNA = cnaName ? `-${cnaName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}` : '';

  return `adl-charting-${sanitizedFacility}-${dateStr}-${timeStr}${sanitizedCNA}`;
}
