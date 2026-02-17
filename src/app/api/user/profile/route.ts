import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const addCORSHeaders = (response: NextResponse, origin: string | null) => {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
    'http://localhost:3000',
    'https://scyra.vercel.app'
  ].filter(Boolean)
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
}

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  addCORSHeaders(response, req.headers.get('origin'))
  return response
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session) {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      addCORSHeaders(response, req.headers.get('origin'))
      return response
    }

    // Get or create user profile
    let profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      // Auto-create profile on first login - 0 credits until purchase
      profile = await prisma.userProfile.create({
        data: {
          userId: session.user.id,
          plan: 'NONE',
          credits: 0,
          totalCreditLimit: 0,
        }
      })
    }

    const response = NextResponse.json({ profile })
    addCORSHeaders(response, req.headers.get('origin'))
    return response
  } catch (error) {
    console.error('Profile error:', error)
    const response = NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
    addCORSHeaders(response, req.headers.get('origin'))
    return response
  }
}
