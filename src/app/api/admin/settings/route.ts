import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const SETTINGS_ID = 'facility_settings';

// GET /api/admin/settings - Get facility settings
export async function GET() {
    try {
        // @ts-ignore - Prisma client type issue
        const settings = await prisma.settings.findUnique({
            where: { id: SETTINGS_ID },
        });

        // Return default values if no settings exist yet
        if (!settings) {
            return NextResponse.json({
                facilityName: '',
                facilityAddress: '',
                facilityStreet: '',
                facilityCity: '',
                facilityState: '',
                facilityZip: '',
                facilityPhone: '',
                facilityFax: '',
                facilityWebsite: '',
                licenseNumber: '',
                npiNumber: '',
                taxId: '',
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
            facilityStreet: settings.facilityStreet || '',
            facilityCity: settings.facilityCity || '',
            facilityState: settings.facilityState || '',
            facilityZip: settings.facilityZip || '',
            facilityPhone: settings.facilityPhone || '',
            facilityFax: settings.facilityFax || '',
            facilityWebsite: settings.facilityWebsite || '',
            licenseNumber: settings.licenseNumber || '',
            npiNumber: settings.npiNumber || '',
            taxId: settings.taxId || '',
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
        console.log('Received settings data:', {
            facilityName: body.facilityName,
            hasStreet: !!body.facilityStreet,
            hasCity: !!body.facilityCity,
            hasState: !!body.facilityState,
            hasZip: !!body.facilityZip,
            hasPhone: !!body.facilityPhone,
            hasLicense: !!body.licenseNumber,
            hasNPI: !!body.npiNumber,
            hasTaxId: !!body.taxId
        });

        const {
            facilityName,
            facilityAddress,
            facilityStreet,
            facilityCity,
            facilityState,
            facilityZip,
            facilityPhone,
            facilityFax,
            facilityWebsite,
            licenseNumber,
            npiNumber,
            taxId,
            adminEmail,
            maxResidentsPerCNA,
            shiftAlerts,
            adlReminders,
            passwordChange,
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

        // Get existing settings
        // @ts-ignore - Prisma client type issue
        const existingSettings = await prisma.settings.findUnique({
            where: { id: SETTINGS_ID },
        });

        let hashedPassword = existingSettings?.masterPassword;

        // Handle password change if provided
        if (passwordChange) {
            const { currentPassword, newPassword, confirmPassword } = passwordChange;

            // Validate new password
            if (!newPassword || newPassword.length < 8) {
                return NextResponse.json(
                    { error: 'New password must be at least 8 characters long' },
                    { status: 400 }
                );
            }

            if (newPassword !== confirmPassword) {
                return NextResponse.json(
                    { error: 'New password and confirmation do not match' },
                    { status: 400 }
                );
            }

            // If there's an existing password, verify current password
            if (existingSettings?.masterPassword) {
                if (!currentPassword) {
                    return NextResponse.json(
                        { error: 'Current password is required to change password' },
                        { status: 400 }
                    );
                }

                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingSettings.masterPassword);
                if (!isCurrentPasswordValid) {
                    return NextResponse.json(
                        { error: 'Current password is incorrect' },
                        { status: 400 }
                    );
                }
            }

            // Hash the new password
            hashedPassword = await bcrypt.hash(newPassword, 12);
        }

        // Upsert settings (create or update)
        // @ts-ignore - Prisma client type issue
        const settings = await prisma.settings.upsert({
            where: { id: SETTINGS_ID },
            update: {
                facilityName,
                facilityAddress,
                facilityStreet,
                facilityCity,
                facilityState,
                facilityZip,
                facilityPhone,
                facilityFax,
                facilityWebsite,
                licenseNumber,
                npiNumber,
                taxId,
                adminEmail,
                ...(hashedPassword !== undefined && { masterPassword: hashedPassword }),
                maxResidentsPerCNA,
                shiftAlerts,
                adlReminders,
                updatedAt: new Date(),
            },
            create: {
                id: SETTINGS_ID,
                facilityName,
                facilityAddress,
                facilityStreet,
                facilityCity,
                facilityState,
                facilityZip,
                facilityPhone,
                facilityFax,
                facilityWebsite,
                licenseNumber,
                npiNumber,
                taxId,
                adminEmail,
                masterPassword: hashedPassword,
                maxResidentsPerCNA,
                shiftAlerts,
                adlReminders,
            },
        });

        console.log('Settings saved successfully:', {
            facilityName: settings.facilityName,
            hasAddress: !!(settings.facilityStreet && settings.facilityCity),
            hasPhone: !!settings.facilityPhone,
            hasLicense: !!settings.licenseNumber
        });

        // Return success without the hashed password
        return NextResponse.json({
            message: 'Settings saved successfully',
            facilityName: settings.facilityName,
            adminEmail: settings.adminEmail,
            passwordChanged: !!passwordChange,
        });
    } catch (error) {
        console.error('Error saving settings:', error);

        // Log the full error details for debugging
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            if (error.message.includes('Server has closed the connection')) {
                return NextResponse.json({
                    error: 'Database connection error. Please try again in a moment.'
                }, { status: 503 });
            }

            // Check for Prisma-specific errors
            if (error.message.includes('Unknown field')) {
                return NextResponse.json({
                    error: 'Database schema error. Please contact support.'
                }, { status: 500 });
            }
        }

        return NextResponse.json({
            error: 'Failed to save settings',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}