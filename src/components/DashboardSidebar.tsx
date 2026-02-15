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
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'History', href: '/dashboard/history', icon: '📜' },
  { label: 'Billing', href: '/dashboard/billing', icon: '💳' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  return (
    <aside className="w-64 bg-white border-r border-black/5 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-black/5">
        <Link 
          href="/"
          className="text-2xl font-black text-charcoal tracking-widest inline-block"
          style={{ letterSpacing: '0.15em' }}
        >
          SCYRA
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname === item.href
                ? 'bg-charcoal text-white'
                : 'text-charcoal hover:bg-charcoal/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-black/5">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-white font-bold">
            {user.name?.[0] || user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-charcoal truncate">{user.name || user.email}</p>
            <p className="text-sm text-text-muted truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  )
}
