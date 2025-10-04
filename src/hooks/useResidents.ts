import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
interface CreateResidentData {
  name: string;
  room: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface Allergy {
  id: string;
  residentId: string;
  name: string;
  severity: string;
  reaction?: string;
  createdAt: string;
  updatedAt: string;
}

interface Condition {
  id: string;
  residentId: string;
  name: string;
  diagnosedDate?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Medication {
  id: string;
  residentId: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  status: string;
  discontinuedReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface Specialist {
  id: string;
  residentId: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface DNRStatus {
  id: string;
  residentId: string;
  hasDNR: boolean;
  hasDNI: boolean;
  dnrDate?: string;
  dniDate?: string;
  physicianName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Resident {
  id: string;
  name: string;
  room: string;
  status: string;
  imageUrl: string;
  dateOfBirth?: string;
  admissionDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  assignedCNA?: string;
  notes?: string;
  adlNeeds?: string[];
  createdAt: string;
  updatedAt: string;
  // Related models (included when fetching individual resident)
  allergies?: Allergy[];
  conditions?: Condition[];
  medications?: Medication[];
  specialists?: Specialist[];
  dnrStatus?: DNRStatus;
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

const updateResident = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Resident>;
}): Promise<Resident> => {
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
