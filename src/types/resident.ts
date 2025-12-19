// Resident types for API responses
export interface Resident {
  id: string;
  name: string;
  imageUrl?: string | null;
  room: string;
  status: 'independent' | 'partial' | 'full';
  dateOfBirth?: string | null;
  admissionDate?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelationship?: string | null;
  assignedCNA?: string | null;
  notes?: string | null;
  adlNeeds?: string[];
  lastADL?: string;
  createdAt: string;
  updatedAt: string;

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
  createdAt: string;
  updatedAt: string;
}

export interface Condition {
  id: string;
  residentId: string;
  name: string;
  diagnosedDate?: string | null;
  status: 'active' | 'managed' | 'resolved';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  residentId: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string | null;
  startDate: string;
  endDate?: string | null;
  status: 'current' | 'past' | 'discontinued';
  discontinuedReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Specialist {
  id: string;
  residentId: string;
  name: string;
  specialty: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DNRStatus {
  id: string;
  residentId: string;
  hasDNR: boolean;
  hasDNI: boolean;
  dnrDate?: string | null;
  dniDate?: string | null;
  physicianName?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ResidentStatus = Resident['status'];
