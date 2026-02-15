import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dodo } from '@/lib/dodo'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

// Product IDs - Dodo Payments
const PRODUCT_ID = process.env.NEXT_PUBLIC_PLAN_PRO_ID || 'pdt_0NYUd1mVCB0vEvtCFFj0r'

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

    const { planId, productId, email, name } = await req.json()
    console.log('Plan ID:', planId, 'Product ID:', productId, 'Email:', email)

    const actualProductId = productId || PRODUCT_ID

    if (!planId || !actualProductId) {
      return NextResponse.json(
        { error: 'planId and productId are required' },
        { status: 400 }
      )
    }

    // For Pro plan, create a subscription checkout session
    if (planId === 'pro') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      console.log('Creating checkout session with appUrl:', appUrl)

      // Use the customer email from session or request
      const customerEmail = email || session.user.email
      const customerName = name || session.user.name || undefined

      const checkoutSession = await dodo.checkoutSessions.create({
        product_cart: [
          {
            product_id: actualProductId,
            quantity: 1,
          },
        ],
        customer: {
          email: customerEmail,
          name: customerName,
        },
        return_url: `${appUrl}/dashboard?checkout=success`,
      })

      console.log('Checkout session created:', checkoutSession)

      return NextResponse.json({
        checkoutUrl: checkoutSession.checkout_url,
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
