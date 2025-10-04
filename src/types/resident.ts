// Resident types for API responses
export interface Resident {
  id: string;
  name: string;
  imageUrl: string;
  room: string;
  status: 'independent' | 'partial' | 'full';
  dateOfBirth?: Date | null;
  admissionDate?: Date | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelationship?: string | null;
  assignedCNA?: string | null;
  notes?: string | null;
  adlNeeds: string[];
  createdAt: Date;
  updatedAt: Date;

  // Relations
  allergies?: Allergy[];
  conditions?: Condition[];
  medications?: Medication[];
  specialists?: Specialist[];
  dnrStatus?: DNRStatus | null;
}

export interface Allergy {
  id: string;
  residentId: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Condition {
  id: string;
  residentId: string;
  name: string;
  diagnosedDate?: Date | null;
  status: 'active' | 'managed' | 'resolved';
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  residentId: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string | null;
  startDate: Date;
  endDate?: Date | null;
  status: 'current' | 'past' | 'discontinued';
  discontinuedReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Specialist {
  id: string;
  residentId: string;
  name: string;
  specialty: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DNRStatus {
  id: string;
  residentId: string;
  hasDNR: boolean;
  hasDNI: boolean;
  dnrDate?: Date | null;
  dniDate?: Date | null;
  physicianName?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ResidentStatus = Resident['status'];
