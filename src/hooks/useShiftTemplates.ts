import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  color?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateShiftTemplateData {
  name: string;
  startTime: string;
  endTime: string;
  color?: string;
  description?: string;
  sortOrder?: number;
}

interface UpdateShiftTemplateData {
  name?: string;
  startTime?: string;
  endTime?: string;
  color?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// API functions
const fetchShiftTemplates = async (): Promise<ShiftTemplate[]> => {
  const response = await fetch('/api/shift-templates');
  if (!response.ok) {
    throw new Error('Failed to fetch shift templates');
  }
  return response.json();
};

const fetchShiftTemplate = async (id: string): Promise<ShiftTemplate> => {
  const response = await fetch(`/api/shift-templates/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shift template');
  }
  return response.json();
};

const createShiftTemplate = async (data: CreateShiftTemplateData): Promise<ShiftTemplate> => {
  const response = await fetch('/api/shift-templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create shift template');
  }

  return response.json();
};

const updateShiftTemplate = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateShiftTemplateData;
}): Promise<ShiftTemplate> => {
  const response = await fetch(`/api/shift-templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update shift template');
  }

  return response.json();
};

const deleteShiftTemplate = async (id: string): Promise<void> => {
  const response = await fetch(`/api/shift-templates/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete shift template');
  }
};

// Hooks
export const useShiftTemplates = () => {
  return useQuery({
    queryKey: ['shift-templates'],
    queryFn: fetchShiftTemplates,
  });
};

export const useShiftTemplate = (id: string) => {
  return useQuery({
    queryKey: ['shift-templates', id],
    queryFn: () => fetchShiftTemplate(id),
    enabled: !!id,
  });
};

export const useCreateShiftTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShiftTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-templates'] });
    },
    onError: error => {
      console.error('Error creating shift template:', error);
    },
  });
};

export const useUpdateShiftTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShiftTemplate,
    onSuccess: (updatedTemplate, variables) => {
      queryClient.setQueryData(['shift-templates', variables.id], updatedTemplate);
      queryClient.invalidateQueries({ queryKey: ['shift-templates'] });
    },
    onError: error => {
      console.error('Error updating shift template:', error);
    },
  });
};

export const useDeleteShiftTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShiftTemplate,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ['shift-templates', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['shift-templates'] });
    },
    onError: error => {
      console.error('Error deleting shift template:', error);
    },
  });
};

// Utility functions
export const formatShiftTime = (startTime: string, endTime: string): string => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

export const calculateShiftDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  let startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  // Handle overnight shifts
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60; // Add 24 hours
  }

  return (endTotalMinutes - startTotalMinutes) / 60; // Return hours
};
