'use client';

import React, { useState } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (allergy: { name: string; severity: string; reaction: string }) => void;
  editingAllergy?: { id: string; name: string; severity: string; reaction: string } | null;
}

export const AllergyModalMolecule = ({
  isOpen,
  onClose,
  onSubmit,
  editingAllergy,
}: AllergyModalProps) => {
  const [form, setForm] = useState({
    name: '',
    severity: 'mild',
    reaction: '',
  });

  // Update form when editing allergy changes
  React.useEffect(() => {
    if (editingAllergy) {
      setForm({
        name: editingAllergy.name,
        severity: editingAllergy.severity,
        reaction: editingAllergy.reaction,
      });
    } else {
      setForm({ name: '', severity: 'mild', reaction: '' });
    }
  }, [editingAllergy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim()) {
      onSubmit(form);
      setForm({ name: '', severity: 'mild', reaction: '' });
      onClose();
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingAllergy ? 'Edit Allergy' : 'Add Allergy'}
      submitLabel={editingAllergy ? 'Update Allergy' : 'Add Allergy'}

    >
      <div>
        <LabelAtom required>Allergy Name</LabelAtom>
        <InputAtom
          type="text"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Penicillin"
          required
        />
      </div>
      <div>
        <LabelAtom>Severity</LabelAtom>
        <DropdownAtom
          value={form.severity}
          onValueChange={value => setForm(prev => ({ ...prev, severity: value }))}
          options={[
            { value: 'mild', label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe', label: 'Severe' },
          ]}
        />
      </div>
      <div>
        <LabelAtom>Reaction</LabelAtom>
        <InputAtom
          type="text"
          value={form.reaction}
          onChange={e => setForm(prev => ({ ...prev, reaction: e.target.value }))}
          placeholder="e.g., Rash, swelling"
        />
      </div>
    </FormModalOrganism>
  );
};
