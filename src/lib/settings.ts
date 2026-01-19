import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const SETTINGS_ID = 'facility_settings';

/**
 * Get facility settings
 */
export async function getFacilitySettings() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: SETTINGS_ID },
        });
        return settings;
    } catch (error) {
        console.error('Error fetching facility settings:', error);
        return null;
    }
}

/**
 * Validate master password for CNA account access
 */
export async function validateMasterPassword(password: string): Promise<boolean> {
    try {
        const settings = await getFacilitySettings();
        if (!settings?.masterPassword) {
            return false;
        }

        return await bcrypt.compare(password, settings.masterPassword);
    } catch (error) {
        console.error('Error validating master password:', error);
        return false;
    }
}

/**
 * Get facility name for display purposes
 */
export async function getFacilityName(): Promise<string> {
    try {
        const settings = await getFacilitySettings();
        return settings?.facilityName || 'SmartChart Pro';
    } catch (error) {
        console.error('Error fetching facility name:', error);
        return 'SmartChart Pro';
    }
}

/**
 * Get admin email for notifications
 */
export async function getAdminEmail(): Promise<string | null> {
    try {
        const settings = await getFacilitySettings();
        return settings?.adminEmail || null;
    } catch (error) {
        console.error('Error fetching admin email:', error);
        return null;
    }
}