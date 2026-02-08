'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { ConditionModalMolecule } from './modals/ConditionModal.molecule';
import { ActionMenuMolecule } from '@/components/molecules/ActionMenu.molecule';
import { toast } from '@/lib/toast';
import { isDemoMode, getDemoMessage } from '@/lib/demo-config';

interface Condition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'managed' | 'resolved';
  notes: string;
}

interface ResidentConditionsProps {
  conditions?: Condition[] | null;
  isEditing: boolean;
  onConditionsChange: (conditions: Condition[]) => void;
  residentId?: string;
}

export const ResidentConditionsMolecule = ({
  conditions = [],
  isEditing,
  onConditionsChange,
  residentId,
}: ResidentConditionsProps) => {
  // Ensure conditions is always an array
  const safeConditions = Array.isArray(conditions) ? conditions : [];
  const [showModal, setShowModal] = useState(false);
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addCondition = async (conditionData: {
    name: string;
    diagnosedDate: string;
    status: string;
    notes: string;
  }) => {
    if (!residentId) return;

    // Block in demo mode
    if (isDemoMode()) {
      toast({
        title: 'Demo Mode',
        description: getDemoMessage('actionNotPersisted'),
        type: 'info',
      });
      setShowModal(false);
      setEditingCondition(null);
      return;
    }

    setIsLoading(true);
    try {
      if (editingCondition) {
        // Update existing condition
        const response = await fetch(
          `/api/residents/${residentId}/conditions/${editingCondition.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conditionData),
          }
        );

        if (response.ok) {
          const updatedCondition = await response.json();
          onConditionsChange(
            safeConditions.map(c => (c.id === editingCondition.id ? updatedCondition : c))
          );
        }
        setEditingCondition(null);
      } else {
        // Add new condition
        const response = await fetch(`/api/residents/${residentId}/conditions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conditionData),
        });

        if (response.ok) {
          const newCondition = await response.json();
          onConditionsChange([...safeConditions, newCondition]);
        }
      }
    } catch (error) {
      console.error('Error saving condition:', error);
    } finally {
      setIsLoading(false);
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

  const removeCondition = async (id: string) => {
    if (!residentId) return;

    // Block in demo mode
    if (isDemoMode()) {
      toast({
        title: 'Demo Mode',
        description: getDemoMessage('actionNotPersisted'),
        type: 'info',
      });
      return;
    }

    try {
      const response = await fetch(`/api/residents/${residentId}/conditions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onConditionsChange(safeConditions.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting condition:', error);
    }
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
        {safeConditions.map(condition => (
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
        {safeConditions.length === 0 && (
          <TextAtom variant="small" color="muted" className="text-center py-4">
            No medical conditions recorded
          </TextAtom>
        )}
      </div>

      {/* Add New Condition Button */}
      {isEditing && (
        <div className="border-t pt-4">
          <ButtonAtom variant="primary" onClick={handleAdd}>
            <DynamicIconAtom name="Plus" size="sm" className="mr-2" />
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
        isLoading={isLoading}
      />
    </CardAtom>
  );
};
