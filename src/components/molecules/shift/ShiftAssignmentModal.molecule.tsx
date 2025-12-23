'use client';

import { useState } from 'react';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { SelectAtom } from '@/components/atoms/Select.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { FormModalOrganism } from '@/components/organisms/Modal.organism';

interface CNA {
  id: string;
  name: string;
  imageData?: string;
  email: string;
  certificationNumber?: string;
}

interface Resident {
  id: string;
  name: string;
  room: string;
  imageUrl?: string;
  adlNeeds: string[];
}

interface ShiftAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: { cnaId: string; residentIds: string[]; notes?: string }) => void;
  shift: {
    id: string;
    type: string;
    date: string;
    time: string;
  };
  availableCNAs: CNA[];
  availableResidents: Resident[];
  isLoading?: boolean;
}

export const ShiftAssignmentModalMolecule = ({
  isOpen,
  onClose,
  onSubmit,
  shift,
  availableCNAs,
  availableResidents,
  isLoading = false,
}: ShiftAssignmentModalProps) => {
  const [selectedCNA, setSelectedCNA] = useState('');
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCNA) {
      onSubmit({
        cnaId: selectedCNA,
        residentIds: selectedResidents,
        notes: notes || undefined,
      });
      // Reset form
      setSelectedCNA('');
      setSelectedResidents([]);
      setNotes('');
    }
  };

  const handleClose = () => {
    setSelectedCNA('');
    setSelectedResidents([]);
    setNotes('');
    onClose();
  };

  const toggleResident = (residentId: string) => {
    setSelectedResidents(prev =>
      prev.includes(residentId) ? prev.filter(id => id !== residentId) : [...prev, residentId]
    );
  };

  const selectedCNAData = availableCNAs.find(cna => cna.id === selectedCNA);
  const maxResidents = 8; // Could come from settings

  const getShiftIcon = (shiftType: string) => {
    switch (shiftType) {
      case 'Morning':
        return 'Sun';
      case 'Evening':
        return 'Sunset';
      case 'Night':
        return 'Moon';
      default:
        return 'Clock';
    }
  };

  return (
    <FormModalOrganism
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Assign Shift"
      submitLabel="Assign Shift"
      isSubmitting={isLoading}
    >
      {/* Shift Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DynamicIconAtom
              name={getShiftIcon(shift.type) as 'Sun' | 'Sunset' | 'Moon' | 'Clock'}
              size="md"
              className="text-blue-600"
            />
          </div>
          <div>
            <TextAtom variant="h3" weight="semibold">
              {shift.type} Shift
            </TextAtom>
            <TextAtom variant="small" className="text-gray-600">
              {new Date(shift.date).toLocaleDateString()} • {shift.time}
            </TextAtom>
          </div>
        </div>
      </div>

      {/* CNA Selection */}
      <div className="mb-6">
        <LabelAtom required>Select CNA</LabelAtom>
        <SelectAtom value={selectedCNA} onChange={e => setSelectedCNA(e.target.value)} required>
          <option value="">Choose a CNA...</option>
          {availableCNAs.map(cna => (
            <option key={cna.id} value={cna.id}>
              {cna.name} - {cna.email}
            </option>
          ))}
        </SelectAtom>

        {selectedCNAData && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AvatarAtom src={selectedCNAData.imageData} alt={selectedCNAData.name} size="sm" />
              <div>
                <TextAtom variant="body" weight="medium">
                  {selectedCNAData.name}
                </TextAtom>
                <TextAtom variant="small" className="text-gray-500">
                  {selectedCNAData.certificationNumber &&
                    `Cert: ${selectedCNAData.certificationNumber}`}
                </TextAtom>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resident Assignment */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <LabelAtom>
            Assign Residents ({selectedResidents.length}/{maxResidents})
          </LabelAtom>
          <div className="flex gap-2">
            <ButtonAtom
              variant="ghost"
              size="sm"
              onClick={() => setSelectedResidents([])}
              type="button"
            >
              Clear All
            </ButtonAtom>
            <ButtonAtom
              variant="ghost"
              size="sm"
              onClick={() =>
                setSelectedResidents(availableResidents.slice(0, maxResidents).map(r => r.id))
              }
              type="button"
            >
              Select All
            </ButtonAtom>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {availableResidents.map(resident => {
            const isSelected = selectedResidents.includes(resident.id);
            const isDisabled = !isSelected && selectedResidents.length >= maxResidents;

            return (
              <div
                key={resident.id}
                className={`
                  flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors
                  ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => !isDisabled && toggleResident(resident.id)}
              >
                <CheckboxAtom
                  checked={isSelected}
                  onCheckedChange={() => !isDisabled && toggleResident(resident.id)}
                  disabled={isDisabled}
                />
                <AvatarAtom src={resident.imageUrl} alt={resident.name} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <TextAtom variant="body" weight="medium">
                      {resident.name}
                    </TextAtom>
                    <TextAtom variant="small" className="text-gray-500">
                      Room {resident.room}
                    </TextAtom>
                  </div>
                  {resident.adlNeeds.length > 0 && (
                    <TextAtom variant="small" className="text-gray-500">
                      ADL: {resident.adlNeeds.slice(0, 3).join(', ')}
                      {resident.adlNeeds.length > 3 && ` +${resident.adlNeeds.length - 3} more`}
                    </TextAtom>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedResidents.length >= maxResidents && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            Maximum residents per shift reached ({maxResidents})
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <LabelAtom>Shift Notes</LabelAtom>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any special instructions or notes for this shift..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
        />
      </div>
    </FormModalOrganism>
  );
};
