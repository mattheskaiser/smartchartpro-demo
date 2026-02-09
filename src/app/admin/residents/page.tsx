'use client';
import { useState } from 'react';
import { AddResidentModalMolecule } from '@/components/molecules/resident/modals/AddResidentModal.molecule';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { useResidents, useCreateResident } from '@/hooks/useResidents';
import { ResidentCardMolecule } from '@/components/molecules/resident/ResidentCard.molecule';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { toast } from '@/lib/toast';
import { isDemoMode } from '@/lib/demo-config';

// Skeleton loading component for resident cards
const ResidentCardSkeleton = () => (
  <div className="flex flex-col gap-y-8 relative p-6 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <AvatarAtom src={undefined} alt="Loading..." size="lg" showSkeleton={true} />
        <div className="space-y-2">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-x-2 items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-1 flex-1">
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
    <div className="w-full h-9 bg-gray-200 rounded animate-pulse" />
  </div>
);

export default function ResidentManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Use TanStack Query hooks
  const { data, isLoading, error } = useResidents();
  const residents = data?.residents || [];
  const createResidentMutation = useCreateResident();

  const handleAddResident = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitResident = async (formData: {
    name: string;
    room: string;
    dateOfBirth: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    imageFile?: File;
    imageData?: string;
  }) => {
    try {
      await createResidentMutation.mutateAsync(formData);
      setIsAddModalOpen(false);

      // Only show success toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'Resident created successfully',
          description: `${formData.name} has been added to the system`,
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error creating resident:', error);

      // Only show error toast if not in demo mode (demo mode shows its own toast)
      if (!isDemoMode()) {
        toast({
          title: 'Failed to create resident',
          description: 'There was an error creating the resident. Please try again.',
          type: 'error',
        });
      }
    }
  };

  return (
    <AdminPageLayoutTemplate
      title="Resident Management"
      subtitle="Manage residents, their care levels, and CNA assignments"
      actionButton={
        !isLoading
          ? {
              label: 'Add Resident',
              onClick: handleAddResident,
              icon: 'Plus',
              variant: 'primary',
            }
          : undefined
      }
    >
      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ResidentCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <EmptyStateMolecule
            iconName="Users"
            title="Error loading residents"
            description="There was an error loading the residents. Please try refreshing the page."
          />
        </div>
      ) : residents.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <EmptyStateMolecule
            iconName="Users"
            title="No residents found"
            description="Get started by adding your first resident to the system. You can manage their care levels, medical information, and CNA assignments."
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {residents.map(resident => (
            <ResidentCardMolecule key={resident.id} resident={resident} />
          ))}
        </div>
      )}

      <AddResidentModalMolecule
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitResident}
        isLoading={createResidentMutation.isPending}
      />
    </AdminPageLayoutTemplate>
  );
}
