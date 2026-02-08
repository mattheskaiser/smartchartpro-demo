import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resizeImage } from '@/lib/imageUpload';
import { Resident } from '@/types/resident';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';
import { toast } from '@/lib/toast';

// Types
interface CreateResidentData {
  name: string;
  room: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  imageFile?: File;
  imageData?: string;
}

// API functions
const fetchResidents = async (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  assignedCNA?: string;
}): Promise<{
  residents: Resident[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.assignedCNA) params.append('assignedCNA', filters.assignedCNA);

  const response = await fetch(`/api/residents?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch residents');
  }
  return response.json();
};

const createResident = async (data: CreateResidentData): Promise<Resident> => {
  // Block in demo mode
  if (isDemoMode()) {
    toast({
      title: 'Demo Mode',
      description: getDemoMessage('actionNotPersisted'),
      type: 'info',
    });
    throw new Error('Demo mode: Changes not persisted');
  }

  let imageData = data.imageData || '';

  // Convert image to base64 if provided and no imageData exists
  if (data.imageFile && !imageData) {
    try {
      imageData = await resizeImage(data.imageFile);
    } catch (error) {
      console.error('Failed to process image:', error);
      // Continue without image if processing fails
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile: _, imageData: __, ...residentData } = data;
  const payload = {
    ...residentData,
    imageData,
  };

  const response = await fetch('/api/residents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create resident');
  }

  return response.json();
};

const fetchResident = async (id: string): Promise<Resident> => {
  const response = await fetch(`/api/residents/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch resident');
  }
  return response.json();
};

const updateResident = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Resident> & { imageFile?: File };
}): Promise<Resident> => {
  // Block in demo mode
  if (isDemoMode()) {
    toast({
      title: 'Demo Mode',
      description: getDemoMessage('actionNotPersisted'),
      type: 'info',
    });
    throw new Error('Demo mode: Changes not persisted');
  }

  let updateData = { ...data };

  // Handle image file if provided
  if (data.imageFile) {
    try {
      const imageData = await resizeImage(data.imageFile);
      updateData = { ...updateData, imageUrl: imageData };
      // Remove imageFile from the data sent to API
      delete updateData.imageFile;
    } catch (error) {
      console.error('Failed to process image:', error);
      // Continue without image if processing fails
      delete updateData.imageFile;
    }
  }

  const response = await fetch(`/api/residents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error('Failed to update resident');
  }

  return response.json();
};

const deleteResident = async (id: string): Promise<void> => {
  // Block in demo mode
  if (isDemoMode()) {
    toast({
      title: 'Demo Mode',
      description: getDemoMessage('actionNotPersisted'),
      type: 'info',
    });
    throw new Error('Demo mode: Changes not persisted');
  }

  const response = await fetch(`/api/residents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete resident');
  }
};

// Hooks
export const useResidents = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  assignedCNA?: string;
}) => {
  return useQuery({
    queryKey: ['residents', filters],
    queryFn: () => fetchResidents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useResident = (id: string) => {
  return useQuery({
    queryKey: ['residents', id],
    queryFn: () => fetchResident(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResident,
    onSuccess: newResident => {
      // Update the residents list cache - handle paginated response
      queryClient.setQueryData(
        ['residents', undefined],
        (
          old:
            | {
              residents: Resident[];
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
              residents: [newResident],
              pagination: { page: 1, limit: 100, totalCount: 1, totalPages: 1, hasMore: false },
            };
          return {
            ...old,
            residents: [newResident, ...old.residents],
            pagination: {
              ...old.pagination,
              totalCount: old.pagination.totalCount + 1,
            },
          };
        }
      );

      // Invalidate to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
};

export const useUpdateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResident,
    onSuccess: (updatedResident, variables) => {
      // Immediately update the specific resident cache with the response data
      queryClient.setQueryData(['residents', variables.id], updatedResident);

      // Update the residents list cache - handle paginated response
      queryClient.setQueryData(
        ['residents', undefined],
        (
          old:
            | {
              residents: Resident[];
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
          if (!old) return old;
          return {
            ...old,
            residents: old.residents.map((resident: Resident) =>
              resident.id === updatedResident.id ? updatedResident : resident
            ),
          };
        }
      );

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
};

export const useDeleteResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResident,
    onSuccess: (_, deletedId) => {
      // Remove from residents list cache - handle paginated response
      queryClient.setQueryData(
        ['residents', undefined],
        (
          old:
            | {
              residents: Resident[];
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
          if (!old) return old;
          return {
            ...old,
            residents: old.residents.filter((resident: Resident) => resident.id !== deletedId),
            pagination: {
              ...old.pagination,
              totalCount: old.pagination.totalCount - 1,
            },
          };
        }
      );

      // Remove the specific resident cache
      queryClient.removeQueries({ queryKey: ['residents', deletedId] });

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
};
