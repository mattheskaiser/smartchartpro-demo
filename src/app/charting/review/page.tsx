'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';
import { useFacilityStore } from '@/stores/facilityStore';
import { format } from 'date-fns';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ChartingReportPDF } from '@/components/pdf/ChartingReportPDF';
import { generateAndDownloadPDF, generateChartingReportFilename } from '@/lib/pdfExport';
import { toast } from '@/lib/toast';

const ADL_TYPES = [
  { id: 'bathing', label: 'Bathing' },
  { id: 'dressing', label: 'Dressing' },
  { id: 'eating', label: 'Eating' },
  { id: 'toileting', label: 'Toileting' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'health', label: 'Health Check' },
];

const ASSISTANCE_LEVELS = [
  { id: 'independent', label: 'Independent' },
  { id: 'partial', label: 'Partial Assist' },
  { id: 'full', label: 'Full Assist' },
];

export default function ChartingReviewPage() {
  const router = useRouter();
  const { selectedResidents, entries, session, endCharting } = useChartingStore();
  const facilitySettings = useFacilityStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleExportPDF = async () => {
    console.log('Starting PDF export...');
    console.log('Session:', session);
    console.log('Facility settings:', facilitySettings);
    console.log('Selected residents:', selectedResidents);
    console.log('Entries:', entries);

    if (!session) {
      toast({ title: 'Session information is missing. Cannot generate PDF.', type: 'error' });
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Ensure startTime is a Date object
      const startTime = session.startTime instanceof Date
        ? session.startTime
        : new Date(session.startTime);

      console.log('Start time:', startTime);

      const pdfDocument = (
        <ChartingReportPDF
          facilityName={facilitySettings.facilityName}
          facilityAddress={facilitySettings.facilityAddress}
          facilityPhone={facilitySettings.facilityPhone}
          licenseNumber={facilitySettings.licenseNumber}
          cnaName={session.cnaName}
          cnaCertification={session.cnaCertification}
          sessionStartTime={startTime}
          selectedResidents={selectedResidents}
          entries={entries}
        />
      );

      const filename = generateChartingReportFilename(
        facilitySettings.facilityName,
        startTime,
        session.cnaName
      );

      console.log('Generating PDF with filename:', filename);

      await generateAndDownloadPDF(pdfDocument, filename);
      toast({ title: 'PDF report generated successfully!', type: 'success' });
    } catch (error) {
      console.error('PDF generation error:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      toast({
        title: 'Failed to generate PDF',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error'
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEndCharting = () => {
    // Here you would typically save all entries to the database
    endCharting();
    router.push('/charting/start');
  };

  const entriesByResident = entries.reduce(
    (acc, entry) => {
      const resident = selectedResidents.find(r => r.id === entry.residentId);
      if (!resident) return acc;

      if (!acc[entry.residentId]) {
        acc[entry.residentId] = {
          resident,
          entries: [],
        };
      }

      acc[entry.residentId].entries.push(entry);
      return acc;
    },
    {} as Record<string, { resident: (typeof selectedResidents)[0]; entries: typeof entries }>
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <CardAtom>
        <TextAtom variant="h2" className="text-gray-900 mb-6">
          Charting Summary
        </TextAtom>

        <div className="space-y-8">
          {Object.values(entriesByResident).map(({ resident, entries }) => (
            <div
              key={resident.id}
              className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              <TextAtom variant="h3" className="text-gray-900 mb-4">
                {resident.name} - Room {resident.room}
              </TextAtom>

              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <TextAtom className="font-medium text-gray-900">
                          {ADL_TYPES.find(t => t.id === entry.activityType)?.label}
                        </TextAtom>
                        <TextAtom variant="small" className="text-gray-500">
                          {ASSISTANCE_LEVELS.find(l => l.id === entry.assistance)?.label}
                        </TextAtom>
                      </div>
                      <TextAtom variant="small" className="text-gray-500">
                        {format(new Date(entry.timestamp), 'h:mm a')}
                      </TextAtom>
                    </div>
                    {entry.notes && (
                      <TextAtom variant="small" className="mt-2 text-gray-600">
                        {entry.notes}
                      </TextAtom>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(entriesByResident).length === 0 && (
            <div className="text-center py-8">
              <DynamicIconAtom name="FileText" size="lg" className="mx-auto text-gray-400 mb-4" />
              <TextAtom className="text-gray-500">No entries recorded yet.</TextAtom>
            </div>
          )}
        </div>
      </CardAtom>

      <div className="flex justify-between">
        <ButtonAtom variant="outline" onClick={() => router.push('/charting/adls')}>
          <DynamicIconAtom name="ArrowLeft" size="sm" className="mr-2" />
          Back to Charting
        </ButtonAtom>

        <div className="flex items-center space-x-4">
          <ButtonAtom
            variant="outline"
            onClick={handleExportPDF}
            disabled={isGeneratingPDF || entries.length === 0}
          >
            <DynamicIconAtom name="Download" size="sm" className="mr-2" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Export PDF'}
          </ButtonAtom>

          <ButtonAtom onClick={handleEndCharting}>
            <DynamicIconAtom name="Check" size="sm" className="mr-2" />
            End Charting
          </ButtonAtom>
        </div>
      </div>
    </div>
  );
}
