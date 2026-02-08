'use client';

import { useRouter } from 'next/navigation';
import { useChartingADLForm } from '@/hooks/useChartingADLForm';
import { CardAtom } from '@/components/atoms/Card.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { PageLoaderMolecule } from '@/components/molecules/PageLoader.molecule';
import { ResidentSelectorMolecule } from '@/components/molecules/charting/ResidentSelector.molecule';
import { ADLSelectorMolecule } from '@/components/molecules/charting/ADLSelector.molecule';
import { AssistanceFormMolecule } from '@/components/molecules/charting/AssistanceForm.molecule';

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

export default function ChartingADLsPage() {
  const router = useRouter();
  const {
    selectedResidents,
    selectedResident,
    setSelectedResident,
    selectedADL,
    setSelectedADL,
    selectedAssistance,
    setSelectedAssistance,
    notes,
    setNotes,
    isSubmitting,
    isLoadingResidents,
    currentResident,
    resetForm,
    handleSubmit,
    handleFinishCharting,
  } = useChartingADLForm();

  // Show loading while residents are being loaded from session
  if (isLoadingResidents) {
    return <PageLoaderMolecule message="Loading session..." />;
  }

  // If no residents are available
  if (selectedResidents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <CardAtom className="max-w-md">
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
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <CardAtom padding="none">
          <div className="p-6">
            <ResidentSelectorMolecule
              residents={selectedResidents}
              onSelect={setSelectedResident}
            />
          </div>

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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
        <ADLSelectorMolecule
          residentName={currentResident?.name || ''}
          selectedADL={selectedADL}
          onSelect={setSelectedADL}
        />
      </CardAtom>

      {/* Assistance Level & Notes */}
      {selectedADL && (
        <CardAtom>
          <AssistanceFormMolecule
            residentName={currentResident?.name || ''}
            selectedAssistance={selectedAssistance}
            notes={notes}
            onAssistanceChange={setSelectedAssistance}
            onNotesChange={setNotes}
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
