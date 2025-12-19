import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resizeImage } from '@/lib/imageUpload';
import { Resident } from '@/types/resident';

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
const fetchResidents = async (): Promise<Resident[]> => {
  const response = await fetch('/api/residents');
  if (!response.ok) {
    throw new Error('Failed to fetch residents');
  }
  return response.json();
};

const createResident = async (data: CreateResidentData): Promise<Resident> => {
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

// Hooks
export const useResidents = () => {
  return useQuery({
    queryKey: ['residents'],
    queryFn: fetchResidents,
  });
};

export const useResident = (id: string) => {
  return useQuery({
    queryKey: ['residents', id],
    queryFn: () => fetchResident(id),
    enabled: !!id,
  });
};

export const useCreateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResident,
    onSuccess: newResident => {
      // Update the residents list cache
      queryClient.setQueryData(['residents'], (old: Resident[] = []) => [newResident, ...old]);

      // Invalidate and refetch residents list
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
    onError: error => {
      console.error('Error creating resident:', error);
    },
  });
};

export const useUpdateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResident,
    onSuccess: (updatedResident, variables) => {
      // Invalidate and refetch the specific resident to get updated related data
      queryClient.invalidateQueries({ queryKey: ['residents', variables.id] });

      // Update the residents list cache
      queryClient.setQueryData(['residents'], (old: Resident[] = []) =>
        old.map(resident => (resident.id === updatedResident.id ? updatedResident : resident))
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
    onError: error => {
      console.error('Error updating resident:', error);
    },
  });
};
