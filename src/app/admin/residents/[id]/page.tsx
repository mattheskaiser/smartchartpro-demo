'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ResidentBasicInformationMolecule } from '@/components/molecules/resident/ResidentBasicInformation.molecule';
import { ResidentEmergencyContactMolecule } from '@/components/molecules/resident/ResidentEmergencyContact.molecule';
import { ResidentADLRequirementsMolecule } from '@/components/molecules/resident/ResidentADLRequirements.molecule';
import { ResidentNotesMolecule } from '@/components/molecules/resident/ResidentNotes.molecule';

import { ResidentAllergiesMolecule } from '@/components/molecules/resident/ResidentAllergies.molecule';
import { ResidentConditionsMolecule } from '@/components/molecules/resident/ResidentConditions.molecule';
import { ResidentMedicationsMolecule } from '@/components/molecules/resident/ResidentMedications.molecule';

const mockResident = {
  id: 1,
  name: 'Alice Thompson',
  imageUrl: '/placeholder.jpg',
  room: '101',
  status: 'independent',
  lastADL: '1 hour ago',
  assignedCNA: 'Sarah Johnson',
  dateOfBirth: '1945-03-15',
  admissionDate: '2023-01-15',
  emergencyContact: {
    name: 'John Thompson',
    relationship: 'Son',
    phone: '(555) 123-4567',
  },
  medicalInfo: {
    allergies: [
      { id: '1', name: 'Penicillin', severity: 'severe' as const, reaction: 'Anaphylaxis' },
      { id: '2', name: 'Shellfish', severity: 'moderate' as const, reaction: 'Hives and swelling' },
    ],
    conditions: [
      {
        id: '1',
        name: 'Diabetes Type 2',
        diagnosedDate: '2018-03-15',
        status: 'managed' as const,
        notes: 'Well controlled with medication',
      },
      {
        id: '2',
        name: 'Hypertension',
        diagnosedDate: '2020-07-22',
        status: 'active' as const,
        notes: 'Monitoring blood pressure daily',
      },
    ],
    medications: [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        instructions: 'Take in the morning with water',
        startDate: '2020-07-22',
        status: 'current' as const,
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        instructions: 'Take with meals to reduce stomach upset',
        startDate: '2018-03-15',
        status: 'current' as const,
      },
      {
        id: '3',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        instructions: 'Take with food',
        startDate: '2019-01-10',
        endDate: '2023-06-15',
        status: 'past' as const,
        discontinuedReason: 'Stomach irritation',
      },
    ],
  },
  adlNeeds: ['bathing', 'dressing', 'mobility'],
  notes:
    'Patient prefers morning care routine. Needs assistance with mobility due to recent hip surgery.',
};

export default function ResidentDetail() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [resident, setResident] = useState(mockResident);

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

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <ButtonAtom
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
            className="mr-4 p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </ButtonAtom>
          <div>
            <TextAtom variant="h1" weight="semibold">
              {resident.name}
            </TextAtom>
            <TextAtom variant="small" color="muted">
              Room {resident.room}
            </TextAtom>
          </div>
        </div>
        <ButtonAtom
          variant="primary"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          {isEditing ? 'Save Changes' : 'Edit'}
        </ButtonAtom>
      </div>

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
