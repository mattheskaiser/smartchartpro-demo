'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { ConditionModalMolecule } from './modals/ConditionModal.molecule';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ActionMenuMolecule } from '@/components/molecules/ActionMenu.molecule';

interface Condition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'managed' | 'resolved';
  notes: string;
}

interface ResidentConditionsProps {
  conditions: Condition[];
  isEditing: boolean;
  onConditionsChange: (conditions: Condition[]) => void;
}

export const ResidentConditionsMolecule = ({
  conditions,
  isEditing,
  onConditionsChange,
}: ResidentConditionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);

  const addCondition = (conditionData: {
    name: string;
    diagnosedDate: string;
    status: string;
    notes: string;
  }) => {
    if (editingCondition) {
      // Update existing condition
      onConditionsChange(
        conditions.map(c =>
          c.id === editingCondition.id
            ? {
                ...c,
                ...conditionData,
                status: conditionData.status as 'active' | 'managed' | 'resolved',
              }
            : c
        )
      );
      setEditingCondition(null);
    } else {
      // Add new condition
      const condition: Condition = {
        id: Date.now().toString(),
        ...conditionData,
        status: conditionData.status as 'active' | 'managed' | 'resolved',
      };
      onConditionsChange([...conditions, condition]);
    }
  };

  const handleEdit = (condition: Condition) => {
    setEditingCondition(condition);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCondition(null);
    setShowModal(true);
  };

  const removeCondition = (id: string) => {
    onConditionsChange(conditions.filter(c => c.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'managed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        Medical Conditions
      </TextAtom>

      {/* Existing Conditions */}
      <div className="space-y-3 mb-4">
        {conditions.map(condition => (
          <div key={condition.id} className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TextAtom weight="medium">{condition.name}</TextAtom>
                <span className={`px-2 py-1 rounded-full ${getStatusColor(condition.status)}`}>
                  <TextAtom variant="caption" as="span">
                    {condition.status}
                  </TextAtom>
                </span>
              </div>
              {isEditing && (
                <ActionMenuMolecule
                  onEdit={() => handleEdit(condition)}
                  onDelete={() => removeCondition(condition.id)}
                />
              )}
            </div>
            {condition.diagnosedDate && (
              <TextAtom variant="small" color="muted" className="mb-1">
                <TextAtom variant="small" weight="medium" color="muted" as="span">
                  Diagnosed:
                </TextAtom>{' '}
                {new Date(condition.diagnosedDate).toLocaleDateString()}
              </TextAtom>
            )}
            {condition.notes && (
              <TextAtom variant="small" color="secondary">
                {condition.notes}
              </TextAtom>
            )}
          </div>
        ))}
        {conditions.length === 0 && (
          <TextAtom variant="small" color="muted" className="text-center py-4">
            No medical conditions recorded
          </TextAtom>
        )}
      </div>

      {/* Add New Condition Button */}
      {isEditing && (
        <div className="border-t pt-4">
          <ButtonAtom variant="primary" onClick={handleAdd}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Condition
          </ButtonAtom>
        </div>
      )}

      <ConditionModalMolecule
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCondition(null);
        }}
        onSubmit={addCondition}
        editingCondition={editingCondition}
      />
    </CardAtom>
  );
};
