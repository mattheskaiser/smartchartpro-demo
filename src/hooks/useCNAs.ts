import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CNA, CreateCNAData } from '@/types/cna';

// API functions
const fetchCNAs = async (): Promise<CNA[]> => {
    const response = await fetch('/api/cnas');
    if (!response.ok) {
        throw new Error('Failed to fetch CNAs');
    }
    return response.json();
};

const createCNA = async (data: CreateCNAData): Promise<CNA> => {
    const response = await fetch('/api/cnas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

const updateCNA = async ({
    id,
    data,
}: {
    id: string;
    data: Partial<CNA>;
}): Promise<CNA> => {
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

// Hooks
export const useCNAs = () => {
    return useQuery({
        queryKey: ['cnas'],
        queryFn: fetchCNAs,
    });
};

export const useCNA = (id: string) => {
    return useQuery({
        queryKey: ['cnas', id],
        queryFn: () => fetchCNA(id),
        enabled: !!id,
    });
};

export const useCreateCNA = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCNA,
        onSuccess: newCNA => {
            // Update the CNAs list cache
            queryClient.setQueryData(['cnas'], (old: CNA[] = []) => [newCNA, ...old]);

            // Invalidate and refetch CNAs list
            queryClient.invalidateQueries({ queryKey: ['cnas'] });
        },
        onError: error => {
            console.error('Error creating CNA:', error);
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
        onError: error => {
            console.error('Error updating CNA:', error);
        },
    });
};