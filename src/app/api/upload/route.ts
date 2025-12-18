import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { validateImageFile } from '@/lib/imageUpload';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('image') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate the file
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}.${extension}`;

        // Save to public/uploads directory
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filepath = join(uploadDir, filename);

        try {
            await writeFile(filepath, buffer);
        } catch (error) {
            // If uploads directory doesn't exist, create it
            const { mkdir } = await import('fs/promises');
            await mkdir(uploadDir, { recursive: true });
            await writeFile(filepath, buffer);
        }

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}