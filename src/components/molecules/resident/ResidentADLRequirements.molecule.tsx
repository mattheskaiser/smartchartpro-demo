'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { ADL_OPTIONS } from '@/constants/adl';

interface ResidentADLRequirementsProps {
  adlNeeds?: string[] | null;
  isEditing: boolean;
  onToggleADL: (adl: string) => void;
}

export const ResidentADLRequirementsMolecule = ({
  adlNeeds = [],
  isEditing,
  onToggleADL,
}: ResidentADLRequirementsProps) => {
  // Ensure adlNeeds is always an array
  const safeAdlNeeds = Array.isArray(adlNeeds) ? adlNeeds : [];
  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        ADL Requirements
      </TextAtom>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ADL_OPTIONS.map(adl => (
          <label key={adl} className="flex items-center space-x-2">
            <CheckboxAtom
              checked={safeAdlNeeds.includes(adl)}
              onCheckedChange={() => isEditing && onToggleADL(adl)}
              disabled={!isEditing}
            />
            <TextAtom variant="small" className="capitalize">
              {adl}
            </TextAtom>
          </label>
        ))}
      </div>
    </CardAtom>
  );
};
