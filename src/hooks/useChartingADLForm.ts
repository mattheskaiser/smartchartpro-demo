import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';
import { useChartingSession } from '@/hooks/useChartingSession';
import { toast } from '@/lib/toast';
import { AssistanceLevel } from '@/constants/charting';

type Resident = {
  id: string;
  name: string;
  room: string;
  status: string;
  imageUrl?: string | null;
  imageData?: string | null;
};

export function useChartingADLForm() {
  const router = useRouter();
  const { selectedResidents, addEntry, setResidents } = useChartingStore();
  const { session: activeSession, isLoading: sessionLoading } = useChartingSession();
  const [selectedResident, setSelectedResident] = useState<string | null>(null);
  const [selectedADL, setSelectedADL] = useState<string | null>(null);
  const [selectedAssistance, setSelectedAssistance] = useState<AssistanceLevel | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResidents, setIsLoadingResidents] = useState(false);

  // Load residents from active session if store is empty
  useEffect(() => {
    const loadResidentsFromSession = async () => {
      // If store already has residents, don't fetch
      if (selectedResidents.length > 0) return;

      // Wait for session to load
      if (sessionLoading) return;

      // If no active session, redirect to start
      if (!activeSession || !activeSession.isActive) {
        router.replace('/charting/start');
        return;
      }

      // Fetch residents from the session's residentIds
      if (activeSession.residentIds && activeSession.residentIds.length > 0) {
        setIsLoadingResidents(true);
        try {
          // Fetch all residents
          const response = await fetch('/api/residents?limit=200');
          if (!response.ok) {
            throw new Error('Failed to fetch residents');
          }

          const data = await response.json();
          const allResidents = data.residents || [];

          // Filter to only the residents in the session
          const sessionResidents = allResidents.filter((r: Resident) =>
            activeSession.residentIds.includes(r.id)
          );

          // Update the store with the session residents
          if (sessionResidents.length > 0) {
            setResidents(sessionResidents);
          } else {
            // No residents found, redirect to start
            router.replace('/charting/start');
          }
        } catch (error) {
          console.error('Error loading residents from session:', error);
          toast({
            title: 'Failed to load residents',
            description: 'Please try starting a new session',
            type: 'error',
          });
          router.replace('/charting/start');
        } finally {
          setIsLoadingResidents(false);
        }
      }
    };

    loadResidentsFromSession();
  }, [selectedResidents.length, activeSession, sessionLoading, router, setResidents]);

  const currentResident = selectedResidents.find(r => r.id === selectedResident);

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

      toast({
        title: 'Entry saved successfully',
        description: `${selectedADL.charAt(0).toUpperCase() + selectedADL.slice(1)} activity recorded for ${currentResident?.name}`,
        type: 'success',
      });

      resetForm();
    } catch (error) {
      toast({
        title: 'Failed to save entry',
        description: 'There was an error saving the entry. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishCharting = async () => {
    try {
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStep: 'review' }),
      });
    } catch (error) {
      // Error handled silently
    }

    router.push('/charting/review');
  };

  return {
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
  };
}
