'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';

interface ResidentNotesProps {
  notes: string;
  isEditing: boolean;
  onNotesChange: (notes: string) => void;
}

export const ResidentNotesMolecule = ({ notes, isEditing, onNotesChange }: ResidentNotesProps) => {
  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        Notes
      </TextAtom>
      {isEditing ? (
        <TextareaAtom
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          rows={4}
          placeholder="Add notes about the resident..."
        />
      ) : (
        <TextAtom color="secondary">{notes}</TextAtom>
      )}
    </CardAtom>
  );
};
