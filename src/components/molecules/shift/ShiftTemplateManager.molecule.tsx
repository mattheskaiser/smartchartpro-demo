'use client';

import { useState } from 'react';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { ConfirmationModalMolecule } from '@/components/molecules/ConfirmationModal.molecule';
import { ShiftTemplateModalMolecule } from '@/components/molecules/shift/ShiftTemplateModal.molecule';
import {
  useShiftTemplates,
  useUpdateShiftTemplate,
  useDeleteShiftTemplate,
  formatShiftTime,
  calculateShiftDuration,
} from '@/hooks/useShiftTemplates';

interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  color?: string;
  description?: string;
  sortOrder: number;
}

export function ShiftTemplateManagerMolecule() {
  const [editingShift, setEditingShift] = useState<ShiftTemplate | null>(null);
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<ShiftTemplate | null>(null);

  const { data: shiftTemplates, isLoading } = useShiftTemplates();
  const updateMutation = useUpdateShiftTemplate();
  const deleteMutation = useDeleteShiftTemplate();

  const handleEdit = (shift: ShiftTemplate) => {
    setEditingShift(shift);
  };

  const handleDelete = async (shift: ShiftTemplate) => {
    try {
      await deleteMutation.mutateAsync(shift.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting shift template:', error);
    }
  };

  const toggleActive = async (shift: ShiftTemplate) => {
    try {
      await updateMutation.mutateAsync({
        id: shift.id,
        data: { isActive: !shift.isActive },
      });
    } catch (error) {
      console.error('Error toggling shift status:', error);
    }
  };

  const closeModal = () => {
    setEditingShift(null);
    setIsAddingShift(false);
  };

  if (isLoading) {
    return <LoadingStateMolecule message="Loading shift templates..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TextAtom variant="body" weight="medium" className="text-gray-900">
            Shift Templates
          </TextAtom>
          <TextAtom variant="small" className="text-gray-500 mt-1">
            Configure the shifts available at your facility
          </TextAtom>
        </div>
        <ButtonAtom variant="primary" size="sm" onClick={() => setIsAddingShift(true)}>
          <DynamicIconAtom name="Plus" size="sm" className="mr-2" />
          Add Shift
        </ButtonAtom>
      </div>

      {/* Shift Templates List */}
      <div className="space-y-3">
        {shiftTemplates?.length === 0 ? (
          <div className="p-8 text-center border border-gray-200 rounded-lg">
            <DynamicIconAtom name="Clock" size="lg" className="mx-auto text-gray-400 mb-4" />
            <TextAtom variant="body" weight="medium" className="text-gray-500 mb-2">
              No shift templates configured
            </TextAtom>
            <TextAtom variant="small" className="text-gray-400 mb-4">
              Add your first shift template to get started with scheduling
            </TextAtom>
            <ButtonAtom variant="primary" onClick={() => setIsAddingShift(true)}>
              <DynamicIconAtom name="Plus" size="sm" className="mr-2" />
              Add First Shift
            </ButtonAtom>
          </div>
        ) : (
          shiftTemplates?.map(shift => (
            <div
              key={shift.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: shift.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <TextAtom variant="body" weight="medium" className="text-gray-900">
                      {shift.name}
                    </TextAtom>
                    <BadgeAtom variant={shift.isActive ? 'success' : 'info'}>
                      {shift.isActive ? 'Active' : 'Inactive'}
                    </BadgeAtom>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <TextAtom variant="small" className="text-gray-500">
                      {formatShiftTime(shift.startTime, shift.endTime)}
                    </TextAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      {calculateShiftDuration(shift.startTime, shift.endTime).toFixed(1)} hours
                    </TextAtom>
                  </div>
                  {shift.description && (
                    <TextAtom variant="small" className="text-gray-400 mt-1">
                      {shift.description}
                    </TextAtom>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ButtonAtom
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(shift)}
                  disabled={updateMutation.isPending}
                  title={shift.isActive ? 'Deactivate shift' : 'Activate shift'}
                >
                  <DynamicIconAtom name={shift.isActive ? 'EyeOff' : 'Eye'} size="sm" />
                </ButtonAtom>
                <ButtonAtom
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(shift)}
                  title="Edit shift"
                >
                  <DynamicIconAtom name="Pencil" size="sm" />
                </ButtonAtom>
                <ButtonAtom
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(shift)}
                  title="Delete shift"
                >
                  <DynamicIconAtom name="Trash2" size="sm" className="text-red-500" />
                </ButtonAtom>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <ShiftTemplateModalMolecule
        isOpen={isAddingShift || !!editingShift}
        onClose={closeModal}
        shiftTemplate={editingShift}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmationModalMolecule
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete Shift Template"
          message={`Are you sure you want to delete the "${deleteConfirm.name}" shift template? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
