'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function ResidentDetail() {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // Use TanStack Query hooks
  const { data: fetchedResident, isLoading, error } = useResident(params.id as string);
  const updateResidentMutation = useUpdateResident();

  // Local state for editing (synced with fetched data)
  const [resident, setResident] = useState<any>(null);

  // Sync local state with fetched data
  useEffect(() => {
    if (fetchedResident && !isEditing) {
      setResident(fetchedResident);
    }
  }, [fetchedResident, isEditing]);

  const handleSave = async () => {
    if (!resident) return;

    try {
      await updateResidentMutation.mutateAsync({
        id: params.id as string,
        data: resident,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating resident:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setResident(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setResident(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleNotesChange = (notes: string) => {
    setResident(prev => ({ ...prev, notes }));
  };

  const toggleADL = (adl: string) => {
    setResident(prev => {
      if (!prev) return prev;
      const currentAdlNeeds = Array.isArray(prev.adlNeeds) ? prev.adlNeeds : [];
      return {
        ...prev,
        adlNeeds: currentAdlNeeds.includes(adl)
          ? currentAdlNeeds.filter(a => a !== adl)
          : [...currentAdlNeeds, adl],
      };
    });
  };

  const handleAllergiesChange = (allergies: any[]) => {
    setResident(prev => ({
      ...prev,
      allergies,
    }));
  };

  const handleConditionsChange = (conditions: any[]) => {
    setResident(prev => ({
      ...prev,
      conditions,
    }));
  };

  const handleMedicationsChange = (medications: any[]) => {
    setResident(prev => ({
      ...prev,
      medications,
    }));
  };

  const handleDNRStatusChange = async (field: string, value: any) => {
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
        setResident(prev => ({
          ...prev,
          dnrStatus: newDNRStatus,
        }));
      }
    } catch (error) {
      console.error('Error updating DNR status:', error);
    }
  };

  const handleSpecialistsChange = (specialists: any[]) => {
    setResident(prev => ({
      ...prev,
      specialists,
    }));
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
        title={resident.name}
        subtitle={`Room ${resident.room}`}
        isEditing={isEditing}
        onBack={() => router.back()}
        onToggleEdit={() => (isEditing ? handleSave() : setIsEditing(true))}
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
              notes={resident.notes}
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
