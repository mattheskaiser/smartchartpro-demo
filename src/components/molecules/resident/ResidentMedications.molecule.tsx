'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { MedicationModalMolecule } from './modals/MedicationModal.molecule';
import { PlusIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ActionMenuMolecule } from '@/components/molecules/ActionMenu.molecule';
import { Clock } from 'lucide-react';

interface Medication {
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

interface ResidentMedicationsProps {
  medications: Medication[];
  isEditing: boolean;
  onMedicationsChange: (medications: Medication[]) => void;
}

export const ResidentMedicationsMolecule = ({
  medications,
  isEditing,
  onMedicationsChange,
}: ResidentMedicationsProps) => {
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [showModal, setShowModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const addMedication = (medicationData: {
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
    startDate: string;
  }) => {
    if (editingMedication) {
      // Update existing medication
      onMedicationsChange(
        medications.map(m => (m.id === editingMedication.id ? { ...m, ...medicationData } : m))
      );
      setEditingMedication(null);
    } else {
      // Add new medication
      const medication: Medication = {
        id: Date.now().toString(),
        ...medicationData,
        status: 'current',
        endDate: undefined,
        discontinuedReason: undefined,
      };
      onMedicationsChange([...medications, medication]);
    }
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingMedication(null);
    setShowModal(true);
  };

  const removeMedication = (id: string) => {
    onMedicationsChange(medications.filter(m => m.id !== id));
  };

  const discontinueMedication = (id: string, reason: string) => {
    onMedicationsChange(
      medications.map(m =>
        m.id === id
          ? {
              ...m,
              status: 'past',
              endDate: new Date().toISOString().split('T')[0],
              discontinuedReason: reason,
            }
          : m
      )
    );
  };

  const currentMedications = medications.filter(m => m.status === 'current');
  const pastMedications = medications.filter(m => m.status === 'past');

  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        Medications
      </TextAtom>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
            activeTab === 'current'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ClockIcon className="h-4 w-4 mr-2" />
          <TextAtom variant="small" weight="medium" as="span">
            Current ({currentMedications.length})
          </TextAtom>
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
            activeTab === 'past'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          <TextAtom variant="small" weight="medium" as="span">
            Past ({pastMedications.length})
          </TextAtom>
        </button>
      </div>

      {/* Medications List */}
      <div className="space-y-3 mb-4">
        {(activeTab === 'current' ? currentMedications : pastMedications).map(medication => (
          <div key={medication.id} className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TextAtom weight="medium">{medication.name}</TextAtom>
                  <TextAtom variant="small" color="muted">
                    ({medication.dosage})
                  </TextAtom>
                </div>
                <TextAtom variant="small" color="secondary" className="mb-1">
                  {medication.frequency}
                </TextAtom>
                {medication.instructions && (
                  <TextAtom variant="small" color="muted" className="mb-2">
                    Instructions: {medication.instructions}
                  </TextAtom>
                )}
                <div className="flex items-center gap-4">
                  <TextAtom variant="caption" color="muted">
                    <TextAtom variant="caption" weight="medium" color="muted" as="span">
                      Started:
                    </TextAtom>{' '}
                    {new Date(medication.startDate).toLocaleDateString()}
                  </TextAtom>
                  {medication.endDate && (
                    <TextAtom variant="caption" color="muted">
                      <TextAtom variant="caption" weight="medium" color="muted" as="span">
                        Ended:
                      </TextAtom>{' '}
                      {new Date(medication.endDate).toLocaleDateString()}
                    </TextAtom>
                  )}
                </div>
                {medication.discontinuedReason && (
                  <TextAtom variant="small" color="muted" className="mt-1 italic">
                    <TextAtom variant="small" weight="medium" color="muted" as="span">
                      Reason for discontinuation:
                    </TextAtom>{' '}
                    {medication.discontinuedReason}
                  </TextAtom>
                )}
              </div>
              {isEditing && (
                <ActionMenuMolecule
                  onEdit={() => handleEdit(medication)}
                  onDelete={() => removeMedication(medication.id)}
                  items={
                    medication.status === 'current'
                      ? [
                          {
                            id: 'discontinue',
                            label: 'Discontinue',
                            icon: Clock,
                            onClick: () => {
                              const reason = prompt('Reason for discontinuing this medication:');
                              if (reason) discontinueMedication(medication.id, reason);
                            },
                            variant: 'warning',
                          },
                        ]
                      : []
                  }
                />
              )}
            </div>
          </div>
        ))}
        {(activeTab === 'current' ? currentMedications : pastMedications).length === 0 && (
          <TextAtom variant="small" color="muted" className="text-center py-4">
            No {activeTab} medications recorded
          </TextAtom>
        )}
      </div>

      {/* Add New Medication Button */}
      {isEditing && activeTab === 'current' && (
        <div className="border-t pt-4">
          <ButtonAtom variant="primary" onClick={handleAdd}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Medication
          </ButtonAtom>
        </div>
      )}

      <MedicationModalMolecule
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMedication(null);
        }}
        onSubmit={addMedication}
        editingMedication={editingMedication}
      />
    </CardAtom>
  );
};
