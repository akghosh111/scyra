import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create user profile
    let profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      // Auto-create profile on first login
      profile = await prisma.userProfile.create({
        data: {
          userId: session.user.id,
          plan: 'FREE',
          credits: 5,
          monthlyCreditLimit: 5,
        }
      })

      // Create initial credit transaction
      await prisma.creditTransaction.create({
        data: {
          userId: session.user.id,
          amount: 5,
          type: 'CREDIT',
          reason: 'Initial FREE plan credits'
        }
      })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
