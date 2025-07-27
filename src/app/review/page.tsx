'use client';

import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';
import { format } from 'date-fns';

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

export default function ReviewPage() {
  const router = useRouter();
  const { selectedResidents, entries, endCharting } = useChartingStore();

  const handleEndCharting = () => {
    // Here you would typically save all entries to the database
    // and generate a PDF report
    endCharting();
    router.push('/start');
  };

  const entriesByResident = entries.reduce(
    (acc, entry) => {
      const resident = selectedResidents.find(r => r.id === entry.residentId);
      if (!resident) return acc;

      if (!acc[entry.residentId]) {
        acc[entry.residentId] = {
          resident,
          entries: [],
        };
      }

      acc[entry.residentId].entries.push(entry);
      return acc;
    },
    {} as Record<string, { resident: (typeof selectedResidents)[0]; entries: typeof entries }>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Charting Summary</h2>

        <div className="space-y-8">
          {Object.values(entriesByResident).map(({ resident, entries }) => (
            <div
              key={resident.id}
              className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              <h3 className="font-medium text-gray-900 mb-2">
                {resident.name} - Room {resident.room}
              </h3>

              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {ADL_TYPES.find(t => t.id === entry.activityType)?.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ASSISTANCE_LEVELS.find(l => l.id === entry.assistance)?.label}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(entry.timestamp), 'h:mm a')}
                      </p>
                    </div>
                    {entry.notes && <p className="mt-2 text-sm text-gray-600">{entry.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(entriesByResident).length === 0 && (
            <p className="text-gray-500 text-center py-4">No entries recorded yet.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => router.push('/charting')}
          className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Back to Charting
        </button>

        <div className="space-x-4">
          <button
            onClick={() => {
              // Here you would trigger PDF generation
              console.log('Generating PDF...');
            }}
            className="px-4 py-2 rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Export PDF
          </button>

          <button
            onClick={handleEndCharting}
            className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            End Charting
          </button>
        </div>
      </div>
    </div>
  );
}
