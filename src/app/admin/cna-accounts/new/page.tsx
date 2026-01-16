'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { CardAtom } from '@/components/atoms/Card.atom';
import { InputAtom } from '@/components/atoms/Input.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { DropdownAtom } from '@/components/atoms/Dropdown.atom';
import { useCNAs } from '@/hooks/useCNAs';
import { toast } from '@/lib/toast';

export default function NewCNAAccountPage() {
    const router = useRouter();
    const [selectedCnaId, setSelectedCnaId] = useState('');
    const [email, setEmail] = useState('');
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

    // Fetch CNAs
    const { data: cnas = [], isLoading: cnasLoading } = useCNAs();

    // Filter CNAs that don't have user accounts yet
    const availableCnas = cnas.filter(cna => !cna.user);

    // Create account mutation
    const createAccountMutation = useMutation({
        mutationFn: async (data: { cnaId: string; email: string }) => {
            const response = await fetch('/api/admin/cna-accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create account');
            }
            return response.json();
        },
        onSuccess: data => {
            setTemporaryPassword(data.temporaryPassword);
            toast({
                title: 'Account created successfully',
                description: 'Save the temporary password before leaving this page',
                type: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Failed to create account',
                description: error.message,
                type: 'error',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCnaId || !email) return;

        createAccountMutation.mutate({ cnaId: selectedCnaId, email });
    };

    const handleDone = () => {
        router.push('/admin/cna-accounts');
    };

    // If temporary password is shown, display success screen
    if (temporaryPassword) {
        return (
            <div className="mx-auto max-w-3xl">
                <ButtonAtom
                    variant="ghost"
                    onClick={handleDone}
                    className="mb-6"
                >
                    <DynamicIconAtom name="ArrowLeft" size="sm" className="mr-2" />
                    Back to Accounts
                </ButtonAtom>

                <CardAtom className="border-l-4 border-l-green-500">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <DynamicIconAtom name="Check" size="lg" className="text-green-600" />
                        </div>

                        <TextAtom variant="h2" className="text-gray-900 mb-2">
                            Account Created Successfully
                        </TextAtom>
                        <TextAtom className="text-gray-600 mb-6">
                            The CNA account has been created. Share the temporary password below with the CNA.
                        </TextAtom>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                            <LabelAtom className="text-sm font-medium text-gray-700 mb-2">
                                Temporary Password
                            </LabelAtom>
                            <div className="flex items-center justify-center space-x-3">
                                <code className="text-2xl font-mono font-bold text-gray-900 bg-white px-4 py-2 rounded border border-gray-300">
                                    {temporaryPassword}
                                </code>
                                <ButtonAtom
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(temporaryPassword);
                                        toast({
                                            title: 'Copied to clipboard',
                                            type: 'success',
                                        });
                                    }}
                                >
                                    <DynamicIconAtom name="Copy" size="sm" className="mr-1" />
                                    Copy
                                </ButtonAtom>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <DynamicIconAtom
                                    name="TriangleAlert"
                                    size="sm"
                                    className="text-yellow-600 mt-0.5"
                                />
                                <div className="text-left">
                                    <TextAtom className="text-yellow-800 font-medium text-sm">
                                        Important
                                    </TextAtom>
                                    <TextAtom className="text-yellow-700 text-sm mt-1">
                                        This password will only be shown once. Make sure to save it or share it with
                                        the CNA before leaving this page. The CNA will be required to change this
                                        password on first login.
                                    </TextAtom>
                                </div>
                            </div>
                        </div>

                        <ButtonAtom onClick={handleDone} className="w-full sm:w-auto">
                            Done
                        </ButtonAtom>
                    </div>
                </CardAtom>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <ButtonAtom
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6"
            >
                <DynamicIconAtom name="ArrowLeft" size="sm" className="mr-2" />
                Back
            </ButtonAtom>

            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <TextAtom variant="h1" weight="semibold">
                        Create CNA Account
                    </TextAtom>
                    <TextAtom variant="small" color="muted" className="mt-2">
                        Create a user account for a CNA so they can log in and start charting
                    </TextAtom>
                </div>
            </div>

            <CardAtom>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CNA Selection */}
                    <div className="space-y-2">
                        <LabelAtom htmlFor="cna-select">Select CNA *</LabelAtom>
                        <DropdownAtom
                            value={selectedCnaId || undefined}
                            onValueChange={value => {
                                setSelectedCnaId(value || '');
                                // Auto-fill email with CNA's email if available
                                const selectedCna = availableCnas.find(cna => cna.id === value);
                                if (selectedCna?.email) {
                                    setEmail(selectedCna.email);
                                }
                            }}
                            placeholder="Select a CNA"
                            options={availableCnas.map(cna => ({
                                value: cna.id,
                                label: `${cna.name}${cna.certificationNumber ? ` (${cna.certificationNumber})` : ''}`,
                            }))}
                            disabled={cnasLoading}
                        />
                        <TextAtom variant="small" className="text-gray-500">
                            {cnasLoading
                                ? 'Loading CNAs...'
                                : availableCnas.length === 0
                                    ? 'All CNAs already have accounts. Add a new CNA first.'
                                    : 'Only CNAs without existing accounts are shown'}
                        </TextAtom>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <LabelAtom htmlFor="email">Email Address *</LabelAtom>
                        <InputAtom
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="cna@example.com"
                            required
                            disabled={createAccountMutation.isPending}
                        />
                        <TextAtom variant="small" className="text-gray-500">
                            This email will be used for login
                        </TextAtom>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <DynamicIconAtom name="Info" size="sm" className="text-blue-600 mt-0.5" />
                            <div>
                                <TextAtom className="text-blue-800 font-medium text-sm">
                                    Automatic Password Generation
                                </TextAtom>
                                <TextAtom className="text-blue-700 text-sm mt-1">
                                    A secure temporary password will be automatically generated. The CNA will be
                                    required to change it on first login.
                                </TextAtom>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <ButtonAtom
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={createAccountMutation.isPending}
                        >
                            Cancel
                        </ButtonAtom>
                        <ButtonAtom
                            type="submit"
                            disabled={
                                !selectedCnaId ||
                                !email ||
                                createAccountMutation.isPending ||
                                availableCnas.length === 0
                            }
                            isLoading={createAccountMutation.isPending}
                            loadingText="Creating..."
                        >
                            <DynamicIconAtom name="UserPlus" size="sm" className="mr-2" />
                            Create Account
                        </ButtonAtom>
                    </div>
                </form>
            </CardAtom>
        </div>
    );
}
