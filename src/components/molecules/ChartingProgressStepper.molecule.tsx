'use client';

import React from 'react';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  icon: string;
}

interface ChartingProgressStepperProps {
  currentStep: string;
  className?: string;
}

const steps: Step[] = [
  {
    id: 'start',
    title: 'Select Residents',
    icon: 'Users',
  },
  {
    id: 'charting',
    title: 'Chart Activities',
    icon: 'Hospital',
  },
  {
    id: 'review',
    title: 'Review & Submit',
    icon: 'FileText',
  },
];

export const ChartingProgressStepperMolecule = ({
  currentStep,
  className,
}: ChartingProgressStepperProps) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex items-center space-x-6">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200',
                    {
                      'bg-primary border-primary text-white': status === 'completed',
                      'bg-white border-primary text-primary ring-2 ring-primary/20':
                        status === 'current',
                      'bg-white border-gray-300 text-gray-400': status === 'upcoming',
                    }
                  )}
                >
                  {status === 'completed' ? (
                    <DynamicIconAtom name="Check" size="sm" />
                  ) : (
                    <DynamicIconAtom name={step.icon as any} size="sm" />
                  )}
                </div>

                {/* Step Label */}
                <TextAtom
                  variant="small"
                  className={cn('mt-1 text-center whitespace-nowrap text-xs', {
                    'text-primary font-medium': status === 'current' || status === 'completed',
                    'text-gray-500': status === 'upcoming',
                  })}
                >
                  {step.title}
                </TextAtom>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="w-12 mt-[-1.5rem]">
                  {status === 'completed' ? (
                    <div className="h-0.5 w-full bg-primary transition-all duration-200" />
                  ) : (
                    <div className="h-0.5 w-full border-t-2 border-dashed border-gray-300 transition-all duration-200" />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
