// Medical specialty options for specialists/doctors
export const SPECIALTY_OPTIONS = [
  { value: 'primary-care', label: 'Primary Care Physician' },
  { value: 'cardiologist', label: 'Cardiologist' },
  { value: 'neurologist', label: 'Neurologist' },
  { value: 'psychiatrist', label: 'Psychiatrist' },
  { value: 'endocrinologist', label: 'Endocrinologist' },
  { value: 'orthopedist', label: 'Orthopedist' },
  { value: 'dermatologist', label: 'Dermatologist' },
  { value: 'ophthalmologist', label: 'Ophthalmologist' },
  { value: 'podiatrist', label: 'Podiatrist' },
  { value: 'other', label: 'Other' },
] as const;

export type SpecialtyValue = (typeof SPECIALTY_OPTIONS)[number]['value'];
