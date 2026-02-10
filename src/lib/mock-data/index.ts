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

// Mock charting reports - 6 recent reports with realistic data
export const generateMockChartingReports = () => {
  const reports: Array<{
    id: string;
    reportDate: string;
    sessionStartTime: string;
    sessionEndTime: string;
    cnaId: string;
    cnaName: string;
    cnaCertification: string;
    createdById: string;
    totalResidents: number;
    totalActivities: number;
    status: string;
    reviewedBy: string | null;
    reviewedAt: string | null;
    notes: string | null;
    residentsData: unknown[];
    entriesData: unknown[];
    pdfData: null;
    createdAt: string;
    updatedAt: string;
  }> = [];
  const today = new Date();

  const mockReportsData = [
    {
      daysAgo: 0,
      cnaId: 'cna_001',
      cnaName: 'Jennifer Rodriguez',
      cnaCert: 'CNA-2022-001',
      totalResidents: 4,
      totalActivities: 18,
      status: 'pending',
    },
    {
      daysAgo: 1,
      cnaId: 'cna_002',
      cnaName: 'Michael Thompson',
      cnaCert: 'CNA-2021-045',
      totalResidents: 3,
      totalActivities: 15,
      status: 'reviewed',
    },
    {
      daysAgo: 2,
      cnaId: 'cna_003',
      cnaName: 'Sarah Johnson',
      cnaCert: 'CNA-2023-012',
      totalResidents: 5,
      totalActivities: 22,
      status: 'reviewed',
    },
    {
      daysAgo: 3,
      cnaId: 'cna_001',
      cnaName: 'Jennifer Rodriguez',
      cnaCert: 'CNA-2022-001',
      totalResidents: 4,
      totalActivities: 17,
      status: 'reviewed',
    },
    {
      daysAgo: 4,
      cnaId: 'cna_004',
      cnaName: 'David Lee',
      cnaCert: 'CNA-2022-078',
      totalResidents: 3,
      totalActivities: 14,
      status: 'reviewed',
    },
    {
      daysAgo: 5,
      cnaId: 'cna_002',
      cnaName: 'Michael Thompson',
      cnaCert: 'CNA-2021-045',
      totalResidents: 4,
      totalActivities: 19,
      status: 'reviewed',
    },
  ];

  mockReportsData.forEach((data, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - data.daysAgo);

    reports.push({
      id: `report_${String(index + 1).padStart(3, '0')}`,
      reportDate: date.toISOString(),
      sessionStartTime: new Date(date.setHours(6, 0, 0, 0)).toISOString(),
      sessionEndTime: new Date(date.setHours(13, 30, 0, 0)).toISOString(),
      cnaId: data.cnaId,
      cnaName: data.cnaName,
      cnaCertification: data.cnaCert,
      createdById: `user_${data.cnaId}`,
      totalResidents: data.totalResidents,
      totalActivities: data.totalActivities,
      status: data.status,
      reviewedBy: data.status === 'reviewed' ? 'Admin User' : null,
      reviewedAt:
        data.status === 'reviewed' ? new Date(date.setHours(15, 0, 0, 0)).toISOString() : null,
      notes: data.status === 'reviewed' ? 'Report reviewed and approved.' : null,
      residentsData: [],
      entriesData: [],
      pdfData: null,
      createdAt: new Date(date.setHours(13, 30, 0, 0)).toISOString(),
      updatedAt: new Date(date.setHours(15, 0, 0, 0)).toISOString(),
    });
  });

  return reports;
};

export const mockChartingReports = generateMockChartingReports();
