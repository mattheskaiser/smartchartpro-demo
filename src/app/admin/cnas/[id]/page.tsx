'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { ConfirmationModalMolecule } from '@/components/molecules/ConfirmationModal.molecule';
import { CNAAvailabilityMolecule } from '@/components/molecules/cna/CNAAvailability.molecule';
import { StickyPageHeaderMolecule } from '@/components/molecules/StickyPageHeader.molecule';
import {
  useCNA,
  useUpdateCNA,
  useDeleteCNA,
  useCNAAvailability,
  useUpdateCNAAvailability,
} from '@/hooks/useCNAs';
import { toast } from '@/lib/toast';
import { isDemoMode } from '@/lib/demo-config';
import { resizeImage } from '@/lib/imageUpload';

interface CNAData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  certificationNumber?: string;
  hireDate?: string;
  notes?: string;
  imageData?: string;
  status: string;
}

export default function CNADetailPage() {
  const params = useParams();
  const router = useRouter();
  const cnaId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localAvailability, setLocalAvailability] = useState<{ [key: string]: string[] }>({});
  const [localCNA, setLocalCNA] = useState<CNAData | null>(null);
  const [originalCNA, setOriginalCNA] = useState<CNAData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: cna, isLoading, error } = useCNA(cnaId);
  const { data: availability = {} } = useCNAAvailability(cnaId);
  const updateCNAMutation = useUpdateCNA();
  const deleteCNAMutation = useDeleteCNA();
  const updateAvailabilityMutation = useUpdateCNAAvailability();

  // Sync local CNA data with fetched data when not editing
  useEffect(() => {
    if (cna && !isEditing) {
      setLocalCNA(cna);
      setOriginalCNA(cna);
    }
  }, [cna, isEditing]);

  // Sync local availability with fetched data when not editing
  useEffect(() => {
    if (!isEditing && availability && Object.keys(availability).length > 0) {
      setLocalAvailability(availability);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Define all handlers before early returns
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

  const handleInputChange = (field: keyof CNAData, value: string) => {
    setLocalCNA(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleImageChange = (imageData: string | null) => {
    setLocalCNA(prev => {
      if (!prev) return prev;
      return { ...prev, imageData: imageData || undefined };
    });
  };

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const base64Data = await resizeImage(file);
        handleImageChange(base64Data);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    handleImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!localCNA) return;

    try {
      // Check if basic CNA data changed
      const basicDataChanged =
        originalCNA &&
        (localCNA.name !== originalCNA.name ||
          localCNA.email !== originalCNA.email ||
          localCNA.phone !== originalCNA.phone ||
          localCNA.certificationNumber !== originalCNA.certificationNumber ||
          localCNA.hireDate !== originalCNA.hireDate ||
          localCNA.notes !== originalCNA.notes ||
          localCNA.imageData !== originalCNA.imageData);

      // Update basic CNA data if changed
      if (basicDataChanged) {
        await updateCNAMutation.mutateAsync({
          id: cnaId,
          data: {
            name: localCNA.name,
            email: localCNA.email,
            phone: localCNA.phone,
            certificationNumber: localCNA.certificationNumber,
            hireDate: localCNA.hireDate,
            notes: localCNA.notes,
            imageData: localCNA.imageData,
          },
        });
      }

      // Check if availability changed
      const availabilityChanged =
        JSON.stringify(localAvailability) !== JSON.stringify(availability);

      // Update availability if changed
      if (availabilityChanged) {
        await updateAvailabilityMutation.mutateAsync({
          cnaId,
          availability: localAvailability,
        });
      }

      // Only show success toast if not in demo mode and something changed
      if (!isDemoMode() && (basicDataChanged || availabilityChanged)) {
        toast({
          title: 'CNA updated successfully',
          description: `${localCNA.name}'s information has been saved`,
          type: 'success',
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating CNA:', error);

      // Only show error toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'Failed to update CNA',
          description: 'There was an error saving the changes. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const handleDeleteCNA = async () => {
    try {
      await deleteCNAMutation.mutateAsync(cnaId);

      // Only show success toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'CNA deleted successfully',
          description: `${cna?.name} has been removed from your team`,
          type: 'success',
        });
      }

      // Navigate back to CNAs list after successful deletion
      router.push('/admin/cnas');
    } catch (error) {
      console.error('Error deleting CNA:', error);

      // Only show error toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'Failed to delete CNA',
          description: 'There was an error deleting the CNA. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const handleAvailabilityChange = (newAvailability: { [key: string]: string[] }) => {
    setLocalAvailability(newAvailability);
  };

  // Early returns after all handlers are defined
  if (isLoading) {
    return <PageLoaderMolecule message="Loading CNA details..." />;
  }

  if (error || !cna || !localCNA) {
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

  return (
    <div className="mx-auto max-w-7xl">
      <StickyPageHeaderMolecule
        title={localCNA.name || 'Unknown CNA'}
        subtitle={localCNA.email || ''}
        isEditing={isEditing}
        onBack={() => router.back()}
        onToggleEdit={() => (isEditing ? handleSave() : setIsEditing(true))}
        isSaving={updateCNAMutation.isPending || updateAvailabilityMutation.isPending}
        showDelete={true}
        onDelete={() => setShowDeleteModal(true)}
      />

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <CardAtom className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <AvatarAtom src={localCNA.imageData} alt={localCNA.name} size="lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <TextAtom variant="h2" weight="semibold">
                  {localCNA.name}
                </TextAtom>
                <BadgeAtom variant={getStatusColor(localCNA.status)}>{localCNA.status}</BadgeAtom>
              </div>
              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <ButtonAtom variant="secondary" size="sm" onClick={handleChangePhotoClick}>
                    <DynamicIconAtom name="Upload" size="sm" className="mr-2" />
                    Change Photo
                  </ButtonAtom>
                  {localCNA.imageData && (
                    <ButtonAtom variant="ghost" size="sm" onClick={handleRemoveImage}>
                      <DynamicIconAtom name="Trash2" size="sm" className="mr-2" />
                      Remove
                    </ButtonAtom>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardAtom>

        {/* Basic Information Section */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Basic Information
          </TextAtom>
          <CardAtom className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextAtom variant="small" color="muted" className="mb-2">
                  Name
                </TextAtom>
                {isEditing ? (
                  <InputAtom
                    value={localCNA.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Enter name"
                  />
                ) : (
                  <TextAtom variant="body" weight="medium">
                    {localCNA.name}
                  </TextAtom>
                )}
              </div>

              <div>
                <TextAtom variant="small" color="muted" className="mb-2">
                  Email
                </TextAtom>
                {isEditing ? (
                  <InputAtom
                    type="email"
                    value={localCNA.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="Enter email"
                  />
                ) : (
                  <TextAtom variant="body" weight="medium">
                    {localCNA.email}
                  </TextAtom>
                )}
              </div>

              <div>
                <TextAtom variant="small" color="muted" className="mb-2">
                  Phone
                </TextAtom>
                {isEditing ? (
                  <InputAtom
                    type="tel"
                    value={localCNA.phone || ''}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <TextAtom variant="body" weight="medium">
                    {localCNA.phone || 'Not provided'}
                  </TextAtom>
                )}
              </div>

              <div>
                <TextAtom variant="small" color="muted" className="mb-2">
                  Certification Number
                </TextAtom>
                {isEditing ? (
                  <InputAtom
                    value={localCNA.certificationNumber || ''}
                    onChange={e => handleInputChange('certificationNumber', e.target.value)}
                    placeholder="Enter certification number"
                  />
                ) : (
                  <TextAtom variant="body" weight="medium">
                    {localCNA.certificationNumber || 'Not provided'}
                  </TextAtom>
                )}
              </div>

              <div>
                <TextAtom variant="small" color="muted" className="mb-2">
                  Hire Date
                </TextAtom>
                {isEditing ? (
                  <InputAtom
                    type="date"
                    value={localCNA.hireDate || ''}
                    onChange={e => handleInputChange('hireDate', e.target.value)}
                  />
                ) : (
                  <TextAtom variant="body" weight="medium">
                    {localCNA.hireDate
                      ? new Date(localCNA.hireDate).toLocaleDateString()
                      : 'Not provided'}
                  </TextAtom>
                )}
              </div>
            </div>

            {(isEditing || localCNA.notes) && (
              <div className="mt-6">
                <TextAtom variant="small" color="muted" className="mb-2">
                  Notes
                </TextAtom>
                {isEditing ? (
                  <TextareaAtom
                    value={localCNA.notes || ''}
                    onChange={e => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={3}
                  />
                ) : (
                  <TextAtom variant="body">{localCNA.notes}</TextAtom>
                )}
              </div>
            )}
          </CardAtom>
        </div>

        {/* Availability Section */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Shift Availability
          </TextAtom>
          <CNAAvailabilityMolecule
            availability={localAvailability}
            isEditing={isEditing}
            onAvailabilityChange={handleAvailabilityChange}
          />
        </div>

        {/* Stats Section */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Statistics
          </TextAtom>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardAtom className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
                  <DynamicIconAtom name="Calendar" size="md" className="text-primary" />
                </div>
                <div>
                  <TextAtom variant="small" color="muted">
                    Available Shifts
                  </TextAtom>
                  <TextAtom variant="h3" weight="semibold">
                    {Object.values(localAvailability).flat().length}
                  </TextAtom>
                </div>
              </div>
            </CardAtom>

            <CardAtom className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
                  <DynamicIconAtom name="Clock" size="md" className="text-primary" />
                </div>
                <div>
                  <TextAtom variant="small" color="muted">
                    Status
                  </TextAtom>
                  <TextAtom variant="h3" weight="semibold">
                    {localCNA.status}
                  </TextAtom>
                </div>
              </div>
            </CardAtom>
          </div>
        </div>
      </div>

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
