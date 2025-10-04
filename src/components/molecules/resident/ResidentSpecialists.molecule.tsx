'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { ActionMenuMolecule } from '@/components/molecules/ActionMenu.molecule';
import { SpecialistModalMolecule } from './modals/SpecialistModal.molecule';
import { SPECIALTY_OPTIONS } from '@/constants/medical';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  notes?: string;
}

interface ResidentSpecialistsProps {
  specialists?: Specialist[] | null;
  isEditing: boolean;
  onSpecialistsChange: (specialists: Specialist[]) => void;
  residentId?: string;
}

export const ResidentSpecialistsMolecule = ({
  specialists = [],
  isEditing,
  onSpecialistsChange,
  residentId,
}: ResidentSpecialistsProps) => {
  // Ensure specialists is always an array
  const safeSpecialists = Array.isArray(specialists) ? specialists : [];
  const [showModal, setShowModal] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);

  const getSpecialtyLabel = (value: string) => {
    return SPECIALTY_OPTIONS.find(option => option.value === value)?.label || value;
  };

  const addSpecialist = async (specialistData: {
    name: string;
    specialty: string;
    phone: string;
    email: string;
    notes: string;
  }) => {
    if (!residentId) return;

    try {
      if (editingSpecialist) {
        // Update existing specialist
        const response = await fetch(
          `/api/residents/${residentId}/specialists/${editingSpecialist.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(specialistData),
          }
        );

        if (response.ok) {
          const updatedSpecialist = await response.json();
          onSpecialistsChange(
            safeSpecialists.map(s => (s.id === editingSpecialist.id ? updatedSpecialist : s))
          );
        }
        setEditingSpecialist(null);
      } else {
        // Add new specialist
        const response = await fetch(`/api/residents/${residentId}/specialists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(specialistData),
        });

        if (response.ok) {
          const newSpecialist = await response.json();
          onSpecialistsChange([...safeSpecialists, newSpecialist]);
        }
      }
    } catch (error) {
      console.error('Error saving specialist:', error);
    }
  };

  const handleEdit = (specialist: Specialist) => {
    setEditingSpecialist(specialist);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSpecialist(null);
    setShowModal(true);
  };

  const removeSpecialist = async (id: string) => {
    if (!residentId) return;

    try {
      const response = await fetch(`/api/residents/${residentId}/specialists/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSpecialistsChange(safeSpecialists.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting specialist:', error);
    }
  };

  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        Specialists & Doctors
      </TextAtom>

      {/* Existing Specialists */}
      <div className="space-y-3 mb-4">
        {safeSpecialists.map(specialist => (
          <div key={specialist.id} className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TextAtom weight="medium">{specialist.name}</TextAtom>
                  <TextAtom variant="small" color="muted">
                    ({getSpecialtyLabel(specialist.specialty)})
                  </TextAtom>
                </div>
                <TextAtom variant="small" color="secondary" className="mb-1">
                  {specialist.phone}
                </TextAtom>
                {specialist.email && (
                  <TextAtom variant="small" color="muted" className="mb-1">
                    <TextAtom variant="small" weight="medium" color="muted" as="span">
                      Email:
                    </TextAtom>{' '}
                    {specialist.email}
                  </TextAtom>
                )}
                {specialist.notes && (
                  <TextAtom variant="small" color="muted">
                    <TextAtom variant="small" weight="medium" color="muted" as="span">
                      Notes:
                    </TextAtom>{' '}
                    {specialist.notes}
                  </TextAtom>
                )}
              </div>
              {isEditing && (
                <ActionMenuMolecule
                  onEdit={() => handleEdit(specialist)}
                  onDelete={() => removeSpecialist(specialist.id)}
                />
              )}
            </div>
          </div>
        ))}
        {safeSpecialists.length === 0 && (
          <TextAtom variant="small" color="muted" className="text-center py-4">
            No specialists or doctors recorded
          </TextAtom>
        )}
      </div>

      {/* Add New Specialist Button */}
      {isEditing && (
        <div className="border-t pt-4">
          <ButtonAtom variant="primary" onClick={handleAdd}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Specialist
          </ButtonAtom>
        </div>
      )}

      <SpecialistModalMolecule
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSpecialist(null);
        }}
        onSubmit={addSpecialist}
        editingSpecialist={editingSpecialist}
      />
    </CardAtom>
  );
};
