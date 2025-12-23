import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  });
};

export const useShift = (id: string) => {
  return useQuery({
    queryKey: ['shifts', id],
    queryFn: () => fetchShift(id),
    enabled: !!id,
  });
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShift,
    onSuccess: newShift => {
      // Invalidate shifts queries
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
    onError: error => {
      console.error('Error creating shift:', error);
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
    onError: error => {
      console.error('Error updating shift:', error);
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
    onError: error => {
      console.error('Error deleting shift:', error);
    },
  });
};
