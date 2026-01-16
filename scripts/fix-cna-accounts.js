const { PrismaClient } = require('@prisma/client');

async function fixCNAAccounts() {
    const prisma = new PrismaClient();

    try {
        console.log('\n=== Fixing CNA Accounts ===\n');

        // Get all CNAs without user accounts
        const cnasWithoutUsers = await prisma.cna.findMany({
            where: {
                user: null,
            },
        });

        console.log(`Found ${cnasWithoutUsers.length} CNAs without user accounts\n`);

        for (const cna of cnasWithoutUsers) {
            console.log(`Creating user account for: ${cna.name} (${cna.email})`);

            try {
                const user = await prisma.user.create({
                    data: {
                        email: cna.email,
                        password: '1234',
                        role: 'CNA',
                        cnaId: cna.id,
                        isActive: true,
                        mustChangePassword: false,
                    },
                });

                console.log(`  ✓ Created user: ${user.id}`);
            } catch (error) {
                console.log(`  ✗ Failed: ${error.message}`);
            }
        }

        console.log('\n=== Verification ===\n');

        // Verify all CNAs now have user accounts
        const allCnas = await prisma.cna.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        cnaId: true,
                    },
                },
            },
        });

        for (const cna of allCnas) {
            if (cna.user) {
                console.log(`✓ ${cna.name} (${cna.email}) - User ID: ${cna.user.id}, cnaId: ${cna.user.cnaId}`);
            } else {
                console.log(`✗ ${cna.name} (${cna.email}) - NO USER ACCOUNT`);
            }
        }

        console.log('\nDone!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixCNAAccounts();
