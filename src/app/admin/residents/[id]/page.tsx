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
import { ResidentSummaryCardMolecule } from '@/components/molecules/resident/ResidentSummaryCard.molecule';
import { ResidentMedicalInformationMolecule } from '@/components/molecules/resident/ResidentMedicalInformation.molecule';

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
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    conditions: ['Diabetes Type 2', 'Hypertension'],
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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

          <ResidentADLRequirementsMolecule
            adlNeeds={resident.adlNeeds}
            isEditing={isEditing}
            onToggleADL={toggleADL}
          />

          <ResidentNotesMolecule
            notes={resident.notes}
            isEditing={isEditing}
            onNotesChange={handleNotesChange}
          />
        </div>

        <div className="space-y-6">
          <ResidentSummaryCardMolecule resident={resident} />
          <ResidentMedicalInformationMolecule medicalInfo={resident.medicalInfo} />
        </div>
      </div>
    </div>
  );
}
