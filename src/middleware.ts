import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip auth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }
  
  // Check if the route is protected
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/trends') || pathname.startsWith('/api/user')) {
    // Check for any auth cookie (Better Auth uses different cookie names)
    const cookies = request.cookies
    const hasSession = cookies.get('better-auth.session') || 
                       cookies.get('session') || 
                       cookies.get('better-auth.session_token')
    
    if (!hasSession) {
      // Redirect to login if no session
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
  matcher: ['/dashboard/:path*', '/api/trends/:path*', '/api/user/:path*', '/api/auth/:path*']
}
