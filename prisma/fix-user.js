// Node.js script to fix user credits - with direct datasources
// Run with: node prisma/fix-user.js <email>

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error'],
});

async function fixUserCredits(email) {
  try {
    console.log(`Looking up user with email: ${email}`);
    console.log(`Database URL: ${process.env.DATABASE_URL ? 'present' : 'missing'}`);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      console.error('User not found!');
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log(`Found user: ${user.id}`);
    console.log(`Current profile:`, JSON.stringify(user?.profile, null, 2));

    // Check if profile exists, create if not
    if (!user.profile) {
      console.log('Profile does not exist, creating it...');
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          plan: 'PRO',
          credits: 50,
          totalCreditLimit: 50,
        },
      });
    } else {
      // Update existing profile
      const result = await prisma.userProfile.update({
        where: { userId: user.id },
        data: {
          plan: 'PRO',
          credits: 50,
          totalCreditLimit: 50,
        },
      });
      console.log('Update result:', JSON.stringify(result, null, 2));
    }

    console.log(`✅ Successfully updated user to PRO plan with 50 credits`);
    
    // Verify the update
    const updatedProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id }
    });
    
    console.log(`Updated profile:`, JSON.stringify(updatedProfile, null, 2));
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Please provide email as argument: node prisma/fix-user.js <email>');
  process.exit(1);
}

fixUserCredits(email);
