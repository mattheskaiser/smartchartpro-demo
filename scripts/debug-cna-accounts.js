const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugCNAAccounts() {
  console.log('\n=== Debugging CNA Accounts ===\n');

  // Get all CNAs
  const cnas = await prisma.cna.findMany({
    include: {
      user: true,
    },
  });

  console.log(`Found ${cnas.length} CNAs:\n`);

  for (const cna of cnas) {
    console.log(`CNA: ${cna.name} (${cna.email})`);
    console.log(`  ID: ${cna.id}`);
    console.log(`  Status: ${cna.status}`);

    if (cna.user) {
      console.log(`  ✓ Has User Account:`);
      console.log(`    User ID: ${cna.user.id}`);
      console.log(`    Email: ${cna.user.email}`);
      console.log(`    Role: ${cna.user.role}`);
      console.log(`    CNA ID Link: ${cna.user.cnaId}`);
      console.log(`    Active: ${cna.user.isActive}`);
      console.log(`    Password: ${cna.user.password}`);
    } else {
      console.log(`  ✗ NO USER ACCOUNT - This CNA cannot log in!`);
    }
    console.log('');
  }

  // Get all CNA users
  const cnaUsers = await prisma.user.findMany({
    where: { role: 'CNA' },
    include: {
      cna: true,
    },
  });

  console.log(`\nFound ${cnaUsers.length} CNA Users:\n`);

  for (const user of cnaUsers) {
    console.log(`User: ${user.email}`);
    console.log(`  ID: ${user.id}`);
    console.log(`  CNA ID: ${user.cnaId}`);
    console.log(`  Active: ${user.isActive}`);
    console.log(`  Password: ${user.password}`);

    if (user.cna) {
      console.log(`  ✓ Linked to CNA: ${user.cna.name}`);
    } else {
      console.log(`  ✗ NO CNA LINK - Orphaned user account!`);
    }
    console.log('');
  }

  await prisma.$disconnect();
}

debugCNAAccounts().catch(console.error);
