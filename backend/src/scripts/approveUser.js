const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.update({
    where: { email: 'affiliate3@example.com' },
    data: { status: 'approved' }
  });
  console.log('User approved');
}
main().catch(console.error).finally(() => prisma.$disconnect());
