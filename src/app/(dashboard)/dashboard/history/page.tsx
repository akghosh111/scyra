'use client'

import { useEffect, useState } from 'react'

interface TrendHistory {
  id: string
  niche: string
  creditsUsed: number
  createdAt: string
  result?: TrendResult
}

interface TrendResult {
  niche: string
  summary: string
  themes: Array<{
    title: string
    description: string
    engagement: string
    velocity: string
    sources: string[]
  }>
  ideas: Array<{
    title: string
    format: string
    rationale: string
  }>
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

export default function HistoryPage() {
  const [history, setHistory] = useState<TrendHistory[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/trends/history')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load history')
      }

      setHistory(data.requests || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
    }
    return icons[format] || '💡'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-charcoal" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-text-secondary">Loading history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-soft rounded-3xl p-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card-soft rounded-3xl p-8">
        <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-2">Trend Investigation History</h1>
        <p className="text-text-secondary text-lg">Review your past trend analyses and insights</p>
      </div>

      {history.length === 0 ? (
        <div className="card-soft rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
            📊
          </div>
          <h3 className="text-xl font-serif text-charcoal mb-2">No trend analysis yet</h3>
          <p className="text-text-secondary mb-6">Start by generating your first trend analysis in the Dashboard</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal-light transition-all"
          >
            Go to Dashboard
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="card-soft rounded-2xl overflow-hidden transition-all hover:shadow-lg"
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-white/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-orange-soft text-orange-800 rounded-full text-xs font-semibold">
                      {item.creditsUsed} credit{item.creditsUsed > 1 ? 's' : ''}
                    </span>
                    <span className="text-text-muted text-sm">{formatDate(item.createdAt)}</span>
                  </div>
                  <h3 className="text-xl font-serif text-charcoal">{item.niche}</h3>
                </div>
                <svg
                  className={`w-6 h-6 text-charcoal transition-transform duration-200 ${
                    expandedItems.has(item.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedItems.has(item.id) && item.result && (
                <div className="border-t border-black/5 p-6 space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h4 className="font-semibold text-charcoal mb-2">Summary</h4>
                    <p className="text-text-secondary">{(item.result as TrendResult)?.summary}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="card-soft rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-charcoal mb-1">
                        {(item.result as TrendResult)?.stats?.sourcesAnalyzed}
                      </p>
                      <p className="text-text-muted text-sm">Sources</p>
                    </div>
                    <div className="card-soft rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-charcoal mb-1">
                        {(item.result as TrendResult)?.stats?.trendingVelocity}/10
                      </p>
                      <p className="text-text-muted text-sm">Velocity</p>
                    </div>
                    <div className="card-soft rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-charcoal mb-1">
                        {(item.result as TrendResult)?.stats?.engagementScore}/10
                      </p>
                      <p className="text-text-muted text-sm">Engagement</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="card-soft rounded-xl p-4">
                      <h4 className="font-semibold text-charcoal mb-3">Top Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {(item.result as TrendResult)?.stats?.sites?.slice(0, 6).map((site, i) => (
                          <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {site}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="card-soft rounded-xl p-4">
                      <h4 className="font-semibold text-charcoal mb-3">Active Communities</h4>
                      <div className="flex flex-wrap gap-2">
                        {(item.result as TrendResult)?.stats?.forums?.slice(0, 6).map((forum, i) => (
                          <span key={i} className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                            {forum}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-charcoal mb-3">Top Themes</h4>
                    <div className="space-y-3">
                      {(item.result as TrendResult)?.themes?.slice(0, 3).map((theme, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-white rounded-xl border border-black/5"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-orange flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-charcoal">{theme.title}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getVelocityColor(
                                  theme.velocity
                                )}`}
                              >
                                {theme.velocity}
                              </span>
                            </div>
                            <p className="text-text-sm text-text-secondary">{theme.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-charcoal mb-3">Content Ideas</h4>
                    <div className="grid gap-2">
                      {(item.result as TrendResult)?.ideas?.slice(0, 5).map((idea, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl"
                        >
                          <span className="text-xl">{getFormatIcon(idea.format)}</span>
                          <div className="flex-1">
                            <span className="px-2 py-1 bg-amber-200 text-amber-900 rounded text-xs font-semibold mr-2">
                              {idea.format}
                            </span>
                            <span className="text-sm font-medium text-charcoal">{idea.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-soft rounded-xl p-6">
                    <h4 className="font-semibold text-charcoal mb-4">Key Insights</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-charcoal mb-2">What is Driving Conversations?</h5>
                        <p className="text-text-secondary text-sm">{(item.result as TrendResult)?.insights?.drivingFactor}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-semibold text-charcoal mb-2">Common Questions</h5>
                          <ul className="space-y-1">
                            {(item.result as TrendResult)?.insights?.commonQuestions?.slice(0, 4).map((q, i) => (
                              <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                                <span>-</span>{q}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-charcoal mb-2">Content Gaps</h5>
                          <ul className="space-y-1">
                            {(item.result as TrendResult)?.insights?.missingContent?.slice(0, 4).map((gap, i) => (
                              <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                                <span>-</span>{gap}
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
          ))}
        </div>
      )}
    </div>
  )
}
