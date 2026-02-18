'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

interface DashboardSidebarProps {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

const navItems = [
  { label: 'DASHBOARD', href: '/dashboard' },
  { label: 'HISTORY', href: '/dashboard/history' },
  { label: 'BILLING', href: '/dashboard/billing' },
  { label: 'SETTINGS', href: '/dashboard/settings' },
]

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  return (
    <aside className="w-72 bg-cream/50 backdrop-blur-sm border-r border-charcoal/5 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-charcoal/10">
        <Link 
          href="/"
          className="text-2xl font-black text-charcoal tracking-widest inline-block hover:scale-105 transition-transform"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.15em' }}
        >
          SCYRA
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-2">
        <p className="text-xs font-semibold text-text-muted tracking-widest uppercase mb-4 px-4">
          Navigation
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-4 rounded-xl font-medium tracking-wide transition-all duration-300 ${
              pathname === item.href
                ? 'bg-charcoal text-white shadow-lg shadow-charcoal/10'
                : 'text-charcoal/70 hover:bg-white/50 hover:text-charcoal hover:shadow-sm'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-6 border-t border-charcoal/10">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="w-12 h-12 rounded-full bg-gradient-orange flex items-center justify-center text-white font-serif font-bold text-lg shadow-lg">
            {user.name?.[0] || user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-charcoal truncate font-serif">
              {user.name || user.email}
            </p>
            <p className="text-sm text-text-muted truncate text-xs tracking-wide">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-4 rounded-xl font-medium text-text-muted tracking-wide hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all duration-300"
        >
          LOG OUT
        </button>
      </div>
    </aside>
  )
}
