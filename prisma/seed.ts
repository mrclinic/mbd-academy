
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles and admin user...');
  const roles = ['admin', 'trainer', 'user'];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  const adminEmail = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash('AdminPassword123!', 10);
    const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hash,
        displayName: 'Administrator',
        roleId: adminRole.id,
      },
    });
    console.log('Created admin user: admin@example.com / AdminPassword123!');
  } else {
    console.log('Admin already exists, skipping user creation.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
