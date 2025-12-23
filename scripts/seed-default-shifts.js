const { execSync } = require('child_process');

console.log('🌱 Seeding default shift templates...');

try {
  execSync('npx tsx prisma/seed-shifts.ts', { stdio: 'inherit' });
  console.log('✅ Default shift templates seeded successfully!');
} catch (error) {
  console.error('❌ Error seeding shift templates:', error.message);
  process.exit(1);
}
