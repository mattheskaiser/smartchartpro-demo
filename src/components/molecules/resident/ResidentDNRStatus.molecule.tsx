'use client';

import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { DatePickerMolecule } from '@/components/molecules/DatePicker.molecule';

interface DNRStatus {
  hasDNR: boolean;
  hasDNI: boolean;
  dnrDate?: string;
  dniDate?: string;
  physicianName?: string;
  notes?: string;
}

interface ResidentDNRStatusProps {
  dnrStatus: DNRStatus;
  isEditing: boolean;
  onDNRStatusChange: (field: keyof DNRStatus, value: any) => void;
}

export const ResidentDNRStatusMolecule = ({
  dnrStatus,
  isEditing,
  onDNRStatusChange,
}: ResidentDNRStatusProps) => {
  return (
    <CardAtom>
      <TextAtom variant="h3" weight="medium" className="mb-4">
        DNR/DNI Status
      </TextAtom>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <LabelAtom>DNR (Do Not Resuscitate)</LabelAtom>
            {isEditing ? (
              <CheckboxAtom
                checked={dnrStatus.hasDNR}
                onCheckedChange={checked => onDNRStatusChange('hasDNR', checked)}
                label="Has DNR order"
              />
            ) : (
              <BadgeAtom variant={dnrStatus.hasDNR ? 'warning' : 'success'}>
                {dnrStatus.hasDNR ? 'DNR Active' : 'No DNR'}
              </BadgeAtom>
            )}
          </div>
          <div>
            <LabelAtom>DNI (Do Not Intubate)</LabelAtom>
            {isEditing ? (
              <CheckboxAtom
                checked={dnrStatus.hasDNI}
                onCheckedChange={checked => onDNRStatusChange('hasDNI', checked)}
                label="Has DNI order"
              />
            ) : (
              <BadgeAtom variant={dnrStatus.hasDNI ? 'warning' : 'success'}>
                {dnrStatus.hasDNI ? 'DNI Active' : 'No DNI'}
              </BadgeAtom>
            )}
          </div>
        </div>

        {(dnrStatus.hasDNR || dnrStatus.hasDNI) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {dnrStatus.hasDNR && (
              <div>
                <LabelAtom>DNR Date</LabelAtom>
                {isEditing ? (
                  <DatePickerMolecule
                    value={dnrStatus.dnrDate || ''}
                    onChange={date => onDNRStatusChange('dnrDate', date)}
                    placeholder="Select DNR date"
                  />
                ) : (
                  <TextAtom>
                    {dnrStatus.dnrDate
                      ? new Date(dnrStatus.dnrDate).toLocaleDateString()
                      : 'Not specified'}
                  </TextAtom>
                )}
              </div>
            )}
            {dnrStatus.hasDNI && (
              <div>
                <LabelAtom>DNI Date</LabelAtom>
                {isEditing ? (
                  <DatePickerMolecule
                    value={dnrStatus.dniDate || ''}
                    onChange={date => onDNRStatusChange('dniDate', date)}
                    placeholder="Select DNI date"
                  />
                ) : (
                  <TextAtom>
                    {dnrStatus.dniDate
                      ? new Date(dnrStatus.dniDate).toLocaleDateString()
                      : 'Not specified'}
                  </TextAtom>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </CardAtom>
  );
};
