"use client";
import { ResidentList } from '@/components/organisms/ResidentList';
import { ADLQuickEntry } from '@/components/organisms/ADLQuickEntry';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SmartChart Pro</h1>
            <p className="text-sm text-gray-500">Assisted Living Care Management</p>
          </div>
          
          {/* Offline indicator */}
          <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium text-yellow-800">Offline Mode</span>
          </div>
        </header>

        {/* Quick Entry Section */}
        <ADLQuickEntry />

        {/* Residents Section */}
        <ResidentList />

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Export Today's Report (PDF)
          </button>
        </div>
      </div>
    </main>
  );
}
