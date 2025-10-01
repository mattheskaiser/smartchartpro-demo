'use client';

import React, { useState } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medication: { name: string; dosage: string; frequency: string; instructions: string; startDate: string }) => void;
  editingMedication?: { id: string; name: string; dosage: string; frequency: string; instructions: string; startDate: string } | null;
}

export const AddMedicationModalMolecule = ({ isOpen, onClose, onSubmit, editingMedication }: AddMedicationModalProps) => {
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    startDate: ''
  });

  // Update form when editing medication changes
  React.useEffect(() => {
    if (editingMedication) {
      setForm({
        name: editingMedication.name,
        dosage: editingMedication.dosage,
        frequency: editingMedication.frequency,
        instructions: editingMedication.instructions,
        startDate: editingMedication.startDate
      });
    } else {
      setForm({ name: '', dosage: '', frequency: '', instructions: '', startDate: '' });
    }
  }, [editingMedication]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim()) {
      onSubmit(form);
      setForm({ name: '', dosage: '', frequency: '', instructions: '', startDate: '' });
      onClose();
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingMedication ? 'Edit Medication' : 'Add Medication'}
      submitLabel={editingMedication ? 'Update Medication' : 'Add Medication'}
      size="md"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom required>Medication Name</LabelAtom>
          <InputAtom
            type="text"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Lisinopril"
            required
          />
        </div>
        <div>
          <LabelAtom>Dosage</LabelAtom>
          <InputAtom
            type="text"
            value={form.dosage}
            onChange={(e) => setForm(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 10mg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom>Frequency</LabelAtom>
          <InputAtom
            type="text"
            value={form.frequency}
            onChange={(e) => setForm(prev => ({ ...prev, frequency: e.target.value }))}
            placeholder="e.g., Once daily"
          />
        </div>
        <div>
          <LabelAtom>Start Date</LabelAtom>
          <DatePickerMolecule
            value={form.startDate}
            onChange={(date) => setForm(prev => ({ ...prev, startDate: date }))}
            placeholder="Select start date"
          />
        </div>
      </div>
      <div>
        <LabelAtom>Instructions</LabelAtom>
        <TextareaAtom
          value={form.instructions}
          onChange={(e) => setForm(prev => ({ ...prev, instructions: e.target.value }))}
          placeholder="e.g., Take with food, avoid alcohol..."
          rows={3}
        />
      </div>
    </FormModalOrganism>
  );
};