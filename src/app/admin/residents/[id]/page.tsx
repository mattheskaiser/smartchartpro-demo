'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Type definition for resident data
interface ResidentData {
  id?: string;
  name?: string;
  room?: string;
  status?: string;
  imageUrl?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  assignedCNA?: string;
  notes?: string;
  adlNeeds?: string[];
  allergies?: any[];
  conditions?: any[];
  medications?: any[];
  specialists?: any[];
  dnrStatus?: any;
  createdAt?: string;
  updatedAt?: string;
}
import { StickyPageHeaderMolecule } from '@/components/molecules/StickyPageHeader.molecule';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ResidentBasicInformationMolecule } from '@/components/molecules/resident/ResidentBasicInformation.molecule';
import { ResidentEmergencyContactMolecule } from '@/components/molecules/resident/ResidentEmergencyContact.molecule';
import { ResidentADLRequirementsMolecule } from '@/components/molecules/resident/ResidentADLRequirements.molecule';
import { ResidentNotesMolecule } from '@/components/molecules/resident/ResidentNotes.molecule';

import { ResidentAllergiesMolecule } from '@/components/molecules/resident/ResidentAllergies.molecule';
import { ResidentConditionsMolecule } from '@/components/molecules/resident/ResidentConditions.molecule';
import { ResidentMedicationsMolecule } from '@/components/molecules/resident/ResidentMedications.molecule';
import { ResidentDNRStatusMolecule } from '@/components/molecules/resident/ResidentDNRStatus.molecule';
import { ResidentSpecialistsMolecule } from '@/components/molecules/resident/ResidentSpecialists.molecule';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { useResident, useUpdateResident } from '@/hooks/useResidents';
import { useQueryClient } from '@tanstack/react-query';

export default function ResidentDetail() {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Use TanStack Query hooks
  const { data: fetchedResident, isLoading, error } = useResident(params.id as string);
  const updateResidentMutation = useUpdateResident();

  // Local state for editing (synced with fetched data)
  const [resident, setResident] = useState<ResidentData | null>(null);
  // Track original basic resident data to detect changes
  const [originalBasicData, setOriginalBasicData] = useState<Partial<ResidentData> | null>(null);

  // Sync local state with fetched data
  useEffect(() => {
    if (fetchedResident && !isEditing) {
      setResident(fetchedResident);
      // Store original basic data (excluding related models)
      const { allergies, conditions, medications, specialists, dnrStatus, ...basicData } =
        fetchedResident;
      setOriginalBasicData(basicData);
    }
  }, [fetchedResident, isEditing]);

  // Helper function to check if basic data has changed
  const hasBasicDataChanged = () => {
    if (!resident || !originalBasicData) return false;

    const { allergies, conditions, medications, specialists, dnrStatus, ...currentBasicData } =
      resident;

    // Compare each field
    const fieldsToCompare = [
      'name',
      'room',
      'status',
      'imageUrl',
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
        const { allergies, conditions, medications, specialists, dnrStatus, ...basicResidentData } =
          resident;

        await updateResidentMutation.mutateAsync({
          id: params.id as string,
          data: basicResidentData,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating resident:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setResident((prev: ResidentData | null) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    // Map the field names to the actual database field names
    const fieldMap: { [key: string]: string } = {
      name: 'emergencyContactName',
      phone: 'emergencyContactPhone',
      relationship: 'emergencyContactRelationship',
    };

    const actualField = fieldMap[field] || field;

    setResident((prev: ResidentData | null) => ({
      ...prev,
      [actualField]: value,
    }));
  };

  const handleNotesChange = (notes: string) => {
    setResident((prev: ResidentData | null) => ({ ...prev, notes }));
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

  const handleAllergiesChange = (allergies: any[]) => {
    setResident((prev: ResidentData | null) => ({
      ...prev,
      allergies,
    }));
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  const handleConditionsChange = (conditions: any[]) => {
    setResident((prev: ResidentData | null) => ({
      ...prev,
      conditions,
    }));
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  const handleMedicationsChange = (medications: any[]) => {
    setResident((prev: ResidentData | null) => ({
      ...prev,
      medications,
    }));
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  const handleDNRStatusChange = async (field: string, value: any) => {
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
        const newDNRStatus = await response.json();
        setResident((prev: ResidentData | null) => ({
          ...prev,
          dnrStatus: newDNRStatus,
        }));
      }
    } catch (error) {
      console.error('Error updating DNR status:', error);
    }
  };

  const handleSpecialistsChange = (specialists: any[]) => {
    setResident((prev: ResidentData | null) => ({
      ...prev,
      specialists,
    }));
    // Invalidate query to ensure fresh data on next fetch
    queryClient.invalidateQueries({ queryKey: ['residents', params.id] });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <LoadingStateMolecule message="Loading resident details..." />
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <LoadingStateMolecule message="Loading resident details..." />
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
      />

      <div className="space-y-8">
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
              allergies={resident.allergies || []}
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
                specialists={resident.specialists || []}
                isEditing={isEditing}
                onSpecialistsChange={handleSpecialistsChange}
                residentId={params.id as string}
              />
            </div>
            <ResidentConditionsMolecule
              conditions={resident.conditions || []}
              isEditing={isEditing}
              onConditionsChange={handleConditionsChange}
              residentId={params.id as string}
            />
            <ResidentMedicationsMolecule
              medications={resident.medications || []}
              isEditing={isEditing}
              onMedicationsChange={handleMedicationsChange}
              residentId={params.id as string}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
