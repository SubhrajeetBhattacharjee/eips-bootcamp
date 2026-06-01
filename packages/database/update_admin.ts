import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { clerkId: 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ' },
    data: { role: 'ADMIN' },
  });
  console.log('Updated user role to ADMIN:', user.username);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
