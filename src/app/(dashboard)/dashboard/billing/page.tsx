'use client'

import { useEffect, useState } from 'react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    pricePerMonth: '$0/month',
    description: 'Perfect for trying it out',
    features: [
      '5 trend scans (lifetime)',
      'Basic trend clustering',
    ],
    creditLimit: 5,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    pricePerMonth: '$12/month',
    description: 'For serious creators',
    features: [
      '50 trend scans/month',
      'Auto-renews monthly',
      'Advanced AI insights',
      'Weekly trend reports',
      'Content idea generator',
      'Priority support',
    ],
    creditLimit: 50,
    featured: true,
  },
]

interface UserProfile {
  plan: string
  credits: number
  totalCreditLimit: number
}

export default function BillingPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      console.log('Loading user profile...')
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      console.log('Profile response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load profile')
      }

      console.log('Setting profile:', data.profile)
      setProfile(data.profile)
    } catch (err: any) {
      console.error('Error loading profile:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    console.log('handleUpgrade called with planId:', planId, 'Current profile plan:', profile?.plan)

    setIsUpgrading(true)
    setError('')
    setSuccess('')
    setSelectedPlan(planId)

    try {
      const plan = PLANS.find(p => p.id === planId)
      console.log('Selected plan:', plan, 'Profile:', profile)

      // Check if already on this plan
      if (profile?.plan?.toUpperCase() === planId.toUpperCase()) {
        setSuccess('You are already on this plan.')
        setIsUpgrading(false)
        return
      }

      // Free plan is already free, no action needed if trying to "upgrade" to it
      if (planId === 'free') {
        setSuccess('Already on the Free plan.')
        setIsUpgrading(false)
        return
      }

      if (planId === 'pro') {
        console.log('Creating checkout session for Pro plan...')
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: 'pro',
            productId: 'pdt_0NYUd1mVCB0vEvtCFFj0r',
          }),
        })

        const data = await response.json()
        console.log('Checkout response:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        if (data.checkoutUrl) {
          console.log('Redirecting to checkout:', data.checkoutUrl)
          window.location.href = data.checkoutUrl
        } else {
          throw new Error('No checkout URL in response')
        }
      }
    } catch (err: any) {
      console.error('Upgrade error:', err)
      setError(err.message)
      setIsUpgrading(false)
      setSelectedPlan(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-charcoal" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-text-secondary">Loading billing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card-soft rounded-3xl p-8">
        <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-2">Billing & Plans</h1>
        <p className="text-text-secondary text-lg">Upgrade to unlock more possibilities</p>
      </div>

      {/* Current Plan Card */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Current Plan</h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-bold text-charcoal">
                {profile?.plan === 'FREE' ? 'Free' : profile?.plan}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <p className="text-text-secondary">
              {profile?.credits} of {profile?.totalCreditLimit} credits remaining this month
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="/history"
              className="px-6 py-3 bg-charcoal/10 text-charcoal rounded-full font-medium hover:bg-charcoal/20 transition-all"
            >
              View Usage
            </a>
          </div>
        </div>
      </div>

      {/* Credit Usage */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Credit Usage This Month</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Credits Used</span>
            <span className="text-charcoal font-semibold">
              {profile?.totalCreditLimit && profile?.credits
                ? (profile.totalCreditLimit - profile.credits).toLocaleString()
                : 0}{' '}
              / {profile?.totalCreditLimit || 0}
            </span>
          </div>
          <div className="h-4 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
              style={{
                width: profile?.totalCreditLimit && profile?.credits
                  ? ((profile.totalCreditLimit - profile.credits) / profile.totalCreditLimit) * 100
                  : 0,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>0</span>
            <span>Pro plan: Credits reset on billing date</span>
            <span>{profile?.totalCreditLimit || 0}</span>
          </div>
          <div className="flex gap-4">
            <a
              href="/history"
              className="px-6 py-3 bg-charcoal/10 text-charcoal rounded-full font-medium hover:bg-charcoal/20 transition-all"
            >
              View Usage
            </a>
          </div>
        </div>
      </div>

      {/* Credit Usage */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Credit Usage This Month</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Credits Used</span>
            <span className="text-charcoal font-semibold">
              {profile?.totalCreditLimit && profile?.credits
                ? (profile.totalCreditLimit - profile.credits).toLocaleString()
                : 0}{' '}
              / {profile?.totalCreditLimit || 0}
            </span>
          </div>
          <div className="h-4 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
              style={{
                width: profile?.totalCreditLimit && profile?.credits
                  ? ((profile.totalCreditLimit - profile.credits) / profile.totalCreditLimit) * 100
                  : 0,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>0</span>
            <span>Pro plan: Credits reset on billing date</span>
            <span>{profile?.totalCreditLimit || 0}</span>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-2">Choose Your Plan</h2>
        <p className="text-text-secondary mb-8">Select the plan that fits your content needs</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${
                plan.featured
                  ? 'bg-charcoal text-white ring-2 ring-charcoal scale-105'
                  : 'card-soft'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-charcoal text-sm font-medium rounded-full">
                  Most popular
                </div>
              )}

              <h3 className={`text-xl font-semibold mb-2 ${plan.featured ? 'text-white' : 'text-charcoal'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-charcoal'}`}>
                  {plan.price}
                </span>
                <span className={plan.featured ? 'text-white/70' : 'text-text-muted'}>/month</span>
              </div>
              <p className={`text-sm mb-6 ${plan.featured ? 'text-white/80' : 'text-text-secondary'}`}>
                {plan.description}
              </p>

              <ul className={`space-y-3 mb-8 ${plan.featured ? 'text-white/90' : 'text-text-secondary'}`}>
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span className={plan.featured ? 'text-white/90' : 'text-text-secondary'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={(isUpgrading && selectedPlan === plan.id) || (plan.id === 'free' && profile?.plan === 'FREE')}
                className={`w-full py-3 rounded-full font-medium transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.featured
                    ? 'bg-amber-400 text-charcoal hover:bg-amber-300 shadow-lg'
                    : profile?.plan === plan.id.toUpperCase()
                    ? 'bg-charcoal/10 text-charcoal cursor-default'
                    : 'bg-charcoal text-white hover:bg-charcoal-light'
                }`}
              >
                {isUpgrading && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : profile?.plan === plan.id.toUpperCase() ? (
                  'Current Plan'
                ) : plan.id === 'free' ? (
                  'Already Free'
                ) : (
                  'Upgrade Now'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b border-black/5 pb-4">
            <h3 className="font-semibold text-charcoal mb-2">What happens if I run out of credits?</h3>
            <p className="text-text-secondary">
              Your credits automatically reset on your monthly billing date. If you run out before your reset, you can still use the app but won't be able to generate new trends until credits renew.
            </p>
          </div>
          <div className="border-b border-black/5 pb-4">
            <h3 className="font-semibold text-charcoal mb-2">Can I cancel anytime?</h3>
            <p className="text-text-secondary">
              Yes! You can cancel your Pro subscription anytime. After cancellation, you'll keep access until the end of your current billing period, then return to the Free plan.
            </p>
          </div>
          <div className="border-b border-black/5 pb-4">
            <h3 className="font-semibold text-charcoal mb-2">Do unused credits rollover?</h3>
            <p className="text-text-secondary">
              No, credits reset each month. We recommend using your credits before your renewal date to get the most value from your subscription.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-charcoal mb-2">How secure is my payment information?</h3>
            <p className="text-text-secondary">
              We use industry-standard encryption and payment processors to ensure your payment information is always secure. We never store your card details on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-gradient-warm rounded-3xl p-8 md:p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">Need help choosing a plan?</h3>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">
          Our team is here to help you find the perfect plan for your content creation needs.
        </p>
        <a
          href="mailto:support@scyra.com"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-charcoal rounded-full font-medium hover:shadow-xl transition-all hover:scale-105"
        >
          Contact Support
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 animate-in fade-in">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 animate-in fade-in">
          {success}
        </div>
      )}
    </div>
  )
}
