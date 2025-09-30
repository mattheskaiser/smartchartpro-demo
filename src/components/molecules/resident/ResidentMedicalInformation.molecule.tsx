'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';

interface ResidentMedicalInformationProps {
  medicalInfo: {
    allergies: string[];
    medications: string[];
    conditions: string[];
  };
}

export const ResidentMedicalInformationMolecule = ({ medicalInfo }: ResidentMedicalInformationProps) => {
  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-3">Medical Information</TextAtom>
      <div className="space-y-3">
        <div>
          <TextAtom variant="small" weight="medium" color="secondary">Allergies:</TextAtom>
          <TextAtom variant="small" color="secondary">{medicalInfo.allergies.join(', ')}</TextAtom>
        </div>
        <div>
          <TextAtom variant="small" weight="medium" color="secondary">Medications:</TextAtom>
          <ul className="mt-1">
            {medicalInfo.medications.map((med, index) => (
              <li key={index}>
                <TextAtom variant="small" color="secondary" as="span">• {med}</TextAtom>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <TextAtom variant="small" weight="medium" color="secondary">Conditions:</TextAtom>
          <TextAtom variant="small" color="secondary">{medicalInfo.conditions.join(', ')}</TextAtom>
        </div>
      </div>
    </CardAtom>
  );
};