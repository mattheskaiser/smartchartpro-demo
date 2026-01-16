import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChartingReport,
  CreateChartingReportData,
  UpdateChartingReportData,
} from '@/types/chartingReport';

// API functions
const fetchReports = async (filters?: {
  status?: string;
  cnaId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ChartingReport[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.cnaId) params.append('cnaId', filters.cnaId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const response = await fetch(`/api/reports?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  return response.json();
};

const fetchReport = async (id: string): Promise<ChartingReport> => {
  const response = await fetch(`/api/reports/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch report');
  }
  return response.json();
};

const createReport = async (data: CreateChartingReportData): Promise<ChartingReport> => {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create report');
  }

  return response.json();
};

const updateReport = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateChartingReportData;
}): Promise<ChartingReport> => {
  const response = await fetch(`/api/reports/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update report');
  }

  return response.json();
};

const deleteReport = async (id: string): Promise<void> => {
  const response = await fetch(`/api/reports/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete report');
  }
};

// Hooks
export const useChartingReports = (filters?: {
  status?: string;
  cnaId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['charting-reports', filters],
    queryFn: () => fetchReports(filters),
  });
};

export const useChartingReport = (id: string) => {
  return useQuery({
    queryKey: ['charting-reports', id],
    queryFn: () => fetchReport(id),
    enabled: !!id,
  });
};

export const useCreateChartingReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: newReport => {
      // Update the reports list cache
      queryClient.setQueryData(['charting-reports'], (old: ChartingReport[] = []) => [
        newReport,
        ...old,
      ]);

      // Invalidate and refetch reports list
      queryClient.invalidateQueries({ queryKey: ['charting-reports'] });
    },
    onError: error => {
      console.error('Error creating report:', error);
    },
  });
};

export const useUpdateChartingReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReport,
    onSuccess: (updatedReport, { id }) => {
      // Update the specific report cache
      queryClient.setQueryData(['charting-reports', id], updatedReport);

      // Invalidate reports list to refetch
      queryClient.invalidateQueries({ queryKey: ['charting-reports'] });
    },
    onError: error => {
      console.error('Error updating report:', error);
    },
  });
};

export const useDeleteChartingReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['charting-reports', id] });

      // Invalidate reports list to refetch
      queryClient.invalidateQueries({ queryKey: ['charting-reports'] });
    },
    onError: error => {
      console.error('Error deleting report:', error);
    },
  });
};
