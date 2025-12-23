'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { useShiftTemplates, formatShiftTime } from '@/hooks/useShiftTemplates';

interface CNAAvailabilityProps {
  cnaId: string;
  availability?: {
    [key: string]: string[]; // day -> shift types
  };
  isEditing: boolean;
  onAvailabilityChange: (availability: { [key: string]: string[] }) => void;
}

export const CNAAvailabilityMolecule = ({
  cnaId,
  availability = {},
  isEditing,
  onAvailabilityChange,
}: CNAAvailabilityProps) => {
  const [localAvailability, setLocalAvailability] = useState(availability);
  const { data: shiftTemplates, isLoading } = useShiftTemplates();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getShiftIcon = (shiftName: string) => {
    const lowerName = shiftName.toLowerCase();
    if (lowerName.includes('morning') || lowerName.includes('day')) return 'Sun';
    if (lowerName.includes('evening') || lowerName.includes('afternoon')) return 'Sunset';
    if (lowerName.includes('night') || lowerName.includes('overnight')) return 'Moon';
    return 'Clock';
  };

  const handleShiftToggle = (day: string, shiftType: string) => {
    if (!isEditing) return;

    const dayShifts = localAvailability[day] || [];
    const newShifts = dayShifts.includes(shiftType)
      ? dayShifts.filter(s => s !== shiftType)
      : [...dayShifts, shiftType];

    const newAvailability = {
      ...localAvailability,
      [day]: newShifts,
    };

    setLocalAvailability(newAvailability);
    onAvailabilityChange(newAvailability);
  };

  if (isLoading) {
    return <LoadingStateMolecule message="Loading shift templates..." />;
  }

  const activeShifts = shiftTemplates?.filter(shift => shift.isActive) || [];

  if (activeShifts.length === 0) {
    return (
      <CardAtom>
        <div className="text-center py-8">
          <DynamicIconAtom name="Clock" size="lg" className="mx-auto text-gray-400 mb-4" />
          <TextAtom variant="body" weight="medium" className="text-gray-500 mb-2">
            No shifts available
          </TextAtom>
          <TextAtom variant="body" className="text-gray-400">
            Please check back later for available shifts.
          </TextAtom>
        </div>
      </CardAtom>
    );
  }

  return (
    <CardAtom>
      <div className="flex items-center justify-between mb-6">
        <div>
          <TextAtom variant="h3" weight="semibold">
            Shift Availability
          </TextAtom>
          <TextAtom variant="small" className="text-gray-500 mt-1">
            Select which shifts this CNA is available to work
          </TextAtom>
        </div>
        {!isEditing && <DynamicIconAtom name="Calendar" className="text-gray-400" />}
      </div>

      <div className="space-y-4">
        {daysOfWeek.map(day => (
          <div key={day} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <TextAtom variant="body" weight="medium">
                {day}
              </TextAtom>
              <TextAtom variant="small" className="text-gray-500">
                {(localAvailability[day] || []).length} shifts available
              </TextAtom>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeShifts.map(shift => {
                const isSelected = (localAvailability[day] || []).includes(shift.name);

                return (
                  <div
                    key={shift.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer
                      ${
                        isSelected
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }
                      ${!isEditing ? 'cursor-default' : ''}
                    `}
                    onClick={() => handleShiftToggle(day, shift.name)}
                  >
                    <div className="flex items-center">
                      <CheckboxAtom
                        checked={isSelected}
                        onCheckedChange={() => handleShiftToggle(day, shift.name)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: shift.color }}
                      />
                      <DynamicIconAtom
                        name={getShiftIcon(shift.name) as any}
                        size="sm"
                        className={isSelected ? 'text-blue-600' : 'text-gray-500'}
                      />
                      <div>
                        <TextAtom
                          variant="small"
                          weight="medium"
                          className={isSelected ? 'text-blue-900' : 'text-gray-700'}
                        >
                          {shift.name}
                        </TextAtom>
                        <TextAtom
                          variant="small"
                          className={isSelected ? 'text-blue-600' : 'text-gray-500'}
                        >
                          {formatShiftTime(shift.startTime, shift.endTime)}
                        </TextAtom>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <DynamicIconAtom name="Info" className="text-blue-600 mt-0.5" size="sm" />
            <div>
              <TextAtom variant="small" weight="medium" className="text-blue-900">
                Availability Settings
              </TextAtom>
              <TextAtom variant="small" className="text-blue-700 mt-1">
                Changes will affect future shift assignments. Current assignments remain unchanged.
              </TextAtom>
            </div>
          </div>
        </div>
      )}
    </CardAtom>
  );
};
