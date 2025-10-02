'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';

interface ResidentBasicInformationProps {
  resident: {
    name: string;
    room: string;
    dateOfBirth: string;
    admissionDate: string;
    status: string;
    assignedCNA: string;
  };
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

export const ResidentBasicInformationMolecule = ({
  resident,
  isEditing,
  onInputChange,
}: ResidentBasicInformationProps) => {
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
              value={resident.name}
              onChange={e => onInputChange('name', e.target.value)}
            />
          ) : (
            <TextAtom>{resident.name}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Room Number</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={resident.room}
              onChange={e => onInputChange('room', e.target.value)}
            />
          ) : (
            <TextAtom>{resident.room}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Date of Birth</LabelAtom>
          {isEditing ? (
            <DatePickerMolecule
              value={resident.dateOfBirth}
              onChange={date => onInputChange('dateOfBirth', date)}
              placeholder="Select date of birth"
            />
          ) : (
            <TextAtom>{new Date(resident.dateOfBirth).toLocaleDateString()}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Admission Date</LabelAtom>
          {isEditing ? (
            <DatePickerMolecule
              value={resident.admissionDate}
              onChange={date => onInputChange('admissionDate', date)}
              placeholder="Select admission date"
            />
          ) : (
            <TextAtom>{new Date(resident.admissionDate).toLocaleDateString()}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Care Status</LabelAtom>
          {isEditing ? (
            <DropdownAtom
              value={resident.status}
              onValueChange={value => onInputChange('status', value)}
              placeholder="Select care status"
              options={[
                { value: 'independent', label: 'Independent' },
                { value: 'partial', label: 'Partial' },
                { value: 'full', label: 'Full' },
              ]}
            />
          ) : (
            <BadgeAtom variant={resident.status as 'info' | 'warning' | 'success'}>
              {resident.status}
            </BadgeAtom>
          )}
        </div>
        <div>
          <LabelAtom>Assigned CNA</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={resident.assignedCNA}
              onChange={e => onInputChange('assignedCNA', e.target.value)}
            />
          ) : (
            <TextAtom>{resident.assignedCNA}</TextAtom>
          )}
        </div>
      </div>
    </CardAtom>
  );
};
