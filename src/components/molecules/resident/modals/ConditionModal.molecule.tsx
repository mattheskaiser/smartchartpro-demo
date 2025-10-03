'use client';

import React, { useState } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';

interface ConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (condition: {
    name: string;
    diagnosedDate: string;
    status: string;
    notes: string;
  }) => void;
  editingCondition?: {
    id: string;
    name: string;
    diagnosedDate: string;
    status: string;
    notes: string;
  } | null;
}

export const ConditionModalMolecule = ({
  isOpen,
  onClose,
  onSubmit,
  editingCondition,
}: ConditionModalProps) => {
  const [form, setForm] = useState({
    name: '',
    diagnosedDate: '',
    status: 'active',
    notes: '',
  });

  // Update form when editing condition changes
  React.useEffect(() => {
    if (editingCondition) {
      setForm({
        name: editingCondition.name,
        diagnosedDate: editingCondition.diagnosedDate,
        status: editingCondition.status,
        notes: editingCondition.notes,
      });
    } else {
      setForm({ name: '', diagnosedDate: '', status: 'active', notes: '' });
    }
  }, [editingCondition]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim()) {
      onSubmit(form);
      setForm({ name: '', diagnosedDate: '', status: 'active', notes: '' });
      onClose();
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingCondition ? 'Edit Medical Condition' : 'Add Medical Condition'}
      submitLabel={editingCondition ? 'Update Condition' : 'Add Condition'}

    >
      <div>
        <LabelAtom required>Condition Name</LabelAtom>
        <InputAtom
          type="text"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Diabetes Type 2"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom>Status</LabelAtom>
          <DropdownAtom
            value={form.status}
            onValueChange={value => setForm(prev => ({ ...prev, status: value }))}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'managed', label: 'Managed' },
              { value: 'resolved', label: 'Resolved' },
            ]}
          />
        </div>
        <div>
          <LabelAtom>Diagnosed Date</LabelAtom>
          <DatePickerMolecule
            value={form.diagnosedDate}
            onChange={date => setForm(prev => ({ ...prev, diagnosedDate: date }))}
            placeholder="Select date"
          />
        </div>
      </div>
      <div>
        <LabelAtom>Notes</LabelAtom>
        <TextareaAtom
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this condition..."
          rows={3}
        />
      </div>
    </FormModalOrganism>
  );
};
