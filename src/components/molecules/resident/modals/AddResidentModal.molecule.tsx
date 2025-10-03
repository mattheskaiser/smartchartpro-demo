'use client';

import React, { useState } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resident: {
    name: string;
    room: string;
    dateOfBirth: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  }) => void;
}

export const AddResidentModalMolecule = ({ isOpen, onClose, onSubmit }: AddResidentModalProps) => {
  const [form, setForm] = useState({
    name: '',
    room: '',
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.room.trim() && form.emergencyContactName.trim()) {
      onSubmit(form);
      setForm({
        name: '',
        room: '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      });
      onClose();
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Add Resident"
      submitLabel="Add Resident"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom required>Full Name</LabelAtom>
          <InputAtom
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter resident's full name"
            required
          />
        </div>
        <div>
          <LabelAtom required>Room Number</LabelAtom>
          <InputAtom
            type="text"
            value={form.room}
            onChange={e => setForm(prev => ({ ...prev, room: e.target.value }))}
            placeholder="e.g., 101"
            required
          />
        </div>
      </div>

      <div>
        <LabelAtom required>Date of Birth</LabelAtom>
        <DatePickerMolecule
          value={form.dateOfBirth}
          onChange={date => setForm(prev => ({ ...prev, dateOfBirth: date }))}
          placeholder="Select date of birth"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom required>Emergency Contact Name</LabelAtom>
          <InputAtom
            type="text"
            value={form.emergencyContactName}
            onChange={e => setForm(prev => ({ ...prev, emergencyContactName: e.target.value }))}
            placeholder="Contact name"
            required
          />
        </div>
        <div>
          <LabelAtom required>Emergency Contact Phone</LabelAtom>
          <InputAtom
            type="tel"
            value={form.emergencyContactPhone}
            onChange={e => setForm(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>
    </FormModalOrganism>
  );
};
