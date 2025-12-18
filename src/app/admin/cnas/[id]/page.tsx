'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { BadgeAtom } from '@/components/atoms/Badge.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { LoadingStateMolecule } from '@/components/molecules/LoadingState.molecule';
import { EmptyStateMolecule } from '@/components/molecules/EmptyState.molecule';
import { useCNA, useUpdateCNA } from '@/hooks/useCNAs';
import { EditCNAModalMolecule } from '@/components/molecules/cna/EditCNAModal.molecule';

export default function CNADetailPage() {
    const params = useParams();
    const router = useRouter();
    const cnaId = params.id as string;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data: cna, isLoading, error } = useCNA(cnaId);
    const updateCNAMutation = useUpdateCNA();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingStateMolecule message="Loading CNA details..." />
            </div>
        );
    }

    if (error || !cna) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <EmptyStateMolecule
                    iconName="UserRound"
                    title="CNA not found"
                    description="The CNA you're looking for doesn't exist or has been removed."
                />
            </div>
        );
    }

    const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'info';
            default:
                return 'info';
        }
    };

    const getShiftIcon = (shift: string) => {
        switch (shift) {
            case 'Morning':
                return 'Sun';
            case 'Evening':
                return 'Sunset';
            case 'Night':
                return 'Moon';
            default:
                return 'Clock';
        }
    };

    const handleEditSubmit = async (formData: {
        name: string;
        email: string;
        phone?: string;
        shift: 'Morning' | 'Evening' | 'Night';
        certificationNumber?: string;
        hireDate?: string;
        notes?: string;
        imageFile?: File;
        imageUrl?: string;
    }) => {
        try {
            await updateCNAMutation.mutateAsync({
                id: cnaId,
                data: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    shift: formData.shift,
                    certificationNumber: formData.certificationNumber,
                    hireDate: formData.hireDate,
                    notes: formData.notes,
                    imageUrl: formData.imageUrl,
                },
            });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating CNA:', error);
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <ButtonAtom
                            variant="ghost"
                            onClick={() => router.back()}
                            className="p-2"
                        >
                            <DynamicIconAtom name="ArrowLeft" size="md" />
                        </ButtonAtom>
                        <TextAtom variant="h1" weight="semibold">
                            CNA Details
                        </TextAtom>
                    </div>
                    <ButtonAtom variant="primary" onClick={() => setIsEditModalOpen(true)}>
                        <DynamicIconAtom name="Pencil" size="sm" className="mr-2" />
                        Edit CNA
                    </ButtonAtom>
                </div>
            </div>

            {/* CNA Profile */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2">
                    <CardAtom className="p-6">
                        <div className="flex items-start gap-6">
                            <AvatarAtom src={cna.imageUrl} alt={cna.name} size="lg" />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <TextAtom variant="h2" weight="semibold">
                                        {cna.name}
                                    </TextAtom>
                                    <BadgeAtom variant={getStatusColor(cna.status)}>
                                        {cna.status}
                                    </BadgeAtom>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <TextAtom variant="small" color="muted">
                                            Email
                                        </TextAtom>
                                        <TextAtom variant="body" weight="medium">
                                            {cna.email}
                                        </TextAtom>
                                    </div>
                                    {cna.phone && (
                                        <div>
                                            <TextAtom variant="small" color="muted">
                                                Phone
                                            </TextAtom>
                                            <TextAtom variant="body" weight="medium">
                                                {cna.phone}
                                            </TextAtom>
                                        </div>
                                    )}
                                    {cna.certificationNumber && (
                                        <div>
                                            <TextAtom variant="small" color="muted">
                                                Certification Number
                                            </TextAtom>
                                            <TextAtom variant="body" weight="medium">
                                                {cna.certificationNumber}
                                            </TextAtom>
                                        </div>
                                    )}
                                    {cna.hireDate && (
                                        <div>
                                            <TextAtom variant="small" color="muted">
                                                Hire Date
                                            </TextAtom>
                                            <TextAtom variant="body" weight="medium">
                                                {new Date(cna.hireDate).toLocaleDateString()}
                                            </TextAtom>
                                        </div>
                                    )}
                                </div>
                                {cna.notes && (
                                    <div className="mt-4">
                                        <TextAtom variant="small" color="muted">
                                            Notes
                                        </TextAtom>
                                        <TextAtom variant="body" className="mt-1">
                                            {cna.notes}
                                        </TextAtom>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardAtom>
                </div>

                {/* Stats */}
                <div className="space-y-6">
                    <CardAtom className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
                                <DynamicIconAtom name={getShiftIcon(cna.shift)} size="md" className="text-primary" />
                            </div>
                            <div>
                                <TextAtom variant="small" color="muted">
                                    Current Shift
                                </TextAtom>
                                <TextAtom variant="h3" weight="semibold">
                                    {cna.shift}
                                </TextAtom>
                            </div>
                        </div>
                    </CardAtom>

                    <CardAtom className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
                                <DynamicIconAtom name="Users" size="md" className="text-primary" />
                            </div>
                            <div>
                                <TextAtom variant="small" color="muted">
                                    Assigned Residents
                                </TextAtom>
                                <TextAtom variant="h3" weight="semibold">
                                    {cna.residents}
                                </TextAtom>
                            </div>
                        </div>
                    </CardAtom>

                    <CardAtom className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-secondary">
                                <DynamicIconAtom name="Clock" size="md" className="text-primary" />
                            </div>
                            <div>
                                <TextAtom variant="small" color="muted">
                                    Last Active
                                </TextAtom>
                                <TextAtom variant="h3" weight="semibold">
                                    {cna.lastActive}
                                </TextAtom>
                            </div>
                        </div>
                    </CardAtom>
                </div>
            </div>

            <EditCNAModalMolecule
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                editingCNA={cna}
                isLoading={updateCNAMutation.isPending}
            />
        </div>
    );
}