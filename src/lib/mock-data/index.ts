// Mock data for demo mode
import residentsData from './residents.json';
import cnasData from './cnas.json';
import usersData from './users.json';
import settingsData from './settings.json';
import sessionsData from './sessions.json';

export const mockResidents = residentsData;
export const mockCnas = cnasData;
export const mockUsers = usersData;
export const mockSettings = settingsData;
export const mockSessions = sessionsData;

// Helper to simulate database delay (reduced to 0ms for better performance)
export const simulateDelay = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find by ID
export const findById = <T extends { id: string }>(data: T[], id: string): T | undefined =>
  data.find(item => item.id === id);

// Helper to filter by field
export const filterBy = <T>(data: T[], field: keyof T, value: T[keyof T]): T[] =>
  data.filter(item => item[field] === value);

// Helper for pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const paginate = <T>(data: T[], params: PaginationParams = {}): PaginatedResponse<T> => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  };
};

// Mock shift templates
export const mockShiftTemplates = [
  {
    id: 'shift_morning',
    name: 'Morning',
    startTime: '06:00',
    endTime: '14:00',
    isActive: true,
    color: '#FCD34D',
    description: 'Morning shift - 6 AM to 2 PM',
    sortOrder: 1,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 'shift_evening',
    name: 'Evening',
    startTime: '14:00',
    endTime: '22:00',
    isActive: true,
    color: '#60A5FA',
    description: 'Evening shift - 2 PM to 10 PM',
    sortOrder: 2,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 'shift_night',
    name: 'Night',
    startTime: '22:00',
    endTime: '06:00',
    isActive: true,
    color: '#818CF8',
    description: 'Night shift - 10 PM to 6 AM',
    sortOrder: 3,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
];

// Mock shift assignments (last 7 days)
export const generateMockShiftAssignments = () => {
  const assignments = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Morning shift
    assignments.push({
      id: `assignment_${i}_morning`,
      date: date.toISOString(),
      shiftType: 'Morning',
      cnaId: i % 2 === 0 ? 'cna_001' : 'cna_002',
      status: i === 0 ? 'in_progress' : 'completed',
      startTime: i === 0 ? new Date(date.setHours(6, 0, 0, 0)).toISOString() : null,
      endTime: i === 0 ? null : new Date(date.setHours(14, 0, 0, 0)).toISOString(),
      notes: null,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });

    // Evening shift
    assignments.push({
      id: `assignment_${i}_evening`,
      date: date.toISOString(),
      shiftType: 'Evening',
      cnaId: i % 2 === 0 ? 'cna_003' : 'cna_002',
      status: i === 0 ? 'scheduled' : 'completed',
      startTime: i === 0 ? null : new Date(date.setHours(14, 0, 0, 0)).toISOString(),
      endTime: i === 0 ? null : new Date(date.setHours(22, 0, 0, 0)).toISOString(),
      notes: null,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });

    // Night shift
    assignments.push({
      id: `assignment_${i}_night`,
      date: date.toISOString(),
      shiftType: 'Night',
      cnaId: 'cna_004',
      status: i === 0 ? 'scheduled' : 'completed',
      startTime: i === 0 ? null : new Date(date.setHours(22, 0, 0, 0)).toISOString(),
      endTime: i === 0 ? null : new Date(date.setHours(6, 0, 0, 0)).toISOString(),
      notes: null,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  return assignments;
};

export const mockShiftAssignments = generateMockShiftAssignments();

// Mock charting reports (last 30 days)
export const generateMockChartingReports = () => {
  const reports = [];
  const today = new Date();

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const cnaId = ['cna_001', 'cna_002', 'cna_003'][i % 3];
    const cnaName = ['Jennifer Rodriguez', 'Michael Thompson', 'Sarah Johnson'][i % 3];
    const cnaCert = ['CNA-2022-001', 'CNA-2021-045', 'CNA-2023-012'][i % 3];

    reports.push({
      id: `report_${String(i).padStart(3, '0')}`,
      reportDate: date.toISOString(),
      sessionStartTime: new Date(date.setHours(6, 0, 0, 0)).toISOString(),
      sessionEndTime: new Date(date.setHours(13, 30, 0, 0)).toISOString(),
      cnaId,
      cnaName,
      cnaCertification: cnaCert,
      createdById: `user_${cnaId}`,
      totalResidents: 4 + (i % 3),
      totalActivities: 12 + (i % 8),
      status: i <= 5 ? 'pending' : 'reviewed',
      reviewedBy: i <= 5 ? null : 'Admin User',
      reviewedAt: i <= 5 ? null : new Date(date.setHours(15, 0, 0, 0)).toISOString(),
      notes: i <= 5 ? null : 'Report reviewed and approved.',
      residentsData: [],
      entriesData: [],
      pdfData: null,
      createdAt: new Date(date.setHours(13, 30, 0, 0)).toISOString(),
      updatedAt: new Date(date.setHours(15, 0, 0, 0)).toISOString(),
    });
  }

  return reports;
};

export const mockChartingReports = generateMockChartingReports();
