'use client';

import React, { useState, useRef } from 'react';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { LabelAtom } from '@/components/atoms/Label.atom';
import { resizeImage } from '@/lib/imageUpload';

interface ImageUploadProps {
    currentImage?: string | null;
    onImageChange: (file: File | null, base64Data: string | null) => void;
    label?: string;
    required?: boolean;
    className?: string;
}

export const ImageUploadMolecule = ({
    currentImage,
    onImageChange,
    label = 'Profile Picture',
    required = false,
    className = '',
}: ImageUploadProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const base64Data = await resizeImage(file);
                setPreviewUrl(base64Data);
                onImageChange(file, base64Data);
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        onImageChange(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={className}>
            <LabelAtom required={required}>{label}</LabelAtom>

            <div className="mt-2">
                {previewUrl ? (
                    <div className="flex items-center gap-4">
                        <AvatarAtom src={previewUrl} alt="Preview" size="lg" />
                        <div className="flex flex-col gap-2">
                            <ButtonAtom variant="secondary" onClick={handleButtonClick}>
                                <DynamicIconAtom name="Upload" size="sm" className="mr-2" />
                                Change Image
                            </ButtonAtom>
                            <ButtonAtom variant="ghost" onClick={handleRemoveImage}>
                                <DynamicIconAtom name="Trash2" size="sm" className="mr-2" />
                                Remove
                            </ButtonAtom>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-gray-400'
                            }
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleButtonClick}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <DynamicIconAtom name="Upload" size="md" className="text-gray-400" />
                            </div>
                            <div>
                                <TextAtom variant="body" weight="medium">
                                    Click to upload or drag and drop
                                </TextAtom>
                                <TextAtom variant="small" color="muted">
                                    PNG, JPG, GIF up to 10MB
                                </TextAtom>
                            </div>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};