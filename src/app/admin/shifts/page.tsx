'use client';

import { useState } from 'react';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { ShiftAssignmentModalMolecule } from '@/components/molecules/shift/ShiftAssignmentModal.molecule';
import { useShifts, useUpdateShift } from '@/hooks/useShifts';
import { useCNAs } from '@/hooks/useCNAs';
import { useResidents } from '@/hooks/useResidents';

export default function ShiftManagement() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedView, setSelectedView] = useState<'daily' | 'weekly'>('daily');

    // Mock data - replace with actual API calls
    const shifts = [
        {
            id: '1',
            type: 'Morning',
            time: '6:00 AM - 2:00 PM',
            assignedCNA: 'Sarah Johnson',
            residents: 8,
            status: 'scheduled',
        },
        {
            id: '2',
            type: 'Evening',
            time: '2:00 PM - 10:00 PM',
            assignedCNA: null,
            residents: 0,
            status: 'unassigned',
        },
        {
            id: '3',
            type: 'Night',
            time: '10:00 PM - 6:00 AM',
            assignedCNA: 'Mike Chen',
            residents: 6,
            status: 'in_progress',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'info';
            case 'in_progress':
                return 'success';
            case 'unassigned':
                return 'warning';
            case 'completed':
                return 'success';
            default:
                return 'info';
        }
    };

    const getShiftIcon = (shiftType: string) => {
        switch (shiftType) {
            case 'Morning':
                return 'Sun';
            case 'Evening':
                return 'Sunset';
            case 'Night':
                return 'Moon';
            default:
                return 'Clock';
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <TextAtom variant="h1" weight="semibold">
                            Shift Management
                        </TextAtom>
                        <TextAtom variant="body" className="text-gray-600 mt-2">
                            Manage daily shift assignments and CNA schedules
                        </TextAtom>
                    </div>
                    <div className="flex items-center gap-3">
                        <ButtonAtom variant="secondary">
                            <DynamicIconAtom name="Calendar" size="sm" className="mr-2" />
                            Schedule Template
                        </ButtonAtom>
                        <ButtonAtom variant="primary">
                            <DynamicIconAtom name="Plus" size="sm" className="mr-2" />
                            Create Shift
                        </ButtonAtom>
                    </div>
                </div>

                {/* Date and View Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <ButtonAtom variant="ghost" size="sm">
                                <DynamicIconAtom name="ChevronLeft" size="sm" />
                            </ButtonAtom>
                            <TextAtom variant="h3" weight="medium">
                                {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </TextAtom>
                            <ButtonAtom variant="ghost" size="sm">
                                <DynamicIconAtom name="ChevronRight" size="sm" />
                            </ButtonAtom>
                        </div>
                        <ButtonAtom variant="outline" size="sm">
                            Today
                        </ButtonAtom>
                    </div>

                    <div className="flex items-center gap-2">
                        <ButtonAtom
                            variant={selectedView === 'daily' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedView('daily')}
                        >
                            Daily
                        </ButtonAtom>
                        <ButtonAtom
                            variant={selectedView === 'weekly' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedView('weekly')}
                        >
                            Weekly
                        </ButtonAtom>
                    </div>
                </div>
            </div>

            {/* Shift Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {shifts.map((shift) => (
                    <CardAtom key={shift.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
                                    <DynamicIconAtom
                                        name={getShiftIcon(shift.type)}
                                        size="md"
                                        className="text-blue-600"
                                    />
                                </div>
                                <div>
                                    <TextAtom variant="h3" weight="semibold">
                                        {shift.type} Shift
                                    </TextAtom>
                                    <TextAtom variant="small" className="text-gray-500">
                                        {shift.time}
                                    </TextAtom>
                                </div>
                            </div>
                            <BadgeAtom variant={getStatusColor(shift.status) as any}>
                                {shift.status.replace('_', ' ')}
                            </BadgeAtom>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <TextAtom variant="small" className="text-gray-500">
                                    Assigned CNA
                                </TextAtom>
                                <TextAtom variant="body" weight="medium">
                                    {shift.assignedCNA || 'Unassigned'}
                                </TextAtom>
                            </div>

                            <div className="flex items-center justify-between">
                                <TextAtom variant="small" className="text-gray-500">
                                    Residents
                                </TextAtom>
                                <TextAtom variant="body" weight="medium">
                                    {shift.residents}
                                </TextAtom>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                            {shift.assignedCNA ? (
                                <>
                                    <ButtonAtom variant="secondary" size="sm" className="flex-1">
                                        <DynamicIconAtom name="Users" size="sm" className="mr-2" />
                                        Manage
                                    </ButtonAtom>
                                    <ButtonAtom variant="outline" size="sm">
                                        <DynamicIconAtom name="MoreVertical" size="sm" />
                                    </ButtonAtom>
                                </>
                            ) : (
                                <ButtonAtom variant="primary" size="sm" className="flex-1">
                                    <DynamicIconAtom name="UserPlus" size="sm" className="mr-2" />
                                    Assign CNA
                                </ButtonAtom>
                            )}
                        </div>
                    </CardAtom>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
                <CardAtom className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <DynamicIconAtom name="CircleCheck" size="sm" className="text-green-600" />
                        </div>
                        <div>
                            <TextAtom variant="small" className="text-gray-500">Covered Shifts</TextAtom>
                            <TextAtom variant="h3" weight="semibold">2/3</TextAtom>
                        </div>
                    </div>
                </CardAtom>

                <CardAtom className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DynamicIconAtom name="Users" size="sm" className="text-blue-600" />
                        </div>
                        <div>
                            <TextAtom variant="small" className="text-gray-500">Active CNAs</TextAtom>
                            <TextAtom variant="h3" weight="semibold">2</TextAtom>
                        </div>
                    </div>
                </CardAtom>

                <CardAtom className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <DynamicIconAtom name="Clock" size="sm" className="text-yellow-600" />
                        </div>
                        <div>
                            <TextAtom variant="small" className="text-gray-500">Total Hours</TextAtom>
                            <TextAtom variant="h3" weight="semibold">24</TextAtom>
                        </div>
                    </div>
                </CardAtom>

                <CardAtom className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DynamicIconAtom name="House" size="sm" className="text-purple-600" />
                        </div>
                        <div>
                            <TextAtom variant="small" className="text-gray-500">Residents</TextAtom>
                            <TextAtom variant="h3" weight="semibold">14</TextAtom>
                        </div>
                    </div>
                </CardAtom>
            </div>
        </div>
    );
}