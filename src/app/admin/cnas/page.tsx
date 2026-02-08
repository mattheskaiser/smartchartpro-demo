'use client';
import { useState } from 'react';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { AddCNAModalMolecule } from '@/components/molecules/cna/AddCNAModal.molecule';
import { CNACardMolecule } from '@/components/molecules/cna/CNACard.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { useCNAs, useCreateCNA } from '@/hooks/useCNAs';
import { toast } from '@/lib/toast';
import { isDemoMode } from '@/lib/demo-config';

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

      // Only show success toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'CNA created successfully',
          description: `${formData.name} has been added to your team`,
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error creating CNA:', error);

      // Only show error toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'Failed to create CNA',
          description: 'There was an error creating the CNA. Please try again.',
          type: 'error',
        });
      }
    }
  };

  return (
    <AdminPageLayoutTemplate
      title="CNA Management"
      subtitle="Manage certified nursing assistants, their schedules, and resident assignments"
      actionButton={
        !isLoading
          ? {
            label: 'Add CNA',
            onClick: handleAddCNA,
            icon: 'Plus',
            variant: 'primary',
          }
          : undefined
      }
    >
      {isLoading ? (
        <PageLoaderMolecule message="Loading CNAs..." />
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
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {cnas.map(cna => (
            <CNACardMolecule key={cna.id} cna={cna} />
          ))}
        </div>
      )}

      <AddCNAModalMolecule
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitCNA}
        isLoading={createCNAMutation.isPending}
      />
    </AdminPageLayoutTemplate>
  );
}
