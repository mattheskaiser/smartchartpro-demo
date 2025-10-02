// ADL (Activities of Daily Living) options
export const ADL_OPTIONS = [
  'bathing',
  'dressing',
  'eating',
  'toileting',
  'mobility',
  'health',
] as const;

// ADL types with labels for forms and displays
export const ADL_TYPES = [
  { id: 'bathing', label: 'Bathing' },
  { id: 'dressing', label: 'Dressing' },
  { id: 'eating', label: 'Eating' },
  { id: 'toileting', label: 'Toileting' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'health', label: 'Health' },
] as const;

// Assistance levels for care planning
export const ASSISTANCE_LEVELS = [
  { id: 'independent', label: 'Independent' },
  { id: 'partial', label: 'Partial Assist' },
  { id: 'full', label: 'Full Assist' },
] as const;

// Care status options
export const CARE_STATUS_OPTIONS = [
  { value: 'independent', label: 'Independent' },
  { value: 'partial', label: 'Partial' },
  { value: 'full', label: 'Full' },
] as const;

export type ADLOption = (typeof ADL_OPTIONS)[number];
export type ADLType = (typeof ADL_TYPES)[number];
export type AssistanceLevel = (typeof ASSISTANCE_LEVELS)[number];
export type CareStatus = (typeof CARE_STATUS_OPTIONS)[number]['value'];
