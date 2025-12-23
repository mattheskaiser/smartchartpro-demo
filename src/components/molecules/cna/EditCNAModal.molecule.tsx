'use client';

import React, { useState, useEffect } from 'react';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { SelectAtom } from '@/components/atoms/Select.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';
import { ImageUploadMolecule } from '@/components/molecules/ImageUpload.molecule';
import { CNA } from '@/types/cna';

interface EditCNAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cna: {
    name: string;
    email: string;
    phone?: string;
    certificationNumber?: string;
    hireDate?: string;
    notes?: string;
    imageFile?: File;
    imageData?: string;
  }) => void;
  editingCNA?: CNA;
  isLoading?: boolean;
}

export const EditCNAModalMolecule = ({
  isOpen,
  onClose,
  onSubmit,
  editingCNA,
  isLoading = false,
}: EditCNAModalProps) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    certificationNumber: '',
    hireDate: '',
    notes: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageData, setCurrentImageData] = useState<string>('');

  // Update form when editing CNA changes
  useEffect(() => {
    if (editingCNA) {
      setForm({
        name: editingCNA.name || '',
        email: editingCNA.email || '',
        phone: editingCNA.phone || '',
        certificationNumber: editingCNA.certificationNumber || '',
        hireDate: editingCNA.hireDate || '',
        notes: editingCNA.notes || '',
      });
      setCurrentImageData(editingCNA.imageData || '');
    }
  }, [editingCNA]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && form.name.trim() && form.email.trim()) {
      onSubmit({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        certificationNumber: form.certificationNumber || undefined,
        hireDate: form.hireDate || undefined,
        notes: form.notes || undefined,
        imageFile: imageFile || undefined,
        imageData: currentImageData,
      });
      // Don't reset form or close modal here - let the parent handle success
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    if (!isLoading) {
      setForm({
        name: '',
        email: '',
        phone: '',
        certificationNumber: '',
        hireDate: '',
        notes: '',
      });
      setImageFile(null);
      setCurrentImageData('');
      onClose();
    }
  };

  const handleImageChange = (file: File | null, base64Data: string | null) => {
    setImageFile(file);
    if (base64Data) {
      setCurrentImageData(base64Data);
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={editingCNA ? 'Edit CNA' : 'Add CNA'}
      submitLabel={editingCNA ? 'Update CNA' : 'Add CNA'}
      isSubmitting={isLoading}
    >
      <ImageUploadMolecule
        currentImage={currentImageData}
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
            placeholder="Enter CNA's full name"
            required
          />
        </div>
        <div>
          <LabelAtom required>Email</LabelAtom>
          <InputAtom
            type="email"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom>Phone Number</LabelAtom>
          <InputAtom
            type="tel"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <LabelAtom>Certification Number</LabelAtom>
          <InputAtom
            type="text"
            value={form.certificationNumber}
            onChange={e => setForm(prev => ({ ...prev, certificationNumber: e.target.value }))}
            placeholder="CNA-12345"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <LabelAtom>Hire Date</LabelAtom>
          <DatePickerMolecule
            value={form.hireDate}
            onChange={date => setForm(prev => ({ ...prev, hireDate: date }))}
            placeholder="Select hire date"
          />
        </div>
      </div>

      <div>
        <LabelAtom>Notes</LabelAtom>
        <TextareaAtom
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about the CNA..."
          rows={3}
        />
      </div>
    </FormModalOrganism>
  );
};
