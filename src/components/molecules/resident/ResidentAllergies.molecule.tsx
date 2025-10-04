'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { AllergyModalMolecule } from './modals/AllergyModal.molecule';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ActionMenuMolecule } from '@/components/molecules/ActionMenu.molecule';

interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

interface ResidentAllergiesProps {
  allergies?: Allergy[] | null;
  isEditing: boolean;
  onAllergiesChange: (allergies: Allergy[]) => void;
  residentId?: string;
}

export const ResidentAllergiesMolecule = ({
  allergies = [],
  isEditing,
  onAllergiesChange,
  residentId,
}: ResidentAllergiesProps) => {
  // Ensure allergies is always an array
  const safeAllergies = Array.isArray(allergies) ? allergies : [];
  const [showModal, setShowModal] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);

  const addAllergy = async (allergyData: { name: string; severity: string; reaction: string }) => {
    if (!residentId) return;

    try {
      if (editingAllergy) {
        // Update existing allergy
        const response = await fetch(`/api/residents/${residentId}/allergies/${editingAllergy.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(allergyData),
        });

        if (response.ok) {
          const updatedAllergy = await response.json();
          onAllergiesChange(
            safeAllergies.map(a => (a.id === editingAllergy.id ? updatedAllergy : a))
          );
        }
        setEditingAllergy(null);
      } else {
        // Add new allergy
        const response = await fetch(`/api/residents/${residentId}/allergies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(allergyData),
        });

        if (response.ok) {
          const newAllergy = await response.json();
          onAllergiesChange([...safeAllergies, newAllergy]);
        }
      }
    } catch (error) {
      console.error('Error saving allergy:', error);
    }
  };

  const handleEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAllergy(null);
    setShowModal(true);
  };

  const removeAllergy = async (id: string) => {
    if (!residentId) return;

    try {
      const response = await fetch(`/api/residents/${residentId}/allergies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onAllergiesChange(safeAllergies.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting allergy:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        Allergies
      </TextAtom>

      {/* Existing Allergies */}
      <div className="space-y-3 mb-4">
        {safeAllergies.map(allergy => (
          <div
            key={allergy.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TextAtom weight="medium">{allergy.name}</TextAtom>
                <span className={`px-2 py-1 rounded-full ${getSeverityColor(allergy.severity)}`}>
                  <TextAtom variant="caption" as="span">
                    {allergy.severity}
                  </TextAtom>
                </span>
              </div>
              {allergy.reaction && (
                <TextAtom variant="small" color="muted">
                  <TextAtom variant="small" weight="medium" color="muted" as="span">
                    Reaction:
                  </TextAtom>{' '}
                  {allergy.reaction}
                </TextAtom>
              )}
            </div>
            {isEditing && (
              <ActionMenuMolecule
                onEdit={() => handleEdit(allergy)}
                onDelete={() => removeAllergy(allergy.id)}
              />
            )}
          </div>
        ))}
        {safeAllergies.length === 0 && (
          <TextAtom variant="small" color="muted" className="text-center py-4">
            No allergies recorded
          </TextAtom>
        )}
      </div>

      {/* Add New Allergy Button */}
      {isEditing && (
        <div className="border-t pt-4">
          <ButtonAtom variant="primary" onClick={handleAdd}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Allergy
          </ButtonAtom>
        </div>
      )}

      <AllergyModalMolecule
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAllergy(null);
        }}
        onSubmit={addAllergy}
        editingAllergy={editingAllergy}
      />
    </CardAtom>
  );
};
