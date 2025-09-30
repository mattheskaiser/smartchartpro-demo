'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { SelectAtom } from '@/components/atoms/Select.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';

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
  onInputChange 
}: ResidentBasicInformationProps) => {
  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">Basic Information</TextAtom>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <LabelAtom>Full Name</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={resident.name}
              onChange={(e) => onInputChange('name', e.target.value)}
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
              onChange={(e) => onInputChange('room', e.target.value)}
            />
          ) : (
            <TextAtom>{resident.room}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Date of Birth</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="date"
              value={resident.dateOfBirth}
              onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
            />
          ) : (
            <TextAtom>{new Date(resident.dateOfBirth).toLocaleDateString()}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Admission Date</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="date"
              value={resident.admissionDate}
              onChange={(e) => onInputChange('admissionDate', e.target.value)}
            />
          ) : (
            <TextAtom>{new Date(resident.admissionDate).toLocaleDateString()}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Care Status</LabelAtom>
          {isEditing ? (
            <SelectAtom
              value={resident.status}
              onChange={(e) => onInputChange('status', e.target.value)}
            >
              <option value="independent">Independent</option>
              <option value="partial">Partial</option>
              <option value="full">Full</option>
            </SelectAtom>
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
              onChange={(e) => onInputChange('assignedCNA', e.target.value)}
            />
          ) : (
            <TextAtom>{resident.assignedCNA}</TextAtom>
          )}
        </div>
      </div>
    </CardAtom>
  );
};