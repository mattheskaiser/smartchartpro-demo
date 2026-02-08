'use client';
import { useState } from 'react';
import { AddResidentModalMolecule } from '@/components/molecules/resident/modals/AddResidentModal.molecule';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { useResidents, useCreateResident } from '@/hooks/useResidents';
import { ResidentCardMolecule } from '@/components/molecules/resident/ResidentCard.molecule';
import { toast } from '@/lib/toast';

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
      toast({
        title: 'Resident created successfully',
        description: `${formData.name} has been added to the system`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error creating resident:', error);
      toast({
        title: 'Failed to create resident',
        description: 'There was an error creating the resident. Please try again.',
        type: 'error',
      });
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
        <PageLoaderMolecule message="Loading residents..." />
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
