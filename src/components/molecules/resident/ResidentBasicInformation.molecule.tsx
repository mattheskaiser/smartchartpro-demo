'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';

interface ResidentBasicInformationProps {
  resident?: {
    name?: string;
    room?: string;
    dateOfBirth?: string | null;
    admissionDate?: string | null;
    status?: string;
    assignedCNA?: string | null;
  } | null;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

export const ResidentBasicInformationMolecule = ({
  resident,
  isEditing,
  onInputChange,
}: ResidentBasicInformationProps) => {
  // Provide safe defaults
  const safeResident = {
    name: '',
    room: '',
    dateOfBirth: '',
    admissionDate: '',
    status: 'independent',
    assignedCNA: '',
    ...resident,
  };
  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        Basic Information
      </TextAtom>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <LabelAtom>Full Name</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={safeResident.name}
              onChange={e => onInputChange('name', e.target.value)}
            />
          ) : (
            <TextAtom>{safeResident.name}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Room Number</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={safeResident.room}
              onChange={e => onInputChange('room', e.target.value)}
            />
          ) : (
            <TextAtom>{safeResident.room}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Date of Birth</LabelAtom>
          {isEditing ? (
            <DatePickerMolecule
              value={safeResident.dateOfBirth ?? undefined}
              onChange={date => onInputChange('dateOfBirth', date)}
              placeholder="Select date of birth"
            />
          ) : (
            <TextAtom>
              {safeResident.dateOfBirth
                ? new Date(safeResident.dateOfBirth).toLocaleDateString()
                : 'Not specified'}
            </TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Admission Date</LabelAtom>
          {isEditing ? (
            <DatePickerMolecule
              value={safeResident.admissionDate ?? undefined}
              onChange={date => onInputChange('admissionDate', date)}
              placeholder="Select admission date"
            />
          ) : (
            <TextAtom>
              {safeResident.admissionDate
                ? new Date(safeResident.admissionDate).toLocaleDateString()
                : 'Not specified'}
            </TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Care Status</LabelAtom>
          {isEditing ? (
            <DropdownAtom
              value={safeResident.status}
              onValueChange={value => onInputChange('status', value)}
              placeholder="Select care status"
              options={[
                { value: 'independent', label: 'Independent' },
                { value: 'partial', label: 'Partial' },
                { value: 'full', label: 'Full' },
              ]}
            />
          ) : (
            <BadgeAtom variant={safeResident.status as 'info' | 'warning' | 'success'}>
              {safeResident.status}
            </BadgeAtom>
          )}
        </div>
        <div>
          <LabelAtom>Assigned CNA</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={safeResident.assignedCNA ?? ''}
              onChange={e => onInputChange('assignedCNA', e.target.value)}
            />
          ) : (
            <TextAtom>{safeResident.assignedCNA || 'Not assigned'}</TextAtom>
          )}
        </div>
      </div>
    </CardAtom>
  );
};
