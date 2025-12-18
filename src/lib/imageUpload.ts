// Utility functions for handling image uploads

export const uploadImage = async (file: File): Promise<string> => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const generateImageUrl = (filename: string): string => {
    // Return the actual uploaded image URL
    return `/uploads/${filename}`;
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Please upload a valid image file (JPEG, PNG, or GIF)',
        };
    }

    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'Image size must be less than 10MB',
        };
    }

    return { isValid: true };
};