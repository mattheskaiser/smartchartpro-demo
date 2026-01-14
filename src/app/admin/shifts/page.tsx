'use client';

import { useState } from 'react';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { ShiftAssignmentModalMolecule } from '@/components/molecules/shift/ShiftAssignmentModal.molecule';
import { useShiftTemplates, formatShiftTime } from '@/hooks/useShiftTemplates';
import { toast } from '@/lib/toast';

// Mock data - replace with actual API calls
const mockCNAs = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@facility.com',
    imageData: '',
    certificationNumber: 'CNA-001',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@facility.com',
    imageData: '',
    certificationNumber: 'CNA-002',
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    email: 'lisa@facility.com',
    imageData: '',
    certificationNumber: 'CNA-003',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@facility.com',
    imageData: '',
    certificationNumber: 'CNA-004',
  },
];

const mockResidents = [
  {
    id: '1',
    name: 'John Smith',
    room: '101',
    imageUrl: '',
    adlNeeds: ['Bathing', 'Dressing', 'Mobility'],
  },
  { id: '2', name: 'Mary Johnson', room: '102', imageUrl: '', adlNeeds: ['Feeding', 'Toileting'] },
  { id: '3', name: 'Robert Brown', room: '103', imageUrl: '', adlNeeds: ['Bathing', 'Medication'] },
  {
    id: '4',
    name: 'Patricia Davis',
    room: '104',
    imageUrl: '',
    adlNeeds: ['Dressing', 'Mobility', 'Feeding'],
  },
  { id: '5', name: 'James Wilson', room: '105', imageUrl: '', adlNeeds: ['Bathing', 'Toileting'] },
  {
    id: '6',
    name: 'Linda Miller',
    room: '106',
    imageUrl: '',
    adlNeeds: ['Medication', 'Mobility'],
  },
];

// Mock shift assignments
const mockShiftAssignments = [
  { shiftId: '1', cnaId: '1', residentIds: ['1', '2', '3'] },
  { shiftId: '3', cnaId: '2', residentIds: ['4', '5'] },
];

export default function ShiftManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [assignmentModal, setAssignmentModal] = useState<{
    isOpen: boolean;
    shift?: any;
  }>({ isOpen: false });

  const { data: shiftTemplates, isLoading: templatesLoading } = useShiftTemplates();

  const getShiftIcon = (shiftName: string) => {
    const lowerName = shiftName.toLowerCase();
    if (lowerName.includes('morning') || lowerName.includes('day')) return 'Sun';
    if (lowerName.includes('evening') || lowerName.includes('afternoon')) return 'Sunset';
    if (lowerName.includes('night') || lowerName.includes('overnight')) return 'Moon';
    return 'Clock';
  };

  const getAssignmentForShift = (shiftId: string) => {
    return mockShiftAssignments.find(assignment => assignment.shiftId === shiftId);
  };

  const getCNAById = (cnaId: string) => {
    return mockCNAs.find(cna => cna.id === cnaId);
  };

  const handleAssignShift = (shift: any) => {
    setAssignmentModal({ isOpen: true, shift });
  };

  const handleAssignmentSubmit = (assignment: {
    cnaId: string;
    residentIds: string[];
    notes?: string;
  }) => {
    console.log('Assignment submitted:', assignment);
    // TODO: Save assignment to backend
    toast({
      title: 'Shift assigned successfully',
      description: `CNA has been assigned to ${assignment.residentIds.length} resident${assignment.residentIds.length !== 1 ? 's' : ''}`,
      type: 'success',
    });
    setAssignmentModal({ isOpen: false });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  if (templatesLoading) {
    return <LoadingStateMolecule message="Loading shifts..." />;
  }

  const activeShifts = shiftTemplates?.filter(shift => shift.isActive) || [];

  if (activeShifts.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="text-center py-12">
          <DynamicIconAtom name="Calendar" size="lg" className="mx-auto text-gray-400 mb-6" />
          <TextAtom variant="h2" className="text-gray-500 mb-4">
            No shifts configured
          </TextAtom>
          <TextAtom variant="body" className="text-gray-400 mb-6">
            Set up shift templates in Settings first.
          </TextAtom>
          <ButtonAtom variant="primary" onClick={() => (window.location.href = '/admin/settings')}>
            <DynamicIconAtom name="Settings" size="sm" className="mr-2" />
            Go to Settings
          </ButtonAtom>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <TextAtom variant="h1" weight="semibold" className="mb-2">
          Daily Shift Assignments
        </TextAtom>
        <TextAtom variant="body" className="text-gray-600">
          Assign CNAs to shifts and residents to CNAs
        </TextAtom>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <ButtonAtom variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
          <DynamicIconAtom name="ChevronLeft" size="sm" />
        </ButtonAtom>
        <div className="text-center">
          <TextAtom variant="h2" weight="semibold">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </TextAtom>
          <TextAtom variant="small" className="text-gray-500">
            {selectedDate.getFullYear()}
          </TextAtom>
        </div>
        <ButtonAtom variant="ghost" size="sm" onClick={() => navigateDate('next')}>
          <DynamicIconAtom name="ChevronRight" size="sm" />
        </ButtonAtom>
      </div>

      {/* Shifts */}
      <div className="space-y-6">
        {activeShifts.map(shift => {
          const assignment = getAssignmentForShift(shift.id);
          const assignedCNA = assignment ? getCNAById(assignment.cnaId) : null;
          const assignedResidents = assignment
            ? assignment.residentIds.map(id => mockResidents.find(r => r.id === id)).filter(Boolean)
            : [];

          return (
            <div key={shift.id} className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Shift Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${shift.color}20`, color: shift.color }}
                  >
                    <DynamicIconAtom name={getShiftIcon(shift.name)} size="lg" />
                  </div>
                  <div>
                    <TextAtom variant="h2" weight="semibold">
                      {shift.name}
                    </TextAtom>
                    <TextAtom variant="body" className="text-gray-600">
                      {formatShiftTime(shift.startTime, shift.endTime)}
                    </TextAtom>
                  </div>
                </div>
                <ButtonAtom
                  variant={assignedCNA ? 'secondary' : 'primary'}
                  onClick={() => handleAssignShift(shift)}
                >
                  <DynamicIconAtom
                    name={assignedCNA ? 'Pencil' : 'UserCheck'}
                    size="sm"
                    className="mr-2"
                  />
                  {assignedCNA ? 'Edit Assignment' : 'Assign CNA'}
                </ButtonAtom>
              </div>

              {/* Assignment Details */}
              {assignedCNA ? (
                <div className="space-y-4">
                  {/* Assigned CNA */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <AvatarAtom src={assignedCNA.imageData} alt={assignedCNA.name} size="md" />
                    <div className="flex-1">
                      <TextAtom variant="body" weight="semibold">
                        {assignedCNA.name}
                      </TextAtom>
                      <TextAtom variant="small" className="text-gray-600">
                        {assignedCNA.email}
                      </TextAtom>
                    </div>
                    <div className="text-right">
                      <TextAtom variant="small" className="text-gray-500">
                        Residents Assigned
                      </TextAtom>
                      <TextAtom variant="h3" weight="semibold">
                        {assignedResidents.length}
                      </TextAtom>
                    </div>
                  </div>

                  {/* Assigned Residents */}
                  {assignedResidents.length > 0 && (
                    <div>
                      <TextAtom variant="body" weight="medium" className="mb-3">
                        Assigned Residents
                      </TextAtom>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {assignedResidents.map(resident => (
                          <div
                            key={resident?.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <AvatarAtom
                              src={resident?.imageUrl}
                              alt={resident?.name || 'Resident'}
                              size="sm"
                            />
                            <div className="flex-1">
                              <TextAtom variant="body" weight="medium">
                                {resident?.name}
                              </TextAtom>
                              <TextAtom variant="small" className="text-gray-500">
                                Room {resident?.room}
                              </TextAtom>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <DynamicIconAtom name="UserX" size="lg" className="mx-auto text-gray-400 mb-3" />
                  <TextAtom variant="body" className="text-gray-500 mb-2">
                    No CNA assigned to this shift
                  </TextAtom>
                  <TextAtom variant="small" className="text-gray-400">
                    Click "Assign CNA" to get started
                  </TextAtom>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assignment Modal */}
      <ShiftAssignmentModalMolecule
        isOpen={assignmentModal.isOpen}
        onClose={() => setAssignmentModal({ isOpen: false })}
        onSubmit={handleAssignmentSubmit}
        shift={
          assignmentModal.shift
            ? {
              id: assignmentModal.shift.id,
              type: assignmentModal.shift.name,
              date: selectedDate.toISOString(),
              time: formatShiftTime(
                assignmentModal.shift.startTime,
                assignmentModal.shift.endTime
              ),
            }
            : { id: '', type: '', date: '', time: '' }
        }
        availableCNAs={mockCNAs}
        availableResidents={mockResidents}
      />
    </div>
  );
}
