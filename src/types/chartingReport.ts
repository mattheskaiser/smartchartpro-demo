export interface ChartingReportResident {
    id: string;
    name: string;
    room: string;
    status: string;
    imageData?: string | null;
}

export interface ChartingReportEntry {
    residentId: string;
    activityType: string;
    assistance: string;
    timestamp: Date | string;
    notes?: string;
}

export interface ChartingReport {
    id: string;
    reportDate: Date | string;
    sessionStartTime: Date | string;
    sessionEndTime: Date | string;
    cnaId?: string | null;
    cnaName?: string | null;
    cnaCertification?: string | null;
    totalResidents: number;
    totalActivities: number;
    status: 'pending' | 'reviewed' | 'archived';
    reviewedBy?: string | null;
    reviewedAt?: Date | string | null;
    notes?: string | null;
    residentsData: ChartingReportResident[];
    entriesData: ChartingReportEntry[];
    createdAt: Date | string;
    updatedAt: Date | string;
    cna?: {
        id: string;
        name: string;
        email: string;
        certificationNumber?: string | null;
    } | null;
}

export interface CreateChartingReportData {
    reportDate: Date;
    sessionStartTime: Date;
    sessionEndTime: Date;
    cnaId?: string;
    cnaName?: string;
    cnaCertification?: string;
    totalResidents: number;
    totalActivities: number;
    residentsData: ChartingReportResident[];
    entriesData: ChartingReportEntry[];
    pdfData?: string; // Base64 encoded PDF
}

export interface UpdateChartingReportData {
    status?: 'pending' | 'reviewed' | 'archived';
    reviewedBy?: string;
    reviewedAt?: Date;
    notes?: string;
}
