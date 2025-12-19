'use client';

import React, { useState, useEffect } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';
import { ImageUploadMolecule } from '@/components/molecules/ImageUpload.molecule';
import { Resident } from '@/types/resident';

interface EditResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resident: {
    name: string;
    room: string;
    dateOfBirth: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    imageFile?: File;
    imageUrl?: string;
  }) => void;
  editingResident?: Resident;
  isLoading?: boolean;
}

export const EditResidentModalMolecule = ({
  isOpen,
  onClose,
  onSubmit,
  editingResident,
  isLoading = false,
}: EditResidentModalProps) => {
  const [form, setForm] = useState({
    name: '',
    room: '',
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  // Update form when editing resident changes
  useEffect(() => {
    if (editingResident) {
      setForm({
        name: editingResident.name || '',
        room: editingResident.room || '',
        dateOfBirth: editingResident.dateOfBirth || '',
        emergencyContactName: editingResident.emergencyContactName || '',
        emergencyContactPhone: editingResident.emergencyContactPhone || '',
      });
      setCurrentImageUrl(editingResident.imageUrl || '');
    }
  }, [editingResident]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isLoading &&
      form.name.trim() &&
      form.room.trim() &&
      form.dateOfBirth.trim() &&
      form.emergencyContactName.trim() &&
      form.emergencyContactPhone.trim()
    ) {
      onSubmit({
        ...form,
        imageFile: imageFile || undefined,
        imageUrl: currentImageUrl,
      });
      // Don't reset form or close modal here - let the parent handle success
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    if (!isLoading) {
      setForm({
        name: '',
        room: '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      });
      setImageFile(null);
      setCurrentImageUrl('');
      onClose();
    }
  };

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setImageFile(file);
    if (previewUrl) {
      setCurrentImageUrl(previewUrl);
    } else if (file === null) {
      // Handle image removal
      setCurrentImageUrl('');
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={editingResident ? 'Edit Resident' : 'Add Resident'}
      submitLabel={editingResident ? 'Update Resident' : 'Add Resident'}
      isSubmitting={isLoading}
    >
      <ImageUploadMolecule
        currentImage={currentImageUrl}
        onImageChange={handleImageChange}
        label="Profile Picture"
      />

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
