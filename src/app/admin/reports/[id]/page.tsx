'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useChartingReport, useUpdateChartingReport } from '@/hooks/useChartingReports';
import { format } from 'date-fns';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { toast } from '@/lib/toast';

const ADL_TYPES: Record<string, string> = {
  bathing: 'Bathing',
  dressing: 'Dressing',
  eating: 'Eating',
  toileting: 'Toileting',
  mobility: 'Mobility',
  health: 'Health Check',
};

const ASSISTANCE_LEVELS: Record<string, string> = {
  independent: 'Independent',
  partial: 'Partial Assist',
  full: 'Full Assist',
};

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const { data: report, isLoading, error } = useChartingReport(reportId);
  const updateReport = useUpdateChartingReport();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!report) return;

    try {
      const response = await fetch(`/api/reports/${report.id}/pdf`);
      if (!response.ok) throw new Error('Failed to download PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `charting-report-${format(new Date(report.reportDate), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: 'PDF downloaded successfully', type: 'success' });
    } catch (error) {
      toast({
        title: 'Failed to download PDF',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    }
  };

  const handleMarkAsReviewed = async () => {
    if (!report) return;
    setIsUpdating(true);
    try {
      await updateReport.mutateAsync({
        id: report.id,
        data: { status: 'reviewed', reviewedAt: new Date(), reviewedBy: 'Admin' },
      });
      toast({ title: 'Report marked as reviewed', type: 'success' });
    } catch (error) {
      toast({
        title: 'Failed to update report',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!report) return;
    setIsUpdating(true);
    try {
      await updateReport.mutateAsync({ id: report.id, data: { status: 'archived' } });
      toast({ title: 'Report archived', type: 'success' });
    } catch (error) {
      toast({
        title: 'Failed to archive report',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'reviewed':
        return 'success';
      case 'archived':
        return 'info';
      default:
        return 'warning';
    }
  };

  if (isLoading) {
    return <PageLoaderMolecule message="Loading report..." />;
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <CardAtom className="text-center">
          <DynamicIconAtom name="TriangleAlert" size="lg" className="mx-auto text-red-500 mb-4" />
          <TextAtom variant="h2" className="text-red-600 mb-2">
            Error Loading Report
          </TextAtom>
          <TextAtom className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Report not found'}
          </TextAtom>
          <ButtonAtom onClick={() => router.push('/admin/reports')} variant="outline">
            Back to Reports
          </ButtonAtom>
        </CardAtom>
      </div>
    );
  }

  const entriesByResident = report.entriesData.reduce(
    (acc, entry) => {
      if (!acc[entry.residentId]) {
        const resident = report.residentsData.find(r => r.id === entry.residentId);
        if (resident) {
          acc[entry.residentId] = { resident, entries: [] };
        }
      }
      if (acc[entry.residentId]) {
        acc[entry.residentId].entries.push(entry);
      }
      return acc;
    },
    {} as Record<
      string,
      { resident: (typeof report.residentsData)[0]; entries: typeof report.entriesData }
    >
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ButtonAtom variant="ghost" onClick={() => router.push('/admin/reports')}>
            <DynamicIconAtom name="ArrowLeft" size="sm" className="mr-2" />
            Back
          </ButtonAtom>
          <div>
            <div className="flex items-center gap-3">
              <TextAtom variant="h1" className="text-gray-900">
                Charting Report
              </TextAtom>
              <BadgeAtom variant={getStatusVariant(report.status)}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </BadgeAtom>
            </div>
            <TextAtom className="text-gray-600 mt-1">
              {format(new Date(report.reportDate), 'EEEE, MMMM dd, yyyy')}
            </TextAtom>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {report.status === 'pending' && (
            <ButtonAtom onClick={handleMarkAsReviewed} disabled={isUpdating} variant="outline">
              <DynamicIconAtom name="Check" size="sm" className="mr-2" />
              Mark as Reviewed
            </ButtonAtom>
          )}
          {report.status !== 'archived' && (
            <ButtonAtom onClick={handleArchive} disabled={isUpdating} variant="ghost">
              <DynamicIconAtom name="Archive" size="sm" className="mr-2" />
              Archive
            </ButtonAtom>
          )}
          <ButtonAtom onClick={handleDownloadPDF}>
            <DynamicIconAtom name="Download" size="sm" className="mr-2" />
            Download PDF
          </ButtonAtom>
        </div>
      </div>
      <CardAtom>
        <TextAtom variant="h3" className="text-gray-900 mb-4">
          Session Information
        </TextAtom>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <TextAtom variant="small" className="text-gray-500 mb-1">
              CNA/Nurse
            </TextAtom>
            <TextAtom className="font-medium text-gray-900">
              {report.cnaName || 'Not specified'}
            </TextAtom>
            {report.cnaCertification && (
              <TextAtom variant="small" className="text-gray-500">
                Cert: {report.cnaCertification}
              </TextAtom>
            )}
          </div>
          <div>
            <TextAtom variant="small" className="text-gray-500 mb-1">
              Session Time
            </TextAtom>
            <TextAtom className="font-medium text-gray-900">
              {format(new Date(report.sessionStartTime), 'h:mm a')} -{' '}
              {format(new Date(report.sessionEndTime), 'h:mm a')}
            </TextAtom>
          </div>
          <div>
            <TextAtom variant="small" className="text-gray-500 mb-1">
              Total Residents
            </TextAtom>
            <TextAtom className="font-medium text-gray-900">{report.totalResidents}</TextAtom>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <TextAtom variant="small" className="text-gray-500 mb-1">
              Total Activities
            </TextAtom>
            <TextAtom className="font-medium text-gray-900">{report.totalActivities}</TextAtom>
          </div>
        </div>
        {report.reviewedAt && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <TextAtom variant="small" className="text-gray-500">
              Reviewed by {report.reviewedBy} on{' '}
              {format(new Date(report.reviewedAt), 'MMM dd, yyyy h:mm a')}
            </TextAtom>
          </div>
        )}
      </CardAtom>
      <CardAtom>
        <TextAtom variant="h3" className="text-gray-900 mb-6">
          Charting Details
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
                          {ADL_TYPES[entry.activityType] || entry.activityType}
                        </TextAtom>
                        <TextAtom variant="small" className="text-gray-500">
                          {ASSISTANCE_LEVELS[entry.assistance] || entry.assistance}
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
              <TextAtom className="text-gray-500">No entries recorded</TextAtom>
            </div>
          )}
        </div>
      </CardAtom>
    </div>
  );
}
