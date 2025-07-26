'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resident } from '@/constants/residents';

interface ADLEntry {
  residentId: string;
  activityType: string;
  assistance: string;
  timestamp: Date;
  notes?: string;
}

interface ChartingStore {
  isChartingActive: boolean;
  selectedResidents: Resident[];
  entries: ADLEntry[];
  startCharting: (residents: Resident[]) => void;
  endCharting: () => void;
  addEntry: (entry: ADLEntry) => void;
}

export const useChartingStore = create<ChartingStore>()(
  persist(
    (set) => ({
      isChartingActive: false,
      selectedResidents: [],
      entries: [],
      
      startCharting: (residents) => set({
        isChartingActive: true,
        selectedResidents: residents,
        entries: [],
      }),
      
      endCharting: () => set({
        isChartingActive: false,
        selectedResidents: [],
        entries: [],
      }),
      
      addEntry: (entry) => set((state) => ({
        entries: [...state.entries, entry],
      })),
    }),
    {
      name: 'charting-store',
    }
  )
); 