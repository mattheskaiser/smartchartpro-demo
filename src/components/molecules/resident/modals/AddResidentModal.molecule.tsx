'use client';

import { useState } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';
import { ADL_OPTIONS, CARE_STATUS_OPTIONS } from '@/constants/adl'; 

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export const AddResidentModalMolecule = ({ isOpen, onClose, onSubmit }: AddResidentModalProps) => {
  const [form, setForm] = useState({
    name: '',
    room: '',
    status: 'independent',
    adls: [] as string[],
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleAdlChange = (adl: string) => {
    setForm(prev => ({
      ...prev,
      adls: prev.adls.includes(adl) ? prev.adls.filter(a => a !== adl) : [...prev.adls, adl],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', room: '', status: 'independent', adls: [] });
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Add Resident"
      submitLabel="Add"
      size="sm"
    >
      <div>
        <LabelAtom required>Name</LabelAtom>
        <InputAtom
          type="text"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          required
        />
      </div>
      <div>
        <LabelAtom required>Room</LabelAtom>
        <InputAtom
          type="text"
          value={form.room}
          onChange={e => handleChange('room', e.target.value)}
          required
        />
      </div>
      <div>
        <LabelAtom>Status</LabelAtom>
        <DropdownAtom
          value={form.status}
          onValueChange={value => handleChange('status', value)}
          placeholder="Select care status"
          options={CARE_STATUS_OPTIONS}
        />
      </div>
      <div>
        <LabelAtom>ADLs</LabelAtom>
        <div className="flex flex-wrap gap-2">
          {ADL_OPTIONS.map(adl => (
            <label key={adl} className="flex items-center gap-1 text-sm">
              <CheckboxAtom
                checked={form.adls.includes(adl)}
                onCheckedChange={() => handleAdlChange(adl)}
              />
              <TextAtom variant="small" className="capitalize">
                {adl}
              </TextAtom>
            </label>
          ))}
        </div>
      </div>
    </FormModalOrganism>
  );
};
