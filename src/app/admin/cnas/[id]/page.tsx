'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { ConfirmationModalMolecule } from '@/components/molecules/ConfirmationModal.molecule';
import { CNAAvailabilityMolecule } from '@/components/molecules/cna/CNAAvailability.molecule';
import {
  useCNA,
  useUpdateCNA,
  useDeleteCNA,
  useCNAAvailability,
  useUpdateCNAAvailability,
} from '@/hooks/useCNAs';
import { EditCNAModalMolecule } from '@/components/molecules/cna/EditCNAModal.molecule';

export default function CNADetailPage() {
  const params = useParams();
  const router = useRouter();
  const cnaId = params.id as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [localAvailability, setLocalAvailability] = useState<{ [key: string]: string[] }>({});

  const { data: cna, isLoading, error } = useCNA(cnaId);
  const { data: availability = {} } = useCNAAvailability(cnaId);
  const updateCNAMutation = useUpdateCNA();
  const deleteCNAMutation = useDeleteCNA();
  const updateAvailabilityMutation = useUpdateCNAAvailability();

  // Sync local availability with fetched data when not editing
  React.useEffect(() => {
    if (!isEditingAvailability && availability) {
      setLocalAvailability(availability);
    }
  }, [availability, isEditingAvailability]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingStateMolecule message="Loading CNA details..." />
      </div>
    );
  }

  if (error || !cna) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyStateMolecule
          iconName="UserRound"
          title="CNA not found"
          description="The CNA you're looking for doesn't exist or has been removed."
        />
      </div>
    );
  }

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleEditSubmit = async (formData: {
    name: string;
    email: string;
    phone?: string;
    certificationNumber?: string;
    hireDate?: string;
    notes?: string;
    imageFile?: File;
    imageUrl?: string;
  }) => {
    try {
      await updateCNAMutation.mutateAsync({
        id: cnaId,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          certificationNumber: formData.certificationNumber,
          hireDate: formData.hireDate,
          notes: formData.notes,
          imageData: formData.imageUrl,
        },
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating CNA:', error);
    }
  };

  const handleDeleteCNA = async () => {
    try {
      await deleteCNAMutation.mutateAsync(cnaId);
      // Navigate back to CNAs list after successful deletion
      router.push('/admin/cnas');
    } catch (error) {
      console.error('Error deleting CNA:', error);
      // Error is already handled by the mutation
    }
  };

  const handleAvailabilityChange = (newAvailability: { [key: string]: string[] }) => {
    // Only update local state, don't save to API yet
    setLocalAvailability(newAvailability);
  };

  const handleSaveAvailability = async () => {
    try {
      await updateAvailabilityMutation.mutateAsync({
        cnaId,
        availability: localAvailability,
      });
      setIsEditingAvailability(false);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleCancelAvailabilityEdit = () => {
    // Revert to original availability
    setLocalAvailability(availability);
    setIsEditingAvailability(false);
  };

  const handleStartAvailabilityEdit = () => {
    // Initialize local state with current availability
    setLocalAvailability(availability);
    setIsEditingAvailability(true);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <ButtonAtom variant="ghost" onClick={() => router.back()} className="p-2">
              <DynamicIconAtom name="ArrowLeft" size="md" />
            </ButtonAtom>
            <TextAtom variant="h1" weight="semibold">
              CNA Details
            </TextAtom>
          </div>
          <div className="flex items-center gap-3">
            <ButtonAtom variant="delete" onClick={() => setShowDeleteModal(true)}>
              <DynamicIconAtom name="Trash2" size="sm" className="mr-2" />
              Delete CNA
            </ButtonAtom>
            <ButtonAtom variant="primary" onClick={() => setIsEditModalOpen(true)}>
              <DynamicIconAtom name="Pencil" size="sm" className="mr-2" />
              Edit CNA
            </ButtonAtom>
          </div>
        </div>
      </div>

      {/* CNA Profile */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <CardAtom className="p-6">
            <div className="flex items-start gap-6">
              <AvatarAtom src={cna.imageData} alt={cna.name} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TextAtom variant="h2" weight="semibold">
                    {cna.name}
                  </TextAtom>
                  <BadgeAtom variant={getStatusColor(cna.status)}>{cna.status}</BadgeAtom>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <TextAtom variant="small" color="muted">
                      Email
                    </TextAtom>
                    <TextAtom variant="body" weight="medium">
                      {cna.email}
                    </TextAtom>
                  </div>
                  {cna.phone && (
                    <div>
                      <TextAtom variant="small" color="muted">
                        Phone
                      </TextAtom>
                      <TextAtom variant="body" weight="medium">
                        {cna.phone}
                      </TextAtom>
                    </div>
                  )}
                  {cna.certificationNumber && (
                    <div>
                      <TextAtom variant="small" color="muted">
                        Certification Number
                      </TextAtom>
                      <TextAtom variant="body" weight="medium">
                        {cna.certificationNumber}
                      </TextAtom>
                    </div>
                  )}
                  {cna.hireDate && (
                    <div>
                      <TextAtom variant="small" color="muted">
                        Hire Date
                      </TextAtom>
                      <TextAtom variant="body" weight="medium">
                        {new Date(cna.hireDate).toLocaleDateString()}
                      </TextAtom>
                    </div>
                  )}
                </div>
                {cna.notes && (
                  <div className="mt-4">
                    <TextAtom variant="small" color="muted">
                      Notes
                    </TextAtom>
                    <TextAtom variant="body" className="mt-1">
                      {cna.notes}
                    </TextAtom>
                  </div>
                )}
              </div>
            </div>
          </CardAtom>

          {/* Availability Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <TextAtom variant="h2" weight="semibold" className="text-gray-900">
                Shift Availability
              </TextAtom>
              {!isEditingAvailability ? (
                <ButtonAtom variant="secondary" onClick={handleStartAvailabilityEdit}>
                  <DynamicIconAtom name="Pencil" size="sm" className="mr-2" />
                  Edit Availability
                </ButtonAtom>
              ) : (
                <div className="flex items-center gap-2">
                  <ButtonAtom
                    variant="ghost"
                    onClick={handleCancelAvailabilityEdit}
                    disabled={updateAvailabilityMutation.isPending}
                  >
                    Cancel
                  </ButtonAtom>
                  <ButtonAtom
                    variant="primary"
                    onClick={handleSaveAvailability}
                    isLoading={updateAvailabilityMutation.isPending}
                    loadingText="Saving..."
                  >
                    <DynamicIconAtom name="Check" size="sm" className="mr-2" />
                    Save Changes
                  </ButtonAtom>
                </div>
              )}
            </div>
            <CNAAvailabilityMolecule
              availability={localAvailability}
              isEditing={isEditingAvailability}
              onAvailabilityChange={handleAvailabilityChange}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <CardAtom className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
                <DynamicIconAtom name="Calendar" size="md" className="text-primary" />
              </div>
              <div>
                <TextAtom variant="small" color="muted">
                  Available Shifts
                </TextAtom>
                <TextAtom variant="h3" weight="semibold">
                  {
                    Object.values(isEditingAvailability ? localAvailability : availability).flat()
                      .length
                  }
                </TextAtom>
              </div>
            </div>
          </CardAtom>

          <CardAtom className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
                <DynamicIconAtom name="Clock" size="md" className="text-primary" />
              </div>
              <div>
                <TextAtom variant="small" color="muted">
                  Status
                </TextAtom>
                <TextAtom variant="h3" weight="semibold">
                  {cna.status}
                </TextAtom>
              </div>
            </div>
          </CardAtom>
        </div>
      </div>

      <EditCNAModalMolecule
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editingCNA={cna}
        isLoading={updateCNAMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModalMolecule
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCNA}
        title="Delete CNA"
        message={`Are you sure you want to delete ${cna.name}? This action cannot be undone and will permanently remove all CNA data including shift history and resident assignments.`}
        confirmText="Delete CNA"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteCNAMutation.isPending}
      />
    </div>
  );
}
