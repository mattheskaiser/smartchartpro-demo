'use client';

import { useState, useEffect } from 'react';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DEMO_CONFIG } from '@/lib/demo-config';

const WELCOME_SHOWN_KEY = 'smartchartpro_welcome_shown';

export function WelcomeModalMolecule() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!DEMO_CONFIG.enabled) return;

    const hasShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasShown) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <DynamicIconAtom name="Hospital" size="md" className="text-primary" />
            </div>
            <div>
              <TextAtom variant="h2" className="text-gray-900">
                SmartChart Pro
              </TextAtom>
              <TextAtom variant="small" className="text-gray-600">
                Portfolio Demo
              </TextAtom>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <TextAtom className="text-gray-700 leading-relaxed">
              This is a demonstration of a healthcare EMR system built for assisted living
              facilities. Explore the full-stack application with realistic data and workflows.
            </TextAtom>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <DynamicIconAtom name="Shield" size="sm" className="text-gray-600 mt-0.5" />
              <div>
                <TextAtom variant="small" className="text-gray-900 font-medium">
                  Admin Dashboard
                </TextAtom>
                <TextAtom variant="small" className="text-gray-600">
                  Manage residents, staff, shifts, and view reports
                </TextAtom>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DynamicIconAtom name="User" size="sm" className="text-gray-600 mt-0.5" />
              <div>
                <TextAtom variant="small" className="text-gray-900 font-medium">
                  CNA Charting
                </TextAtom>
                <TextAtom variant="small" className="text-gray-600">
                  iPad-optimized interface for care documentation
                </TextAtom>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DynamicIconAtom name="FileText" size="sm" className="text-gray-600 mt-0.5" />
              <div>
                <TextAtom variant="small" className="text-gray-900 font-medium">
                  Automated Reports
                </TextAtom>
                <TextAtom variant="small" className="text-gray-600">
                  PDF generation and compliance tracking
                </TextAtom>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-gray-500 pt-2">
            <DynamicIconAtom name="Info" size="sm" className="mt-0.5 flex-shrink-0" />
            <TextAtom variant="small" className="text-gray-600">
              Demo mode: All data is simulated. Changes are not persisted.
            </TextAtom>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <ButtonAtom onClick={handleClose} className="w-full">
            Continue to Dashboard
          </ButtonAtom>
        </div>
      </div>
    </div>
  );
}
