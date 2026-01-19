import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const SETTINGS_ID = 'facility_settings';

// DELETE /api/admin/settings/password - Remove master password (dev only)
export async function DELETE() {
    try {
        // Only allow in development mode
        if (process.env.NODE_ENV !== 'development') {
            return NextResponse.json(
                { error: 'This endpoint is only available in development mode' },
                { status: 403 }
            );
        }

        // Get existing settings
        const existingSettings = await prisma.settings.findUnique({
            where: { id: SETTINGS_ID },
        });

        if (!existingSettings) {
            return NextResponse.json(
                { error: 'No settings found' },
                { status: 404 }
            );
        }

        if (!existingSettings.masterPassword) {
            return NextResponse.json(
                { error: 'No master password is currently set' },
                { status: 400 }
            );
        }

        // Remove the password by setting it to null
        await prisma.settings.update({
            where: { id: SETTINGS_ID },
            data: {
                masterPassword: null,
                updatedAt: new Date(),
            },
        });

        console.log('Master password removed successfully (dev mode)');

        return NextResponse.json({
            message: 'Master password removed successfully',
        });
    } catch (error) {
        console.error('Error removing password:', error);

        // More specific error handling
        if (error instanceof Error) {
            if (error.message.includes('Server has closed the connection')) {
                return NextResponse.json({
                    error: 'Database connection error. Please try again in a moment.'
                }, { status: 503 });
            }
        }

        return NextResponse.json({ error: 'Failed to remove password' }, { status: 500 });
    }
}