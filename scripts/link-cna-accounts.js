const { PrismaClient } = require('@prisma/client');

async function linkCNAAccounts() {
  const prisma = new PrismaClient();

  try {
    console.log('\n=== Linking CNA Accounts ===\n');

    // Get all CNAs
    const allCnas = await prisma.cna.findMany({
      include: {
        user: true,
      },
    });

    for (const cna of allCnas) {
      if (!cna.user) {
        console.log(`CNA without user: ${cna.name} (${cna.email})`);

        // Try to find a user with the same email
        const existingUser = await prisma.user.findUnique({
          where: { email: cna.email },
        });

        if (existingUser) {
          console.log(`  Found existing user with email: ${existingUser.email}`);
          console.log(`  Current cnaId: ${existingUser.cnaId}`);

          if (!existingUser.cnaId) {
            // Link the user to this CNA
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { cnaId: cna.id },
            });
            console.log(`  ✓ Linked user ${existingUser.id} to CNA ${cna.id}`);
          } else if (existingUser.cnaId !== cna.id) {
            console.log(`  ⚠ User is already linked to different CNA: ${existingUser.cnaId}`);
          }
        } else {
          console.log(`  No existing user found, creating new one...`);
          try {
            const newUser = await prisma.user.create({
              data: {
                email: cna.email,
                password: '1234',
                role: 'CNA',
                cnaId: cna.id,
                isActive: true,
                mustChangePassword: false,
              },
            });
            console.log(`  ✓ Created new user: ${newUser.id}`);
          } catch (error) {
            console.log(`  ✗ Failed to create user: ${error.message}`);
          }
        }
      }
    }

    console.log('\n=== Final Status ===\n');

    // Verify all CNAs now have user accounts
    const finalCnas = await prisma.cna.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            cnaId: true,
            isActive: true,
          },
        },
      },
    });

    for (const cna of finalCnas) {
      if (cna.user) {
        console.log(`✓ ${cna.name} (${cna.email})`);
        console.log(`  User ID: ${cna.user.id}`);
        console.log(`  CNA ID: ${cna.user.cnaId}`);
        console.log(`  Active: ${cna.user.isActive}`);
      } else {
        console.log(`✗ ${cna.name} (${cna.email}) - NO USER ACCOUNT`);
      }
    }

    console.log('\nDone! You can now log in with:');
    console.log('  Email: [CNA email]');
    console.log('  Password: 1234 or master password');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkCNAAccounts();
