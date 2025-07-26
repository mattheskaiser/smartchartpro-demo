'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DUMMY_RESIDENTS } from '@/constants/residents';
import { useShiftStore } from '@/stores/shiftStore';
import { Badge } from '@/components/atoms/Badge';

export default function StartShiftPage() {
  const router = useRouter();
  const { startShift } = useShiftStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleStartShift = () => {
    const selectedResidents = DUMMY_RESIDENTS.filter((r) => selectedIds.has(r.id));
    startShift(selectedResidents);
    router.push('/shift/chart');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'independent':
        return 'success';
      case 'partial':
        return 'warning';
      case 'full':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">SmartChart Pro</h1>
          <p className="mt-2 text-sm text-gray-600">
            Select the residents you'll be caring for during your shift
          </p>
        </header>

        {/* Resident Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Available Residents
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DUMMY_RESIDENTS.map((resident) => (
                <label
                  key={resident.id}
                  className={`relative flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedIds.has(resident.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedIds.has(resident.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedIds);
                      if (e.target.checked) {
                        newSelected.add(resident.id);
                      } else {
                        newSelected.delete(resident.id);
                      }
                      setSelectedIds(newSelected);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {resident.name}
                      </p>
                      <Badge variant={getStatusVariant(resident.status)}>
                        {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Room {resident.room}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedIds.size} resident{selectedIds.size !== 1 ? 's' : ''} selected
              </p>
              <button
                onClick={handleStartShift}
                disabled={selectedIds.size === 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedIds.size === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Start Shift
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 