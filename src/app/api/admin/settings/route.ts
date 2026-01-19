import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const SETTINGS_ID = 'facility_settings';

// GET /api/admin/settings - Get facility settings
export async function GET() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: SETTINGS_ID },
        });

        // Return default values if no settings exist yet
        if (!settings) {
            return NextResponse.json({
                facilityName: '',
                facilityAddress: '',
                adminEmail: '',
                masterPassword: '',
                maxResidentsPerCNA: '8',
                shiftAlerts: true,
                adlReminders: true,
            });
        }

        // Don't return the actual hashed password, just indicate if one exists
        const response = {
            facilityName: settings.facilityName || '',
            facilityAddress: settings.facilityAddress || '',
            adminEmail: settings.adminEmail || '',
            masterPassword: settings.masterPassword ? '********' : '',
            maxResidentsPerCNA: settings.maxResidentsPerCNA,
            shiftAlerts: settings.shiftAlerts,
            adlReminders: settings.adlReminders,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// POST /api/admin/settings - Save facility settings
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            facilityName,
            facilityAddress,
            adminEmail,
            masterPassword,
            maxResidentsPerCNA,
            shiftAlerts,
            adlReminders,
        } = body;

        // Validate required fields
        if (!facilityName || !adminEmail) {
            return NextResponse.json(
                { error: 'Facility name and admin email are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(adminEmail)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Get existing settings to check if password should be updated
        const existingSettings = await prisma.settings.findUnique({
            where: { id: SETTINGS_ID },
        });

        let hashedPassword = existingSettings?.masterPassword;

        // Only update password if a new one is provided
        if (masterPassword && masterPassword.trim() !== '') {
            // Validate password length
            if (masterPassword.length < 8) {
                return NextResponse.json(
                    { error: 'Master password must be at least 8 characters long' },
                    { status: 400 }
                );
            }

            // Hash the new password
            hashedPassword = await bcrypt.hash(masterPassword, 12);
        } else if (!existingSettings?.masterPassword) {
            // If no existing password and no new password provided, require it
            return NextResponse.json(
                { error: 'Master password is required for initial setup' },
                { status: 400 }
            );
        }

        // Hash the master password
        // const hashedPassword = await bcrypt.hash(masterPassword, 12);

        // Upsert settings (create or update)
        const settings = await prisma.settings.upsert({
            where: { id: SETTINGS_ID },
            update: {
                facilityName,
                facilityAddress,
                adminEmail,
                ...(hashedPassword && { masterPassword: hashedPassword }),
                maxResidentsPerCNA,
                shiftAlerts,
                adlReminders,
                updatedAt: new Date(),
            },
            create: {
                id: SETTINGS_ID,
                facilityName,
                facilityAddress,
                adminEmail,
                masterPassword: hashedPassword!,
                maxResidentsPerCNA,
                shiftAlerts,
                adlReminders,
            },
        });

        console.log('Settings saved successfully');

        // Return success without the hashed password
        return NextResponse.json({
            message: 'Settings saved successfully',
            facilityName: settings.facilityName,
            adminEmail: settings.adminEmail,
        });
    } catch (error) {
        console.error('Error saving settings:', error);

        // More specific error handling
        if (error instanceof Error) {
            if (error.message.includes('Server has closed the connection')) {
                return NextResponse.json({
                    error: 'Database connection error. Please try again in a moment.'
                }, { status: 503 });
            }
        }

        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}