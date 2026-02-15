import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const handler = async (req: NextRequest) => {
  const response = await auth.handler(req)
  
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
}

export { handler as GET, handler as POST, handler as OPTIONS }
