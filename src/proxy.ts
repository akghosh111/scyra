import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip auth routes and checkout (checkout handles its own auth)
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/checkout')) {
    return NextResponse.next()
  }
  
  // Check if the route is protected
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/trends') || pathname.startsWith('/api/user')) {
    try {
      // Use Better Auth API to check session
      const session = await auth.api.getSession({
        headers: request.headers
      })
      
      if (!session) {
        // No valid session
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      console.error('Proxy auth error:', error)
      // On error, redirect to login
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/trends/:path*', '/api/user/:path*', '/api/portal/:path*', '/api/webhooks/:path*', '/api/auth/:path*', '/api/checkout/:path*']
}
