'use client';

import { useRouter } from 'next/navigation';
import { useShiftStore } from '@/stores/shiftStore';
import { useState } from 'react';

const ADL_TYPES = [
  { id: 'bathing', label: 'Bathing' },
  { id: 'dressing', label: 'Dressing' },
  { id: 'eating', label: 'Eating' },
  { id: 'toileting', label: 'Toileting' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'health', label: 'Health Check' },
];

const ASSISTANCE_LEVELS = [
  { id: 'independent', label: 'Independent' },
  { id: 'partial', label: 'Partial Assist' },
  { id: 'full', label: 'Full Assist' },
];

export default function ChartPage() {
  const router = useRouter();
  const { selectedResidents, addEntry } = useShiftStore();
  const [selectedResident, setSelectedResident] = useState<string | null>(null);
  const [selectedADL, setSelectedADL] = useState<string | null>(null);
  const [selectedAssistance, setSelectedAssistance] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedResident || !selectedADL || !selectedAssistance) return;

    addEntry({
      residentId: selectedResident,
      activityType: selectedADL,
      assistance: selectedAssistance,
      timestamp: new Date(),
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSelectedADL(null);
    setSelectedAssistance(null);
    setNotes('');
  };

  const handleFinishCharting = () => {
    router.push('/shift/review');
  };

  return (
    <div className="space-y-6">
      {/* Resident Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Resident</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selectedResidents.map((resident) => (
            <button
              key={resident.id}
              onClick={() => setSelectedResident(resident.id)}
              className={`p-4 rounded-lg border text-left ${
                selectedResident === resident.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-gray-900">{resident.name}</p>
              <p className="text-sm text-gray-500">Room {resident.room}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ADL Selection */}
      {selectedResident && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Activity</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ADL_TYPES.map((adl) => (
              <button
                key={adl.id}
                onClick={() => setSelectedADL(adl.id)}
                className={`p-4 rounded-lg border ${
                  selectedADL === adl.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {adl.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Assistance Level */}
      {selectedADL && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Assistance Level</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {ASSISTANCE_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedAssistance(level.id)}
                className={`p-4 rounded-lg border ${
                  selectedAssistance === level.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {selectedAssistance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notes (Optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 rounded-lg border-gray-200 resize-none"
            placeholder="Add any additional notes..."
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={handleSubmit}
          disabled={!selectedResident || !selectedADL || !selectedAssistance}
          className={`px-4 py-2 rounded-lg font-medium ${
            !selectedResident || !selectedADL || !selectedAssistance
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Save Entry
        </button>

        <button
          onClick={handleFinishCharting}
          className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Finish Charting
        </button>
      </div>
    </div>
  );
} 