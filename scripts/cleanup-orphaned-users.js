const { PrismaClient } = require('@prisma/client');

async function cleanupOrphanedUsers() {
    const prisma = new PrismaClient();

    try {
        console.log('\n=== Cleaning Up Orphaned User Accounts ===\n');

        // Find all CNA users without a linked CNA
        const orphanedUsers = await prisma.user.findMany({
            where: {
                role: 'CNA',
                cnaId: null,
            },
        });

        console.log(`Found ${orphanedUsers.length} orphaned CNA user accounts\n`);

        for (const user of orphanedUsers) {
            console.log(`Deleting orphaned user: ${user.email} (ID: ${user.id})`);
            await prisma.user.delete({
                where: { id: user.id },
            });
            console.log('  ✓ Deleted');
        }

        console.log('\n=== Cleanup Complete ===\n');
        console.log('You can now create new CNAs with those email addresses.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupOrphanedUsers();
