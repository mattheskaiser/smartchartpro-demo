'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';
import { ADLButtonMolecule } from '@/components/molecules/ADLButton.molecule';
import { AssistanceSelectorMolecule } from '@/components/molecules/AssistanceSelector.molecule';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';

const ADL_TYPES = ['bathing', 'dressing', 'eating', 'toileting', 'mobility', 'health'] as const;

export default function ChartingADLsPage() {
  const router = useRouter();
  const { selectedResidents, addEntry } = useChartingStore();
  const [selectedResident, setSelectedResident] = useState<string | null>(null);
  const [selectedADL, setSelectedADL] = useState<string | null>(null);
  const [selectedAssistance, setSelectedAssistance] = useState<
    'independent' | 'partial' | 'full' | null
  >(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedResident(null);
    setSelectedADL(null);
    setSelectedAssistance(null);
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!selectedResident || !selectedADL || !selectedAssistance) return;

    setIsSubmitting(true);

    try {
      addEntry({
        residentId: selectedResident,
        activityType: selectedADL,
        assistance: selectedAssistance,
        timestamp: new Date(),
        notes: notes.trim() || undefined,
      });

      // Show success message using a toast-like notification
      const successMessage = document.createElement('div');
      successMessage.className =
        'fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg border border-green-200 z-50';
      successMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          Entry saved successfully
        </div>
      `;
      document.body.appendChild(successMessage);

      setTimeout(() => {
        successMessage.remove();
      }, 3000);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishCharting = () => {
    router.push('/charting/review');
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
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

  // If no residents are available
  if (selectedResidents.length === 0) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <CardAtom>
          <EmptyStateMolecule
            iconName="Users"
            title="No Residents Selected"
            description="You need to select residents before you can start charting. Go back to the start page to select residents."
            actionLabel="Go to Start Page"
            onAction={() => router.push('/charting/start')}
          />
        </CardAtom>
      </div>
    );
  }

  // If no resident is selected, show the resident selection screen
  if (!selectedResident) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Resident Selection */}
        <CardAtom padding="none">
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedResidents.map(resident => (
                <div
                  key={resident.id}
                  className="relative flex items-center space-x-4 p-4 border border-gray-200 rounded-lg transition-all cursor-pointer hover:shadow-sm hover:border-gray-300 hover:bg-gray-50"
                  onClick={() => setSelectedResident(resident.id)}
                >
                  <AvatarAtom
                    src={resident.imageUrl || resident.imageData || undefined}
                    alt={resident.name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <TextAtom className="font-medium text-gray-900 truncate">
                        {resident.name}
                      </TextAtom>
                      <BadgeAtom variant={getStatusVariant(resident.status)}>
                        {resident.status?.charAt(0).toUpperCase() + resident.status?.slice(1)}
                      </BadgeAtom>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DynamicIconAtom name="MapPin" size="sm" className="mr-1" />
                      Room {resident.room}
                    </div>
                  </div>
                  <DynamicIconAtom name="ChevronRight" size="sm" className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DynamicIconAtom name="Info" size="sm" className="text-blue-500" />
                <TextAtom className="text-gray-600">
                  Select a resident to begin charting their activities
                </TextAtom>
              </div>
              <ButtonAtom variant="outline" onClick={handleFinishCharting}>
                <DynamicIconAtom name="FileText" size="sm" className="mr-2" />
                Review Entries
              </ButtonAtom>
            </div>
          </div>
        </CardAtom>
      </div>
    );
  }

  const currentResident = selectedResidents.find(r => r.id === selectedResident);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header with Current Resident */}
      <CardAtom className="border-l-4 border-l-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <AvatarAtom
              src={currentResident?.imageUrl || currentResident?.imageData || undefined}
              alt={currentResident?.name || ''}
              size="lg"
            />
            <div>
              <TextAtom variant="h2" className="text-gray-900">
                {currentResident?.name}
              </TextAtom>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <DynamicIconAtom name="MapPin" size="sm" className="mr-1" />
                  Room {currentResident?.room}
                </div>
                <BadgeAtom variant={getStatusVariant(currentResident?.status || '')}>
                  {currentResident?.status
                    ? currentResident.status.charAt(0).toUpperCase() +
                      currentResident.status.slice(1)
                    : ''}
                </BadgeAtom>
              </div>
            </div>
          </div>
          <ButtonAtom variant="outline" onClick={resetForm}>
            <DynamicIconAtom name="ArrowLeft" size="sm" className="mr-2" />
            Change Resident
          </ButtonAtom>
        </div>
      </CardAtom>

      {/* ADL Selection */}
      <CardAtom>
        <div className="mb-6">
          <TextAtom variant="h3" className="text-gray-900 mb-2">
            Select Activity
          </TextAtom>
          <TextAtom className="text-gray-600">
            Choose the activity you're documenting for {currentResident?.name}
          </TextAtom>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ADL_TYPES.map(adl => (
            <ADLButtonMolecule
              key={adl}
              type={adl}
              selected={selectedADL === adl}
              onClick={() => setSelectedADL(adl)}
              className="w-full"
            />
          ))}
        </div>
      </CardAtom>

      {/* Assistance Level */}
      {selectedADL && (
        <CardAtom>
          <div className="mb-6">
            <TextAtom variant="h3" className="text-gray-900 mb-2">
              Assistance Level
            </TextAtom>
            <TextAtom className="text-gray-600">
              How much assistance did {currentResident?.name} need?
            </TextAtom>
          </div>

          <AssistanceSelectorMolecule
            value={selectedAssistance || undefined}
            onChange={setSelectedAssistance}
            className="w-full max-w-md"
          />
        </CardAtom>
      )}

      {/* Notes */}
      {selectedAssistance && (
        <CardAtom>
          <div className="mb-6">
            <TextAtom variant="h3" className="text-gray-900 mb-2">
              Additional Notes
            </TextAtom>
            <TextAtom className="text-gray-600">
              Add any relevant observations or details (optional)
            </TextAtom>
          </div>

          <TextareaAtom
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add any additional notes about the activity..."
            rows={4}
            className="w-full"
          />
        </CardAtom>
      )}

      {/* Actions */}
      <CardAtom className="bg-gray-50 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DynamicIconAtom
              name={selectedADL && selectedAssistance ? 'Check' : 'Circle'}
              size="sm"
              className={selectedADL && selectedAssistance ? 'text-green-500' : 'text-gray-400'}
            />
            <TextAtom className="text-gray-600">
              {selectedADL && selectedAssistance
                ? 'Ready to save entry'
                : 'Complete the form to save entry'}
            </TextAtom>
          </div>

          <div className="flex items-center space-x-3">
            <ButtonAtom variant="outline" onClick={handleFinishCharting}>
              <DynamicIconAtom name="FileText" size="sm" className="mr-2" />
              Review All Entries
            </ButtonAtom>

            <ButtonAtom
              onClick={handleSubmit}
              disabled={!selectedADL || !selectedAssistance || isSubmitting}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              <DynamicIconAtom name="Save" size="sm" className="mr-2" />
              Save Entry
            </ButtonAtom>
          </div>
        </div>
      </CardAtom>
    </div>
  );
}
