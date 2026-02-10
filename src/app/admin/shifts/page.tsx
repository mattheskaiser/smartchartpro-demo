'use client';

import { useState } from 'react';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { ShiftAssignmentModalMolecule } from '@/components/molecules/shift/ShiftAssignmentModal.molecule';
import { AdminPageLayoutTemplate } from '@/components/templates/AdminPageLayout.template';
import { useShiftTemplates, formatShiftTime } from '@/hooks/useShiftTemplates';
import { toast } from '@/lib/toast';

// Mock data from actual mock-data files
const mockCNAs = [
  {
    id: 'cna_001',
    name: 'Jennifer Rodriguez',
    email: 'cna@demo.com',
    imageData: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces',
    certificationNumber: 'CNA-2022-001',
  },
  {
    id: 'cna_002',
    name: 'Michael Thompson',
    email: 'michael.thompson@demo.com',
    imageData: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=faces',
    certificationNumber: 'CNA-2021-045',
  },
  {
    id: 'cna_003',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@demo.com',
    imageData: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces',
    certificationNumber: 'CNA-2023-012',
  },
  {
    id: 'cna_004',
    name: 'David Lee',
    email: 'david.lee@demo.com',
    imageData: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces',
    certificationNumber: 'CNA-2022-078',
  },
  {
    id: 'cna_005',
    name: 'Emily Martinez',
    email: 'emily.martinez@demo.com',
    imageData: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=faces',
    certificationNumber: 'CNA-2023-089',
  },
  {
    id: 'cna_006',
    name: 'Robert Kim',
    email: 'robert.kim@demo.com',
    imageData: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=faces',
    certificationNumber: 'CNA-2020-034',
  },
];

const mockResidents = [
  {
    id: 'res_001',
    name: 'Margaret Thompson',
    room: '101',
    imageUrl: '/resident-stock-photos/women/artem-labunsky-izJC1PUjZNc-unsplash.jpg',
    adlNeeds: ['Bathing', 'Dressing', 'Mobility'],
  },
  {
    id: 'res_002',
    name: 'Robert Chen',
    room: '102',
    imageUrl: '/resident-stock-photos/men/abbas-souzian-JC1oue4zY5U-unsplash.jpg',
    adlNeeds: ['Health Monitoring'],
  },
  {
    id: 'res_003',
    name: 'Dorothy Williams',
    room: '103',
    imageUrl: '/resident-stock-photos/women/danie-franco-l9I93gZKTG4-unsplash.jpg',
    adlNeeds: ['Bathing', 'Dressing', 'Eating', 'Toileting', 'Mobility'],
  },
  {
    id: 'res_004',
    name: 'James Martinez',
    room: '104',
    imageUrl: '/resident-stock-photos/men/maria-lupan-2L8McMW3wAM-unsplash.jpg',
    adlNeeds: ['Bathing', 'Dressing'],
  },
  {
    id: 'res_005',
    name: 'Patricia Johnson',
    room: '105',
    imageUrl: '/resident-stock-photos/women/eduardo-barrios-XMCLLGGMMYU-unsplash.jpg',
    adlNeeds: ['Health Monitoring'],
  },
  {
    id: 'res_006',
    name: 'William Anderson',
    room: '106',
    imageUrl: '/resident-stock-photos/men/tim-doerfler-5jDJ4LaXiWE-unsplash.jpg',
    adlNeeds: ['Mobility', 'Toileting'],
  },
  {
    id: 'res_007',
    name: 'Mary Davis',
    room: '107',
    imageUrl: '/resident-stock-photos/women/otacilio-maia-zrbnoeRI3wI-unsplash.jpg',
    adlNeeds: ['Bathing', 'Dressing', 'Mobility'],
  },
  {
    id: 'res_008',
    name: 'Charles Brown',
    room: '108',
    imageUrl: '/resident-stock-photos/men/ving-n-qccFiSIZtiY-unsplash.jpg',
    adlNeeds: [],
  },
  {
    id: 'res_009',
    name: 'Barbara Wilson',
    room: '109',
    imageUrl: '/resident-stock-photos/women/tatiana-zanon-MMhazsT2wtM-unsplash.jpg',
    adlNeeds: ['Bathing', 'Dressing', 'Eating', 'Toileting', 'Mobility'],
  },
  {
    id: 'res_010',
    name: 'Richard Taylor',
    room: '110',
    imageUrl: '/resident-stock-photos/men/default-male.jpg',
    adlNeeds: ['Bathing', 'Mobility'],
  },
  {
    id: 'res_011',
    name: 'Helen Garcia',
    room: '111',
    imageUrl: '/resident-stock-photos/women/default-female.jpg',
    adlNeeds: ['Dressing', 'Eating'],
  },
  {
    id: 'res_012',
    name: 'George Miller',
    room: '112',
    imageUrl: '/resident-stock-photos/men/default-male-2.jpg',
    adlNeeds: ['Toileting', 'Mobility'],
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
    shift?: {
      id: string;
      name: string;
      startTime: string;
      endTime: string;
      color?: string;
    };
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

  const handleAssignShift = (shift: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    color?: string;
  }) => {
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
      title: 'Demo Mode',
      description: "Changes aren't saved in demo mode. This is for demonstration purposes only.",
      type: 'warning',
    });
    setAssignmentModal({ isOpen: false });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  if (templatesLoading) {
    return <PageLoaderMolecule message="Loading shifts..." />;
  }

  const activeShifts = shiftTemplates?.filter(shift => shift.isActive) || [];

  if (activeShifts.length === 0) {
    return (
      <AdminPageLayoutTemplate
        title="Daily Shift Assignments"
        subtitle="Assign CNAs to shifts and residents to CNAs"
      >
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
      </AdminPageLayoutTemplate>
    );
  }

  return (
    <AdminPageLayoutTemplate
      title="Daily Shift Assignments"
      subtitle="Assign CNAs to shifts and residents to CNAs"
      headerExtra={
        <div className="flex items-center gap-4">
          <ButtonAtom variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
            <DynamicIconAtom name="ChevronLeft" size="sm" />
          </ButtonAtom>
          <div className="text-center">
            <TextAtom variant="body" weight="semibold">
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
      }
    >
      {/* Shifts */}
      <div className="space-y-6">
        {activeShifts.map(shift => {
          const assignment = getAssignmentForShift(shift.id);
          const assignedCNA = assignment ? getCNAById(assignment.cnaId) : null;
          const assignedResidents = assignment
            ? assignment.residentIds.map(id => mockResidents.find(r => r.id === id)).filter(Boolean)
            : [];

          return (
            <div key={shift.id} className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
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
                    <DynamicIconAtom
                      name="UserX"
                      size="lg"
                      className="mx-auto text-gray-400 mb-3"
                    />
                    <TextAtom variant="body" className="text-gray-500 mb-2">
                      No CNA assigned to this shift
                    </TextAtom>
                    <TextAtom variant="small" className="text-gray-400">
                      Click "Assign CNA" to get started
                    </TextAtom>
                  </div>
                )}
              </div>
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
    </AdminPageLayoutTemplate>
  );
}
