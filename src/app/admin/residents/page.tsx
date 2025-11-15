'use client';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { AddResidentModalMolecule } from '@/components/molecules/resident/modals/AddResidentModal.molecule';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { useResidents, useCreateResident } from '@/hooks/useResidents';
import { ResidentCardMolecule } from '@/components/molecules/resident/ResidentCard.molecule';

export default function ResidentManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Use TanStack Query hooks
  const { data: residents = [], isLoading, error } = useResidents();
  const createResidentMutation = useCreateResident();

  const handleAddResident = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitResident = async (formData: any) => {
    try {
      await createResidentMutation.mutateAsync(formData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating resident:', error);
      // Error is already handled by the mutation
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <TextAtom variant="h1" weight="semibold">
            Resident Management
          </TextAtom>
          <TextAtom variant="small" color="muted" className="mt-2">
            Manage residents, their care levels, and CNA assignments
          </TextAtom>
        </div>
        {/* Hide Add button only when loading */}
        {!isLoading && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <ButtonAtom variant="primary" onClick={handleAddResident}>
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Resident
            </ButtonAtom>
          </div>
        )}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingStateMolecule message="Loading residents..." />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyStateMolecule
              icon={UserGroupIcon}
              title="Error loading residents"
              description="There was an error loading the residents. Please try refreshing the page."
            />
          </div>
        ) : residents.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyStateMolecule
              icon={UserGroupIcon}
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
      </div>

      <AddResidentModalMolecule
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitResident}
        isLoading={createResidentMutation.isPending}
      />
    </div>
  );
}
