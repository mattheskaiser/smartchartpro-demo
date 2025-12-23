export interface CNA {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
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
  certificationNumber?: string;
  hireDate?: string;
  notes?: string;
  imageFile?: File;
  imageUrl?: string;
  imageData?: string;
}
