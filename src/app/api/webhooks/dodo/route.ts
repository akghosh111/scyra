import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Dodo Payments webhook handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_type, data } = body

    console.log('Webhook received:', event_type, data)

    switch (event_type) {
      case 'subscription.created':
      case 'subscription.activated': {
        // New Pro subscription created - user gets 50 credits monthly
        const { id: subscription_id, customer_id, product_id } = data
        const email = data.customer?.email

        if (!email) {
          console.error('No email in webhook payload')
          return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        })

        if (!user) {
          console.error('User not found for email:', email)
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if product_id matches Pro plan ($12/month subscription, 50 credits)
        if (product_id === 'pdt_0NYUd1mVCB0vEvtCFFj0r') {
          const creditsPerMonth = 50

          await prisma.userProfile.update({
            where: { userId: user.id },
            data: {
              plan: 'PRO',
              credits: creditsPerMonth,
              totalCreditLimit: creditsPerMonth,
              dodoCustomerId: customer_id,
            },
          })

          console.log(`User ${user.id} subscribed to Pro plan (${creditsPerMonth} credits/month)`)
        }

        return NextResponse.json({ success: true })
      }

      case 'subscription.renewed': {
        // Monthly renewal - reset credits to 50 for Pro plan
        const { id: subscription_id, customer_id } = data
        const creditsPerMonth = 50

        await prisma.userProfile.updateMany({
          where: { dodoCustomerId: customer_id, plan: 'PRO' },
          data: {
            credits: creditsPerMonth,
            totalCreditLimit: creditsPerMonth,
          },
        })

        console.log(`Subscription renewed for customer ${customer_id} - credits reset to ${creditsPerMonth}`)
        return NextResponse.json({ success: true })
      }

      case 'subscription.canceled': {
        // Pro subscription canceled - keep data but clear customer ID
        const { customer_id } = data

        const profile = await prisma.userProfile.findFirst({
          where: { dodoCustomerId: customer_id, plan: 'PRO' },
        })

        if (profile) {
          await prisma.userProfile.update({
            where: { id: profile.id },
            data: {
              plan: 'PRO',
              dodoCustomerId: null, // Clear Dodo customer ID
            },
          })

          console.log(`Subscription canceled for user ${profile.userId} - customer ID cleared`)
        }

        return NextResponse.json({ success: true })
      }

      default:
        console.log('Unhandled event type:', event_type)
        return NextResponse.json({ success: true })
    }
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle webhook verification (HEAD request)
export async function HEAD(req: NextRequest) {
  return NextResponse.json({ success: true })
}
