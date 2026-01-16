import { TextAtom } from '@/components/atoms/Text.atom';
import { TextareaAtom } from '@/components/atoms/Textarea.atom';
import { AssistanceSelectorMolecule } from '@/components/molecules/AssistanceSelector.molecule';
import { AssistanceLevel } from '@/constants/charting';

interface AssistanceFormProps {
    residentName: string;
    selectedAssistance: AssistanceLevel | null;
    notes: string;
    onAssistanceChange: (level: AssistanceLevel) => void;
    onNotesChange: (notes: string) => void;
}

export function AssistanceFormMolecule({
    residentName,
    selectedAssistance,
    notes,
    onAssistanceChange,
    onNotesChange,
}: AssistanceFormProps) {
    return (
        <div className="space-y-6">
            {/* Assistance Level */}
            <div>
                <div className="mb-6">
                    <TextAtom variant="h3" className="text-gray-900 mb-2">
                        Assistance Level
                    </TextAtom>
                    <TextAtom className="text-gray-600">
                        How much assistance did {residentName} need?
                    </TextAtom>
                </div>

                <AssistanceSelectorMolecule
                    value={selectedAssistance || undefined}
                    onChange={onAssistanceChange}
                    className="w-full max-w-md"
                />
            </div>

            {/* Notes */}
            {selectedAssistance && (
                <div>
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
                        onChange={e => onNotesChange(e.target.value)}
                        placeholder="Add any additional notes about the activity..."
                        rows={4}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}
