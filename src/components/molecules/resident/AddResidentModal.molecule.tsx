'use client';

import { useState } from 'react';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';

const adlOptions = ['bathing', 'dressing', 'eating', 'toileting', 'mobility', 'health'];

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <ButtonAtom
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </ButtonAtom>
        <TextAtom variant="h3" weight="semibold" className="mb-4">
          Add Resident
        </TextAtom>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onValueChange={(value) => handleChange('status', value)}
              placeholder="Select care status"
              options={[
                { value: 'independent', label: 'Independent' },
                { value: 'partial', label: 'Partial' },
                { value: 'full', label: 'Full' }
              ]}
            />
          </div>
          <div>
            <LabelAtom>ADLs</LabelAtom>
            <div className="flex flex-wrap gap-2">
              {adlOptions.map(adl => (
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
          <div className="flex justify-end gap-2">
            <ButtonAtom variant="secondary" onClick={onClose}>
              Cancel
            </ButtonAtom>
            <ButtonAtom variant="primary" type="submit">
              Add
            </ButtonAtom>
          </div>
        </form>
      </div>
    </div>
  );
};
