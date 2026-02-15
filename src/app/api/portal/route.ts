import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dodo } from '@/lib/dodo'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Customer portal not available yet' },
        { status: 401 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // TODO: Implement customer portal when Dodo Payments is fully integrated
    return NextResponse.json(
      { error: 'Customer portal feature coming soon. Please contact support@scyra.com for plan changes.' },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
