'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Flexible resident type that works with both dummy data and database data
interface ChartingResident {
  id: string;
  name: string;
  room: string;
  status: string;
  imageUrl?: string | null;
  imageData?: string | null;
}

interface ADLEntry {
  residentId: string;
  activityType: string;
  assistance: string;
  timestamp: Date;
  notes?: string;
}

interface ChartingStore {
  isChartingActive: boolean;
  selectedResidents: ChartingResident[];
  entries: ADLEntry[];
  startCharting: (residents: ChartingResident[]) => void;
  endCharting: () => void;
  addEntry: (entry: ADLEntry) => void;
}

export const useChartingStore = create<ChartingStore>()(
  persist(
    set => ({
      isChartingActive: false,
      selectedResidents: [],
      entries: [],

      startCharting: residents =>
        set({
          isChartingActive: true,
          selectedResidents: residents,
          entries: [],
        }),

      endCharting: () =>
        set({
          isChartingActive: false,
          selectedResidents: [],
          entries: [],
        }),

      addEntry: entry =>
        set(state => ({
          entries: [...state.entries, entry],
        })),
    }),
    {
      name: 'charting-store',
    }
  )
);
