'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DUMMY_RESIDENTS } from '@/constants/residents';
import { useChartingStore } from '@/stores/chartingStore';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CheckboxAtom } from '@/components/atoms/Checkbox.atom';

export default function StartPage() {
  const router = useRouter();
  const { startCharting } = useChartingStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleStartCharting = () => {
    const selectedResidents = DUMMY_RESIDENTS.filter(r => selectedIds.has(r.id));
    startCharting(selectedResidents);
    router.push('/charting');
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
            Select the residents you'll be charting for during your session
          </p>
        </header>

        {/* Resident Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Residents</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DUMMY_RESIDENTS.map(resident => (
                <div
                  key={resident.id}
                  className={`relative flex items-center space-x-4 p-4 border rounded-lg transition-colors ${
                    selectedIds.has(resident.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <CheckboxAtom
                    checked={selectedIds.has(resident.id)}
                    onCheckedChange={checked => {
                      const newSelected = new Set(selectedIds);
                      if (checked) {
                        newSelected.add(resident.id);
                      } else {
                        newSelected.delete(resident.id);
                      }
                      setSelectedIds(newSelected);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{resident.name}</p>
                      <BadgeAtom variant={getStatusVariant(resident.status)}>
                        {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                      </BadgeAtom>
                    </div>
                    <p className="text-sm text-gray-500">Room {resident.room}</p>
                  </div>
                </div>
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
                onClick={handleStartCharting}
                disabled={selectedIds.size === 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedIds.size === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Start Charting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
