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

interface ChartingSession {
  startTime: Date;
  cnaId?: string;
  cnaName?: string;
  cnaCertification?: string;
}

interface ChartingStore {
  isChartingActive: boolean;
  selectedResidents: ChartingResident[];
  entries: ADLEntry[];
  session: ChartingSession | null;
  startCharting: (
    residents: ChartingResident[],
    cnaInfo?: { id: string; name: string; certificationNumber?: string }
  ) => void;
  endCharting: () => void;
  addEntry: (entry: ADLEntry) => void;
}

export const useChartingStore = create<ChartingStore>()(
  persist(
    set => ({
      isChartingActive: false,
      selectedResidents: [],
      entries: [],
      session: null,

      startCharting: (residents, cnaInfo) =>
        set({
          isChartingActive: true,
          selectedResidents: residents,
          entries: [],
          session: {
            startTime: new Date(),
            cnaId: cnaInfo?.id,
            cnaName: cnaInfo?.name,
            cnaCertification: cnaInfo?.certificationNumber,
          },
        }),

      endCharting: () =>
        set({
          isChartingActive: false,
          selectedResidents: [],
          entries: [],
          session: null,
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
