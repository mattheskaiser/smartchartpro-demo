const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
        console.log('⚠️  Admin user already exists:', existingAdmin.email);
        console.log('Skipping admin creation.');
        return;
    }

    // Create admin user
    const adminEmail = 'admin@smartchartpro.com';
    const adminPassword = 'Admin123!'; // Change this to your preferred password

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
            mustChangePassword: false, // Admin doesn't need to change password
        },
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');
    console.log('You can now access the admin panel at: http://localhost:3000/admin');
}

main()
    .catch((error) => {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
