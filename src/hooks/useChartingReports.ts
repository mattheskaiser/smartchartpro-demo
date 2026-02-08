import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChartingReport,
  CreateChartingReportData,
  UpdateChartingReportData,
} from '@/types/chartingReport';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';
import { toast } from '@/lib/toast';

// API functions
const fetchReports = async (filters?: {
  status?: string;
  cnaId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  includeDetails?: boolean;
}): Promise<{
  reports: ChartingReport[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.cnaId) params.append('cnaId', filters.cnaId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.includeDetails) params.append('includeDetails', 'true');

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
  // In demo mode, return mock data without API call
  if (isDemoMode()) {
    setTimeout(() => {
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'error',
      });
    }, 100);

    return {
      id: `report_demo_${Date.now()}`,
      ...data,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ChartingReport;
  }

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
  // In demo mode, return mock updated data without API call
  if (isDemoMode()) {
    setTimeout(() => {
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'error',
      });
    }, 100);

    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    } as ChartingReport;
  }

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
  // In demo mode, simulate successful deletion without API call
  if (isDemoMode()) {
    setTimeout(() => {
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'error',
      });
    }, 100);
    return;
  }

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
  page?: number;
  limit?: number;
  includeDetails?: boolean;
}) => {
  return useQuery({
    queryKey: ['charting-reports', filters],
    queryFn: () => fetchReports(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (reports change frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useChartingReport = (id: string) => {
  return useQuery({
    queryKey: ['charting-reports', id],
    queryFn: () => fetchReport(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateChartingReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: newReport => {
      // Update the reports list cache - handle paginated response
      queryClient.setQueryData(
        ['charting-reports', undefined],
        (
          old:
            | {
              reports: ChartingReport[];
              pagination: {
                page: number;
                limit: number;
                totalCount: number;
                totalPages: number;
                hasMore: boolean;
              };
            }
            | undefined
        ) => {
          if (!old)
            return {
              reports: [newReport],
              pagination: { page: 1, limit: 50, totalCount: 1, totalPages: 1, hasMore: false },
            };
          return {
            ...old,
            reports: [newReport, ...old.reports],
            pagination: {
              ...old.pagination,
              totalCount: old.pagination.totalCount + 1,
            },
          };
        }
      );

      // Invalidate to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['charting-reports'] });
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

      // Invalidate to refetch lists
      queryClient.invalidateQueries({ queryKey: ['charting-reports'] });
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

      // Invalidate to refetch lists
      queryClient.invalidateQueries({ queryKey: ['charting-reports'] });
    },
  });
};
