'use client';

import React from 'react';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const ConfirmationModalMolecule = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    const iconMap = {
        danger: 'TriangleAlert',
        warning: 'TriangleAlert',
        info: 'Info',
    } as const;

    const colorMap = {
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
    };

    const bgColorMap = {
        danger: 'bg-red-100',
        warning: 'bg-yellow-100',
        info: 'bg-blue-100',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="sm:flex sm:items-start">
                        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${bgColorMap[variant]} sm:mx-0 sm:h-10 sm:w-10`}>
                            <DynamicIconAtom
                                name={iconMap[variant]}
                                className={`h-6 w-6 ${colorMap[variant]}`}
                            />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <TextAtom variant="h3" weight="semibold" className="text-gray-900">
                                {title}
                            </TextAtom>
                            <div className="mt-2">
                                <TextAtom variant="body" className="text-gray-500">
                                    {message}
                                </TextAtom>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                        <ButtonAtom
                            variant="destructive"
                            onClick={onConfirm}
                            isLoading={isLoading}
                            loadingText="Processing..."
                            disabled={isLoading}
                        >
                            {confirmText}
                        </ButtonAtom>
                        <ButtonAtom
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </ButtonAtom>
                    </div>
                </div>
            </div>
        </div>
    );
};