import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';
import { toast } from '@/lib/toast';

// Types
interface ShiftAssignment {
  id: string;
  date: string;
  shiftType: string;
  cnaId?: string;
  status: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  cna?: {
    id: string;
    name: string;
    email: string;
    imageData?: string;
  };
  residentAssignments: {
    id: string;
    resident: {
      id: string;
      name: string;
      room: string;
      imageData?: string;
      adlNeeds: string[];
    };
  }[];
}

interface CreateShiftData {
  date: string;
  shiftType: string;
  cnaId?: string;
  residentIds?: string[];
  notes?: string;
}

interface UpdateShiftData {
  cnaId?: string;
  residentIds?: string[];
  notes?: string;
  status?: string;
}

// API functions
const fetchShifts = async (params?: {
  date?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ShiftAssignment[]> => {
  const searchParams = new URLSearchParams();
  if (params?.date) searchParams.append('date', params.date);
  if (params?.startDate) searchParams.append('startDate', params.startDate);
  if (params?.endDate) searchParams.append('endDate', params.endDate);

  const response = await fetch(`/api/shifts?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shifts');
  }
  return response.json();
};

const fetchShift = async (id: string): Promise<ShiftAssignment> => {
  const response = await fetch(`/api/shifts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shift');
  }
  return response.json();
};

const createShift = async (data: CreateShiftData): Promise<ShiftAssignment> => {
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
      id: `shift_demo_${Date.now()}`,
      date: data.date,
      shiftType: data.shiftType,
      cnaId: data.cnaId,
      status: 'scheduled',
      residentAssignments: [],
    } as ShiftAssignment;
  }

  const response = await fetch('/api/shifts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create shift');
  }

  return response.json();
};

const updateShift = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateShiftData;
}): Promise<ShiftAssignment> => {
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
    } as ShiftAssignment;
  }

  const response = await fetch(`/api/shifts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update shift');
  }

  return response.json();
};

const deleteShift = async (id: string): Promise<void> => {
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

  const response = await fetch(`/api/shifts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete shift');
  }
};

// Hooks
export const useShifts = (params?: { date?: string; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['shifts', params],
    queryFn: () => fetchShifts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (shifts change frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useShift = (id: string) => {
  return useQuery({
    queryKey: ['shifts', id],
    queryFn: () => fetchShift(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShift,
    onSuccess: () => {
      // Invalidate shifts queries
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShift,
    onSuccess: (updatedShift, variables) => {
      // Update the specific shift cache
      queryClient.setQueryData(['shifts', variables.id], updatedShift);

      // Invalidate shifts queries
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShift,
    onSuccess: (_, deletedId) => {
      // Remove the specific shift cache
      queryClient.removeQueries({ queryKey: ['shifts', deletedId] });

      // Invalidate shifts queries
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};
