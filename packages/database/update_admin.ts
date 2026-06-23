import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = process.argv[2] || 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ';
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  });
  console.log('Updated user role to ADMIN:', user.username);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
