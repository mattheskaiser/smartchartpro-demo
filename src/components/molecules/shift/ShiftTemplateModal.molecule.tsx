'use client';

import { useState, useEffect } from 'react';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import {
  useCreateShiftTemplate,
  useUpdateShiftTemplate,
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

interface ShiftTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftTemplate?: ShiftTemplate | null; // null for new, ShiftTemplate for edit
}

interface ShiftTemplateFormData {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  description: string;
}

export function ShiftTemplateModalMolecule({
  isOpen,
  onClose,
  shiftTemplate,
}: ShiftTemplateModalProps) {
  const [formData, setFormData] = useState<ShiftTemplateFormData>({
    name: '',
    startTime: '',
    endTime: '',
    color: '#3B82F6',
    description: '',
  });

  const createMutation = useCreateShiftTemplate();
  const updateMutation = useUpdateShiftTemplate();

  const isEditing = !!shiftTemplate;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Reset form when modal opens/closes or shift template changes
  useEffect(() => {
    if (isOpen) {
      if (shiftTemplate) {
        setFormData({
          name: shiftTemplate.name,
          startTime: shiftTemplate.startTime,
          endTime: shiftTemplate.endTime,
          color: shiftTemplate.color || '#3B82F6',
          description: shiftTemplate.description || '',
        });
      } else {
        setFormData({
          name: '',
          startTime: '',
          endTime: '',
          color: '#3B82F6',
          description: '',
        });
      }
    }
  }, [isOpen, shiftTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && shiftTemplate) {
        await updateMutation.mutateAsync({
          id: shiftTemplate.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving shift template:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${formData.color}20`,
                    color: formData.color,
                  }}
                >
                  <DynamicIconAtom name="Clock" size="md" className="text-current" />
                </div>
                <div>
                  <TextAtom variant="h3" weight="semibold">
                    {isEditing ? 'Edit Shift Template' : 'Add New Shift Template'}
                  </TextAtom>
                  <TextAtom variant="small" className="text-gray-500">
                    {isEditing ? 'Update shift details' : 'Create a new shift for your facility'}
                  </TextAtom>
                </div>
              </div>
              <ButtonAtom
                variant="ghost"
                size="sm"
                onClick={handleClose}
                type="button"
                disabled={isLoading}
              >
                <DynamicIconAtom name="X" size="sm" />
              </ButtonAtom>
            </div>

            <div className="space-y-4">
              <div>
                <LabelAtom htmlFor="shift-name" required>
                  Shift Name
                </LabelAtom>
                <InputAtom
                  id="shift-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning, Day, Evening, Night"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <LabelAtom htmlFor="start-time" required>
                    Start Time
                  </LabelAtom>
                  <InputAtom
                    id="start-time"
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <LabelAtom htmlFor="end-time" required>
                    End Time
                  </LabelAtom>
                  <InputAtom
                    id="end-time"
                    type="time"
                    value={formData.endTime}
                    onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <LabelAtom htmlFor="shift-color">Color</LabelAtom>
                <div className="flex items-center gap-3">
                  <input
                    id="shift-color"
                    type="color"
                    value={formData.color}
                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    disabled={isLoading}
                  />
                  <InputAtom
                    type="text"
                    value={formData.color}
                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#3B82F6"
                    className="flex-1"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <LabelAtom htmlFor="description">Description (Optional)</LabelAtom>
                <InputAtom
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional notes about this shift"
                  disabled={isLoading}
                />
              </div>

              {formData.startTime && formData.endTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <DynamicIconAtom name="Clock" size="sm" className="text-blue-600" />
                    <TextAtom variant="small" className="text-blue-800">
                      <strong>Duration:</strong>{' '}
                      {calculateShiftDuration(formData.startTime, formData.endTime).toFixed(1)}{' '}
                      hours ({formatShiftTime(formData.startTime, formData.endTime)})
                    </TextAtom>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <ButtonAtom
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={isLoading}
                loadingText={isEditing ? 'Updating...' : 'Creating...'}
              >
                {isEditing ? 'Update Shift' : 'Create Shift'}
              </ButtonAtom>
              <ButtonAtom
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </ButtonAtom>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
