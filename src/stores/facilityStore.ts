'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FacilitySettings {
  facilityName: string;
  facilityAddress: string;
  facilityStreet: string;
  facilityCity: string;
  facilityState: string;
  facilityZip: string;
  facilityPhone: string;
  facilityFax: string;
  facilityWebsite: string;
  licenseNumber: string;
  npiNumber: string;
  taxId: string;
  timezone: string;
}

interface FacilityStore extends FacilitySettings {
  updateSettings: (settings: Partial<FacilitySettings>) => void;
  loadFromDatabase: () => Promise<void>;
  getFormattedAddress: () => string;
}

export const useFacilityStore = create<FacilityStore>()(
  persist(
    (set, get) => ({
      // Default values
      facilityName: 'SmartChart Pro Facility',
      facilityAddress: '123 Healthcare Ave, Medical City, MC 12345',
      facilityStreet: '123 Healthcare Ave',
      facilityCity: 'Medical City',
      facilityState: 'MC',
      facilityZip: '12345',
      facilityPhone: '(555) 123-4567',
      facilityFax: '(555) 123-4568',
      facilityWebsite: '',
      licenseNumber: 'HC-2024-001',
      npiNumber: '',
      taxId: '',
      timezone: 'EST',

      updateSettings: settings =>
        set(state => ({
          ...state,
          ...settings,
        })),

      loadFromDatabase: async () => {
        try {
          const response = await fetch('/api/admin/settings');
          if (response.ok) {
            const data = await response.json();
            set(state => ({
              ...state,
              facilityName: data.facilityName || state.facilityName,
              facilityAddress: data.facilityAddress || state.facilityAddress,
              facilityStreet: data.facilityStreet || state.facilityStreet,
              facilityCity: data.facilityCity || state.facilityCity,
              facilityState: data.facilityState || state.facilityState,
              facilityZip: data.facilityZip || state.facilityZip,
              facilityPhone: data.facilityPhone || state.facilityPhone,
              facilityFax: data.facilityFax || state.facilityFax,
              facilityWebsite: data.facilityWebsite || state.facilityWebsite,
              licenseNumber: data.licenseNumber || state.licenseNumber,
              npiNumber: data.npiNumber || state.npiNumber,
              taxId: data.taxId || state.taxId,
            }));
          }
        } catch (error) {
          console.error('Failed to load facility settings from database:', error);
        }
      },

      getFormattedAddress: () => {
        const state = get();
        if (
          state.facilityStreet &&
          state.facilityCity &&
          state.facilityState &&
          state.facilityZip
        ) {
          return `${state.facilityStreet}, ${state.facilityCity}, ${state.facilityState} ${state.facilityZip}`;
        }
        return state.facilityAddress || '';
      },
    }),
    {
      name: 'facility-settings',
    }
  )
);
