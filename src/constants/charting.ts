/**
 * Charting Constants
 * Centralized constants for ADL charting functionality
 */

// ADL Activity Types
export const ADL_TYPES = [
    'bathing',
    'dressing',
    'eating',
    'toileting',
    'mobility',
    'health',
] as const;

export type ADLType = (typeof ADL_TYPES)[number];

// Assistance Levels
export const ASSISTANCE_LEVELS = ['independent', 'partial', 'full'] as const;

export type AssistanceLevel = (typeof ASSISTANCE_LEVELS)[number];

// Session Steps
export const SESSION_STEPS = ['start', 'adls', 'review'] as const;

export type SessionStep = (typeof SESSION_STEPS)[number];

// ADL Type Labels (for display)
export const ADL_LABELS: Record<ADLType, string> = {
    bathing: 'Bathing',
    dressing: 'Dressing',
    eating: 'Eating',
    toileting: 'Toileting',
    mobility: 'Mobility',
    health: 'Health Monitoring',
};

// Assistance Level Labels (for display)
export const ASSISTANCE_LABELS: Record<AssistanceLevel, string> = {
    independent: 'Independent',
    partial: 'Partial Assistance',
    full: 'Full Assistance',
};

// ADL Type Icons (for UI)
export const ADL_ICONS: Record<ADLType, string> = {
    bathing: 'Droplets',
    dressing: 'Shirt',
    eating: 'Utensils',
    toileting: 'Home',
    mobility: 'Footprints',
    health: 'Heart',
};

// Assistance Level Colors (for UI)
export const ASSISTANCE_COLORS: Record<AssistanceLevel, string> = {
    independent: 'green',
    partial: 'yellow',
    full: 'red',
};
