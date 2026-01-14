'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FacilitySettings {
  facilityName: string;
  facilityAddress: string;
  facilityPhone: string;
  licenseNumber: string;
  timezone: string;
}

interface FacilityStore extends FacilitySettings {
  updateSettings: (settings: Partial<FacilitySettings>) => void;
}

export const useFacilityStore = create<FacilityStore>()(
  persist(
    set => ({
      // Default values
      facilityName: 'SmartChart Pro Facility',
      facilityAddress: '123 Healthcare Ave, Medical City, MC 12345',
      facilityPhone: '(555) 123-4567',
      licenseNumber: 'HC-2024-001',
      timezone: 'EST',

      updateSettings: settings =>
        set(state => ({
          ...state,
          ...settings,
        })),
    }),
    {
      name: 'facility-settings',
    }
  )
);
