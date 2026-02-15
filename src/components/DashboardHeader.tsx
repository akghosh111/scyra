'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardHeaderProps {
  user: {
    id: string
    email: string
    name?: string | null
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [credits, setCredits] = useState<number>(0)
  const [plan, setPlan] = useState<string>('FREE')

  useEffect(() => {
    // Fetch user profile
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setCredits(data.profile.credits)
          setPlan(data.profile.plan)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <header className="bg-white border-b border-black/5 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-serif text-charcoal">
          Welcome back, {user.name?.split(' ')[0] || 'Creator'}
        </h1>
        <p className="text-text-secondary">
          Ready to spot some trends?
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Credits */}
        <div className="flex items-center gap-3 px-4 py-2 bg-cream rounded-xl">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm text-text-muted">Credits</p>
            <p className="font-bold text-charcoal">{credits} remaining</p>
          </div>
        </div>

        {/* Plan */}
        <div className="px-4 py-2 bg-charcoal/5 rounded-xl">
          <p className="text-sm text-text-muted">Current Plan</p>
          <p className="font-bold text-charcoal">{plan}</p>
        </div>

        {/* Upgrade button */}
        <Link
          href="/dashboard/billing"
          className="px-6 py-2.5 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal-light transition-all hover:scale-105"
        >
          Upgrade
        </Link>
      </div>
    </header>
  )
}
