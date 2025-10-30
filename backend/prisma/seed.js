const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

/**
 * Seed database with initial data
 */
async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@incapacidades.com' },
    update: {},
    create: {
      email: 'admin@incapacidades.com',
      password: adminPassword,
      fullName: 'Administrador del Sistema',
      cedula: '1000000001',
      phone: '3001234567',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('User123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'usuario@test.com' },
    update: {},
    create: {
      email: 'usuario@test.com',
      password: userPassword,
      fullName: 'Usuario de Prueba',
      cedula: '1000000002',
      phone: '3007654321',
      role: 'USER',
    },
  });

  console.log('✅ Test user created:', user.email);

  console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                                ║
  ║   🌱 DATABASE SEEDING COMPLETED                               ║
  ║                                                                ║
  ║   👤 Admin User:                                              ║
  ║      Email: admin@incapacidades.com                           ║
  ║      Password: Admin123!                                      ║
  ║                                                                ║
  ║   👤 Test User:                                               ║
  ║      Email: usuario@test.com                                  ║
  ║      Password: User123!                                       ║
  ║                                                                ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
