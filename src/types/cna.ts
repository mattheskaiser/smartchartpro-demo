export interface CNA {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  shift: 'Morning' | 'Evening' | 'Night';
  residents: number;
  lastActive: string;
  imageData?: string;
  hireDate?: string;
  certificationNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCNAData {
  name: string;
  email: string;
  phone?: string;
  shift: 'Morning' | 'Evening' | 'Night';
  certificationNumber?: string;
  hireDate?: string;
  notes?: string;
  imageFile?: File;
  imageUrl?: string;
  imageData?: string;
}
