const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const adapter = new PrismaPg(pg);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    const users = await prisma.user.findMany({ 
      include: { 
        profile: true,
        sessions: true
      }
    });
    console.log('Users found:', users.length);
    console.log('');
    users.forEach(user => {
      console.log(`User ID: ${user.id}`);
      console.log(`Email: ${user.email || 'none'}`);
      console.log(`Name: ${user.name || 'none'}`);
      console.log(`Email verified: ${user.emailVerified}`);
      console.log(`Has profile: ${!!user.profile}`);
      if (user.profile) {
        console.log(`  - Plan: ${user.profile.plan}`);
        console.log(`  - Credits: ${user.profile.credits}`);
      }
      console.log(`Active sessions: ${user.sessions?.length || 0}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
