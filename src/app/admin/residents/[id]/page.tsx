'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { MOCK_RESIDENT_DETAIL } from '@/constants/residents';

export default function ResidentDetail() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [resident, setResident] = useState(MOCK_RESIDENT_DETAIL);

  const handleSave = () => {
    setIsEditing(false);
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
    setResident(prev => ({
      ...prev,
      adlNeeds: prev.adlNeeds.includes(adl)
        ? prev.adlNeeds.filter(a => a !== adl)
        : [...prev.adlNeeds, adl],
    }));
  };

  const handleAllergiesChange = (allergies: any[]) => {
    setResident(prev => ({
      ...prev,
      medicalInfo: { ...prev.medicalInfo, allergies },
    }));
  };

  const handleConditionsChange = (conditions: any[]) => {
    setResident(prev => ({
      ...prev,
      medicalInfo: { ...prev.medicalInfo, conditions },
    }));
  };

  const handleMedicationsChange = (medications: any[]) => {
    setResident(prev => ({
      ...prev,
      medicalInfo: { ...prev.medicalInfo, medications },
    }));
  };

  const handleDNRStatusChange = (field: string, value: any) => {
    setResident(prev => ({
      ...prev,
      dnrStatus: { ...prev.dnrStatus, [field]: value },
    }));
  };

  const handleSpecialistsChange = (specialists: any[]) => {
    setResident(prev => ({
      ...prev,
      specialists,
    }));
  };

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
              emergencyContact={resident.emergencyContact}
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
              adlNeeds={resident.adlNeeds}
              isEditing={isEditing}
              onToggleADL={toggleADL}
            />
            <ResidentAllergiesMolecule
              allergies={resident.medicalInfo.allergies}
              isEditing={isEditing}
              onAllergiesChange={handleAllergiesChange}
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
                dnrStatus={resident.dnrStatus}
                isEditing={isEditing}
                onDNRStatusChange={handleDNRStatusChange}
              />
              <ResidentSpecialistsMolecule
                specialists={resident.specialists}
                isEditing={isEditing}
                onSpecialistsChange={handleSpecialistsChange}
              />
            </div>
            <ResidentConditionsMolecule
              conditions={resident.medicalInfo.conditions}
              isEditing={isEditing}
              onConditionsChange={handleConditionsChange}
            />
            <ResidentMedicationsMolecule
              medications={resident.medicalInfo.medications}
              isEditing={isEditing}
              onMedicationsChange={handleMedicationsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
