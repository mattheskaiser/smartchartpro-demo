'use client';

import React from 'react';
import { ADLButtonMolecule } from '../molecules/ADLButton.molecule';
import { AssistanceSelectorMolecule } from '../molecules/AssistanceSelector.molecule';
import { ButtonAtom } from '../atoms/Button.atom';

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
        <ButtonAtom variant="secondary" type="button">
          Clear
        </ButtonAtom>
        <ButtonAtom variant="primary" type="button">
          Save Entry
        </ButtonAtom>
      </div>
    </div>
  );
};
