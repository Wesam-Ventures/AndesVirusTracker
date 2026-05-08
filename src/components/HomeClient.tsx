'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import StatCounter from '@/components/StatCounter'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import type { OutbreakStats, OutbreakNews, OutbreakEvent } from '@/lib/getOutbreakData'

const GlobeComponent = dynamic(() => import('@/components/GlobeComponent'), { ssr: false })

// ─── DATA ────────────────────────────────────────────────────────────────────

const NEWS = [
  { source: 'WHO', tag: 'OFFICIAL', color: '#3b82f6', title: 'Multi-country cluster of Andes virus disease — Disease Outbreak Notice', date: 'May 6, 2026', url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599' },
  { source: 'CNN', tag: 'MEDIA', color: '#ef4444', title: 'Andes virus: What doctors know about how the hantavirus spreads person-to-person', date: 'May 6, 2026', url: 'https://www.cnn.com/2026/05/06/health/andes-strain-hantavirus-explained' },
  { source: 'NPR', tag: 'MEDIA', color: '#ef4444', title: 'Cruise ship hantavirus confirmed as rare type that can spread human-to-human', date: 'May 5, 2026', url: 'https://www.npr.org/2026/05/05/g-s1-120234/cruise-ship-hantavirus' },
  { source: 'NBC NEWS', tag: 'MEDIA', color: '#ef4444', title: 'US monitoring hantavirus cruise passengers as new case confirmed in Switzerland', date: 'May 6, 2026', url: 'https://www.nbcnews.com/health/health-news/us-monitoring-hantavirus-cruise-passengers-new-case-flight-attendant-rcna343990' },
  { source: 'LIVE SCIENCE', tag: 'SCIENCE', color: '#4ade80', title: 'Andes virus — the only hantavirus that can spread between people — identified on cruise ship', date: 'May 6, 2026', url: 'https://www.livescience.com/health/viruses-infections-disease/andes-virus-the-only-hantavirus-strain-that-can-spread-between-people-identified-as-culprit-on-cruise-ship' },
  { source: 'TIME', tag: 'MEDIA', color: '#ef4444', title: 'What Countries Are Linked to the Hantavirus Outbreak?', date: 'May 7, 2026', url: 'https://time.com/article/2026/05/07/countries-hantavirus-hondius-cruise-ship/' },
]

const GEAR = [
  { icon: '🫁', name: '3M P100 Half-Face Respirator', desc: 'Maximum respiratory protection against airborne particles', price: '$45–65', url: 'https://www.amazon.com/dp/B01CSPTIFW?tag=andesvirustra-20' },
  { icon: '😷', name: 'N95 Respirator Masks (50-pack)', desc: 'CDC-recommended respiratory protection, NIOSH approved', price: '$25–40', url: 'https://www.amazon.com/dp/B008MCUZZS?tag=andesvirustra-20' },
  { icon: '🥼', name: 'Tyvek Protective Coverall Suit', desc: 'Full-body barrier protection for rodent cleanup', price: '$15–25', url: 'https://www.amazon.com/dp/B07KRXXFGZ?tag=andesvirustra-20' },
  { icon: '🐭', name: 'Victor Snap Trap (12-pack)', desc: 'Eliminate rodent vectors around your home', price: '$15–20', url: 'https://www.amazon.com/dp/B0781YYN3F?tag=andesvirustra-20' },
  { icon: '🧤', name: 'Nitrile Gloves (100-pack)', desc: 'Barrier protection for cleanup operations', price: '$12–18', url: 'https://www.amazon.com/dp/B0CP7GP2KW?tag=andesvirustra-20' },
  { icon: '🧴', name: 'Lysol Disinfectant Spray (4-pack)', desc: 'EPA-registered for rodent-contaminated surfaces', price: '$20–30', url: 'https://www.amazon.com/dp/B083HL7NMC?tag=andesvirustra-20' },
]

const OTHER_OUTBREAKS = [
  { name: 'H5N1 Bird Flu',  status: 'ACTIVE',     level: 'HIGH',     levelColor: '#ef4444', countries: 'USA · Canada · Australia · Europe', summary: 'Ongoing outbreak in US dairy cattle herds with confirmed human spillover cases. WHO monitoring for pandemic potential.', who_url: 'https://www.who.int/news-room/fact-sheets/detail/influenza-(avian-and-other-zoonotic)', cases: '70+ human',         deaths: '2' },
  { name: 'Mpox (Clade I)', status: 'ACTIVE',     level: 'HIGH',     levelColor: '#ef4444', countries: 'DRC · Central Africa · Europe',     summary: 'Clade I mpox declared a Public Health Emergency of International Concern by WHO. Spreading in Democratic Republic of Congo and neighboring countries.', who_url: 'https://www.who.int/news-room/fact-sheets/detail/mpox', cases: '30,000+',           deaths: '1,000+' },
  { name: 'Marburg Virus',  status: 'MONITORING', level: 'MODERATE', levelColor: '#f59e0b', countries: 'Rwanda · Tanzania · Germany',       summary: 'Periodic outbreaks in Central and East Africa. Rwanda declared outbreak contained in late 2024. Ongoing surveillance across the region.', who_url: 'https://www.who.int/news-room/fact-sheets/detail/marburg-virus-disease', cases: '66 Rwanda 2024', deaths: '15' },
  { name: 'Dengue Fever',   status: 'ELEVATED',   level: 'MODERATE', levelColor: '#f59e0b', countries: 'Americas · SE Asia · Pacific',      summary: 'Record global dengue cases in 2024 with continued elevated transmission in 2026. Over 100 countries now endemic.', who_url: 'https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue', cases: '7.6M+ (2024)',       deaths: '3,000+' },
]

const SYMPTOMS = [
  { phase: 'Days 1–5', label: 'PRODROMAL PHASE', items: ['Fever (38–40°C)', 'Severe headache', 'Muscle pain (esp. lower back)', 'Chills, fatigue', 'Nausea / vomiting'], color: '#f59e0b' },
  { phase: 'Days 5–10', label: 'CARDIOPULMONARY PHASE', items: ['Sudden shortness of breath', 'Rapid heart rate', 'Fluid in lungs (pulmonary edema)', 'Low blood pressure', 'Oxygen levels drop rapidly'], color: '#ef4444' },
  { phase: 'Days 10+', label: 'RECOVERY OR CRITICAL', items: ['ICU admission typically required', 'Mechanical ventilation may be needed', 'Survivors improve over weeks', 'CFR approximately 40%', 'No vaccine or antiviral exists'], color: '#7f1d1d' },
]

const FAQS = [
  { q: 'Can Andes virus spread between humans?', a: 'Yes — Andes virus is the only hantavirus confirmed to spread person-to-person. Transmission requires prolonged close contact (sharing a bed, food). It does not spread through the air like COVID-19.' },
  { q: 'Is Andes virus the same as hantavirus?', a: 'Andes virus (ANDV) is a specific strain of hantavirus, uniquely dangerous because it can spread human-to-human. All other hantavirus strains only spread from infected rodents to humans.' },
  { q: 'What happened on the MV Hondius?', a: 'In April–May 2026, 8 passengers on the Antarctic cruise ship MV Hondius were confirmed infected with Andes virus. 3 died. Over 62 passengers from 23 nationalities are being actively monitored.' },
  { q: 'How deadly is Andes virus?', a: 'The case fatality rate is approximately 40%. It causes hantavirus pulmonary syndrome (HPS) with rapid respiratory failure. Early ICU admission improves outcomes significantly.' },
  { q: 'Is there a vaccine or treatment?', a: 'No approved vaccine or antiviral exists for hantavirus. Supportive ICU care is the primary treatment. Early hospitalization at first symptoms is critical.' },
]

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ExposureChecker() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ ship: false, region: false, contact: false })
  const [result, setResult] = useState<null | 'low' | 'moderate' | 'high'>(null)

  const assess = (final: typeof answers) => {
    const score = (final.ship ? 3 : 0) + (final.region ? 1 : 0) + (final.contact ? 2 : 0)
    setResult(score >= 4 ? 'high' : score >= 2 ? 'moderate' : 'low')
  }

  const RESULT_CONFIG = {
    low:      { color: '#4ade80', label: 'LOW RISK', msg: 'Based on your answers, your personal risk is low. Continue monitoring official WHO/CDC guidance.' },
    moderate: { color: '#f59e0b', label: 'MODERATE RISK', msg: 'You may have indirect exposure. Monitor for symptoms and contact your local health authority if you develop fever or breathing difficulty.' },
    high:     { color: '#ef4444', label: 'HIGH RISK — SEEK MEDICAL ADVICE', msg: 'Based on your answers, you may have been directly exposed. Contact your healthcare provider immediately and mention potential Andes virus exposure.' },
  }

  const QUESTIONS = [
    { key: 'ship', q: 'Were you aboard the MV Hondius or any vessel that docked alongside it between March–May 2026?', yes: 'Yes, I was on board', no: 'No' },
    { key: 'region', q: 'Have you visited Argentina (Patagonia/Andes region), Chile, or Cape Verde in the past 6 weeks?', yes: 'Yes', no: 'No' },
    { key: 'contact', q: 'Have you had close prolonged contact with someone who was on the MV Hondius or who has been diagnosed with hantavirus?', yes: 'Yes, close contact', no: 'No' },
  ]

  const S: React.CSSProperties = {
    background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
    borderRadius: 12, padding: '24px',
  }

  if (result) {
    const cfg = RESULT_CONFIG[result]
    return (
      <div style={S}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="font-display" style={{ fontSize: 22, color: cfg.color, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>
            {cfg.label}
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>{cfg.msg}</p>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {(['low', 'moderate', 'high'] as const).map(r => (
            <div key={r} style={{ flex: 1, height: 6, borderRadius: 3, background: result === r ? RESULT_CONFIG[r].color : 'rgba(148,163,184,0.1)', boxShadow: result === r ? `0 0 10px ${RESULT_CONFIG[r].color}80` : 'none' }} />
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599" target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, minWidth: 140, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '10px', textAlign: 'center', textDecoration: 'none' }}>
            <div className="font-mono" style={{ fontSize: 9, color: '#3b82f6', letterSpacing: 1.5, marginBottom: 3 }}>WHO GUIDANCE</div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>Official outbreak notice →</div>
          </a>
          <a href="https://www.cdc.gov/hantavirus" target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, minWidth: 140, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px', textAlign: 'center', textDecoration: 'none' }}>
            <div className="font-mono" style={{ fontSize: 9, color: '#ef4444', letterSpacing: 1.5, marginBottom: 3 }}>CDC INFO</div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>Hantavirus guidance →</div>
          </a>
          <button onClick={() => { setStep(0); setResult(null); setAnswers({ ship: false, region: false, contact: false }) }}
            style={{ flex: 1, minWidth: 140, background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px', cursor: 'pointer' }}>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 1.5, marginBottom: 3 }}>RESTART</div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>Check again</div>
          </button>
        </div>
        <p className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: 12, opacity: 0.5, textAlign: 'center' }}>
          NOT MEDICAL ADVICE · THIS TOOL IS FOR INFORMATIONAL PURPOSES ONLY
        </p>
      </div>
    )
  }

  const q = QUESTIONS[step]
  return (
    <div style={S}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? 'var(--red)' : 'rgba(148,163,184,0.15)' }} />
        ))}
      </div>
      <div className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>
        QUESTION {step + 1} OF {QUESTIONS.length}
      </div>
      <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.6, marginBottom: 20, fontWeight: 500 }}>{q.q}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ label: q.yes, val: true, color: '#ef4444' }, { label: q.no, val: false, color: '#4ade80' }].map(opt => (
          <button key={opt.label} onClick={() => {
            const next = { ...answers, [q.key]: opt.val }
            setAnswers(next)
            if (step < QUESTIONS.length - 1) setStep(s => s + 1)
            else assess(next)
          }} style={{
            flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13,
            background: `${opt.color}10`, border: `1px solid ${opt.color}40`, color: opt.color,
            fontFamily: 'DM Sans, sans-serif', transition: 'all 150ms',
          }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function IncubationCalc() {
  const [date, setDate] = useState('')
  const [result, setResult] = useState<{ earliest: string; latest: string; danger: string } | null>(null)

  const calc = () => {
    if (!date) return
    const exp = new Date(date)
    const earliest = new Date(exp); earliest.setDate(earliest.getDate() + 9)
    const latest = new Date(exp); latest.setDate(latest.getDate() + 33)
    const danger = new Date(exp); danger.setDate(danger.getDate() + 14)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setResult({ earliest: fmt(earliest), latest: fmt(latest), danger: fmt(danger) })
  }

  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '24px' }}>
      <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 16, lineHeight: 1.6 }}>
        Andes virus incubation: <strong style={{ color: 'var(--fg)' }}>9–33 days</strong> (avg. ~18 days) after exposure. Enter your potential exposure date:
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{
            flex: 1, minWidth: 160, background: 'var(--bg)', border: '1px solid var(--line-strong)',
            borderRadius: 8, padding: '10px 14px', color: 'var(--fg)', fontSize: 13,
            fontFamily: 'Space Mono, monospace', outline: 'none',
            colorScheme: 'dark',
          }} />
        <button onClick={calc} style={{
          background: 'var(--red)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700,
          fontFamily: 'Space Mono, monospace', letterSpacing: 1, cursor: 'pointer',
        }}>CALCULATE</button>
      </div>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { label: 'EARLIEST SYMPTOMS', value: result.earliest, color: '#f59e0b' },
            { label: 'PEAK DANGER WINDOW', value: result.danger, color: '#ef4444' },
            { label: 'LATEST ONSET', value: result.latest, color: '#64748b' },
          ].map(r => (
            <div key={r.label} style={{ background: 'var(--bg)', border: `1px solid ${r.color}30`, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: 8, color: r.color, letterSpacing: 1.5, marginBottom: 6 }}>{r.label}</div>
              <div style={{ fontSize: 12, color: 'var(--fg)', fontWeight: 600 }}>{r.value}</div>
            </div>
          ))}
          <div style={{ gridColumn: '1/-1' }}>
            <p className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', opacity: 0.5, textAlign: 'center', marginTop: 8 }}>
              BASED ON WHO REPORTED INCUBATION RANGE · NOT MEDICAL ADVICE
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SOCIAL SHARE ────────────────────────────────────────────────────────────

const SHARE_PAGE_URL = 'https://andesvirustracker.com'
const SHARE_TWEET_URL =
  'https://twitter.com/intent/tweet?text=Live+Andes+virus+outbreak+tracker+—+8+cases%2C+3+deaths%2C+23+countries+monitoring.+The+only+hantavirus+that+spreads+person-to-person.&url=https%3A%2F%2Fandesvirustracker.com'
const SHARE_WA_URL =
  'https://wa.me/?text=Live+Andes+virus+outbreak+tracker%3A+https%3A%2F%2Fandesvirustracker.com'

function ShareButtons() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    console.log('[ShareButtons] copy link clicked →', SHARE_PAGE_URL)
    try {
      await navigator.clipboard.writeText(SHARE_PAGE_URL)
      console.log('[ShareButtons] clipboard write OK')
      setCopied(true)
      setTimeout(() => {
        console.log('[ShareButtons] reverting COPIED state')
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('[ShareButtons] clipboard write failed', err)
    }
  }

  const pill: React.CSSProperties = {
    background: 'rgba(4,6,14,0.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(148,163,184,0.2)',
    borderRadius: 20,
    padding: '8px 14px',
    fontFamily: 'Space Mono, monospace',
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  }

  return (
    <>
      <a href={SHARE_TWEET_URL} target="_blank" rel="noopener noreferrer"
        style={{ ...pill, color: '#1DA1F2' }}>
        TWEET
      </a>
      <a href={SHARE_WA_URL} target="_blank" rel="noopener noreferrer"
        style={{ ...pill, color: '#25D366' }}>
        WHATSAPP
      </a>
      <button onClick={handleCopy}
        style={{ ...pill, color: copied ? '#4ade80' : '#94a3b8' }}>
        {copied ? 'COPIED!' : 'COPY LINK'}
      </button>
    </>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

interface Props {
  stats: OutbreakStats
  news: OutbreakNews[]
  events: OutbreakEvent[]
}

export default function Home({ stats: initialStats, news, events }: Props) {
  const [stats, setStats] = useState<OutbreakStats>(initialStats)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [subError, setSubError] = useState('')

  // Live polling — refresh stats every 5 minutes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/andes_stats?id=eq.1&select=*`,
          { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } }
        )
        if (res.ok) {
          const [row] = await res.json()
          if (row) setStats(row)
        }
      } catch { /* keep existing stats on error */ }
    }
    const id = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) { setSubError('Enter a valid email'); return }
    setSubscribing(true); setSubError('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) { setSubscribed(true) }
      else { setSubError('Something went wrong — try again') }
    } catch { setSubError('Connection error — try again') }
    finally { setSubscribing(false) }
  }

  const section = (id?: string) => ({
    id,
    style: { maxWidth: 900, margin: '64px auto 0', padding: '0 16px' } as React.CSSProperties,
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      <SiteNav />

      {/* ── BREAKING BANNER ── */}
      <div style={{ maxWidth: 900, margin: '12px auto', padding: '0 16px' }}>
        <div className="hazard-stripe" style={{ border: '1px solid rgba(239,68,68,0.3)', borderLeft: '3px solid var(--red)', borderRadius: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="font-mono blink" style={{ fontSize: 12, color: 'var(--red)', letterSpacing: 1.5, fontWeight: 700 }}>⚠ BREAKING</span>
            <span className="font-mono" style={{ fontSize: 12, color: 'var(--fg)' }}>{stats.breaking_news}</span>
          </div>
          <a href={stats.breaking_news_url} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 11, color: 'var(--red)', whiteSpace: 'nowrap', textDecoration: 'none', letterSpacing: 1, fontWeight: 700 }}>READ →</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 16px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="font-mono" style={{ fontSize: 12, color: 'var(--fg-mute)', letterSpacing: 3, marginBottom: 14 }}>OUTBREAK · DAY {stats.day_count} · WHO CONFIRMED</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(28px, 7vw, 72px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: -1, color: 'var(--fg)', marginBottom: 16 }}>
            ANDES VIRUS<br /><span style={{ color: 'var(--red)' }}>TRACKER</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fg-mute)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            The only hantavirus strain confirmed to spread person-to-person — now active across multiple continents following the MV Hondius outbreak.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 1, background: 'var(--line)' }}>
          {[
            { label: 'CONFIRMED CASES', value: stats.confirmed_cases,      color: 'var(--red)', delay: 0 },
            { label: 'DEATHS',          value: stats.deaths,               color: 'var(--red)', delay: 80 },
            { label: 'COUNTRIES',       value: stats.countries_monitoring, color: 'var(--amber)', delay: 160 },
            { label: 'EXPOSED',         value: stats.exposed_passengers,   suffix: '+', color: 'var(--amber)', delay: 240 },
          ].map(s => {
            const isRed = s.color === 'var(--red)'
            return (
            <div
              key={s.label}
              className="card-corner fade-up"
              style={{ background: 'var(--bg-1)', padding: '20px 16px', position: 'relative', animationDelay: `${s.delay}ms`, transition: 'box-shadow 200ms ease' }}
              onMouseEnter={isRed ? (e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(239,68,68,0.15)' }) : undefined}
              onMouseLeave={isRed ? (e => { e.currentTarget.style.boxShadow = 'none' }) : undefined}
            >
              <div className="font-display" style={{ fontSize: 48, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6, letterSpacing: -1 }}>
                <StatCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 1.5 }}>{s.label}</div>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', marginTop: 6, borderTop: '1px dashed var(--line-strong)', paddingTop: 6 }}>SOURCE: WHO/ECDC</div>
            </div>
          )})}
        </div>

        {/* MOBILE SHARE ROW — desktop uses fixed bar at bottom-right */}
        <div className="flex md:hidden" style={{ justifyContent: 'center', gap: 6, marginTop: 16 }}>
          <ShareButtons />
        </div>

        {/* SECONDARY ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: 'var(--line)', marginTop: 1 }}>
          {[
            { label: 'CASE FATALITY RATE', value: '~40%', color: 'var(--red)' },
            { label: 'P2P TRANSMISSION',   value: 'CONFIRMED', color: 'var(--amber)' },
            { label: 'ACTIVE VESSEL',       value: 'MV HONDIUS', color: 'var(--blue)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1.5 }}>{s.label}</span>
              <span className="font-mono" style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHO RISK LEVEL ── */}
      <div style={{ maxWidth: 900, margin: '16px auto 0', padding: '0 16px' }}>
        <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.6 } }`}</style>
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 2 }}>WHO ASSESSMENT</div>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--blue)', letterSpacing: 1, marginTop: 2 }}>OFFICIAL RISK LEVEL</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 5 }}>
              {[{ l:'LOW',c:'#4ade80'},{l:'MODERATE',c:'#f59e0b'},{l:'HIGH',c:'#ef4444'},{l:'CRITICAL',c:'#7f1d1d'}].map(lv => { const a = lv.l === stats.who_risk_level; return (
                <div key={lv.l} style={{ flex: 1, height: 6, borderRadius: 2, background: a ? lv.c : 'rgba(148,163,184,0.1)', boxShadow: a ? `0 0 8px ${lv.c}80` : 'none', animation: a ? 'pulse 2s ease-in-out infinite' : undefined }} />
              )})}

            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[{l:'LOW',a:false},{l:'MODERATE',a:true},{l:'HIGH',a:false},{l:'CRITICAL',a:false}].map((lv,i) => (
                <div key={lv.l} style={{ flex: 1 }}>
                  <span className="font-mono" style={{ fontSize: 7, letterSpacing: 1, color: i===1?'#f59e0b':'var(--fg-dim)', fontWeight: i===1?700:400 }}>{lv.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', letterSpacing: 2 }}>{stats.who_risk_level}</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, marginTop: 2 }}>P2P CONFIRMED</div>
            </div>
            <a href="https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599" target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 8, color: 'var(--blue)', letterSpacing: 1, textDecoration: 'none' }}>WHO →</a>
          </div>
        </div>
      </div>

      {/* ── GLOBE ── */}
      <div id="map" style={{ margin: '64px 0 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: -0.5, lineHeight: 1 }}>LIVE OUTBREAK MAP</h2>
              <p className="font-mono" style={{ fontSize: 12, color: 'var(--fg-mute)', letterSpacing: 1, marginTop: 6 }}>Interactive 3D globe · 16 active signals · Drag to explore</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 20, padding: '6px 14px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px #4ade80' }} className="blink" />
              <span className="font-mono" style={{ fontSize: 12, color: '#4ade80', letterSpacing: 1.5, fontWeight: 700 }}>AIS LIVE</span>
            </div>
          </div>
        </div>
        <div className="md:px-4">
          <div style={{ maxWidth: 932, margin: '0 auto' }}>
            <div style={{ border: '1px solid rgba(239,68,68,0.25)', borderRadius: 0, overflow: 'hidden', minHeight: 620, boxShadow: '0 0 60px rgba(239,68,68,0.12), inset 0 0 80px rgba(0,0,0,0.6)' }} className="md:rounded-2xl">
              <GlobeComponent />
            </div>
          </div>
        </div>
      </div>

      {/* ── EXPOSURE RISK CHECKER ── */}
      <div {...section('risk')}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>PERSONAL RISK ASSESSMENT</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 6 }}>ARE YOU AT RISK?</h2>
        <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 20 }}>Answer 3 questions to assess your personal exposure risk. Takes 30 seconds.</p>
        <ExposureChecker />
      </div>

      {/* ── SITUATION REPORT TABLE ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>SITUATION REPORT</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 20 }}>CASE DATA TIMELINE</h2>
        <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Desktop header — hidden on mobile */}
          <div className="hidden md:grid" style={{ gridTemplateColumns: '120px 1fr 60px 60px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', padding: '10px 16px' }}>
            {['DATE', 'EVENT', 'CASES', 'DEATHS'].map(h => (
              <div key={h} className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 2 }}>{h}</div>
            ))}
          </div>
          {events.map((e, i) => {
            const date = new Date(e.event_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            return (
            <div key={e.id} style={{ borderBottom: i < events.length - 1 ? '1px solid var(--line)' : 'none', background: 'var(--bg-1)' }}>
              {/* Desktop row */}
              <div className="hidden md:grid" style={{ gridTemplateColumns: '120px 1fr 60px 60px', padding: '12px 16px', alignItems: 'start' }}>
                <div className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', paddingTop: 2 }}>{date}</div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--fg)', lineHeight: 1.4, marginBottom: 4 }}>{e.event}</p>
                  <span className="font-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, border: `1px solid ${e.tag_color}40`, color: e.tag_color, background: `${e.tag_color}12`, letterSpacing: 1 }}>{e.tag} · {e.source}</span>
                </div>
                <div className="font-mono" style={{ fontSize: 14, color: 'var(--amber)', fontWeight: 700 }}>{e.cases}</div>
                <div className="font-mono" style={{ fontSize: 14, color: e.deaths > 0 ? 'var(--red)' : 'var(--fg-dim)', fontWeight: 700 }}>{e.deaths}</div>
              </div>
              {/* Mobile card */}
              <div className="md:hidden" style={{ padding: '14px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{date}</span>
                  <span className="font-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, border: `1px solid ${e.tag_color}40`, color: e.tag_color, background: `${e.tag_color}12`, letterSpacing: 1 }}>{e.tag}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, marginBottom: 10 }}>{e.event}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 18, color: 'var(--amber)', fontWeight: 700 }}>{e.cases}</div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1.5, marginTop: 2 }}>CASES</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 18, color: e.deaths > 0 ? 'var(--red)' : 'var(--fg-dim)', fontWeight: 700 }}>{e.deaths}</div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1.5, marginTop: 2 }}>DEATHS</div>
                  </div>
                  <div style={{ flex: 2, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1 }}>{e.source}</span>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
        <p className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: 10, opacity: 0.5 }}>DATA SOURCED FROM WHO, ECDC, AND CREDIBLE MEDIA REPORTS</p>
      </div>

      {/* ── INCUBATION CALCULATOR ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>EXPOSURE TIMELINE TOOL</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 6 }}>INCUBATION CALCULATOR</h2>
        <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 20 }}>If you were potentially exposed, calculate when symptoms could appear based on WHO-published incubation data.</p>
        <IncubationCalc />
      </div>

      {/* ── SYMPTOMS ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>CLINICAL PROFILE</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 20 }}>SYMPTOMS BY PHASE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 8 }}>
          {SYMPTOMS.map(ph => (
            <div key={ph.phase} className="card-corner" style={{ background: 'var(--bg-1)', border: `1px solid ${ph.color}30`, borderRadius: 10, padding: '18px', position: 'relative' }}>
              <div className="font-mono" style={{ fontSize: 8, color: ph.color, letterSpacing: 2, marginBottom: 4 }}>{ph.phase}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 12 }}>{ph.label}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ph.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.4 }}>
                    <span style={{ color: ph.color, marginTop: 2, flexShrink: 0 }}>›</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '12px 16px' }}>
          <p className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)' }}>
            ⚠ If you develop fever + muscle pain within 33 days of potential exposure — <strong style={{ color: 'var(--fg)' }}>seek emergency care immediately</strong> and mention possible Andes virus exposure to the treating physician.
          </p>
        </div>
      </div>

      {/* ── NEWS ── */}
      <div {...section('news')}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>INTELLIGENCE FEED</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 20 }}>LATEST UPDATES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, background: 'var(--line)' }}>
          {(news.length > 0 ? news : NEWS).map(n => {
            const isLive = 'headline' in n
            const title = isLive ? (n as any).headline : (n as any).title
            const url = isLive ? (n as any).source_url : (n as any).url
            const tag = isLive ? (n as any).tag : (n as any).tag
            const color = isLive ? (n as any).tag_color : (n as any).color
            const source = isLive ? (n as any).source_label : (n as any).source
            const date = isLive ? new Date((n as any).published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (n as any).date
            return (
            <a key={title} href={url} target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--bg-1)', padding: '16px', display: 'block', textDecoration: 'none', transition: 'background 120ms' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span className="font-mono" style={{ fontSize: 8, letterSpacing: 1.5, padding: '2px 6px', borderRadius: 4, border: `1px solid ${color}`, color, background: `${color}18` }}>{tag}</span>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{source}</span>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', marginLeft: 'auto' }}>{date}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, fontWeight: 500 }}>{title}</p>
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 1, display: 'block', marginTop: 8 }}>READ →</span>
            </a>
          )})}
          {news.length > 0 && <div style={{ gridColumn: '1/-1', background: 'var(--bg-1)', padding: '12px 16px', textAlign: 'center' }}><a href="/andes-virus-news" className="font-mono" style={{ fontSize: 9, color: 'var(--blue)', letterSpacing: 1, textDecoration: 'none' }}>VIEW FULL TIMELINE →</a></div>}
        </div>
      </div>

      {/* ── PROTECT YOURSELF ── */}
      <div {...section('protect')}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>PROTECTIVE EQUIPMENT</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 4 }}>PROTECT YOURSELF</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dim)', marginBottom: 20 }}>Affiliate links support this free tracker. Prices approximate.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: 1, background: 'var(--line)' }}>
          {GEAR.map(g => (
            <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--bg-1)', borderTop: '2px solid rgba(245,158,11,0.3)', padding: '16px', display: 'block', textDecoration: 'none', transition: 'background 120ms, box-shadow 200ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(245,158,11,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-1)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: 1.5, marginBottom: 8 }}>AMAZON ↗</div>
              <p style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>
                <span style={{ marginRight: 8 }} aria-hidden>{g.icon}</span>{g.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.5, marginBottom: 12 }}>{g.desc}</p>
              <div style={{ borderTop: '1px dashed var(--line-strong)', paddingTop: 10, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: 18, color: '#4ade80', fontWeight: 800 }}>{g.price}</span>
              </div>
              <span className="font-mono" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.5)', borderRadius: 6, padding: '8px 16px', color: '#f59e0b', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, display: 'block', textAlign: 'center', marginTop: 12 }}>VIEW →</span>
            </a>
          ))}
        </div>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', marginTop: 10, opacity: 0.5 }}>Amazon Associate · Prices vary · Not medical advice</p>
      </div>

      {/* ── SUPPORT THIS TRACKER ── */}
      <div {...section('support')}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>INDEPENDENT TRACKER</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 6 }}>KEEP THIS FREE</h2>
        <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 20 }}>This tracker is independently operated. No paywalls, no ads beyond affiliate links. If it helped you, consider supporting the work.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Stripe donate */}
          <a href="https://buymeacoffee.com/mwapp" target="_blank" rel="noopener noreferrer"
            style={{ background: 'var(--bg-1)', border: '1px solid rgba(245,158,11,0.7)', borderRadius: 10, padding: '24px', display: 'block', textDecoration: 'none', transition: 'background 120ms', boxShadow: '0 0 20px rgba(245,158,11,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }} aria-hidden>☕</div>
            <div className="font-mono" style={{ fontSize: 9, color: '#f59e0b', letterSpacing: 1.5, textAlign: 'center', marginBottom: 6 }}>BUY A COFFEE</div>
            <p style={{ fontSize: 16, color: 'var(--fg)', fontWeight: 700, lineHeight: 1.4, marginBottom: 6, textAlign: 'center' }}>One-time tip — fuels the tracker</p>
            <p style={{ fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.5, textAlign: 'center' }}>$3 · $5 · $10 → your call</p>
            <span className="font-mono" style={{ background: '#f59e0b', color: '#000', borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 800, letterSpacing: 1, display: 'block', textAlign: 'center', marginTop: 16 }}>BUY A COFFEE ☕</span>
          </a>

          {/* Share the tracker */}
          <div
            style={{ background: 'var(--bg-1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 10, padding: '24px', display: 'block', transition: 'background 120ms' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }} aria-hidden>📡</div>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--green)', letterSpacing: 1.5, textAlign: 'center', marginBottom: 6 }}>SHARE THE TRACKER</div>
            <p style={{ fontSize: 16, color: 'var(--fg)', fontWeight: 700, lineHeight: 1.4, marginBottom: 6, textAlign: 'center' }}>Tell someone who needs to know</p>
            <p style={{ fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.5, textAlign: 'center' }}>Every share = more people informed</p>
            <a href={SHARE_TWEET_URL} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid #4ade80', color: '#4ade80', borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 800, letterSpacing: 1, display: 'block', textAlign: 'center', marginTop: 16, textDecoration: 'none' }}>SHARE NOW 📡</a>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>INTELLIGENCE · FAQ</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 20 }}>FREQUENTLY ASKED</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line)' }}>
          {FAQS.map(faq => (
            <details key={faq.q} style={{ background: 'var(--bg-1)' }}>
              <summary style={{ padding: '14px 16px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
                {faq.q}<span style={{ color: 'var(--red)', fontSize: 16, marginLeft: 12, flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ padding: '0 16px 16px', fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, borderTop: '1px solid var(--line)' }}>
                <div style={{ paddingTop: 12 }}>{faq.a}</div>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ── EMAIL ALERTS ── */}
      <div id="alerts" style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 16px' }}>
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '40px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="hazard-stripe" style={{ position: 'absolute', inset: 0, opacity: 0.35 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 3, marginBottom: 10 }}>OUTBREAK ALERTS</p>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--fg)', letterSpacing: 1, marginBottom: 8 }}>STAY INFORMED</h2>
            <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>Immediate alerts when new Andes virus cases are confirmed. No spam.</p>
            {subscribed ? (
              <div className="font-mono" style={{ color: 'var(--green)', fontSize: 13 }}>✅ SUBSCRIBED — YOU&apos;LL BE ALERTED IMMEDIATELY</div>
            ) : (
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    placeholder="your@email.com"
                    className="font-mono"
                    style={{ flex: 1, minWidth: 180, background: 'var(--bg)', border: `1px solid ${subError ? 'var(--red)' : 'var(--line-strong)'}`, borderRadius: 8, padding: '10px 14px', color: 'var(--fg)', fontSize: 12, outline: 'none' }} />
                  <button onClick={handleSubscribe} disabled={subscribing}
                    style={{ background: subscribing ? 'rgba(239,68,68,0.5)' : 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700, fontFamily: 'Space Mono, monospace', letterSpacing: 1, cursor: subscribing ? 'default' : 'pointer' }}>
                    {subscribing ? '...' : 'SUBSCRIBE'}
                  </button>
                </div>
                {subError && <p className="font-mono" style={{ fontSize: 9, color: 'var(--red)', marginTop: 8, letterSpacing: 1 }}>{subError}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── OTHER ACTIVE OUTBREAKS ── */}
      <div {...section('other-outbreaks')}>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>GLOBAL SURVEILLANCE</p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 6 }}>OTHER ACTIVE OUTBREAKS</h2>
        <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 20 }}>We track Andes virus. These are the other outbreaks public health authorities are actively monitoring worldwide.</p>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 8 }}>
          {OTHER_OUTBREAKS.map(o => (
            <div key={o.name} className="card-corner" style={{ background: 'var(--bg-1)', border: `1px solid ${o.levelColor}30`, borderRadius: 10, padding: '18px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)' }}>{o.name}</div>
                <span className="font-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, border: `1px solid ${o.levelColor}40`, color: o.levelColor, background: `${o.levelColor}12`, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                  {o.status} · {o.level}
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, marginBottom: 12 }}>{o.countries}</div>
              <p style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.6, marginBottom: 14 }}>{o.summary}</p>
              <div style={{ marginTop: 'auto', borderTop: '1px dashed var(--line-strong)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div>
                    <div className="font-mono" style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 700 }}>{o.cases}</div>
                    <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-mute)', letterSpacing: 1.5, marginTop: 2 }}>CASES</div>
                  </div>
                  <div>
                    <div className="font-mono" style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700 }}>{o.deaths}</div>
                    <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-mute)', letterSpacing: 1.5, marginTop: 2 }}>DEATHS</div>
                  </div>
                </div>
                <a href={o.who_url} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 10, color: 'var(--blue)', letterSpacing: 1.5, textDecoration: 'none', fontWeight: 700 }}>WHO →</a>
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: 10, opacity: 0.5 }}>DATA SOURCED FROM WHO, CDC, AND ECDC · UPDATED PERIODICALLY</p>
      </div>

      {/* DESKTOP STICKY SHARE BAR — mobile uses inline row below hero stats */}
      <div className="hidden md:flex" style={{ position: 'fixed', bottom: 24, right: 16, zIndex: 100, flexDirection: 'column', gap: 6 }}>
        <ShareButtons />
      </div>

      <SiteFooter />

    </div>
  )
}
