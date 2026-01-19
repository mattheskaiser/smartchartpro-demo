'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useChartingStore } from '@/stores/chartingStore';
import { useFacilityStore } from '@/stores/facilityStore';
import { useCreateChartingReport } from '@/hooks/useChartingReports';
import { useChartingSession } from '@/hooks/useChartingSession';
import { format } from 'date-fns';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
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
  const { session: activeSession, endSession } = useChartingSession();
  const facilitySettings = useFacilityStore();
  const createReport = useCreateChartingReport();
  const [isSaving, setIsSaving] = useState(false);

  const handleEndCharting = async () => {
    if (!session) {
      toast({ title: 'Session information is missing.', type: 'error' });
      return;
    }

    if (entries.length === 0) {
      toast({
        title: 'No activities recorded. Please add at least one activity.',
        type: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      const startTime =
        session.startTime instanceof Date ? session.startTime : new Date(session.startTime);
      const endTime = new Date();

      console.log('Step 1: Generating PDF on client side...');

      // Generate PDF on client side to avoid Next.js SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const { ChartingReportPDF } = await import('@/components/pdf/ChartingReportPDF');

      const pdfBlob = await pdf(
        <ChartingReportPDF
          facilityName={facilitySettings.facilityName}
          facilityAddress={facilitySettings.getFormattedAddress()}
          facilityPhone={facilitySettings.facilityPhone}
          facilityFax={facilitySettings.facilityFax}
          facilityWebsite={facilitySettings.facilityWebsite}
          licenseNumber={facilitySettings.licenseNumber}
          npiNumber={facilitySettings.npiNumber}
          taxId={facilitySettings.taxId}
          cnaName={session.cnaName}
          cnaCertification={session.cnaCertification}
          sessionStartTime={startTime}
          selectedResidents={selectedResidents}
          entries={entries}
        />
      ).toBlob();

      const arrayBuffer = await pdfBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = buffer.toString('base64');

      console.log('Step 2: PDF generated, size:', pdfData.length);

      console.log('Step 3: Saving report to database...');

      // Create the report with PDF data
      const report = await createReport.mutateAsync({
        reportDate: startTime,
        sessionStartTime: startTime,
        sessionEndTime: endTime,
        cnaId: session.cnaId,
        cnaName: session.cnaName,
        cnaCertification: session.cnaCertification,
        totalResidents: selectedResidents.length,
        totalActivities: entries.length,
        residentsData: selectedResidents.map(r => ({
          id: r.id,
          name: r.name,
          room: r.room,
          status: r.status,
          imageData: r.imageData || r.imageUrl || null,
        })),
        entriesData: entries.map(e => ({
          residentId: e.residentId,
          activityType: e.activityType,
          assistance: e.assistance,
          timestamp: e.timestamp,
          notes: e.notes,
        })),
        pdfData: pdfData,
      });

      console.log('Step 4: Report saved successfully!');

      // End the session in database
      if (activeSession) {
        await endSession(report.id);
      }

      // Clear charting session
      endCharting();

      toast({
        title: 'Session ended successfully',
        description: 'Report generated and you will be logged out',
        type: 'success',
      });

      // Log out the user after ending session
      setTimeout(() => {
        signOut({ callbackUrl: '/login' });
      }, 1500);
    } catch (error) {
      console.error('Error saving charting session:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Failed to save charting session',
        description: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
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
        <ButtonAtom
          variant="outline"
          onClick={async () => {
            // Update session step back to 'adls'
            try {
              await fetch('/api/sessions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentStep: 'adls' }),
              });
            } catch (error) {
              console.error('Error updating session step:', error);
            }
            router.push('/charting/adls');
          }}
        >
          <DynamicIconAtom name="ArrowLeft" size="sm" className="mr-2" />
          Back to Charting
        </ButtonAtom>

        <ButtonAtom onClick={handleEndCharting} disabled={isSaving || entries.length === 0}>
          <DynamicIconAtom name="Check" size="sm" className="mr-2" />
          {isSaving ? 'Saving...' : 'End Charting'}
        </ButtonAtom>
      </div>
    </div>
  );
}
