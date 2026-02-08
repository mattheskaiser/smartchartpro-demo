import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CNA, CreateCNAData } from '@/types/cna';
import { resizeImage } from '@/lib/imageUpload';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';
import { toast } from '@/lib/toast';

// API functions
const fetchCNAs = async (): Promise<CNA[]> => {
  const response = await fetch('/api/cnas');
  if (!response.ok) {
    throw new Error('Failed to fetch CNAs');
  }
  return response.json();
};

const createCNA = async (data: CreateCNAData): Promise<CNA> => {
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
      id: `cna_demo_${Date.now()}`,
      name: data.name,
      email: data.email,
      certificationNumber: data.certificationNumber,
      phone: data.phone,
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as CNA;
  }

  let imageData = '';

  // Convert image to base64 if provided
  if (data.imageFile) {
    try {
      imageData = await resizeImage(data.imageFile);
    } catch (error) {
      console.error('Failed to process image:', error);
      // Continue without image if processing fails
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile: _, ...cnaData } = data;
  const payload = {
    ...cnaData,
    imageData,
  };

  const response = await fetch('/api/cnas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create CNA');
  }

  return response.json();
};

const fetchCNA = async (id: string): Promise<CNA> => {
  const response = await fetch(`/api/cnas/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch CNA');
  }
  return response.json();
};

const updateCNA = async ({ id, data }: { id: string; data: Partial<CNA> }): Promise<CNA> => {
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
    } as CNA;
  }

  const response = await fetch(`/api/cnas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update CNA');
  }

  return response.json();
};

const deleteCNA = async (id: string): Promise<void> => {
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

  const response = await fetch(`/api/cnas/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete CNA');
  }
};

// Hooks
export const useCNAs = () => {
  return useQuery({
    queryKey: ['cnas'],
    queryFn: fetchCNAs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCNA = (id: string) => {
  return useQuery({
    queryKey: ['cnas', id],
    queryFn: () => fetchCNA(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCNA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCNA,
    onSuccess: newCNA => {
      // Update the CNAs list cache
      queryClient.setQueryData(['cnas'], (old: CNA[] = []) => [newCNA, ...old]);

      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ['cnas'] });
    },
  });
};

export const useUpdateCNA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCNA,
    onSuccess: (updatedCNA, variables) => {
      // Invalidate and refetch the specific CNA
      queryClient.invalidateQueries({ queryKey: ['cnas', variables.id] });

      // Update the CNAs list cache
      queryClient.setQueryData(['cnas'], (old: CNA[] = []) =>
        old.map(cna => (cna.id === updatedCNA.id ? updatedCNA : cna))
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['cnas'] });
    },
  });
};

export const useDeleteCNA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCNA,
    onSuccess: (_, deletedId) => {
      // Remove from CNAs list cache
      queryClient.setQueryData(['cnas'], (old: CNA[] = []) =>
        old.filter(cna => cna.id !== deletedId)
      );

      // Remove the specific CNA cache
      queryClient.removeQueries({ queryKey: ['cnas', deletedId] });

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['cnas'] });
    },
  });
};

// CNA Availability hooks
const fetchCNAAvailability = async (cnaId: string): Promise<{ [key: string]: string[] }> => {
  const response = await fetch(`/api/cnas/${cnaId}/availability`);
  if (!response.ok) {
    throw new Error('Failed to fetch CNA availability');
  }
  return response.json();
};

const updateCNAAvailability = async ({
  cnaId,
  availability,
}: {
  cnaId: string;
  availability: { [key: string]: string[] };
}): Promise<{ [key: string]: string[] }> => {
  // In demo mode, return the availability data without API call
  if (isDemoMode()) {
    setTimeout(() => {
      toast({
        title: 'Changes Not Saved',
        description: getDemoMessage('actionNotPersisted'),
        type: 'warning',
      });
    }, 100);
    return availability;
  }

  const response = await fetch(`/api/cnas/${cnaId}/availability`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(availability),
  });

  if (!response.ok) {
    throw new Error('Failed to update CNA availability');
  }

  return response.json();
};

export const useCNAAvailability = (cnaId: string) => {
  return useQuery({
    queryKey: ['cnas', cnaId, 'availability'],
    queryFn: () => fetchCNAAvailability(cnaId),
    enabled: !!cnaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateCNAAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCNAAvailability,
    onSuccess: (updatedAvailability, variables) => {
      // Update the availability cache
      queryClient.setQueryData(['cnas', variables.cnaId, 'availability'], updatedAvailability);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};
