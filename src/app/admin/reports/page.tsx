'use client';

import { useChartingReports, useDeleteChartingReport } from '@/hooks/useChartingReports';
import { format } from 'date-fns';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { toast } from '@/lib/toast';

export default function ReportsPage() {
  const { data: reports = [], isLoading, error } = useChartingReports();
  const deleteReport = useDeleteChartingReport();

  const handleDelete = async (id: string, reportDate: string | Date) => {
    const dateStr = typeof reportDate === 'string' ? reportDate : reportDate.toISOString();
    if (
      !confirm(
        `Are you sure you want to delete the report from ${format(new Date(dateStr), 'MMM dd, yyyy')}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteReport.mutateAsync(id);
      toast({ title: 'Report deleted successfully', type: 'success' });
    } catch (error) {
      toast({
        title: 'Failed to delete report',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    }
  };

  const handleDownload = async (id: string, reportDate: string | Date) => {
    try {
      const response = await fetch(`/api/reports/${id}/pdf`);
      if (!response.ok) throw new Error('Failed to download PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `charting-report-${format(new Date(reportDate), 'yyyy-MM-dd')}.pdf`;
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <LoadingStateMolecule message="Loading reports..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <CardAtom className="text-center">
          <DynamicIconAtom name="TriangleAlert" size="lg" className="mx-auto text-red-500 mb-4" />
          <TextAtom variant="h2" className="text-red-600 mb-2">
            Error Loading Reports
          </TextAtom>
          <TextAtom className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Failed to load reports'}
          </TextAtom>
          <ButtonAtom onClick={() => window.location.reload()} variant="outline">
            Try Again
          </ButtonAtom>
        </CardAtom>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <TextAtom variant="h1" weight="semibold">
            Charting Reports
          </TextAtom>
          <TextAtom variant="small" color="muted" className="mt-2">
            View and manage completed ADL charting sessions
          </TextAtom>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <CardAtom className="text-center py-12">
          <DynamicIconAtom name="FileText" size="lg" className="mx-auto text-gray-400 mb-4" />
          <TextAtom variant="h3" className="text-gray-500 mb-2">
            No Reports Found
          </TextAtom>
          <TextAtom className="text-gray-400">
            Completed charting sessions will appear here
          </TextAtom>
        </CardAtom>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div
              key={report.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Report Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50">
                    <DynamicIconAtom name="FileText" size="md" className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <TextAtom variant="body" weight="semibold">
                        {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                      </TextAtom>
                      <TextAtom variant="small" className="text-gray-500">
                        {format(new Date(report.sessionStartTime), 'h:mm a')} -{' '}
                        {format(new Date(report.sessionEndTime), 'h:mm a')}
                      </TextAtom>
                    </div>
                    <TextAtom variant="small" className="text-gray-600">
                      {report.cnaName || 'Not specified'} • {report.totalResidents} residents •{' '}
                      {report.totalActivities} activities
                    </TextAtom>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <ButtonAtom
                    variant="outline"
                    onClick={() => window.open(`/api/reports/${report.id}/pdf`, '_blank')}
                  >
                    <DynamicIconAtom name="Eye" size="sm" className="mr-2" />
                    View
                  </ButtonAtom>
                  <ButtonAtom
                    variant="outline"
                    onClick={() => handleDownload(report.id, report.reportDate)}
                  >
                    <DynamicIconAtom name="Download" size="sm" />
                  </ButtonAtom>
                  <ButtonAtom
                    variant="ghost"
                    onClick={() => handleDelete(report.id, report.reportDate)}
                  >
                    <DynamicIconAtom name="Trash2" size="sm" className="text-red-500" />
                  </ButtonAtom>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
