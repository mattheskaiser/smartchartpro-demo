const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedShiftTemplates() {
    console.log('Seeding default shift templates...');

    const defaultShifts = [
        {
            name: 'Morning',
            startTime: '06:00',
            endTime: '14:00',
            color: '#F59E0B', // Amber
            description: 'Morning shift covering breakfast and early activities',
            sortOrder: 1,
            isActive: true,
        },
        {
            name: 'Day',
            startTime: '14:00',
            endTime: '22:00',
            color: '#EF4444', // Red
            description: 'Day shift covering lunch, dinner and evening activities',
            sortOrder: 2,
            isActive: true,
        },
        {
            name: 'Night',
            startTime: '22:00',
            endTime: '06:00',
            color: '#6366F1', // Indigo
            description: 'Overnight shift for monitoring and emergency care',
            sortOrder: 3,
            isActive: true,
        },
    ];

    for (const shift of defaultShifts) {
        try {
            const existingShift = await prisma.shiftTemplate.findUnique({
                where: { name: shift.name },
            });

            if (!existingShift) {
                await prisma.shiftTemplate.create({
                    data: shift,
                });
                console.log(`✓ Created default shift template: ${shift.name}`);
            } else {
                console.log(`- Shift template already exists: ${shift.name}`);
            }
        } catch (error) {
            console.error(`✗ Error creating shift template ${shift.name}:`, error);
        }
    }

    console.log('Default shift template seeding completed!');
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedShiftTemplates()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = { seedShiftTemplates };