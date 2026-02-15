'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0)
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-cream/90 backdrop-blur-xl shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link 
          href="/"
          className="text-2xl font-black text-charcoal hover:scale-105 transition-transform cursor-pointer tracking-widest" 
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.15em' }}
        >
          SCYRA
        </Link>
        
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {['Features', 'How it works', 'Pricing'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
              className="text-text-secondary hover:text-charcoal transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-charcoal transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {!isPending && (
            <>
              {session ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="hidden sm:block px-5 py-2.5 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal-light transition-all hover:scale-105 hover:shadow-lg"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-text-secondary hover:text-charcoal transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="hidden sm:block text-text-secondary hover:text-charcoal transition-colors"
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/signup"
                    className="px-5 py-2.5 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal-light transition-all hover:scale-105 hover:shadow-lg"
                  >
                    Get started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
