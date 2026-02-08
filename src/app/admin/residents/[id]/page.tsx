'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Import types from the hook
import type { Resident } from '@/types/resident';
import { isDemoMode } from '@/lib/demo-config';

// Component-specific types for the molecules
interface AllergyDisplay {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

interface ConditionDisplay {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'managed' | 'resolved';
  notes: string;
}

interface MedicationDisplay {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  status: 'current' | 'past';
  discontinuedReason?: string;
}

interface SpecialistDisplay {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  notes?: string;
}

type ResidentData = Resident;
import { StickyPageHeaderMolecule } from '@/components/molecules/StickyPageHeader.molecule';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ResidentBasicInformationMolecule } from '@/components/molecules/resident/ResidentBasicInformation.molecule';
import { ResidentEmergencyContactMolecule } from '@/components/molecules/resident/ResidentEmergencyContact.molecule';
import { ResidentADLRequirementsMolecule } from '@/components/molecules/resident/ResidentADLRequirements.molecule';
import { ResidentNotesMolecule } from '@/components/molecules/resident/ResidentNotes.molecule';
import { ResidentImageUploadMolecule } from '@/components/molecules/resident/ResidentImageUpload.molecule';

import { ResidentAllergiesMolecule } from '@/components/molecules/resident/ResidentAllergies.molecule';
import { ResidentConditionsMolecule } from '@/components/molecules/resident/ResidentConditions.molecule';
import { ResidentMedicationsMolecule } from '@/components/molecules/resident/ResidentMedications.molecule';
import { ResidentDNRStatusMolecule } from '@/components/molecules/resident/ResidentDNRStatus.molecule';
import { ResidentSpecialistsMolecule } from '@/components/molecules/resident/ResidentSpecialists.molecule';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { ConfirmationModalMolecule } from '@/components/molecules/ConfirmationModal.molecule';
import { useResident, useUpdateResident, useDeleteResident } from '@/hooks/useResidents';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';

export default function ResidentDetail() {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isImageUpdating, setIsImageUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Use TanStack Query hooks
  const { data: fetchedResident, isLoading, error } = useResident(params.id as string);
  const updateResidentMutation = useUpdateResident();
  const deleteResidentMutation = useDeleteResident();

  // Local state for editing (synced with fetched data)
  const [resident, setResident] = useState<ResidentData | null>(null);
  // Track original basic resident data to detect changes
  const [originalBasicData, setOriginalBasicData] = useState<Partial<ResidentData> | null>(null);

  // Sync local state with fetched data
  useEffect(() => {
    if (fetchedResident && !isEditing) {
      setResident(fetchedResident);
      // Store original basic data (excluding related models)
      const { ...basicData } = fetchedResident;
      setOriginalBasicData(basicData);
    }
  }, [fetchedResident, isEditing]);

  // Helper function to check if basic data has changed
  const hasBasicDataChanged = () => {
    if (!resident || !originalBasicData) return false;

    const { ...currentBasicData } = resident;

    // Compare each field (excluding imageUrl since it's handled separately)
    const fieldsToCompare = [
      'name',
      'room',
      'status',
      'dateOfBirth',
      'admissionDate',
      'emergencyContactName',
      'emergencyContactPhone',
      'emergencyContactRelationship',
      'assignedCNA',
      'notes',
    ];

    for (const field of fieldsToCompare) {
      if (
        currentBasicData[field as keyof typeof currentBasicData] !==
        originalBasicData[field as keyof typeof originalBasicData]
      ) {
        return true;
      }
    }

    // Check adlNeeds array
    const currentAdl = currentBasicData.adlNeeds || [];
    const originalAdl = originalBasicData.adlNeeds || [];
    if (JSON.stringify(currentAdl.sort()) !== JSON.stringify(originalAdl.sort())) {
      return true;
    }

    return false;
  };

  const handleSave = async () => {
    if (!resident) return;

    try {
      // Only make a request if basic resident data has changed
      if (hasBasicDataChanged()) {
        // Extract only the basic resident fields, excluding imageUrl (handled separately)
        const basicResidentData = {
          name: resident.name,
          room: resident.room,
          status: resident.status,
          dateOfBirth: resident.dateOfBirth,
          admissionDate: resident.admissionDate,
          emergencyContactName: resident.emergencyContactName,
          emergencyContactPhone: resident.emergencyContactPhone,
          emergencyContactRelationship: resident.emergencyContactRelationship,
          assignedCNA: resident.assignedCNA,
          notes: resident.notes,
          adlNeeds: resident.adlNeeds,
        };

        await updateResidentMutation.mutateAsync({
          id: params.id as string,
          data: basicResidentData,
        });

        // Only show success toast if not in demo mode
        if (!isDemoMode()) {
          toast({
            title: 'Resident updated successfully',
            description: `${resident.name}'s information has been saved`,
            type: 'success',
          });
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating resident:', error);

      // Only show error toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'Failed to update resident',
          description: 'There was an error saving the changes. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setResident((prev: ResidentData | null) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    // Map the field names to the actual database field names
    const fieldMap: { [key: string]: string } = {
      name: 'emergencyContactName',
      phone: 'emergencyContactPhone',
      relationship: 'emergencyContactRelationship',
    };

    const actualField = fieldMap[field] || field;

    setResident((prev: ResidentData | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        [actualField]: value,
      };
    });
  };

  const handleNotesChange = (notes: string) => {
    setResident((prev: ResidentData | null) => {
      if (!prev) return prev;
      return { ...prev, notes };
    });
  };

  const handleImageChange = async (imageData: string | null) => {
    if (!resident) return;

    // Update local state immediately for UI responsiveness
    setResident((prev: ResidentData | null) => {
      if (!prev) return prev;
      return { ...prev, imageUrl: imageData };
    });

    // Save image change immediately to the server
    try {
      setIsImageUpdating(true);
      await updateResidentMutation.mutateAsync({
        id: params.id as string,
        data: { imageUrl: imageData },
      });
      toast({
        title: 'Image updated',
        description: 'Profile picture has been updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating resident image:', error);
      toast({
        title: 'Failed to update image',
        description: 'There was an error updating the profile picture.',
        type: 'error',
      });
      // Revert the local state change on error
      setResident((prev: ResidentData | null) => {
        if (!prev) return prev;
        return { ...prev, imageUrl: resident.imageUrl };
      });
    } finally {
      setIsImageUpdating(false);
    }
  };

  const toggleADL = (adl: string) => {
    setResident((prev: ResidentData | null) => {
      if (!prev) return prev;
      const currentAdlNeeds = Array.isArray(prev.adlNeeds) ? prev.adlNeeds : [];
      return {
        ...prev,
        adlNeeds: currentAdlNeeds.includes(adl)
          ? currentAdlNeeds.filter((a: string) => a !== adl)
          : [...currentAdlNeeds, adl],
      };
    });
  };

  const handleAllergiesChange = () => {
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  const handleConditionsChange = () => {
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  const handleMedicationsChange = () => {
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  const handleDNRStatusChange = async (field: string, value: boolean | string | undefined) => {
    if (!resident) return;

    try {
      const updatedDNRStatus = { ...resident.dnrStatus, [field]: value };

      const response = await fetch(`/api/residents/${params.id}/dnr-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDNRStatus),
      });

      if (response.ok) {
        // Invalidate query to refetch with updated data
        queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
        toast({
          title: 'DNR status updated',
          description: 'Do Not Resuscitate status has been saved',
          type: 'success',
        });
      } else {
        throw new Error('Failed to update DNR status');
      }
    } catch (error) {
      console.error('Error updating DNR status:', error);
      toast({
        title: 'Failed to update DNR status',
        description: 'There was an error updating the DNR status. Please try again.',
        type: 'error',
      });
    }
  };

  const handleSpecialistsChange = () => {
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  const handleDeleteResident = async () => {
    try {
      await deleteResidentMutation.mutateAsync(params.id as string);

      // Only show success toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'Resident deleted successfully',
          description: `${resident?.name} has been removed from the system`,
          type: 'success',
        });
      }

      // Navigate back to residents list after successful deletion
      router.push('/admin/residents');
    } catch (error) {
      console.error('Error deleting resident:', error);

      // Only show error toast if not in demo mode
      if (!isDemoMode()) {
        toast({
          title: 'Failed to delete resident',
          description: 'There was an error deleting the resident. Please try again.',
          type: 'error',
        });
      }
    }
  };

  if (isLoading) {
    return <PageLoaderMolecule message="Loading resident data..." />;
  }

  if (!resident) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="text-center py-8">
          <TextAtom>Resident not found</TextAtom>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="text-center py-8">
          <TextAtom>Error loading resident details</TextAtom>
        </div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="text-center py-8">
          <TextAtom>Resident not found</TextAtom>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <StickyPageHeaderMolecule
        title={resident.name || 'Unknown Resident'}
        subtitle={`Room ${resident.room || 'N/A'}`}
        isEditing={isEditing}
        onBack={() => router.back()}
        onToggleEdit={() => (isEditing ? handleSave() : setIsEditing(true))}
        isSaving={updateResidentMutation.isPending}
        showDelete={true}
        onDelete={() => setShowDeleteModal(true)}
      />

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <ResidentImageUploadMolecule
          currentImage={resident.imageUrl}
          residentName={resident.name || 'Unknown Resident'}
          isEditing={isEditing}
          onImageChange={handleImageChange}
          isUpdating={isImageUpdating}
          avatarSize="3xl"
        />

        {/* Basic Information Section */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Basic Information
          </TextAtom>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResidentBasicInformationMolecule
              resident={resident}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            <ResidentEmergencyContactMolecule
              emergencyContact={{
                name: resident.emergencyContactName,
                phone: resident.emergencyContactPhone,
                relationship: resident.emergencyContactRelationship,
              }}
              isEditing={isEditing}
              onInputChange={handleEmergencyContactChange}
            />
          </div>
          <div className="mt-6">
            <ResidentNotesMolecule
              notes={resident.notes || ''}
              isEditing={isEditing}
              onNotesChange={handleNotesChange}
            />
          </div>
        </div>

        {/* Care & Activities Section */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Care & Activities
          </TextAtom>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResidentADLRequirementsMolecule
              adlNeeds={resident?.adlNeeds || []}
              isEditing={isEditing}
              onToggleADL={toggleADL}
            />
            <ResidentAllergiesMolecule
              allergies={resident.allergies as AllergyDisplay[] | undefined}
              isEditing={isEditing}
              onAllergiesChange={handleAllergiesChange}
              residentId={params.id as string}
            />
          </div>
        </div>

        {/* Medical Information Section */}
        <div>
          <TextAtom variant="h2" weight="semibold" className="mb-4 text-gray-900">
            Medical Information
          </TextAtom>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResidentDNRStatusMolecule
                dnrStatus={resident?.dnrStatus}
                isEditing={isEditing}
                onDNRStatusChange={handleDNRStatusChange}
              />
              <ResidentSpecialistsMolecule
                specialists={resident.specialists as SpecialistDisplay[] | undefined}
                isEditing={isEditing}
                onSpecialistsChange={handleSpecialistsChange}
                residentId={params.id as string}
              />
            </div>
            <ResidentConditionsMolecule
              conditions={resident.conditions as ConditionDisplay[] | undefined}
              isEditing={isEditing}
              onConditionsChange={handleConditionsChange}
              residentId={params.id as string}
            />
            <ResidentMedicationsMolecule
              medications={resident.medications as MedicationDisplay[] | undefined}
              isEditing={isEditing}
              onMedicationsChange={handleMedicationsChange}
              residentId={params.id as string}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModalMolecule
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteResident}
        title="Delete Resident"
        message={`Are you sure you want to delete ${resident.name}? This action cannot be undone and will permanently remove all resident data including medical records, ADL logs, and care history.`}
        confirmText="Delete Resident"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteResidentMutation.isPending}
      />
    </div>
  );
}
