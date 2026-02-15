import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateSearchQueries(niche: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  
  const prompt = `You are a research analyst specializing in content trend discovery.

For the niche/topic: "${niche}"

Generate a comprehensive research plan:

1. **Top Popular Sites** (5-7 sites where this niche is actively discussed):
   List authoritative blogs, news sites, and platforms

2. **Reddit Communities & Forums** (5-7 communities):
   List specific subreddits and forums where people discuss this

3. **Search Terms** (10-15 specific search queries):
   Generate trending search terms, questions, and topics people are searching for
   Include: how-to queries, comparisons, trending topics, common problems

4. **Trend Indicators**:
   What signals would indicate something is trending in this space?

Format your response as JSON:
{
  "sites": ["site1.com", "site2.com", ...],
  "forums": ["r/subreddit", "forum-name", ...],
  "searchTerms": ["term 1", "term 2", ...],
  "trendIndicators": ["indicator 1", "indicator 2", ...]
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  
  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }
  
  throw new Error("Failed to parse Gemini response")
}

export async function analyzeTrendsWithGemini(niche: string, exaResults: any[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  
  // Format Exa results for analysis
  const context = exaResults.map((result, i) => `
Source ${i + 1}: ${result.title}
URL: ${result.url}
Content: ${result.text || result.highlight || 'No content available'}
`).join('\n---\n')

  const prompt = `You are an expert Trend Analyst AI specializing in identifying emerging content opportunities.

NICHE: "${niche}"

Analyze the following web content and identify trending themes, discussions, and content opportunities:

${context}

Based on this data, provide:

1. **5 Trending Themes** - Hot topics gaining traction
   For each: title, description, engagement level (High/Medium/Low), velocity (Rising fast/Steady/Slow)

2. **15 Content Ideas** - Specific, actionable content ideas
   For each: title, format (Blog/Video/Thread/Reel/Carousel), why it works

3. **Statistics**:
   - Total sources analyzed
   - Trending velocity score (1-10)
   - Engagement potential
   - Content gaps identified

4. **Key Insights**:
   - What's driving conversations?
   - What are people asking?
   - What content is missing?

Format as JSON:
{
  "themes": [
    {
      "title": "Theme name",
      "description": "Brief description",
      "engagement": "High/Medium/Low",
      "velocity": "Rising fast/Steady/Slow",
      "sources": ["source1", "source2"]
    }
  ],
  "ideas": [
    {
      "title": "Content idea title",
      "format": "Blog/Video/Thread/Reel/Carousel",
      "rationale": "Why this works"
    }
  ],
  "stats": {
    "sourcesAnalyzed": number,
    "trendingVelocity": number,
    "engagementScore": number,
    "contentGaps": number
  },
  "insights": {
    "drivingFactor": "What's driving conversations",
    "commonQuestions": ["question1", "question2"],
    "missingContent": ["gap1", "gap2"]
  }
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  
  // Extract JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }
  
  throw new Error("Failed to parse trend analysis")
}

export async function generateTrendMetadata(niche: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  
  const prompt = `For the niche "${niche}", generate a brief trend analysis summary (2-3 sentences) explaining what's currently happening in this space and why it's trending.`
  
  const result = await model.generateContent(prompt)
  return result.response.text()
}
