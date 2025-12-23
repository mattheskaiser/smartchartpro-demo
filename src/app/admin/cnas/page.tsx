'use client';
import { useState } from 'react';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { AddCNAModalMolecule } from '@/components/molecules/cna/AddCNAModal.molecule';
import { CNACardMolecule } from '@/components/molecules/cna/CNACard.molecule';
import { useCNAs, useCreateCNA } from '@/hooks/useCNAs';

export default function CNAManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Use TanStack Query hooks
  const { data: cnas = [], isLoading, error } = useCNAs();
  const createCNAMutation = useCreateCNA();

  const handleAddCNA = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitCNA = async (formData: {
    name: string;
    email: string;
    phone?: string;
    certificationNumber?: string;
    hireDate?: string;
    notes?: string;
  }) => {
    try {
      await createCNAMutation.mutateAsync(formData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating CNA:', error);
      // Error is already handled by the mutation
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <TextAtom variant="h1" weight="semibold">
            CNA Management
          </TextAtom>
          <TextAtom variant="small" color="muted" className="mt-2">
            Manage certified nursing assistants, their schedules, and resident assignments
          </TextAtom>
        </div>
        {/* Hide Add button only when loading */}
        {!isLoading && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <ButtonAtom variant="primary" onClick={handleAddCNA}>
              <DynamicIconAtom name="Plus" size="sm" className="-ml-0.5 mr-1.5" />
              Add CNA
            </ButtonAtom>
          </div>
        )}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingStateMolecule message="Loading CNAs..." />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyStateMolecule
              iconName="UserRound"
              title="Error loading CNAs"
              description="There was an error loading the CNAs. Please try refreshing the page."
            />
          </div>
        ) : cnas.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyStateMolecule
              iconName="UserRound"
              title="No CNAs found"
              description="Get started by adding certified nursing assistants to your team. You can manage their schedules, resident assignments, and contact information."
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cnas.map(cna => (
              <CNACardMolecule key={cna.id} cna={cna} />
            ))}
          </div>
        )}
      </div>

      <AddCNAModalMolecule
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitCNA}
        isLoading={createCNAMutation.isPending}
      />
    </div>
  );
}
