'use client';

import React from 'react';
import { ADLButtonMolecule } from '../molecules/ADLButton.molecule';
import { AssistanceSelectorMolecule } from '../molecules/AssistanceSelector.molecule';

const ADL_TYPES = ['bathing', 'dressing', 'eating', 'toileting', 'mobility', 'health'] as const;

export const ADLQuickEntryOrganism = () => {
  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quick Entry</h2>
        <p className="text-sm text-gray-500">Select an activity and assistance level</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {ADL_TYPES.map(type => (
          <ADLButtonMolecule key={type} type={type} className="w-full" />
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">Assistance Level</h3>
        <AssistanceSelectorMolecule className="w-full" />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Clear
        </button>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save Entry
        </button>
      </div>
    </div>
  );
};