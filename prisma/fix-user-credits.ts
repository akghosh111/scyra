// Script to manually update user to Pro plan with 50 credits
// Run this with: npx ts-node prisma/fix-user-credits.ts <email>

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

async function fixUserCredits(email: string) {
  try {
    console.log(`Looking up user with email: ${email}`)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    if (!user) {
      console.error('User not found!')
      process.exit(1)
    }

    console.log(`Found user: ${user.id}`)
    console.log(`Current profile:`, user?.profile)

    // Update profile to Pro with 50 credits
    await prisma.userProfile.update({
      where: { userId: user.id },
      data: {
        plan: 'PRO',
        credits: 50,
        totalCreditLimit: 50,
      },
    })

    console.log(`✅ Successfully updated user to PRO plan with 50 credits`)
    
    // Verify the update
    const updatedProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id }
    })
    
    console.log(`Updated profile:`, updatedProfile)
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.error('Please provide email as argument: npx ts-node prisma/fix-user-credits.ts <email>')
  process.exit(1)
}

fixUserCredits(email)
