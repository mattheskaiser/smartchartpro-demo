import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
interface CreateResidentData {
    name: string;
    room: string;
    dateOfBirth: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

interface Resident {
    id: string;
    name: string;
    room: string;
    status: string;
    imageUrl: string;
    dateOfBirth?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    createdAt: string;
    updatedAt: string;
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
    const response = await fetch('/api/residents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

const updateResident = async ({ id, data }: { id: string; data: Partial<Resident> }): Promise<Resident> => {
    const response = await fetch(`/api/residents/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
        onSuccess: (newResident) => {
            // Update the residents list cache
            queryClient.setQueryData(['residents'], (old: Resident[] = []) => [newResident, ...old]);

            // Invalidate and refetch residents list
            queryClient.invalidateQueries({ queryKey: ['residents'] });
        },
        onError: (error) => {
            console.error('Error creating resident:', error);
        },
    });
};

export const useUpdateResident = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateResident,
        onSuccess: (updatedResident) => {
            // Update the specific resident cache
            queryClient.setQueryData(['residents', updatedResident.id], updatedResident);

            // Update the residents list cache
            queryClient.setQueryData(['residents'], (old: Resident[] = []) =>
                old.map(resident =>
                    resident.id === updatedResident.id ? updatedResident : resident
                )
            );

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['residents'] });
        },
        onError: (error) => {
            console.error('Error updating resident:', error);
        },
    });
};