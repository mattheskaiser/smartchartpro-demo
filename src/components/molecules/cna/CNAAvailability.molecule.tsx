'use client';

import { useState } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';

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

    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    const shiftTypes = [
        { id: 'Morning', label: 'Morning (6AM-2PM)', icon: 'Sun' },
        { id: 'Evening', label: 'Evening (2PM-10PM)', icon: 'Sunset' },
        { id: 'Night', label: 'Night (10PM-6AM)', icon: 'Moon' },
    ];

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

    const getShiftIcon = (shiftType: string) => {
        const shift = shiftTypes.find(s => s.id === shiftType);
        return shift?.icon || 'Clock';
    };

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
                {!isEditing && (
                    <DynamicIconAtom name="Calendar" className="text-gray-400" />
                )}
            </div>

            <div className="space-y-4">
                {daysOfWeek.map((day) => (
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
                            {shiftTypes.map((shift) => {
                                const isSelected = (localAvailability[day] || []).includes(shift.id);

                                return (
                                    <div
                                        key={shift.id}
                                        className={`
                      flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer
                      ${isSelected
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }
                      ${!isEditing ? 'cursor-default' : ''}
                    `}
                                        onClick={() => handleShiftToggle(day, shift.id)}
                                    >
                                        <div className="flex items-center">
                                            <CheckboxAtom
                                                checked={isSelected}
                                                onCheckedChange={() => handleShiftToggle(day, shift.id)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 flex-1">
                                            <DynamicIconAtom
                                                name={getShiftIcon(shift.id) as any}
                                                size="sm"
                                                className={isSelected ? 'text-blue-600' : 'text-gray-500'}
                                            />
                                            <div>
                                                <TextAtom
                                                    variant="small"
                                                    weight="medium"
                                                    className={isSelected ? 'text-blue-900' : 'text-gray-700'}
                                                >
                                                    {shift.id}
                                                </TextAtom>
                                                <TextAtom
                                                    variant="small"
                                                    className={isSelected ? 'text-blue-600' : 'text-gray-500'}
                                                >
                                                    {shift.label.split('(')[1]?.replace(')', '')}
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