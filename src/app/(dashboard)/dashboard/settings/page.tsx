'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
  image?: string
  createdAt: string
}

interface UserProfile {
  plan: string
  credits: number
  monthlyCreditLimit: number
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const [profileRes, userRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/auth/get-session'),
      ])

      const profileData = await profileRes.json()
      const userData = await userRes.json()

      if (!profileRes.ok || !userRes.ok) {
        throw new Error('Failed to load settings')
      }

      setProfile(profileData.profile)
      setUser(userData.user)
      setName(userData.user.name || '')
      setEmail(userData.user.email || '')
    } catch (err: any) {
      showMessage('error', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // Note: Better Auth doesn't have a built-in profile update endpoint
      // In production, you'd create an API endpoint for this
      showMessage('success', 'Profile update feature coming soon!')
    } catch (err: any) {
      showMessage('error', err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    )

    if (!confirmed) return

    setIsSaving(true)
    setMessage(null)

    try {
      // Note: In production, you'd create an API endpoint for this
      showMessage('error', 'Account deletion feature coming soon! Contact support@scyra.com')
    } catch (err: any) {
      showMessage('error', err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-charcoal" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-text-secondary">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card-soft rounded-3xl p-8">
        <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-2">Settings</h1>
        <p className="text-text-secondary text-lg">Manage your account preferences</p>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl animate-in fade-in ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Profile</h2>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-4xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-1">
              {user?.name || 'No name set'}
            </h3>
            <p className="text-text-secondary">{user?.email}</p>
            <p className="text-text-muted text-sm mt-1">
              Member since {user?.createdAt ? formatDate(user.createdAt) : 'recently'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:border-charcoal/30 focus:outline-none transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/10 text-text-primary cursor-not-allowed"
              placeholder="your@email.com"
            />
            <p className="text-text-muted text-sm mt-1">
              Email cannot be changed. Contact support if you need to update your email.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-6 py-3 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal-light transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Subscription</h2>
        
        <div className="flex items-center justify-between p-6 bg-warm-white rounded-2xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-charcoal">{profile?.plan}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <p className="text-text-secondary">
              {profile?.credits} of {profile?.monthlyCreditLimit} credits remaining
            </p>
          </div>
          <a
            href="/billing"
            className="px-6 py-3 bg-charcoal/10 text-charcoal rounded-full font-medium hover:bg-charcoal/20 transition-all"
          >
            Manage Plan
          </a>
        </div>
      </div>

      {/* Account Security */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Account Security</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-soft flex items-center justify-center text-2xl">
                🔒
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Password</h3>
                <p className="text-text-muted text-sm">Last changed recently</p>
              </div>
            </div>
            <button className="px-4 py-2 text-charcoal hover:text-charcoal-light font-medium transition-colors">
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-soft flex items-center justify-center text-2xl">
                🔐
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Two-Factor Authentication</h3>
                <p className="text-text-muted text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium hover:bg-green-200 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-soft flex items-center justify-center text-2xl">
                🌐
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Connected Accounts</h3>
                <p className="text-text-muted text-sm">Google account connected</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-full font-medium hover:bg-red-100 transition-colors">
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-soft rounded-3xl p-8">
        <h2 className="text-2xl font-serif text-charcoal mb-6">Notifications</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5">
            <div>
              <h3 className="font-semibold text-charcoal mb-1">Email Notifications</h3>
              <p className="text-text-muted text-sm">Receive updates about your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-charcoal" />
            </label>
          </div>

          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5">
            <div>
              <h3 className="font-semibold text-charcoal mb-1">Weekly Trend Reports</h3>
              <p className="text-text-muted text-sm">Get weekly summary of trending topics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-charcoal" />
            </label>
          </div>

          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5">
            <div>
              <h3 className="font-semibold text-charcoal mb-1">Credit Reminders</h3>
              <p className="text-text-muted text-sm">Notify when credits are running low</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-charcoal" />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-soft rounded-3xl p-8 border-2 border-red-100">
        <h2 className="text-2xl font-serif text-red-600 mb-2">Danger Zone</h2>
        <p className="text-text-secondary mb-6">Irreversible and destructive actions</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-charcoal mb-1">Delete Account</h3>
            <p className="text-text-muted text-sm">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={isSaving}
            className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-text-muted text-sm">
          Scyra v1.0 © {new Date().getFullYear()} • Built with ❤️ for content creators
        </p>
      </div>
    </div>
  )
}
