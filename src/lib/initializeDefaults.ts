import { prisma } from '@/lib/db';

// Default shifts that should always exist
const DEFAULT_SHIFTS = [
  {
    name: 'Morning',
    startTime: '06:00',
    endTime: '14:00',
    color: '#F59E0B', // Amber
    description: 'Morning shift covering breakfast and early activities',
    sortOrder: 6 * 60, // 6:00 AM = 360 minutes
    isActive: true,
  },
  {
    name: 'Day',
    startTime: '14:00',
    endTime: '22:00',
    color: '#EF4444', // Red
    description: 'Day shift covering lunch, dinner and evening activities',
    sortOrder: 14 * 60, // 2:00 PM = 840 minutes
    isActive: true,
  },
  {
    name: 'Night',
    startTime: '22:00',
    endTime: '06:00',
    color: '#6366F1', // Indigo
    description: 'Overnight shift for monitoring and emergency care',
    sortOrder: 22 * 60, // 10:00 PM = 1320 minutes
    isActive: true,
  },
];

export async function initializeDefaultShifts() {
  try {
    const existingShifts = await prisma.shiftTemplate.count();

    if (existingShifts === 0) {
      console.log('🌱 Initializing default shift templates...');

      for (const shift of DEFAULT_SHIFTS) {
        try {
          await prisma.shiftTemplate.create({
            data: shift,
          });
          console.log(`✓ Created default shift: ${shift.name}`);
        } catch (error) {
          console.error(`✗ Error creating default shift ${shift.name}:`, error);
        }
      }

      console.log('✅ Default shift templates initialized successfully!');
      return true;
    } else {
      console.log('ℹ️ Shift templates already exist, skipping initialization');
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing default shifts:', error);
    return false;
  }
}

// Export the default shifts for use in other places
export { DEFAULT_SHIFTS };
