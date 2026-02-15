'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

function SignupContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      })
      
      if (result.error) {
        setError(result.error.message || 'Failed to create account')
      } else {
        // Redirect to billing if user selected pro plan
        if (planId === 'pro') {
          window.location.href = '/dashboard/billing'
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: planId === 'pro' ? '/dashboard/billing' : '/dashboard',
    })
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="text-3xl font-black text-charcoal tracking-widest inline-block hover:scale-105 transition-transform"
            style={{ letterSpacing: '0.15em' }}
          >
            SCYRA
          </Link>
        </div>

        {/* Card */}
        <div className="card-soft rounded-3xl p-8 md:p-10">
          <h1 className="text-3xl font-serif text-charcoal text-center mb-2">
            Create your account
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Start spotting trends before they blow up
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-black/10 rounded-xl bg-white hover:bg-white/80 transition-all duration-200 hover:shadow-md mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-charcoal font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-text-muted">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:border-charcoal/30 focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:border-charcoal/30 focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:border-charcoal/30 focus:outline-none transition-all duration-200"
                required
              />
              <p className="text-xs text-text-muted mt-1.5">
                Must be at least 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal-light transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-charcoal font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
          <p className="text-center text-text-muted text-sm mt-8">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-charcoal">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-charcoal">Privacy Policy</Link>
          </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><p>Loading...</p></div>}>
      <SignupContent />
    </Suspense>
  )
}

