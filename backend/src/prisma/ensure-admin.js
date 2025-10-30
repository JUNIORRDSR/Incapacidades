const bcrypt = require('bcrypt');

/**
 * Ensure that a default administrative user exists.
 * @param {import('./prisma.service').PrismaService} prisma
 * @returns {Promise<{created: boolean, admin: Object}>}
 */
async function ensureDefaultAdmin(prisma) {
  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@incapacidades.com';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
  const fullName = process.env.DEFAULT_ADMIN_FULL_NAME || 'Administrador del Sistema';
  const cedula = process.env.DEFAULT_ADMIN_CEDULA || '1000000001';
  const phone = process.env.DEFAULT_ADMIN_PHONE || '3001234567';

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      cedula,
      phone,
      role: 'ADMIN',
      isActive: true,
      password: passwordHash,
    },
    create: {
      email,
      password: passwordHash,
      fullName,
      cedula,
      phone,
      role: 'ADMIN',
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      cedula: true,
      phone: true,
      isActive: true,
    },
  });

  const created = !existing;

  console.info('[Bootstrap] Default admin ensured:', email);

  return { created, admin };
}

module.exports = { ensureDefaultAdmin };
