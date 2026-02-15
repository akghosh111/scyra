import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const handler = async (req: NextRequest) => {
  try {
    console.log('Auth API called:', {
      method: req.method,
      url: req.url,
      contentType: req.headers.get('content-type'),
      origin: req.headers.get('origin'),
    })
    
    const response = await auth.handler(req)
    
    console.log('Auth API response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    })
    
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
    console.error('Auth API error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? {
          name: error instanceof Error ? error.name : 'Unknown',
        } : undefined
      },
      { status: 500 }
    )
  }
}

export { handler as GET, handler as POST, handler as OPTIONS }
