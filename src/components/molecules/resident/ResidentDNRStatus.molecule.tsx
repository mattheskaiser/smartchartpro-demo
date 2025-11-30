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
  dnrStatus?: DNRStatus | null;
  isEditing: boolean;
  onDNRStatusChange: (field: keyof DNRStatus, value: boolean | string | undefined) => void;
}

export const ResidentDNRStatusMolecule = ({
  dnrStatus,
  isEditing,
  onDNRStatusChange,
}: ResidentDNRStatusProps) => {
  // Provide safe defaults for DNR status
  const safeDNRStatus: DNRStatus = {
    hasDNR: false,
    hasDNI: false,
    dnrDate: undefined,
    dniDate: undefined,
    physicianName: undefined,
    notes: undefined,
    ...dnrStatus,
  };
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
                checked={safeDNRStatus.hasDNR}
                onCheckedChange={checked => onDNRStatusChange('hasDNR', checked)}
                label="Has DNR order"
              />
            ) : (
              <BadgeAtom variant={safeDNRStatus.hasDNR ? 'warning' : 'success'}>
                {safeDNRStatus.hasDNR ? 'DNR Active' : 'No DNR'}
              </BadgeAtom>
            )}
          </div>
          <div>
            <LabelAtom>DNI (Do Not Intubate)</LabelAtom>
            {isEditing ? (
              <CheckboxAtom
                checked={safeDNRStatus.hasDNI}
                onCheckedChange={checked => onDNRStatusChange('hasDNI', checked)}
                label="Has DNI order"
              />
            ) : (
              <BadgeAtom variant={safeDNRStatus.hasDNI ? 'warning' : 'success'}>
                {safeDNRStatus.hasDNI ? 'DNI Active' : 'No DNI'}
              </BadgeAtom>
            )}
          </div>
        </div>

        {(safeDNRStatus.hasDNR || safeDNRStatus.hasDNI) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {safeDNRStatus.hasDNR && (
              <div>
                <LabelAtom>DNR Date</LabelAtom>
                {isEditing ? (
                  <DatePickerMolecule
                    value={safeDNRStatus.dnrDate || ''}
                    onChange={date => onDNRStatusChange('dnrDate', date)}
                    placeholder="Select DNR date"
                  />
                ) : (
                  <TextAtom>
                    {safeDNRStatus.dnrDate
                      ? new Date(safeDNRStatus.dnrDate).toLocaleDateString()
                      : 'Not specified'}
                  </TextAtom>
                )}
              </div>
            )}
            {safeDNRStatus.hasDNI && (
              <div>
                <LabelAtom>DNI Date</LabelAtom>
                {isEditing ? (
                  <DatePickerMolecule
                    value={safeDNRStatus.dniDate || ''}
                    onChange={date => onDNRStatusChange('dniDate', date)}
                    placeholder="Select DNI date"
                  />
                ) : (
                  <TextAtom>
                    {safeDNRStatus.dniDate
                      ? new Date(safeDNRStatus.dniDate).toLocaleDateString()
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
