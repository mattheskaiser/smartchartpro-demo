export interface ChartingSession {
  id: string;
  userId: string;
  cnaId: string;
  residentIds: string[];
  startTime: Date;
  endTime: Date | null;
  isActive: boolean;
  currentStep: 'start' | 'adls' | 'review';
  chartingData: any | null;
  reportId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionData {
  residentIds: string[];
}

export interface UpdateSessionData {
  currentStep?: 'start' | 'adls' | 'review';
  chartingData?: any;
}

export interface SessionWithDetails extends ChartingSession {
  cna: {
    id: string;
    name: string;
    email: string;
    certificationNumber: string | null;
  };
  user: {
    id: string;
    email: string;
  };
}
