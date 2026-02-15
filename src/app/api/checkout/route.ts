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

    // Get headers first
    const reqHeaders = await headers()
    console.log('Request headers:', {
      cookie: reqHeaders.get('cookie'),
      authorization: reqHeaders.get('authorization'),
    })

    // Get current session
    const session = await auth.api.getSession({
      headers: reqHeaders,
    })

    console.log('Session:', session?.user?.email)

    if (!session || !session.user) {
      console.error('Unauthorized - no session found')
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
      console.log('Dodo API key present:', !!process.env.DODO_API_KEY)

      // Use the customer email from session or request
      const customerEmail = email || session.user.email
      const customerName = name || session.user.name || undefined

      console.log('Customer:', { email: customerEmail, name: customerName })

      try {
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
      } catch (dodoError: any) {
        console.error('Dodo API error:', dodoError)
        console.error('Dodo error status:', dodoError.status)
        console.error('Dodo error message:', dodoError.message)
        console.error('Dodo error response:', dodoError.response)
        
        // Check if this is a 401 authentication error
        if (dodoError.status === 401) {
          console.error('Dodo API authentication error - check API key')
          return NextResponse.json(
            { error: 'Payment API authentication error. Please contact support.' },
            { status: 500 }
          )
        }
        
        throw dodoError
      }
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
