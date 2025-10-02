'use client';

import React, { useState } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';
import { SPECIALTY_OPTIONS } from '@/constants/medical';

interface SpecialistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (specialist: {
    name: string;
    specialty: string;
    phone: string;
    email: string;
    notes: string;
  }) => void;
  editingSpecialist?: {
    id: string;
    name: string;
    specialty: string;
    phone: string;
    email?: string;
    notes?: string;
  } | null;
}

export const SpecialistModalMolecule = ({
  isOpen,
  onClose,
  onSubmit,
  editingSpecialist,
}: SpecialistModalProps) => {
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    notes: '',
  });

  // Update form when editing specialist changes
  React.useEffect(() => {
    if (editingSpecialist) {
      setForm({
        name: editingSpecialist.name,
        specialty: editingSpecialist.specialty,
        phone: editingSpecialist.phone,
        email: editingSpecialist.email || '',
        notes: editingSpecialist.notes || '',
      });
    } else {
      setForm({ name: '', specialty: '', phone: '', email: '', notes: '' });
    }
  }, [editingSpecialist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.specialty.trim() && form.phone.trim()) {
      onSubmit(form);
      setForm({ name: '', specialty: '', phone: '', email: '', notes: '' });
      onClose();
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingSpecialist ? 'Edit Specialist/Doctor' : 'Add Specialist/Doctor'}
      submitLabel={editingSpecialist ? 'Update Specialist' : 'Add Specialist'}
      size="md"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom required>Doctor Name</LabelAtom>
          <InputAtom
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Dr. Sarah Mitchell"
            required
          />
        </div>
        <div>
          <LabelAtom required>Specialty</LabelAtom>
          <DropdownAtom
            value={form.specialty}
            onValueChange={value => setForm(prev => ({ ...prev, specialty: value }))}
            placeholder="Select specialty"
            options={SPECIALTY_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom required>Phone</LabelAtom>
          <InputAtom
            type="tel"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(555) 123-4567"
            required
          />
        </div>
        <div>
          <LabelAtom>Email</LabelAtom>
          <InputAtom
            type="email"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="doctor@example.com"
          />
        </div>
      </div>

      <div>
        <LabelAtom>Notes</LabelAtom>
        <TextareaAtom
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this specialist..."
          rows={3}
        />
      </div>
    </FormModalOrganism>
  );
};
