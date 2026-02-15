import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dodo } from '@/lib/dodo'
import { headers } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const adapter = new PrismaPg(pg)
const prisma = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's customer ID from profile
    // Note: You'd need to store the Dodo customer ID in user profile
    // For now, we'll return an error提示用户设置

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // In production, get the actual customer ID from user profile
    const customerId = await getCustomerId(session.user.id)

    if (!customerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Create portal session
    const portalSession = await dodo.createPortalSession({
      customer_id: customerId,
      return_url: `${appUrl}/dashboard/billing`,
    })

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error: any) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}

async function getCustomerId(userId: string): Promise<string | null> {
  // In production, fetch the Dodo customer ID from user profile
  // For now, return null
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  })

  return profile?.dodoCustomerId || null
}
