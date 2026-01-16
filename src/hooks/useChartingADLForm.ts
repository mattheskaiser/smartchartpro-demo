import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChartingStore } from '@/stores/chartingStore';
import { toast } from '@/lib/toast';
import { AssistanceLevel } from '@/constants/charting';

export function useChartingADLForm() {
    const router = useRouter();
    const { selectedResidents, addEntry } = useChartingStore();
    const [selectedResident, setSelectedResident] = useState<string | null>(null);
    const [selectedADL, setSelectedADL] = useState<string | null>(null);
    const [selectedAssistance, setSelectedAssistance] = useState<AssistanceLevel | null>(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        currentResident,
        resetForm,
        handleSubmit,
        handleFinishCharting,
    };
}
