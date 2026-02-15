import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import Exa from 'exa-js'
import { generateSearchQueries, analyzeTrendsWithGemini, generateTrendMetadata } from '@/lib/gemini-service'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })
const exa = new Exa(process.env.EXA_API_KEY!)

// Rate limiting cache
const rateLimitCache = new Map<string, { count: number; timestamp: number }>()

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { niche } = await req.json()

    // Validate input
    if (!niche || typeof niche !== 'string' || niche.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid niche' },
        { status: 400 }
      )
    }

    if (niche.length > 50) {
      return NextResponse.json(
        { error: 'Niche must be less than 50 characters' },
        { status: 400 }
      )
    }

    // Rate limiting
    const now = Date.now()
    const userRateLimit = rateLimitCache.get(session.user.id)
    
    if (userRateLimit) {
      if (now - userRateLimit.timestamp < 60000) {
        if (userRateLimit.count >= 5) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again in a minute.' },
            { status: 429 }
          )
        }
        userRateLimit.count++
      } else {
        rateLimitCache.set(session.user.id, { count: 1, timestamp: now })
      }
    } else {
      rateLimitCache.set(session.user.id, { count: 1, timestamp: now })
    }

    // Get user profile
    let profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id }
    })

    // Auto-create profile if not exists
    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          userId: session.user.id,
          plan: 'FREE',
          credits: 5,
          monthlyCreditLimit: 5,
        }
      })

      await prisma.creditTransaction.create({
        data: {
          userId: session.user.id,
          amount: 5,
          type: 'CREDIT',
          reason: 'Initial FREE plan credits'
        }
      })
    }

    // Check credits
    if (profile.credits < 1) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 402 }
      )
    }

    // Step 1: Generate search strategy with Gemini
    console.log(`[TrendGen] Generating search queries for: ${niche}`)
    const searchStrategy = await generateSearchQueries(niche)
    
    // Step 2: Search with Exa using multiple queries
    console.log(`[TrendGen] Searching with Exa...`)
    const exaResults: any[] = []
    
    // Search main niche
    const mainResults = await exa.search(niche, {
      type: 'auto',
      numResults: 10,
      contents: {
        highlights: {
          maxCharacters: 2000
        }
      }
    })
    exaResults.push(...mainResults.results)

    // Search with specific terms from Gemini
    for (const term of searchStrategy.searchTerms.slice(0, 3)) {
      try {
        const results = await exa.search(term, {
          type: 'auto',
          numResults: 5,
          contents: {
            highlights: {
              maxCharacters: 1500
            }
          }
        })
        exaResults.push(...results.results)
      } catch (e) {
        console.error(`Search failed for term: ${term}`, e)
      }
    }

    // Search Reddit specifically
    try {
      const redditResults = await exa.search(`${niche} reddit discussions`, {
        type: 'auto',
        numResults: 5,
        contents: {
          highlights: {
            maxCharacters: 1500
          }
        }
      })
      exaResults.push(...redditResults.results)
    } catch (e) {
      console.error('Reddit search failed', e)
    }

    // Step 3: Analyze with Gemini
    console.log(`[TrendGen] Analyzing trends with Gemini...`)
    const trendAnalysis = await analyzeTrendsWithGemini(niche, exaResults)
    const trendSummary = await generateTrendMetadata(niche)

    // Step 4: Deduct credit and save
    await prisma.$transaction([
      prisma.userProfile.update({
        where: { userId: session.user.id },
        data: { credits: { decrement: 1 } }
      }),
      prisma.creditTransaction.create({
        data: {
          userId: session.user.id,
          amount: -1,
          type: 'DEBIT',
          reason: `Trend generation for: ${niche}`
        }
      }),
      prisma.trendRequest.create({
        data: {
          userId: session.user.id,
          niche: niche.trim(),
          creditsUsed: 1,
          result: {
            ...trendAnalysis,
            searchStrategy,
            summary: trendSummary,
            timestamp: new Date().toISOString()
          } as any
        }
      })
    ])

    // Return formatted result
    return NextResponse.json({
      niche,
      summary: trendSummary,
      themes: trendAnalysis.themes,
      ideas: trendAnalysis.ideas,
      stats: {
        sourcesAnalyzed: exaResults.length,
        trendingVelocity: trendAnalysis.stats.trendingVelocity,
        engagementScore: trendAnalysis.stats.engagementScore,
        contentGaps: trendAnalysis.stats.contentGaps,
        sites: searchStrategy.sites,
        forums: searchStrategy.forums
      },
      insights: trendAnalysis.insights
    })

  } catch (error: any) {
    console.error('[TrendGen] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate trends' },
      { status: 500 }
    )
  }
}
