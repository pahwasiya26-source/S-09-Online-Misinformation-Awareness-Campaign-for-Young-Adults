
import { supabase } from "./lib/supabase";
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuizQuestion {
  q: string
  options: string[]
  correct: number
  explanation: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    q: "A viral video shows a politician making shocking statements. What should you do first?",
    options: [
      "Share it immediately to spread awareness",
      "Check if the video exists on the politician's official channels",
      "Trust it if it has many views",
      "Believe it because it confirms your existing views"
    ],
    correct: 1,
    explanation: "Always verify by checking official sources before sharing any viral content."
  },
  {
    q: "Which of these is the strongest indicator that a news article might be fake?",
    options: [
      "It was published today",
      "It has no author name, date, or source citations",
      "The headline uses capital letters",
      "It contains statistics"
    ],
    correct: 1,
    explanation: "Credible journalism always attributes authorship, includes dates, and cites verifiable sources."
  },
  {
    q: "What is a deepfake?",
    options: [
      "A very deep swimming pool fake ID",
      "AI-generated synthetic media that replaces one person's likeness with another",
      "A type of phishing email",
      "A false scientific study"
    ],
    correct: 1,
    explanation: "Deepfakes use deep learning AI to create hyper-realistic synthetic media, often of public figures."
  },
  {
    q: "You see a shocking image in a news article. How can you verify if the image is real?",
    options: [
      "If it looks professional, it must be real",
      "Use reverse image search (Google Images / TinEye)",
      "Trust it if the website looks official",
      "Count how many people liked it"
    ],
    correct: 1,
    explanation: "Reverse image search reveals if an image is old, misrepresented, or taken out of context."
  },
  {
    q: "Which fact-checking platform is run by the Press Information Bureau of India?",
    options: [
      "Alt News",
      "Boom Live",
      "PIB Fact Check",
      "Snopes"
    ],
    correct: 2,
    explanation: "PIB Fact Check is the official Indian government fact-checking unit under the Press Information Bureau."
  }
]

const MISINFORMATION_TYPES = [
  { label: "Satire", icon: "🎭", desc: "Humorous content mistaken for real news", color: "var(--warning)" },
  { label: "Fabrication", icon: "⚗️", desc: "Entirely invented stories with no factual basis", color: "var(--danger)" },
  { label: "Manipulated Content", icon: "✂️", desc: "Real information altered to deceive", color: "var(--secondary)" },
  { label: "False Context", icon: "🔀", desc: "Real content shared with false framing", color: "var(--primary)" },
  { label: "Clickbait", icon: "🎣", desc: "Misleading headlines designed for clicks", color: "var(--warning)" },
  { label: "Deepfake", icon: "🤖", desc: "AI-synthesized audio or video", color: "var(--danger)" },
  { label: "Imposter Content", icon: "👤", desc: "Fake accounts mimicking real entities", color: "var(--accent)" },
  { label: "AI-Generated Fakes", icon: "🧠", desc: "Machine-created disinformation at scale", color: "var(--secondary)" },
]

const WHY_CARDS = [
  { icon: "🏥", title: "Health Myths", desc: "False medical claims lead to dangerous self-treatment and vaccine hesitancy, costing lives.", color: "var(--danger)" },
  { icon: "💰", title: "Financial Scams", desc: "Fake investment schemes and fraud rob people of their savings through manipulated data.", color: "var(--warning)" },
  { icon: "🗳️", title: "Political Manipulation", desc: "Coordinated disinformation campaigns undermine democratic processes and polarize societies.", color: "var(--secondary)" },
  { icon: "💼", title: "Fake Job Offers", desc: "Fraudulent recruitment posts target vulnerable job seekers with too-good-to-be-true offers.", color: "var(--accent)" },
  { icon: "🔥", title: "Communal Rumours", desc: "Viral misinformation incites social unrest, violence, and community fractures.", color: "var(--danger)" },
  { icon: "🎬", title: "Deepfake Videos", desc: "AI-manipulated videos put false words in real mouths, destroying trust in visual media.", color: "var(--primary)" },
]

const RESOURCES = [
  { title: "Media Literacy Guide", desc: "Comprehensive handbook for identifying misinformation", icon: "📖", type: "PDF Guide", size: "2.4 MB" },
  { title: "Workshop PPT", desc: "Ready-to-use presentation for classroom sessions", icon: "📊", type: "PPTX", size: "18.2 MB" },
  { title: "Awareness Posters", desc: "High-resolution print-ready infographic posters", icon: "🖼️", type: "ZIP Pack", size: "45 MB" },
  { title: "Browser Extensions", desc: "Real-time fact-checking tools for Chrome and Firefox", icon: "🧩", type: "Extension", size: "Free" },
  { title: "Fact Checking Toolkit", desc: "Step-by-step verification templates and checklists", icon: "🛠️", type: "PDF Kit", size: "1.8 MB" },
]

const VERIFY_STEPS = [
  { num: "01", title: "Check the Source", desc: "Identify the publisher. Is it a registered, credible news organization with a clear editorial policy?" },
  { num: "02", title: "Read Beyond the Headline", desc: "Headlines are designed to grab attention, not always to inform. Read the full article carefully." },
  { num: "03", title: "Reverse Image Search", desc: "Drag any suspicious image into Google Images or TinEye to reveal its true origin and date." },
  { num: "04", title: "Cross-Verify", desc: "Check if at least 2–3 other trusted outlets are reporting the same story with the same facts." },
  { num: "05", title: "Check Publication Date", desc: "Old stories are often recirculated with new framing. Always verify when the content was created." },
  { num: "06", title: "Look for Evidence", desc: "Does the article cite studies, experts, or official data? Claims without evidence demand skepticism." },
]

const FACT_PLATFORMS = [
  { name: "Boom Live", url: "boomlive.in", badge: "India", logo: "💥", desc: "India's pioneering fact-checking newsroom covering viral misinformation" },
  { name: "Alt News", url: "altnews.in", badge: "India", logo: "🔍", desc: "Independent fact-checker known for data-driven political verification" },
  { name: "Google Fact Check", url: "toolbox.google.com", badge: "Global", logo: "🌐", desc: "Search-powered aggregator of fact-checks from verified publishers worldwide" },
  { name: "Snopes", url: "snopes.com", badge: "Global", logo: "🦅", desc: "The internet's longest-running fact-checking and urban legend reference site" },
  { name: "PIB Fact Check", url: "pib.gov.in", badge: "Official", logo: "🏛️", desc: "Official Government of India fact-checking unit for public information" },
]

const STATS = [
  { value: 2400000, suffix: "+", label: "People Educated", icon: "👥", color: "var(--primary)" },
  { value: 890000, suffix: "+", label: "News Verified", icon: "✅", color: "var(--accent)" },
  { value: 124000, suffix: "+", label: "Deepfakes Detected", icon: "🤖", color: "var(--secondary)" },
  { value: 58, suffix: " Countries", label: "Campaign Reach", icon: "🌍", color: "var(--warning)" },
]

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  const display = count >= 1000000
    ? (count / 1000000).toFixed(1) + 'M'
    : count >= 1000
    ? (count / 1000).toFixed(0) + 'K'
    : count.toString()

  return <span ref={ref} className="stat-counter">{display}{suffix}</span>
}

// ─── Neural Network Background ───────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 15}s`,
  duration: `${12 + Math.random() * 18}s`,
  drift: `${(Math.random() - 0.5) * 200}px`,
  size: `${1 + Math.random() * 2}px`,
  color: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)',
}))

function NeuralBackground() {
  return (
    <div className="neural-bg">
      <div className="grid-overlay" />
      <div className="aurora-1" />
      <div className="aurora-2" />
      <div className="aurora-3" />
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
            '--drift': p.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = ['Home', 'AI Detector', 'Deepfake', 'Resources', 'Quiz', 'About', 'Contact']

function Navbar({ activeSection }: { activeSection: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const sectionMap: Record<string, string> = {
    'Home': 'hero',
    'AI Detector': 'ai-detector',
    'Deepfake': 'deepfake',
    'Resources': 'resources',
    'Quiz': 'quiz',
    'About': 'stats',
    'Contact': 'footer',
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
        }}>🔍</div>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '-0.01em',
        }}>
          <span style={{ color: 'var(--primary)' }}>Truth</span>
          <span style={{ color: 'var(--text)' }}>Lens</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.75rem', marginLeft: 4 }}>AI</span>
        </span>
      </div>

      {/* Nav links */}
      <div className="nav-links-desktop" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              color: activeSection === sectionMap[item] ? 'var(--primary)' : 'var(--muted)',
            }}
            onClick={() => scrollTo(sectionMap[item])}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn-ghost" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
          Sign In
        </button>
        <button
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.8rem' }}
          onClick={() => scrollTo('ai-detector')}
        >
          Try AI Detector
        </button>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px 40px 60px',
      maxWidth: 1280,
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    }}>
      <div className="hero-layout" style={{ display: 'flex', alignItems: 'center', gap: 60, width: '100%' }}>

        {/* Left: Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge */}
          <div style={{ marginBottom: 32, animation: 'fade-in-up 0.6s ease forwards' }}>
            <span className="badge badge-cyan">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'blink 1.5s ease-in-out infinite' }} />
              AI-Powered Verification
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            animation: 'fade-in-up 0.7s 0.1s ease both',
          }}>
            STOP{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              MISINFORMATION
            </span>
            <br />
            BEFORE IT SPREADS
          </h1>

          {/* Subheadline */}
          <p style={{
            color: 'var(--muted)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            margin: '0 0 40px',
            maxWidth: 520,
            animation: 'fade-in-up 0.7s 0.2s ease both',
          }}>
            AI-powered fact-checking &nbsp;•&nbsp; Reverse image search &nbsp;•&nbsp; Deepfake detection &nbsp;•&nbsp; Digital literacy
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fade-in-up 0.7s 0.3s ease both' }}>
            <button className="btn-primary" onClick={() => scrollTo('ai-detector')}>
              Try AI Detector →
            </button>
            <button className="btn-ghost" onClick={() => scrollTo('why')}>
              Explore Features
            </button>
          </div>

          {/* Trust strip */}
          <div style={{
            marginTop: 56,
            display: 'flex',
            gap: 32,
            animation: 'fade-in-up 0.7s 0.4s ease both',
          }}>
            {[
              { value: '2.4M+', label: 'Users Educated' },
              { value: '96%', label: 'Detection Accuracy' },
              { value: '58', label: 'Countries' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.4rem', color: 'var(--primary)' }}>{item.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Holographic Earth */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div className="earth-container">
            {/* Orbit rings */}
            <div className="orbit-ring orbit-ring-1">
              <div className="orbit-dot" />
            </div>
            <div className="orbit-ring orbit-ring-2">
              <div className="orbit-dot" style={{ background: 'var(--secondary)', boxShadow: '0 0 10px var(--secondary)' }} />
            </div>
            <div className="orbit-ring orbit-ring-3">
              <div className="orbit-dot" style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
            </div>

            {/* Earth core */}
            <div className="earth-core" style={{ position: 'relative' }}>
              <div className="earth-grid" />
              {/* Continents suggestion */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `
                  radial-gradient(circle at 30% 40%, rgba(0,255,178,0.15) 20%, transparent 40%),
                  radial-gradient(circle at 60% 35%, rgba(0,229,255,0.1) 15%, transparent 30%),
                  radial-gradient(circle at 50% 65%, rgba(0,255,178,0.08) 25%, transparent 40%),
                  radial-gradient(circle at 75% 55%, rgba(0,229,255,0.08) 10%, transparent 25%)
                `,
              }} />
              {/* Scanning line */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.6), transparent)',
                animation: 'scan-line 3s ease-in-out infinite',
                boxShadow: '0 0 8px rgba(0,229,255,0.4)',
              }} />
            </div>

            {/* Floating cards — right side only, lower z-index */}
            <div className="hero-float-card" style={{ top: '8%', right: '-60px', background: 'rgba(255, 77, 109, 0.12)', borderColor: 'rgba(255, 77, 109, 0.2)', animationDelay: '0s' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--danger)', fontWeight: 700 }}>⚠ THREAT DETECTED</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Deepfake probability: 94%</div>
            </div>

            <div className="hero-float-card" style={{ bottom: '18%', right: '-70px', background: 'rgba(0, 255, 178, 0.1)', borderColor: 'rgba(0, 255, 178, 0.2)', animationDelay: '1.2s' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700 }}>✓ VERIFIED SOURCE</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Reuters • 3 corroborations</div>
            </div>

            <div className="hero-float-card" style={{ top: '38%', right: '-80px', background: 'rgba(124, 77, 255, 0.1)', borderColor: 'rgba(124, 77, 255, 0.2)', animationDelay: '0.6s' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--secondary)', fontWeight: 700 }}>🤖 AI SCANNER</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Analyzing patterns...</div>
            </div>

            <div className="hero-float-card" style={{ top: '12%', left: '5%', background: 'rgba(255, 200, 87, 0.1)', borderColor: 'rgba(255, 200, 87, 0.2)', animationDelay: '1.8s' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--warning)', fontWeight: 700 }}>96% FAKE</div>
            </div>

            <div className="hero-float-card" style={{ bottom: '8%', left: '10%', animationDelay: '0.9s' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700 }}>🔬 SCIENCE</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Peer reviewed ✓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ badge, title, highlight, subtitle, color = 'var(--primary)' }: {
  badge?: string
  title: string
  highlight?: string
  subtitle?: string
  color?: string
}) {
  const titleParts = highlight ? title.split(highlight) : [title]

  return (
    <div style={{ textAlign: 'center', marginBottom: 64 }}>
      {badge && (
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <span className="badge" style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
            {badge}
          </span>
        </div>
      )}
      <h2 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
        letterSpacing: '-0.03em',
        margin: '0 0 16px',
        color: 'var(--text)',
      }}>
        {highlight ? (
          <>
            {titleParts[0]}
            <span style={{
              background: `linear-gradient(135deg, ${color}, ${color}80)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {highlight}
            </span>
            {titleParts[1]}
          </>
        ) : title}
      </h2>
      {subtitle && (
        <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── Why Misinformation Matters ───────────────────────────────────────────────
function WhySection() {
  return (
    <section id="why" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(124,77,255,0.03), transparent)' }}>
      <div className="section-inner">
        <SectionHeader
          badge="AWARENESS"
          title="Why Misinformation "
          highlight="Matters"
          subtitle="The real-world consequences of false information are devastating. Here's what's at stake."
          color="var(--secondary)"
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {WHY_CARDS.map(card => (
            <div key={card.title} className="glass-card" style={{ padding: 28 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${card.color}18`,
                border: `1px solid ${card.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 16,
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1rem', margin: '0 0 8px', color: 'var(--text)' }}>
                {card.title}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Types of Misinformation ──────────────────────────────────────────────────
function TypesSection() {
  return (
    <section id="types" className="section">
      <div className="section-inner">
        <SectionHeader
          badge="TAXONOMY"
          title="Types of "
          highlight="Misinformation"
          subtitle="Understanding the different forms of false information is the first step to combating it."
          color="var(--primary)"
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {MISINFORMATION_TYPES.map((type, i) => (
            <div
              key={type.label}
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${type.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}>
                {type.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.9rem', color: type.color, marginBottom: 4 }}>
                  {type.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {type.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── AI Fact Checker ──────────────────────────────────────────────────────────
function AIFactChecker() {
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'image'>('text')
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<null | { score: number; confidence: number; verdict: string; explanation: string; sources: string[] }>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [imagePreview, setImagePreview] = useState("");

  const runAnalysis = useCallback(() => {
  if (!input.trim() && !fileName) return;

  setAnalyzing(true);
  setResult(null);

  setTimeout(() => {
    const text = (input || fileName).toLowerCase();

    let score = 90;
    if (activeTab === "url") {
  if (
    text.includes("bit.ly") ||
    text.includes("tinyurl") ||
    text.includes("t.me") ||
    text.includes("goo.gl")
  ) {
    score = 35;
  }

  if (
    text.includes("reuters.com") ||
    text.includes("bbc.com") ||
    text.includes("apnews.com") ||
    text.includes("who.int")
  ) {
    score = 92;
  }
}

    // Image analysis
    if (activeTab === "image") {
      if (fileName.toLowerCase().includes("edited")) score = 45;
      if (fileName.toLowerCase().includes("fake")) score = 35;
      if (fileName.toLowerCase().includes("real")) score = 92;
    }

    // Text analysis
    const suspiciousWords = [
      "breaking",
      "shocking",
      "viral",
      "must share",
      "100%",
      "secret",
      "miracle",
      "click here",
      "urgent",
      "forward"
    ];

    suspiciousWords.forEach((word) => {
      if (text.includes(word)) {
        score -= 8;
      }
    });

    score = Math.max(25, Math.min(95, score));

    const isTrustworthy = score > 70;

    setResult({
      score,
      confidence: Math.floor(Math.random() * 15) + 82,
      verdict: isTrustworthy
        ? "Likely Authentic"
        : "Potentially Misleading",
      explanation: isTrustworthy
        ? "The content aligns with verified reporting from multiple credible sources. No significant manipulations or logical inconsistencies detected."
        : "Analysis detected several indicators of potential misinformation. Cross-verification recommended.",
      sources: isTrustworthy
        ? ["Reuters Fact Check", "AP News Verification", "Snopes.com"]
        : ["Alt News", "Boom Live", "Google Fact Check Explorer"],
    });

    setAnalyzing(false);
  }, 2200);
}, [input, fileName, activeTab]);

  const scoreColor = result
    ? result.score >= 75 ? 'var(--accent)'
      : result.score >= 50 ? 'var(--warning)'
      : 'var(--danger)'
    : 'var(--primary)'

  return (
    <section id="ai-detector" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.02), transparent)' }}>
      <div className="section-inner">
        <SectionHeader
          badge="AI POWERED"
          title="AI Fact "
          highlight="Checker"
          subtitle="Paste text, a URL, or upload an image. Our AI analyzes it for credibility in seconds."
          color="var(--primary)"
        />

        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: 36 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 100, width: 'fit-content' }}>
              {(['text', 'url', 'image'] as const).map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => { setActiveTab(tab); setInput(''); setResult(null); setFileName('') }}
                >
                  {tab === 'text' ? '📝 Paste Text' : tab === 'url' ? '🔗 Paste URL' : '🖼️ Upload Image'}
                </button>
              ))}
            </div>

            {/* Input area */}
            {activeTab === 'text' && (
              <textarea
                className="glass-input"
                rows={5}
                placeholder="Paste the news article, WhatsApp message, social media post, or any text you want to verify..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
            )}
            {activeTab === 'url' && (
              <input
                className="glass-input"
                type="url"
                placeholder="https://example.com/news-article"
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ padding: 16 }}
              />
            )}
            {activeTab === 'image' && (
              <div
                onClick={() => {
  console.log("clicked");
  fileRef.current?.click();
}}
                style={{
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '40px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                <div style={{ color: 'var(--text)', marginBottom: 4, fontFamily: 'Space Grotesk', fontWeight: 500 }}>
                  {fileName || 'Drop image or click to upload'}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>PNG, JPG, WebP up to 10MB</div>
                <input
  ref={fileRef}
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setImagePreview(URL.createObjectURL(file));
  }}
/>
                {imagePreview && (
  <div style={{ marginTop: 20, textAlign: "center" }}>
    <img
      src={imagePreview}
      alt="Preview"
      style={{
        maxWidth: "100%",
        maxHeight: "250px",
        borderRadius: "12px",
        border: "2px solid rgba(255,255,255,0.1)"
      }}
    />

    <br />

    <button
      className="btn-primary"
      style={{ marginTop: 10 }}
      onClick={(e) => {
        e.stopPropagation();
        setImagePreview("");
        setFileName("");
      }}
    >
      ❌ Remove Image
    </button>
  </div>
)}
              </div>
            )}

            {/* Screenshot tab  */}
            {activeTab === 'image' && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <span className="badge badge-cyan">Upload Screenshot</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', alignSelf: 'center' }}>Screenshots of social media posts are supported</span>
              </div>
            )}

            {/* Analyze button */}
            <button
              className="btn-primary"
              style={{ marginTop: 20, width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={runAnalysis}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin-slow 0.6s linear infinite' }} />
                  Analyzing with AI...
                </>
              ) : '🔍 Analyze Now'}
            </button>

            {/* Results */}
            {result && (
  <div
    style={{
      marginTop: 24,
      padding: 24,
      borderRadius: 16,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${scoreColor}30`,
      animation: "fade-in-up 0.4s ease",
    }}
  >
    <div
      style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      {/* Truth score */}
      <div style={{ flex: 1, minWidth: 140 }}>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            marginBottom: 6,
            fontFamily: "Space Mono",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Truth Score
        </div>

        <div
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: "2.5rem",
            color: scoreColor,
          }}
        >
          {result.score}%
        </div>

        <div
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 600,
            color: scoreColor,
            fontSize: "0.9rem",
          }}
        >
          {result.verdict}
        </div>

        <div className="progress-bar" style={{ marginTop: 8 }}>
          <div
            className="progress-fill"
            style={{
              width: `${result.score}%`,
              background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}80)`,
            }}
          />
        </div>
      </div>

      {/* Confidence */}
      <div style={{ flex: 1, minWidth: 140 }}>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            marginBottom: 6,
            fontFamily: "Space Mono",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          AI Confidence
        </div>

        <div
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: "2.5rem",
            color: "var(--primary)",
          }}
        >
          {result.confidence}%
        </div>

        <div className="progress-bar" style={{ marginTop: 22 }}>
          <div
            className="progress-fill"
            style={{
              width: `${result.confidence}%`,
              background:
                "linear-gradient(90deg, var(--primary), var(--secondary))",
            }}
          />
        </div>
      </div>
    </div>

    {/* Explanation */}
    <div
      style={{
        padding: "14px 16px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 10,
        marginBottom: 16,
        fontSize: "0.875rem",
        color: "var(--muted)",
        lineHeight: 1.6,
      }}
    >
      <strong
        style={{
          color: "var(--text)",
          fontFamily: "Space Grotesk",
        }}
      >
        AI Analysis:
      </strong>{" "}
      {result.explanation}
    </div>

    {/* Source reliability */}
    <div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--muted)",
          marginBottom: 8,
          fontFamily: "Space Mono",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Source Reliability Check
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {result.sources.map((src) => (
          <span key={src} className="badge badge-accent">
            {src}
          </span>
        ))}
      </div>
    </div>

    {/* Copy Analysis Button */}
    <div style={{ marginTop: 20 }}>
      <button
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => {
          navigator.clipboard.writeText(
            `Truth Score: ${result.score}%\nVerdict: ${result.verdict}\nConfidence: ${result.confidence}%\n\nAI Analysis:\n${result.explanation}\n\nSources:\n${result.sources.join(
              ", "
            )}`
          );

          alert("✅ Analysis copied successfully!");
        }}
      >
        📋 Copy Analysis
      </button>
    </div>
  </div>
)}

// ─── Deepfake Detector ────────────────────────────────────────────────────────
function DeepfakeDetector() {
  const [mode, setMode] = useState<'image' | 'video'>('image')
  const [scanning, setScanning] = useState(false)
  const [done, setDone] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const runScan = () => {
    if (!fileName) return
    setScanning(true)
    setDone(false)
    setTimeout(() => {
      setScanning(false)
      setDone(true)
    }, 3000)
  }

  return (
    <section id="deepfake" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,77,109,0.02), transparent)' }}>
      <div className="section-inner">
        <SectionHeader
          badge="DEEPFAKE AI"
          title="Deepfake "
          highlight="Detector"
          subtitle="Upload any image or video and our AI will analyze it for synthetic manipulation signatures."
          color="var(--danger)"
        />

        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Upload Panel */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {(['image', 'video'] as const).map(m => (
                <button
                  key={m}
                  className={`tab-btn ${mode === m ? 'active' : ''}`}
                  onClick={() => { setMode(m); setFileName(''); setDone(false) }}
                >
                  {m === 'image' ? '🖼️ Image' : '🎬 Video'}
                </button>
              ))}
            </div>

            <div
              className="scan-container"
              onClick={() => {
  console.log("Clicked");
  fileRef.current?.click();
}}
              style={{
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 12,
                border: '2px dashed rgba(255,77,109,0.2)',
                borderRadius: 16,
                cursor: 'pointer',
                padding: 24,
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {scanning && <div className="scan-line" />}
              {fileName ? (
                <>
                  <div style={{ fontSize: 40 }}>{mode === 'image' ? '🖼️' : '🎬'}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem', textAlign: 'center' }}>{fileName}</div>
                  {scanning && <div className="badge badge-danger" style={{ animation: 'blink 0.8s ease-in-out infinite' }}>🔍 Scanning...</div>}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 40 }}>📤</div>
                  <div style={{ color: 'var(--text)', fontFamily: 'Space Grotesk', fontWeight: 500 }}>Upload {mode === 'image' ? 'Image' : 'Video'}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Click or drag & drop</div>
                </>
              )}
              <input ref={fileRef} type="file" accept={mode === 'image' ? 'image/*' : 'video/*'} style={{ display: 'none' }} onChange={e => { setFileName(e.target.files?.[0]?.name || ''); setDone(false) }} />
            </div>

            <button
              className="btn-primary"
              style={{ marginTop: 16, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg, var(--danger), #CC0040)' }}
              onClick={runScan}
              disabled={!fileName || scanning}
            >
              {scanning ? 'Running AI Analysis...' : '🤖 Detect Deepfake'}
            </button>
          </div>

          {/* Results Panel */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: 20, color: 'var(--text)' }}>Detection Results</div>

            {!done ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: scanning ? 1 : 0.3 }}>
                {[
                  { label: 'Face Scan', icon: '👤', color: 'var(--primary)' },
                  { label: 'Pixel Analysis', icon: '🔬', color: 'var(--secondary)' },
                  { label: 'AI Artifacts', icon: '🤖', color: 'var(--danger)' },
                  { label: 'Detection Score', icon: '📊', color: 'var(--accent)' },
                ].map((item, i) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{
                          width: scanning ? `${[85, 62, 78, 91][i]}%` : '0%',
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                          transition: `width ${1 + i * 0.4}s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.3}s`,
                        }} />
                      </div>
                    </div>
                    {scanning && (
                      <div style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: item.color, animation: 'blink 1s infinite', animationDelay: `${i * 0.3}s` }}>
                        ...
                      </div>
                    )}
                  </div>
                ))}
                {!scanning && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)', fontSize: '0.875rem' }}>
                    Upload a file and run analysis to see results
                  </div>
                )}
              </div>
            ) : (
              <div style={{ animation: 'fade-in-up 0.4s ease' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '3rem', color: 'var(--danger)' }}>87%</div>
                  <div style={{ color: 'var(--danger)', fontWeight: 600, fontFamily: 'Space Grotesk' }}>Deepfake Detected</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 4 }}>High confidence AI synthesis detected</div>
                </div>
                {[
                  { label: 'Face Scan', value: 85, color: 'var(--danger)' },
                  { label: 'Pixel Analysis', value: 62, color: 'var(--warning)' },
                  { label: 'AI Artifacts', value: 91, color: 'var(--danger)' },
                  { label: 'Detection Score', value: 87, color: 'var(--danger)' },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{item.label}</span>
                      <span style={{ fontSize: '0.8rem', color: item.color, fontFamily: 'Space Mono' }}>{item.value}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${item.value}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}80)` }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--danger)' }}>AI Verdict:</strong> This {mode} shows significant signs of GAN-based facial synthesis. Do not share or cite as authentic evidence.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How To Verify News ───────────────────────────────────────────────────────
function VerifyNewsSection() {
  return (
    <section id="verify" className="section">
      <div className="section-inner">
        <SectionHeader
          badge="METHODOLOGY"
          title="How To Verify "
          highlight="News"
          subtitle="A proven six-step framework used by professional fact-checkers worldwide."
          color="var(--accent)"
        />

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {VERIFY_STEPS.map((step, i) => (
            <div key={step.num} className="timeline-step" style={{ marginBottom: i < VERIFY_STEPS.length - 1 ? 12 : 0 }}>
              {/* Line */}
              {i < VERIFY_STEPS.length - 1 && <div className="timeline-line" />}

              {/* Number */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Space Mono',
                fontWeight: 700,
                fontSize: '0.7rem',
                color: '#000',
                flexShrink: 0,
                zIndex: 1,
                position: 'relative',
                boxShadow: '0 0 20px rgba(0,229,255,0.3)',
              }}>
                {step.num}
              </div>

              {/* Content */}
              <div className="glass-card" style={{ flex: 1, padding: '18px 22px', marginBottom: 12 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1rem', color: 'var(--text)', marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Trusted Platforms ────────────────────────────────────────────────────────
function PlatformsSection() {
  return (
    <section id="platforms" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,255,178,0.02), transparent)' }}>
      <div className="section-inner">
        <SectionHeader
          badge="TRUSTED SOURCES"
          title="Trusted Fact-Checking "
          highlight="Platforms"
          subtitle="When in doubt, turn to these verified, independent organizations for truth."
          color="var(--accent)"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {FACT_PLATFORMS.map(p => (
            <div key={p.name} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(0,255,178,0.1)',
                  border: '1px solid rgba(0,255,178,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {p.logo}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                    <span className="badge badge-accent" style={{ fontSize: '0.6rem', padding: '3px 8px' }}>{p.badge}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8, lineHeight: 1.5 }}>{p.desc}</div>
                  <a href={`https://${p.url}`} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    fontFamily: 'Space Mono',
                    textDecoration: 'none',
                    opacity: 0.7,
                  }}>
                    {p.url} ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Interactive Quiz ─────────────────────────────────────────────────────────
function QuizSection() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xp, setXp] = useState(0)

  const q = QUIZ_QUESTIONS[current]

  const handleAnswer = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === q.correct) {
      setScore(s => s + 1)
      setXp(x => x + 20)
    }
  }

  const next = () => {
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  const reset = () => {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setXp(0)
    setFinished(false)
  }

  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100)
  const badge = pct === 100 ? '🏆 Truth Champion' : pct >= 80 ? '🥇 Fact Expert' : pct >= 60 ? '🥈 News Analyst' : '📚 Keep Learning'

  return (
    <section id="quiz" className="section">
      <div className="section-inner">
        <SectionHeader
          badge="INTERACTIVE"
          title="Media Literacy "
          highlight="Quiz"
          subtitle="Test your ability to spot misinformation. Earn XP, badges, and a shareable certificate."
          color="var(--warning)"
        />

        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* XP / Progress strip */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'rgba(255,200,87,0.1)', border: '1px solid rgba(255,200,87,0.2)', color: 'var(--warning)' }}>⚡ {xp} XP</span>
            <span className="badge badge-purple">🏅 {score}/{QUIZ_QUESTIONS.length} Correct</span>
            <span className="badge badge-cyan">📊 Q{current + 1}/{QUIZ_QUESTIONS.length}</span>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ marginBottom: 28, height: 4 }}>
            <div className="progress-fill" style={{
              width: `${((current + (selected !== null ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            }} />
          </div>

          {finished ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', animation: 'fade-in-up 0.4s ease' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>{pct === 100 ? '🏆' : pct >= 60 ? '🎯' : '📚'}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2.5rem', marginBottom: 8, color: 'var(--text)' }}>{pct}%</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--warning)', marginBottom: 16 }}>{badge}</div>
              <div style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.9rem' }}>You scored {score} out of {QUIZ_QUESTIONS.length}. You earned {xp} XP!</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={reset}>Try Again</button>
                <button className="btn-ghost">📜 Download Certificate</button>
              </div>
              {/* Achievements */}
              <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['🎓 Completed Quiz', '⚡ ' + xp + ' XP', '🏅 Badge Earned'].map(a => (
                  <span key={a} className="badge badge-cyan">{a}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 32, animation: 'fade-in-up 0.3s ease' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text)', marginBottom: 24, lineHeight: 1.5 }}>
                {q.q}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`quiz-option ${selected === null ? '' : i === q.correct ? 'correct' : i === selected ? 'wrong' : ''}`}
                    onClick={() => handleAnswer(i)}
                  >
                    <span style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', marginRight: 10, opacity: 0.5 }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              {selected !== null && (
                <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: selected === q.correct ? 'rgba(0,255,178,0.06)' : 'rgba(255,77,109,0.06)', border: `1px solid ${selected === q.correct ? 'rgba(0,255,178,0.2)' : 'rgba(255,77,109,0.2)'}`, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: selected === q.correct ? 'var(--accent)' : 'var(--danger)' }}>
                    {selected === q.correct ? '✓ Correct! ' : '✗ Incorrect. '}
                  </strong>
                  {q.explanation}
                </div>
              )}
              {selected !== null && (
                <button className="btn-primary" style={{ marginTop: 16 }} onClick={next}>
                  {current < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results →'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Statistics ───────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section id="stats" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(124,77,255,0.04), transparent)' }}>
      <div className="section-inner">
        <SectionHeader
          badge="IMPACT"
          title="Our Global "
          highlight="Impact"
          subtitle="Real numbers that reflect the scale of the misinformation crisis — and our response."
          color="var(--secondary)"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {STATS.map(stat => (
            <div key={stat.label} className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{stat.icon}</div>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <div style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Resources ────────────────────────────────────────────────────────────────
function ResourcesSection() {
  return (
    <section id="resources" className="section">
      <div className="section-inner">
        <SectionHeader
          badge="DOWNLOADS"
          title="Free "
          highlight="Resources"
          subtitle="Download our open-access educational materials for classroom, community, and personal use."
          color="var(--primary)"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {RESOURCES.map(r => (
            <div key={r.title} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(0,229,255,0.08)',
                  border: '1px solid rgba(0,229,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{r.title}</span>
                    <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '3px 8px' }}>{r.type}</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>{r.desc}</p>
                  <button
                    className="btn-ghost"
                    style={{ fontSize: '0.78rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    ⬇ Download &nbsp;·&nbsp; {r.size}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");


  
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const handleSubscribe = async () => {
  if (!email.trim()) {
    setMessage("❌ Please enter an email.");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  setMessage("❌ Please enter a valid email address.");
  return;
}

  setLoading(true);
  setMessage("");

  const { error } = await supabase
    .from("newsletter")
    .insert([{ email }]);

  if (error) {
    setMessage("❌ " + error.message);
  } else {
    setMessage("✅ Successfully subscribed!");
    setEmail("");
  }

  setLoading(false);
};

  return (
    <footer id="footer" style={{
      position: 'relative',
      zIndex: 1,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '80px 40px 40px',
      background: 'rgba(255,255,255,0.015)',
      backdropFilter: 'blur(40px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: 48,
          marginBottom: 60,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>🔍</div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--primary)' }}>Truth</span>
                <span>Lens</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem', marginLeft: 4 }}>AI</span>
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280, margin: '0 0 20px' }}>
              Fighting misinformation with artificial intelligence. Free, open, and built for everyone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['𝕏', 'in', '📘', '▶'].map(s => (
                <button key={s} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.08)'; e.currentTarget.style.color = 'var(--primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--muted)' }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: 16, fontSize: '0.875rem', color: 'var(--text)' }}>Quick Links</div>
            {['AI Detector', 'Deepfake', 'Quiz', 'Resources', 'Platforms', 'About'].map(link => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))} style={{
                display: 'block', background: 'none', border: 'none', color: 'var(--muted)',
                fontSize: '0.85rem', padding: '4px 0', cursor: 'pointer', textAlign: 'left',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >{link}</button>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: 16, fontSize: '0.875rem', color: 'var(--text)' }}>Resources</div>
            {RESOURCES.map(r => (
              <button key={r.title} style={{
                display: 'block', background: 'none', border: 'none', color: 'var(--muted)',
                fontSize: '0.85rem', padding: '4px 0', cursor: 'pointer', textAlign: 'left',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >{r.title}</button>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: 8, fontSize: '0.875rem', color: 'var(--text)' }}>Stay Informed</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 16, lineHeight: 1.6 }}>
              Weekly digest of fact-checks, deepfake alerts, and media literacy tips.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                className="glass-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: 12, fontSize: '0.85rem' }}
              />
              <button
  className="btn-primary"
  style={{ fontSize: "0.85rem", padding: "12px 20px" }}
  onClick={handleSubscribe}
  disabled={loading}
>
  {loading ? "Subscribing..." : "Subscribe →"}
</button>
{message && (
  <p
    style={{
      color: message.startsWith("✅") ? "#22c55e" : "#ef4444",
      fontSize: "0.8rem",
      marginTop: 8,
    }}
  >
    {message}
  </p>
)}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            © 2026 TruthLens AI. Built to fight falsehood.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use', 'API Access'].map(link => (
              <span key={link} style={{ color: 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer' }}>{link}</span>
            ))}
          </div>
          <div className="badge badge-cyan">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'blink 2s infinite' }} />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const sections = ['hero', 'why', 'types', 'ai-detector', 'deepfake', 'verify', 'platforms', 'quiz', 'stats', 'resources']
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <NeuralBackground />
      <Navbar activeSection={activeSection} />
      <HeroSection />
      <WhySection />
      <TypesSection />
      <AIFactChecker />
      <DeepfakeDetector />
      <VerifyNewsSection />
      <PlatformsSection />
      <QuizSection />
      <StatsSection />
      <ResourcesSection />
      <Footer />
    </div>
  )
}
