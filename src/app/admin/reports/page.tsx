'use client';

import { useChartingReports, useDeleteChartingReport } from '@/hooks/useChartingReports';
import { format } from 'date-fns';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DashboardCardAtom } from '@/components/atoms/DashboardCard.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { toast } from '@/lib/toast';
import { isDemoMode } from '@/lib/demo-config';

export default function ReportsPage() {
  const { data, isLoading, error } = useChartingReports();
  const reports = data?.reports || [];
  const deleteReport = useDeleteChartingReport();

  const handleDelete = async (id: string, reportDate: string | Date) => {
    toast({
      title: 'Demo Mode',
      description: "Report deletion isn't available in demo mode. This is for demonstration purposes only.",
      type: 'warning',
    });
  };

  const handleViewPDF = async (report: any) => {
    try {
      // Open PDF in new tab via API
      window.open(`/api/reports/${report.id}/pdf`, '_blank');
    } catch (error) {
      toast({
        title: 'Failed to open PDF',
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
    return <PageLoaderMolecule message="Loading reports..." />;
  }

  if (error) {
    return (
      <AdminPageLayoutTemplate
        title="Reports"
        subtitle="View and manage generated charting reports"
      >
        <DashboardCardAtom className="text-center">
          <DynamicIconAtom name="TriangleAlert" size="lg" className="mx-auto text-red-500 mb-4" />
          <TextAtom variant="h2" className="text-red-600 mb-2">
            Error Loading Reports
          </TextAtom>
          <TextAtom className="text-gray-600 mb-4">
            There was an error loading the reports. Please try refreshing the page.
          </TextAtom>
          <ButtonAtom onClick={() => window.location.reload()}>
            <DynamicIconAtom name="RefreshCw" size="sm" className="mr-2" />
            Refresh Page
          </ButtonAtom>
        </DashboardCardAtom>
      </AdminPageLayoutTemplate>
    );
  }

  if (reports.length === 0) {
    return (
      <AdminPageLayoutTemplate
        title="Reports"
        subtitle="View and manage generated charting reports"
      >
        <DashboardCardAtom className="text-center py-12">
          <DynamicIconAtom name="FileText" size="lg" className="mx-auto text-gray-400 mb-4" />
          <TextAtom variant="h2" className="text-gray-500 mb-2">
            No Reports Available
          </TextAtom>
          <TextAtom className="text-gray-600 mb-6">
            Reports will appear here once charting data is available and reports are generated.
          </TextAtom>
          <ButtonAtom variant="primary" onClick={() => (window.location.href = '/admin')}>
            <DynamicIconAtom name="TrendingUp" size="sm" className="mr-2" />
            Go to Dashboard
          </ButtonAtom>
        </DashboardCardAtom>
      </AdminPageLayoutTemplate>
    );
  }

  return (
    <AdminPageLayoutTemplate title="Reports" subtitle="View and manage generated charting reports">
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {reports.map(report => (
          <div key={report.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DynamicIconAtom name="FileText" className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <TextAtom variant="body" weight="semibold" className="text-gray-900">
                      Daily Report
                    </TextAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                    </TextAtom>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <TextAtom variant="small" className="text-gray-500">
                    Total Activities
                  </TextAtom>
                  <TextAtom variant="small" weight="medium">
                    {report.totalActivities}
                  </TextAtom>
                </div>
                <div className="flex justify-between">
                  <TextAtom variant="small" className="text-gray-500">
                    Total Residents
                  </TextAtom>
                  <TextAtom variant="small" weight="medium">
                    {report.totalResidents}
                  </TextAtom>
                </div>
                <div className="flex justify-between">
                  <TextAtom variant="small" className="text-gray-500">
                    Generated
                  </TextAtom>
                  <TextAtom variant="small" weight="medium">
                    {format(new Date(report.createdAt), 'h:mm a')}
                  </TextAtom>
                </div>
              </div>

              <div className="flex gap-2">
                <ButtonAtom
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewPDF(report)}
                >
                  <DynamicIconAtom name="Eye" size="sm" className="mr-2" />
                  View
                </ButtonAtom>
                <ButtonAtom
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(report.id, report.reportDate)}
                >
                  <DynamicIconAtom name="Download" size="sm" className="mr-2" />
                  Download
                </ButtonAtom>
                <ButtonAtom
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(report.id, report.reportDate)}
                >
                  <DynamicIconAtom name="Trash2" size="sm" />
                </ButtonAtom>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPageLayoutTemplate>
  );
}
