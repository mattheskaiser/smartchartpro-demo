'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { InputAtom } from '@/components/atoms/Input.atom';

interface ResidentEmergencyContactProps {
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

export const ResidentEmergencyContactMolecule = ({ 
  emergencyContact, 
  isEditing, 
  onInputChange 
}: ResidentEmergencyContactProps) => {
  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">Emergency Contact</TextAtom>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <LabelAtom>Contact Name</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={emergencyContact.name}
              onChange={(e) => onInputChange('name', e.target.value)}
            />
          ) : (
            <TextAtom>{emergencyContact.name}</TextAtom>
          )}
        </div>
        <div>
          <LabelAtom>Relationship</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="text"
              value={emergencyContact.relationship}
              onChange={(e) => onInputChange('relationship', e.target.value)}
            />
          ) : (
            <TextAtom>{emergencyContact.relationship}</TextAtom>
          )}
        </div>
        <div className="md:col-span-2">
          <LabelAtom>Phone Number</LabelAtom>
          {isEditing ? (
            <InputAtom
              type="tel"
              value={emergencyContact.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
            />
          ) : (
            <TextAtom>{emergencyContact.phone}</TextAtom>
          )}
        </div>
      </div>
    </CardAtom>
  );
};