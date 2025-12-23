const { execSync } = require('child_process');

console.log('🚀 Starting build process...');

try {
    // Try to generate Prisma client
    console.log('📦 Attempting to generate Prisma client...');
    try {
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✅ Prisma client generated successfully');
    } catch (prismaError) {
        console.warn('⚠️ Prisma generation failed, continuing with existing client...');
        console.warn('This is usually fine if the client was already generated.');
    }

    // Run Next.js build
    console.log('🏗️ Building Next.js application...');
    execSync('npx next build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}