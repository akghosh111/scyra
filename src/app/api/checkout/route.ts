import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dodo } from '@/lib/dodo'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

// Product IDs - Dodo Payments
const PRODUCTS = {
  PRO: 'pdt_0NYUd1mVCB0vEvtCFFj0r',
}

export async function POST(req: NextRequest) {
  try {
    console.log('Checkout API called')

    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    console.log('Session:', session?.user?.email)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, productId } = await req.json()
    console.log('Plan ID:', planId, 'Product ID:', productId)

    if (!planId || !productId) {
      return NextResponse.json(
        { error: 'planId and productId are required' },
        { status: 400 }
      )
    }

    // For Pro plan, create a subscription
    if (planId === 'pro') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      console.log('Creating subscription with appUrl:', appUrl)

      const subscription = await dodo.createSubscription({
        product_id: productId,
        customer: {
          email: session.user.email,
          name: session.user.name || undefined,
        },
        return_url: `${appUrl}/dashboard?checkout=success`,
      })

      console.log('Subscription created:', subscription)

      return NextResponse.json({
        checkoutUrl: subscription.checkout_url,
        subscriptionId: subscription.id,
      })
    }

    return NextResponse.json(
      { error: 'Invalid plan type' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Checkout error:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
