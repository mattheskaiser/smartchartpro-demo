'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';

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

export default function ChartingPage() {
  const router = useRouter();
  const { selectedResidents, addEntry } = useChartingStore();
  const [selectedResident, setSelectedResident] = useState<string | null>(null);
  const [selectedADL, setSelectedADL] = useState<string | null>(null);
  const [selectedAssistance, setSelectedAssistance] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setSelectedResident(null);
    setSelectedADL(null);
    setSelectedAssistance(null);
    setNotes('');
  };

  const handleSubmit = () => {
    if (!selectedResident || !selectedADL || !selectedAssistance) return;

    addEntry({
      residentId: selectedResident,
      activityType: selectedADL,
      assistance: selectedAssistance,
      timestamp: new Date(),
      notes: notes.trim() || undefined,
    });

    // Show a brief success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-sm';
    successMessage.textContent = 'Entry saved successfully';
    document.body.appendChild(successMessage);
    
    // Remove the message after 2 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 2000);

    // Reset form
    resetForm();
  };

  const handleFinishCharting = () => {
    router.push('/review');
  };

  // If no resident is selected, show the resident selection screen
  if (!selectedResident) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Resident</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedResidents.map((resident) => (
              <button
                key={resident.id}
                onClick={() => setSelectedResident(resident.id)}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 text-left"
              >
                <p className="font-medium text-gray-900">{resident.name}</p>
                <p className="text-sm text-gray-500">Room {resident.room}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleFinishCharting}
            className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Review All Entries
          </button>
        </div>
      </div>
    );
  }

  const currentResident = selectedResidents.find(r => r.id === selectedResident);

  return (
    <div className="space-y-6">
      {/* Current Resident Info */}
      <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-blue-500 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-medium text-gray-900">{currentResident?.name}</h2>
            <p className="text-sm text-gray-500">Room {currentResident?.room}</p>
          </div>
          <button
            onClick={resetForm}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Change Resident
          </button>
        </div>
      </div>

      {/* ADL Selection */}
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
          disabled={!selectedADL || !selectedAssistance}
          className={`px-4 py-2 rounded-lg font-medium ${
            !selectedADL || !selectedAssistance
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
          Review All Entries
        </button>
      </div>
    </div>
  );
} 