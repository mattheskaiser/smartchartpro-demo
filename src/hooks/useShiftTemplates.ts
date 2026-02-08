import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';
import { toast } from '@/lib/toast';

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
  // In demo mode, return mock data without API call
  if (isDemoMode()) {
    setTimeout(() => {
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'warning',
      });
    }, 100);

    return {
      id: `template_demo_${Date.now()}`,
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      color: data.color,
      description: data.description,
      sortOrder: data.sortOrder || 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ShiftTemplate;
  }

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
  // In demo mode, return mock updated data without API call
  if (isDemoMode()) {
    setTimeout(() => {
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'warning',
      });
    }, 100);

    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    } as ShiftTemplate;
  }

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
  // In demo mode, simulate successful deletion without API call
  if (isDemoMode()) {
    setTimeout(() => {
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'warning',
      });
    }, 100);
    return;
  }

  const response = await fetch(`/api/shift-templates/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete shift template');
  }
};

// Utility function to calculate sort order based on start time
export const calculateSortOrder = (startTime: string): number => {
  const [hours, minutes] = startTime.split(':').map(Number);
  return hours * 60 + minutes; // Convert to minutes since midnight
};

// Utility function to sort shifts by start time
const sortShiftsByStartTime = (shifts: ShiftTemplate[]): ShiftTemplate[] => {
  return [...shifts].sort((a, b) => {
    // Convert time strings to minutes for comparison
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });
};

// Hooks
export const useShiftTemplates = () => {
  return useQuery({
    queryKey: ['shift-templates'],
    queryFn: async () => {
      const shifts = await fetchShiftTemplates();
      return sortShiftsByStartTime(shifts);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (templates rarely change)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useShiftTemplate = (id: string) => {
  return useQuery({
    queryKey: ['shift-templates', id],
    queryFn: () => fetchShiftTemplate(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCreateShiftTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShiftTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-templates'] });
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
