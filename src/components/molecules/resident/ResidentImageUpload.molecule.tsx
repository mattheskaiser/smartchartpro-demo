'use client';

import { useRef } from 'react';
import { CardAtom } from '@/components/atoms/Card.atom';
import { AvatarAtom } from '@/components/atoms/Avatar.atom';
import { ButtonAtom } from '@/components/atoms/Button.atom';
import { DynamicIconAtom } from '@/components/atoms/DynamicIcon.atom';
import { SpinnerAtom } from '@/components/atoms/Spinner.atom';
import { TextAtom } from '@/components/atoms/Text.atom';
import { resizeImage } from '@/lib/imageUpload';

interface ResidentImageUploadProps {
    currentImage?: string | null;
    residentName: string;
    isEditing: boolean;
    onImageChange: (imageData: string | null) => void;
    isUpdating?: boolean;
    avatarSize?: 'lg' | 'xl' | '2xl' | '3xl';
}

export const ResidentImageUploadMolecule = ({
    currentImage,
    residentName,
    isEditing,
    onImageChange,
    isUpdating = false,
    avatarSize = '2xl',
}: ResidentImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const base64Data = await resizeImage(file);
                onImageChange(base64Data);
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

    const handleChangeClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <CardAtom>
            <div className="h-72 flex items-center justify-center">
                {!currentImage && isEditing ? (
                    // No image - compact drag & drop box
                    <div
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100"
                        onClick={handleChangeClick}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <DynamicIconAtom name="Upload" size="lg" className="text-gray-400" />
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
                ) : (
                    // Has image - centered layout with large avatar and buttons below
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <AvatarAtom
                                src={currentImage}
                                alt={residentName}
                                size={avatarSize}
                                className="border-4 border-white shadow-lg"
                            />

                            {/* Loading spinner overlay */}
                            {isUpdating && (
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                                    <SpinnerAtom size="lg" className="border-white border-t-blue-400" />
                                </div>
                            )}
                        </div>

                        {/* Action buttons - regular size, centered */}
                        {isEditing && !isUpdating && (
                            <div className="flex gap-3">
                                <ButtonAtom
                                    variant="secondary"
                                    onClick={handleChangeClick}
                                >
                                    <DynamicIconAtom name="Upload" size="sm" className="mr-2" />
                                    Change Photo
                                </ButtonAtom>

                                <ButtonAtom
                                    variant="ghost"
                                    onClick={handleRemoveImage}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <DynamicIconAtom name="Trash2" size="sm" className="mr-2" />
                                    Remove
                                </ButtonAtom>
                            </div>
                        )}

                        {/* Loading state text */}
                        {isUpdating && (
                            <div className="flex items-center gap-2">
                                <SpinnerAtom size="sm" />
                                <TextAtom variant="body" color="muted">
                                    Saving changes...
                                </TextAtom>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />
        </CardAtom>
    );
};