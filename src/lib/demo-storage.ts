/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Demo Storage - Client-side data management for demo mode
 *
 * Uses localStorage to persist demo data during the session.
 * Data resets when localStorage is cleared or on page refresh (optional).
 */

import {
  mockResidents,
  mockCnas,
  mockUsers,
  mockSettings,
  mockSessions,
  mockShiftTemplates,
  mockShiftAssignments,
  mockChartingReports,
} from './mock-data';

const STORAGE_KEY = 'smartchartpro_demo_data';
const STORAGE_VERSION = '1.0';

export interface DemoData {
  version: string;
  residents: any[];
  cnas: any[];
  users: any[];
  settings: any;
  sessions: any[];
  shiftTemplates: any[];
  shiftAssignments: any[];
  chartingReports: any[];
  lastUpdated: string;
}

/**
 * Initialize demo data from localStorage or use defaults
 */
export function initDemoData(): DemoData {
  if (typeof window === 'undefined') {
    // Server-side: return defaults
    return getDefaultData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DemoData;
      // Check version compatibility
      if (data.version === STORAGE_VERSION) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Failed to load demo data from localStorage:', error);
  }

  // Return defaults if nothing in storage or error
  const defaultData = getDefaultData();
  saveDemoData(defaultData);
  return defaultData;
}

/**
 * Get default demo data
 */
function getDefaultData(): DemoData {
  return {
    version: STORAGE_VERSION,
    residents: [...mockResidents],
    cnas: [...mockCnas],
    users: [...mockUsers],
    settings: { ...mockSettings },
    sessions: [...mockSessions],
    shiftTemplates: [...mockShiftTemplates],
    shiftAssignments: [...mockShiftAssignments],
    chartingReports: [...mockChartingReports],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Save demo data to localStorage
 */
export function saveDemoData(data: DemoData): void {
  if (typeof window === 'undefined') return;

  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save demo data to localStorage:', error);
  }
}

/**
 * Reset demo data to defaults
 */
export function resetDemoData(): DemoData {
  const defaultData = getDefaultData();
  saveDemoData(defaultData);
  return defaultData;
}

/**
 * Clear all demo data
 */
export function clearDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get current demo data
 */
export function getDemoData(): DemoData {
  return initDemoData();
}

/**
 * Update specific collection in demo data
 */
export function updateDemoCollection(
  collection: keyof Omit<DemoData, 'version' | 'lastUpdated'>,
  data: any
): void {
  const current = getDemoData();
  current[collection] = data;
  saveDemoData(current);
}

/**
 * Add item to collection
 */
export function addToDemoCollection(
  collection: keyof Omit<DemoData, 'version' | 'lastUpdated' | 'settings'>,
  item: any
): void {
  const current = getDemoData();
  if (Array.isArray(current[collection])) {
    (current[collection] as any[]).push(item);
    saveDemoData(current);
  }
}

/**
 * Update item in collection
 */
export function updateInDemoCollection(
  collection: keyof Omit<DemoData, 'version' | 'lastUpdated' | 'settings'>,
  id: string,
  updates: any
): void {
  const current = getDemoData();
  if (Array.isArray(current[collection])) {
    const index = (current[collection] as any[]).findIndex((item: any) => item.id === id);
    if (index !== -1) {
      (current[collection] as any[])[index] = {
        ...(current[collection] as any[])[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveDemoData(current);
    }
  }
}

/**
 * Remove item from collection
 */
export function removeFromDemoCollection(
  collection: keyof Omit<DemoData, 'version' | 'lastUpdated' | 'settings'>,
  id: string
): void {
  const current = getDemoData();
  if (Array.isArray(current[collection])) {
    current[collection] = (current[collection] as any[]).filter((item: any) => item.id !== id);
    saveDemoData(current);
  }
}

/**
 * Find item in collection
 */
export function findInDemoCollection(
  collection: keyof Omit<DemoData, 'version' | 'lastUpdated' | 'settings'>,
  id: string
): any | undefined {
  const current = getDemoData();
  if (Array.isArray(current[collection])) {
    return (current[collection] as any[]).find((item: any) => item.id === id);
  }
  return undefined;
}

/**
 * Filter collection
 */
export function filterDemoCollection(
  collection: keyof Omit<DemoData, 'version' | 'lastUpdated' | 'settings'>,
  predicate: (item: any) => boolean
): any[] {
  const current = getDemoData();
  if (Array.isArray(current[collection])) {
    return (current[collection] as any[]).filter(predicate);
  }
  return [];
}
