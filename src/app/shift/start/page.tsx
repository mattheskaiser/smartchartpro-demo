'use client';

import { useRouter } from 'next/navigation';
import { useShiftStore } from '@/stores/shiftStore';
import { useEffect, useState } from 'react';
import { prisma } from '@/lib/db';

export default function StartShiftPage() {
  const router = useRouter();
  const { startShift } = useShiftStore();
  const [residents, setResidents] = useState<Array<{ id: string; name: string; room: string }>>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch residents from the API
    fetch('/api/residents')
      .then((res) => res.json())
      .then((data) => setResidents(data))
      .catch((error) => console.error('Error fetching residents:', error));
  }, []);

  const handleStartShift = () => {
    const selectedResidents = residents.filter((r) => selectedIds.has(r.id));
    startShift(selectedResidents);
    router.push('/shift/chart');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Residents for Your Shift</h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {residents.map((resident) => (
            <label
              key={resident.id}
              className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
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
              <div>
                <p className="font-medium text-gray-900">{resident.name}</p>
                <p className="text-sm text-gray-500">Room {resident.room}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleStartShift}
          disabled={selectedIds.size === 0}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedIds.size === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Start Shift with {selectedIds.size} Resident{selectedIds.size !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
} 