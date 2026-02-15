'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Theme {
  title: string
  description: string
  engagement: string
  velocity: string
  sources: string[]
}

interface Idea {
  title: string
  format: string
  rationale: string
}

interface TrendResult {
  niche: string
  summary: string
  themes: Theme[]
  ideas: Idea[]
  stats: {
    sourcesAnalyzed: number
    trendingVelocity: number
    engagementScore: number
    contentGaps: number
    sites: string[]
    forums: string[]
  }
  insights: {
    drivingFactor: string
    commonQuestions: string[]
    missingContent: string[]
  }
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [niche, setNiche] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TrendResult | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      setSuccess('Upgrade successful! You have been upgraded to the Pro plan with 100 credits.')
    }
  }, [searchParams])

  const handleGenerate = async () => {
    if (!niche.trim()) {
      setError('Please enter a niche')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/trends/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate trends')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getVelocityColor = (velocity: string) => {
    if (velocity.includes('fast') || velocity.includes('Hot')) return 'bg-red-100 text-red-700'
    if (velocity.includes('Rising')) return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  const getFormatIcon = (format: string) => {
    const icons: Record<string, string> = {
      'Blog': '📝',
      'Video': '🎬',
      'Thread': '🧵',
      'Reel': '🎞️',
      'Carousel': '🎠',
      'LinkedIn': '💼',
      'Tweet': '🐦',
      'YouTube': '▶️'
    }
    return icons[format] || '💡'
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Alert Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 animate-in fade-in slide-in-from-top-4">
          {success}
        </div>
      )}

      {/* Input Section */}
      <div className="card-soft rounded-3xl p-8 md:p-10">
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
          Discover Trends in Your Niche
        </h2>
        <p className="text-text-secondary mb-8 text-lg">
          Enter a niche or topic and our AI will analyze trending discussions across the web to generate content ideas for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., AI tools, fitness, cybersecurity..."
            className="flex-1 px-6 py-4 rounded-xl bg-white border border-black/10 focus:border-charcoal/30 focus:outline-none transition-all text-lg"
            maxLength={50}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-8 py-4 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal-light transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Generate Trends'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Summary Banner */}
          <div className="bg-gradient-warm rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-serif mb-3">Trend Analysis for "{result.niche}"</h3>
            <p className="text-white/90 text-lg">{result.summary}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-soft rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-charcoal mb-1">{result.stats.sourcesAnalyzed}</p>
              <p className="text-text-secondary text-sm">Sources Analyzed</p>
            </div>
            <div className="card-soft rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-charcoal mb-1">{result.stats.trendingVelocity}/10</p>
              <p className="text-text-secondary text-sm">Trend Velocity</p>
            </div>
            <div className="card-soft rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-charcoal mb-1">{result.stats.engagementScore}/10</p>
              <p className="text-text-secondary text-sm">Engagement Score</p>
            </div>
            <div className="card-soft rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-charcoal mb-1">{result.stats.contentGaps}</p>
              <p className="text-text-secondary text-sm">Content Gaps</p>
            </div>
          </div>

          {/* Top Sources & Forums */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-soft rounded-3xl p-6">
              <h3 className="text-xl font-serif text-charcoal mb-4">📊 Top Sources</h3>
              <div className="flex flex-wrap gap-2">
                {result.stats.sites.slice(0, 6).map((site, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {site}
                  </span>
                ))}
              </div>
            </div>
            <div className="card-soft rounded-3xl p-6">
              <h3 className="text-xl font-serif text-charcoal mb-4">💬 Active Communities</h3>
              <div className="flex flex-wrap gap-2">
                {result.stats.forums.slice(0, 6).map((forum, i) => (
                  <span key={i} className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {forum}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trending Themes */}
          <div className="card-soft rounded-3xl p-8">
            <h3 className="text-2xl font-serif text-charcoal mb-6">🔥 Trending Themes</h3>
            <div className="space-y-4">
              {result.themes.map((theme, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-black/5 hover:border-charcoal/20 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-orange flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-charcoal text-lg">{theme.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getVelocityColor(theme.velocity)}`}>
                        {theme.velocity}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3">{theme.description}</p>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {theme.engagement} engagement
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Ideas */}
          <div className="card-soft rounded-3xl p-8">
            <h3 className="text-2xl font-serif text-charcoal mb-6">💡 Content Ideas</h3>
            <div className="grid gap-4">
              {result.ideas.map((idea, index) => (
                <div 
                  key={index} 
                  className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{getFormatIcon(idea.format)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-amber-200 text-amber-900 rounded text-xs font-semibold">
                          {idea.format}
                        </span>
                      </div>
                      <p className="font-medium text-charcoal text-lg mb-1 group-hover:text-charcoal-light transition-colors">
                        {idea.title}
                      </p>
                      <p className="text-text-secondary text-sm">{idea.rationale}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="card-soft rounded-3xl p-8">
            <h3 className="text-2xl font-serif text-charcoal mb-6">🔍 Key Insights</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-charcoal mb-2">What's Driving Conversations?</h4>
                <p className="text-text-secondary">{result.insights.drivingFactor}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Common Questions</h4>
                  <ul className="space-y-2">
                    {result.insights.commonQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary">
                        <span className="text-charcoal">•</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Content Gaps</h4>
                  <ul className="space-y-2">
                    {result.insights.missingContent.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary">
                        <span className="text-charcoal">•</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
