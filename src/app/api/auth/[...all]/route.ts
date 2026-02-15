import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const handler = async (req: NextRequest) => {
  try {
    console.log('Auth API called:', req.method, req.url)
    
    const response = await auth.handler(req)
    
    console.log('Auth response status:', response.status)
    
    // Add CORS headers
    const origin = req.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_VERCEL_URL,
      'http://localhost:3000',
      'https://scyra.vercel.app'
    ].filter(Boolean)
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    return response
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export { handler as GET, handler as POST, handler as OPTIONS }
