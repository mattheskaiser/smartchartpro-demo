'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { AddAllergyModalMolecule } from './AddAllergyModal.molecule';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ActionMenuMolecule } from '@/components/molecules/ActionMenu.molecule';

interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

interface ResidentAllergiesProps {
  allergies: Allergy[];
  isEditing: boolean;
  onAllergiesChange: (allergies: Allergy[]) => void;
}

export const ResidentAllergiesMolecule = ({ 
  allergies, 
  isEditing, 
  onAllergiesChange 
}: ResidentAllergiesProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);

  const addAllergy = (allergyData: { name: string; severity: string; reaction: string }) => {
    if (editingAllergy) {
      // Update existing allergy
      onAllergiesChange(allergies.map(a => 
        a.id === editingAllergy.id 
          ? { ...a, ...allergyData }
          : a
      ));
      setEditingAllergy(null);
    } else {
      // Add new allergy
      const allergy: Allergy = {
        id: Date.now().toString(),
        ...allergyData
      };
      onAllergiesChange([...allergies, allergy]);
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

  const removeAllergy = (id: string) => {
    onAllergiesChange(allergies.filter(a => a.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">Allergies</TextAtom>
      
      {/* Existing Allergies */}
      <div className="space-y-3 mb-4">
        {allergies.map((allergy) => (
          <div key={allergy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TextAtom weight="medium">{allergy.name}</TextAtom>
                <span className={`px-2 py-1 rounded-full ${getSeverityColor(allergy.severity)}`}>
                  <TextAtom variant="caption" as="span">{allergy.severity}</TextAtom>
                </span>
              </div>
              {allergy.reaction && (
                <TextAtom variant="small" color="muted">
                  <TextAtom variant="small" weight="medium" color="muted" as="span">Reaction:</TextAtom> {allergy.reaction}
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
        {allergies.length === 0 && (
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

      <AddAllergyModalMolecule
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