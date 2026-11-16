const { PrismaClient } = require('../generated-client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { status: 'pending' },
    data: { status: 'approved' }
  });
  console.log('Approved users count:', result.count);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
