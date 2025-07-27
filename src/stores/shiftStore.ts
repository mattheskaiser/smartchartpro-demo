import { create } from 'zustand';
import type { Resident } from '@/constants/residents';

interface ADLEntry {
  residentId: string;
  activityType: string;
  assistance: string;
  timestamp: Date;
  notes?: string;
}

interface ShiftStore {
  isShiftActive: boolean;
  selectedResidents: Resident[];
  entries: ADLEntry[];
  startShift: (residents: Resident[]) => void;
  endShift: () => void;
  addEntry: (entry: ADLEntry) => void;
}

export const useShiftStore = create<ShiftStore>(set => ({
  isShiftActive: false,
  selectedResidents: [],
  entries: [],

  startShift: residents =>
    set({
      isShiftActive: true,
      selectedResidents: residents,
      entries: [],
    }),

  endShift: () =>
    set({
      isShiftActive: false,
      selectedResidents: [],
      entries: [],
    }),

  addEntry: entry =>
    set(state => ({
      entries: [...state.entries, entry],
    })),
}));
