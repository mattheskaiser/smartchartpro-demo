'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ActionMenuMolecule } from '@/components/molecules/ActionMenu.molecule';
import { MedicationModalMolecule } from '@/components/molecules/resident/modals/MedicationModal.molecule';
import { toast } from '@/lib/toast';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';

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
  medications?: Medication[] | null;
  isEditing: boolean;
  onMedicationsChange: (medications: Medication[]) => void;
  residentId?: string;
}

export const ResidentMedicationsMolecule = ({
  medications = [],
  isEditing,
  onMedicationsChange,
  residentId,
}: ResidentMedicationsProps) => {
  // Ensure medications is always an array
  const safeMedications = Array.isArray(medications) ? medications : [];
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [showModal, setShowModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addMedication = async (medicationData: {
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
    startDate: string;
  }) => {
    if (!residentId) return;

    // In demo mode, simulate success without API call
    if (isDemoMode()) {
      setShowModal(false);
      setEditingMedication(null);
      setTimeout(() => {
        toast({
          title: 'Changes Not Saved',
          description: getDemoMessage('actionNotPersisted'),
          type: 'warning',
        });
      }, 100);
      return;
    }

    setIsLoading(true);
    try {
      if (editingMedication) {
        // Update existing medication
        const response = await fetch(
          `/api/residents/${residentId}/medications/${editingMedication.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicationData),
          }
        );

        if (response.ok) {
          const updatedMedication = await response.json();
          onMedicationsChange(
            safeMedications.map(m => (m.id === editingMedication.id ? updatedMedication : m))
          );
        }
        setEditingMedication(null);
      } else {
        // Add new medication
        const response = await fetch(`/api/residents/${residentId}/medications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...medicationData, status: 'current' }),
        });

        if (response.ok) {
          const newMedication = await response.json();
          onMedicationsChange([...safeMedications, newMedication]);
        }
      }
    } catch (error) {
      console.error('Error saving medication:', error);
    } finally {
      setIsLoading(false);
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

  const removeMedication = async (id: string) => {
    if (!residentId) return;

    // In demo mode, simulate success without API call
    if (isDemoMode()) {
      setTimeout(() => {
        toast({
          title: 'Changes Not Saved',
          description: getDemoMessage('actionNotPersisted'),
          type: 'warning',
        });
      }, 100);
      return;
    }

    try {
      const response = await fetch(`/api/residents/${residentId}/medications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onMedicationsChange(safeMedications.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const discontinueMedication = async (id: string, reason: string) => {
    if (!residentId) return;

    // In demo mode, simulate success without API call
    if (isDemoMode()) {
      setTimeout(() => {
        toast({
          title: 'Changes Not Saved',
          description: getDemoMessage('actionNotPersisted'),
          type: 'warning',
        });
      }, 100);
      return;
    }

    try {
      const updateData = {
        status: 'past',
        endDate: new Date().toISOString(),
        discontinuedReason: reason,
      };

      const response = await fetch(`/api/residents/${residentId}/medications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedMedication = await response.json();
        onMedicationsChange(safeMedications.map(m => (m.id === id ? updatedMedication : m)));
      }
    } catch (error) {
      console.error('Error discontinuing medication:', error);
    }
  };

  const currentMedications = safeMedications.filter(m => m.status === 'current');
  const pastMedications = safeMedications.filter(m => m.status === 'past');

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
          <DynamicIconAtom name="Clock" size="sm" className="mr-2" />
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
          <DynamicIconAtom name="CircleCheck" size="sm" className="mr-2" />
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
                            icon: <DynamicIconAtom name="Clock" size="sm" className="mr-2" />,
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
            <DynamicIconAtom name="Plus" size="sm" className="mr-2" />
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
        isLoading={isLoading}
      />
    </CardAtom>
  );
};
