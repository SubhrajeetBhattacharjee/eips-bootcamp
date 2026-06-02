const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: { emailVerified: true }
  });
  console.log("Fixed emailVerified for all test users");
}
main().finally(() => prisma.$disconnect());
