const { execSync } = require('child_process');

console.log('🌱 Seeding default shift templates...');

try {
  execSync('node prisma/seed-shifts.js', { stdio: 'inherit' });
  console.log('✅ Default shift templates seeded successfully!');
} catch (error) {
  console.error('❌ Error seeding shift templates:', error.message);
  process.exit(1);
}
