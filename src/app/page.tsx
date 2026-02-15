'use client'

import { useEffect, useState, useRef } from 'react'
import FAQ from '@/components/FAQ'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'

interface CardPosition {
  x: number
  y: number
  rotation: number
}

export default function Home() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const heroRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<CardPosition[]>([
    { x: 0, y: 0, rotation: -3 },
    { x: 0, y: 0, rotation: 2 },
    { x: 0, y: 0, rotation: -2 },
    { x: 0, y: 0, rotation: 3 },
  ])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlanClick = async (planId: string) => {
    if (planId === 'free') {
      router.push('/login')
      return
    }

    // For pro plan, redirect to signup with plan parameter
    router.push(`/signup?plan=${planId}`)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      if (draggingIndex !== null && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const newX = e.clientX - rect.left - dragOffset.x
        const newY = e.clientY - rect.top - dragOffset.y
        
        setCards(prev => prev.map((card, i) => 
          i === draggingIndex 
            ? { ...card, x: newX, y: newY, rotation: 0 }
            : card
        ))
      }
    }

    const handleMouseUp = () => {
      setDraggingIndex(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingIndex, dragOffset])

  const handleCardMouseDown = (index: number, e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left - cards[index].x,
        y: e.clientY - rect.top - cards[index].y,
      })
      setDraggingIndex(index)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <div className="absolute inset-0 noise-subtle pointer-events-none" />
      
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-24 px-6 lg:px-12 min-h-screen flex items-center overflow-hidden">
          {/* Cursor Glow Effect - Hero Only */}
          <div 
            className="pointer-events-none fixed w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] transition-all duration-100 ease-out mix-blend-soft-light"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, rgba(245, 158, 11, 0.3) 30%, transparent 70%)',
              left: mousePosition.x - 250,
              top: mousePosition.y - 250,
              zIndex: 1,
            }}
          />
          
          {/* Secondary Cursor Glow - Blue tint */}
          <div 
            className="pointer-events-none fixed w-[350px] h-[350px] rounded-full opacity-15 blur-[80px] transition-all duration-150 ease-out mix-blend-soft-light"
            style={{
              background: 'radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)',
              left: mousePosition.x - 175,
              top: mousePosition.y - 175,
              zIndex: 1,
            }}
          />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] text-charcoal mb-8">
              Know what your niche is
              <br />
              talking about —{' '}
              <span className="relative inline-block">
                <span className="relative z-10">before</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path 
                    d="M0,8 Q50,0 100,8 T200,8" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="4"
                    className="opacity-60"
                  />
                </svg>
              </span>
              <br />
              everyone else does.
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover trending content ideas powered by real discussions across{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium text-charcoal">Reddit</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-orange-200/50 -z-0" />
              </span>,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium text-charcoal">blogs</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200/50 -z-0" />
              </span>,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium text-charcoal">forums</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-purple-200/50 -z-0" />
              </span>, and the web.
            </p>
            
            <button className="group px-8 py-4 bg-charcoal text-cream rounded-full font-medium text-lg hover:bg-charcoal-light transition-all duration-200 hover:scale-105 hover:shadow-xl relative overflow-hidden">
              <span className="relative z-10">Find trends now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 to-orange-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
            
            <p className="mt-4 text-sm text-text-muted">
              No credit card required
            </p>
          </div>
        </section>

        {/* Draggable Floating Cards Section */}
        <section className="py-20 px-6 lg:px-12 relative">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-text-muted text-sm mb-4">
              Drag the cards to explore
            </p>
            <div 
              ref={containerRef}
              className="relative h-[500px] w-full select-none"
            >
              {/* Card 1 - Trending Topic */}
              <div 
                className="absolute left-[5%] top-[5%] card-soft rounded-2xl p-5 w-72 cursor-grab active:cursor-grabbing hover:shadow-2xl transition-shadow duration-150"
                style={{
                  transform: `translate(${cards[0].x}px, ${cards[0].y}px) rotate(${cards[0].rotation}deg)`,
                  zIndex: draggingIndex === 0 ? 50 : 10,
                  transition: draggingIndex === 0 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseDown={(e) => handleCardMouseDown(0, e)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-lg">
                    🔥
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">AI Tools</div>
                    <div className="text-xs text-text-muted">Trending now</div>
                  </div>
                </div>
                <div className="text-sm text-text-secondary leading-relaxed">
                  "ChatGPT alternatives gaining traction in developer communities..."
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-orange-soft rounded-full text-orange-700 font-bold">+234%</span>
                  <span className="text-xs text-text-muted">Last 7 days</span>
                </div>
              </div>

              {/* Card 2 - Analytics */}
              <div 
                className="absolute right-[10%] top-[10%] card-soft rounded-2xl p-5 w-60 cursor-grab active:cursor-grabbing hover:shadow-2xl transition-shadow duration-150"
                style={{
                  transform: `translate(${cards[1].x}px, ${cards[1].y}px) rotate(${cards[1].rotation}deg)`,
                  zIndex: draggingIndex === 1 ? 50 : 20,
                  transition: draggingIndex === 1 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseDown={(e) => handleCardMouseDown(1, e)}
              >
                <div className="text-xs text-text-muted mb-2">Engagement Score</div>
                <div className="text-3xl font-bold text-charcoal mb-3">8.4/10</div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-blue rounded-full" />
                </div>
                <div className="mt-3 text-xs text-text-secondary">
                  High discussion velocity
                </div>
              </div>

              {/* Card 3 - New Topic */}
              <div 
                className="absolute left-[20%] top-[50%] card-soft rounded-2xl p-5 w-64 cursor-grab active:cursor-grabbing hover:shadow-2xl transition-shadow duration-150"
                style={{
                  transform: `translate(${cards[2].x}px, ${cards[2].y}px) rotate(${cards[2].rotation}deg)`,
                  zIndex: draggingIndex === 2 ? 50 : 30,
                  transition: draggingIndex === 2 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseDown={(e) => handleCardMouseDown(2, e)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center text-sm">
                    💡
                  </div>
                  <span className="text-sm font-semibold text-charcoal">New insight</span>
                </div>
                <div className="text-sm text-text-secondary leading-relaxed">
                  "Developers are discussing local LLMs more than cloud-based solutions"
                </div>
              </div>

              {/* Card 4 - Chart */}
              <div 
                className="absolute right-[15%] top-[55%] card-soft rounded-2xl p-5 w-56 cursor-grab active:cursor-grabbing hover:shadow-2xl transition-shadow duration-150"
                style={{
                  transform: `translate(${cards[3].x}px, ${cards[3].y}px) rotate(${cards[3].rotation}deg)`,
                  zIndex: draggingIndex === 3 ? 50 : 40,
                  transition: draggingIndex === 3 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseDown={(e) => handleCardMouseDown(3, e)}
              >
                <div className="text-xs text-text-muted mb-3">Trend Velocity</div>
                <div className="flex items-end gap-1.5 h-20">
                  {[40, 55, 45, 70, 85, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-amber-400 to-orange-400 rounded-t transition-all duration-150"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Grid */}
        <section className="py-16 px-6 lg:px-12 border-y border-black/5">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-text-muted text-sm mb-8">
              Trusted by content creators at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
              {['Notion', 'Figma', 'Stripe', 'Vercel', 'Linear', 'Discord', 'Slack', 'GitHub'].map((logo) => (
                <div 
                  key={logo} 
                  className="text-xl font-bold text-charcoal hover:opacity-100 hover:scale-110 transition-all duration-150 cursor-pointer"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                Spot trends before they{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">blow up</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 150 8" preserveAspectRatio="none">
                    <path 
                      d="M0,4 Q37.5,0 75,4 T150,4" 
                      fill="none" 
                      stroke="#3B82F6" 
                      strokeWidth="3"
                      className="opacity-50"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                We analyze millions of conversations to surface what's about to go viral in your niche.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🔎',
                  gradient: 'icon-gradient-1',
                  title: 'Scan the web',
                  description: 'We monitor Reddit, blogs, forums, and news sites to detect emerging conversations in real-time.',
                },
                {
                  icon: '📊',
                  gradient: 'icon-gradient-2',
                  title: 'Detect patterns',
                  description: 'Our AI identifies recurring themes, debates, and viral moments as they start gaining traction.',
                },
                {
                  icon: '💡',
                  gradient: 'icon-gradient-3',
                  title: 'Generate ideas',
                  description: 'Turn trend data into ready-to-post content ideas for threads, reels, blogs, and videos.',
                },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="text-center group cursor-pointer"
                >
                  <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 transition-all duration-150 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif text-charcoal mb-3 transition-colors duration-150 group-hover:text-charcoal-light">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 lg:px-12 bg-warm-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                How Scyra{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">works</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" preserveAspectRatio="none">
                    <path 
                      d="M0,4 Q30,0 60,4 T120,4" 
                      fill="none" 
                      stroke="#8B5CF6" 
                      strokeWidth="3"
                      className="opacity-50"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-text-secondary">
                Three simple steps to never run out of content ideas again.
              </p>
            </div>

            <div className="space-y-24">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-charcoal text-white font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-3xl font-serif text-charcoal mb-4">
                    Enter your{' '}
                    <span className="underline decoration-amber-400 decoration-4 underline-offset-4">niche</span>
                  </h3>
                  <p className="text-text-secondary text-lg mb-6">
                    Tell us what you create content about. AI tools? Fitness? Personal finance? 
                    We'll start monitoring conversations in your space.
                  </p>
                  <div className="card-soft rounded-2xl p-4 inline-block hover:shadow-lg transition-shadow duration-150">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-amber-soft rounded-full text-sm text-amber-800 font-medium">AI Tools</span>
                      <span className="px-3 py-1.5 bg-blue-soft rounded-full text-sm text-blue-800 hover:bg-blue-100 cursor-pointer transition-colors duration-150">+ Add more</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="card-soft rounded-3xl p-6 glow-amber hover:shadow-2xl transition-shadow duration-150">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-charcoal">Your niches</span>
                        <span className="text-xs text-text-muted">3 active</span>
                      </div>
                      {['AI Tools', 'No-Code', 'Productivity'].map((niche) => (
                        <div 
                          key={niche} 
                          className="flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-150 cursor-pointer group"
                        >
                          <span className="text-charcoal transition-transform duration-150 group-hover:translate-x-1">{niche}</span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="card-soft rounded-3xl p-6 glow-blue hover:shadow-2xl transition-shadow duration-150">
                    <div className="space-y-3">
                      <div className="text-sm text-text-muted mb-4">Trending in AI Tools</div>
                      {[
                        { topic: 'Local LLMs vs Cloud', growth: '+156%', hot: true },
                        { topic: 'AI Coding Assistants', growth: '+89%', hot: false },
                        { topic: 'Prompt Engineering Tips', growth: '+234%', hot: true },
                      ].map((trend, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white/90 transition-all duration-150 cursor-pointer group hover:translate-x-1"
                        >
                          <div className="flex items-center gap-3">
                            {trend.hot && <span className="text-lg">🔥</span>}
                            <span className="text-charcoal font-medium">{trend.topic}</span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">{trend.growth}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-charcoal text-white font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-3xl font-serif text-charcoal mb-4">
                    Get weekly{' '}
                    <span className="underline decoration-blue-400 decoration-4 underline-offset-4">trend reports</span>
                  </h3>
                  <p className="text-text-secondary text-lg mb-6">
                    Every week, we surface the hottest conversations in your niche with 
                    engagement metrics and velocity scores.
                  </p>
                  <ul className="space-y-3 text-text-secondary">
                    {[
                      'Rising discussions ranked by momentum',
                      'Sentiment analysis included',
                      'Source links to original discussions',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 group cursor-pointer">
                        <span className="text-green-500 transition-transform duration-150 group-hover:scale-125">✓</span>
                        <span className="transition-colors duration-150 group-hover:text-charcoal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-charcoal text-white font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-3xl font-serif text-charcoal mb-4">
                    Create with{' '}
                    <span className="underline decoration-purple-400 decoration-4 underline-offset-4">confidence</span>
                  </h3>
                  <p className="text-text-secondary text-lg mb-6">
                    Use our AI to turn trend insights into ready-to-post content ideas. 
                    Hooks, angles, and full scripts — all aligned with what's trending now.
                  </p>
                  <button className="group px-6 py-3 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal-light transition-all duration-150 hover:scale-105 relative overflow-hidden">
                    <span className="relative z-10">See example outputs</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  </button>
                </div>
                <div className="order-1 md:order-2">
                  <div className="card-soft rounded-3xl p-6 hover:shadow-2xl transition-shadow duration-150">
                    <div className="text-sm text-text-muted mb-4">Generated content ideas</div>
                    <div className="space-y-3">
                      {[
                        'Thread: "Why I switched from ChatGPT to local LLMs (and you should too)"',
                        'Reel: "3 AI tools that actually save me 2 hours daily"',
                        'Blog: "The future of coding: AI assistants vs traditional IDEs"',
                      ].map((idea, i) => (
                        <div 
                          key={i} 
                          className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-all duration-150 cursor-pointer group hover:translate-x-1"
                        >
                          <p className="text-sm text-charcoal transition-colors duration-150 group-hover:text-charcoal-light">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal text-center mb-16">
              Creators are catching trends{' '}
              <span className="relative inline-block">
                <span className="relative z-10">faster</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" preserveAspectRatio="none">
                  <path 
                    d="M0,4 Q30,0 60,4 T120,4" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="3"
                    className="opacity-50"
                  />
                </svg>
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I stopped guessing what to post. This literally shows me what people are already arguing about.",
                  author: 'Arjun S.',
                  role: 'Indie Hacker',
                  initial: 'A',
                  color: 'bg-gradient-orange',
                },
                {
                  quote: "Saved me 2–3 hours of research every week. I just check my trend report and I know what to create.",
                  author: 'Neha K.',
                  role: 'Content Creator',
                  initial: 'N',
                  color: 'bg-gradient-blue',
                },
                {
                  quote: "The trend explanations are the best part. It actually tells you why something is hot right now.",
                  author: 'Marcus D.',
                  role: 'Growth Marketer',
                  initial: 'M',
                  color: 'bg-gradient-purple',
                },
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="card-soft rounded-3xl p-8 hover:shadow-xl transition-all duration-150 group cursor-pointer hover:-translate-y-1"
                >
                  <p className="text-charcoal text-lg mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold transition-transform duration-150 group-hover:scale-110`}>
                      {testimonial.initial}
                    </div>
                    <div>
                      <div className="font-semibold text-charcoal">{testimonial.author}</div>
                      <div className="text-sm text-text-muted">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 lg:px-12 bg-warm-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
                Simple{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">pricing</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" preserveAspectRatio="none">
                    <path 
                      d="M0,4 Q30,0 60,4 T120,4" 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="3"
                      className="opacity-50"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-text-secondary">
                Start free. Upgrade when you're ready.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  id: 'free',
                  name: 'Free',
                  price: '$0',
                  period: '/month',
                  description: 'Perfect for trying it out',
                  features: ['5 trend scans (lifetime)', 'Basic trend clustering'],
                  cta: 'Get started',
                  popular: false,
                },
                {
                  id: 'pro',
                  name: 'Pro',
                  price: '$12',
                  period: '/month',
                  description: 'For serious creators',
                  features: ['50 trend scans/month', 'Auto-renews monthly', 'Advanced AI insights', 'Weekly trend reports', 'Content idea generator', 'Priority support'],
                  cta: 'Upgrade to Pro',
                  popular: true,
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`card-soft rounded-3xl p-8 relative group hover:shadow-2xl transition-all duration-150 hover:-translate-y-1 ${
                    plan.popular ? 'ring-2 ring-charcoal scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-charcoal text-white text-sm font-medium rounded-full">
                      Most popular
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-charcoal mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-charcoal">{plan.price}</span>
                    <span className="text-text-muted">/{plan.period}</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-text-secondary transition-colors duration-150 group-hover:text-charcoal-light">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full py-3 rounded-full font-medium transition-all duration-150 hover:scale-105 ${
                      plan.popular
                        ? 'bg-charcoal text-white hover:bg-charcoal-light hover:shadow-lg'
                        : 'bg-charcoal/10 text-charcoal hover:bg-charcoal/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal text-center mb-16">
              Frequently asked{' '}
              <span className="relative inline-block">
                <span className="relative z-10">questions</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path 
                    d="M0,4 Q50,0 100,4 T200,4" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="3"
                    className="opacity-50"
                  />
                </svg>
              </span>
            </h2>
            <FAQ />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-warm rounded-3xl p-12 md:p-16 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-150" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                  Start spotting trends{' '}
                  <span className="underline decoration-white/50 decoration-4 underline-offset-4">today</span>
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Join thousands of creators who never run out of content ideas.
                </p>
                <button className="px-8 py-4 bg-white text-charcoal rounded-full font-medium text-lg hover:shadow-2xl transition-all duration-150 hover:scale-105">
                  Get started for free
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 lg:px-12 border-t border-black/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <div className="text-2xl font-black text-charcoal mb-4 hover:scale-105 transition-transform duration-150 inline-block cursor-pointer tracking-widest" style={{ letterSpacing: '0.15em' }}>
                  SCYRA
                </div>
                <p className="text-text-secondary max-w-sm">
                  Discover trending content ideas powered by real discussions across the web.
                </p>
              </div>
              <div>
                <div className="font-semibold text-charcoal mb-4">Product</div>
                <ul className="space-y-3">
                  {['Features', 'Pricing', 'API'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-text-secondary hover:text-charcoal transition-colors duration-150 hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-charcoal mb-4">Company</div>
                <ul className="space-y-3">
                  {['About', 'Blog', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-text-secondary hover:text-charcoal transition-colors duration-150 hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-text-muted text-sm">
                © {new Date().getFullYear()} Scyra. All rights reserved.
              </p>
              <div className="flex gap-6">
                {['Privacy', 'Terms'].map((item) => (
                  <a key={item} href="#" className="text-text-muted hover:text-charcoal transition-colors duration-150 text-sm hover:underline">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
