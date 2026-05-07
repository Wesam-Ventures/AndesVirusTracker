'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import StatCounter from '@/components/StatCounter'

const GlobeComponent = dynamic(() => import('@/components/GlobeComponent'), { ssr: false })

// ─── DATA ────────────────────────────────────────────────────────────────────

const CASES = [
  { date: 'May 7, 2026', event: 'Swiss passenger tests positive — Andes strain confirmed', cases: 8, deaths: 3, source: 'Global News', tag: 'CONFIRMED', color: '#ef4444' },
  { date: 'May 6, 2026', event: 'WHO issues Disease Outbreak Notice — multi-country cluster', cases: 7, deaths: 3, source: 'WHO DON-599', tag: 'OFFICIAL', color: '#3b82f6' },
  { date: 'May 5, 2026', event: 'Two additional cases confirmed, Andes strain identified', cases: 5, deaths: 2, source: 'ECDC', tag: 'CONFIRMED', color: '#ef4444' },
  { date: 'May 3, 2026', event: 'First deaths reported aboard MV Hondius near Cape Verde', cases: 3, deaths: 1, source: 'CBC News', tag: 'MEDIA', color: '#f59e0b' },
  { date: 'Apr 28, 2026', event: 'First cases reported — initial cluster on MV Hondius', cases: 2, deaths: 0, source: 'Oceanwide Expeditions', tag: 'SOURCE', color: '#64748b' },
]

const NEWS = [
  { source: 'WHO', tag: 'OFFICIAL', color: '#3b82f6', title: 'Multi-country cluster of Andes virus disease — Disease Outbreak Notice', date: 'May 6, 2026', url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599' },
  { source: 'CNN', tag: 'MEDIA', color: '#ef4444', title: 'Andes virus: What doctors know about how the hantavirus spreads person-to-person', date: 'May 6, 2026', url: 'https://www.cnn.com/2026/05/06/health/andes-strain-hantavirus-explained' },
  { source: 'NPR', tag: 'MEDIA', color: '#ef4444', title: 'Cruise ship hantavirus confirmed as rare type that can spread human-to-human', date: 'May 5, 2026', url: 'https://www.npr.org/2026/05/05/g-s1-120234/cruise-ship-hantavirus' },
  { source: 'NBC NEWS', tag: 'MEDIA', color: '#ef4444', title: 'US monitoring hantavirus cruise passengers as new case confirmed in Switzerland', date: 'May 6, 2026', url: 'https://www.nbcnews.com/health/health-news/us-monitoring-hantavirus-cruise-passengers-new-case-flight-attendant-rcna343990' },
  { source: 'LIVE SCIENCE', tag: 'SCIENCE', color: '#4ade80', title: 'Andes virus — the only hantavirus that can spread between people — identified on cruise ship', date: 'May 6, 2026', url: 'https://www.livescience.com/health/viruses-infections-disease/andes-virus-the-only-hantavirus-strain-that-can-spread-between-people-identified-as-culprit-on-cruise-ship' },
  { source: 'TIME', tag: 'MEDIA', color: '#ef4444', title: 'What Countries Are Linked to the Hantavirus Outbreak?', date: 'May 7, 2026', url: 'https://time.com/article/2026/05/07/countries-hantavirus-hondius-cruise-ship/' },
]

const GEAR = [
  { name: '3M P100 Half-Face Respirator', desc: 'Maximum respiratory protection against airborne particles', price: '$45–65', url: 'https://www.amazon.com/s?k=3M+P100+respirator&tag=YOURTAG-20' },
  { name: 'N95 Respirator Masks (50-pack)', desc: 'CDC-recommended respiratory protection, NIOSH approved', price: '$25–40', url: 'https://www.amazon.com/s?k=N95+respirator+masks+50+pack&tag=YOURTAG-20' },
  { name: 'Tyvek Protective Coverall Suit', desc: 'Full-body barrier protection for rodent cleanup', price: '$15–25', url: 'https://www.amazon.com/s?k=tyvek+coverall+suit&tag=YOURTAG-20' },
  { name: 'Victor Snap Trap (12-pack)', desc: 'Eliminate rodent vectors around your home', price: '$15–20', url: 'https://www.amazon.com/s?k=victor+snap+trap+rodent&tag=YOURTAG-20' },
  { name: 'Nitrile Gloves (100-pack)', desc: 'Barrier protection for cleanup operations', price: '$12–18', url: 'https://www.amazon.com/s?k=nitrile+gloves+100+pack&tag=YOURTAG-20' },
  { name: 'Lysol Disinfectant Spray (4-pack)', desc: 'EPA-registered for rodent-contaminated surfaces', price: '$20–30', url: 'https://www.amazon.com/s?k=lysol+disinfectant+spray&tag=YOURTAG-20' },
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
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1.5, marginBottom: 3 }}>RESTART</div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)' }}>Check again</div>
          </button>
        </div>
        <p className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', marginTop: 12, opacity: 0.5, textAlign: 'center' }}>
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
      <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 10 }}>
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
            <p className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', opacity: 0.5, textAlign: 'center', marginTop: 8 }}>
              BASED ON WHO REPORTED INCUBATION RANGE · NOT MEDICAL ADVICE
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const section = (id?: string) => ({
    id,
    style: { maxWidth: 900, margin: '64px auto 0', padding: '0 16px' } as React.CSSProperties,
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── NAV ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '10px 12px 0' }}>
        <nav className="glass" style={{ maxWidth: 900, margin: '0 auto', borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {/* Logo + LIVE badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span className="font-display" style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>ANDES VIRUS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '3px 7px', flexShrink: 0 }}>
              <div className="blink" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)' }} />
              <span className="font-mono" style={{ fontSize: 8, color: 'var(--red)', letterSpacing: 1.5 }}>LIVE</span>
            </div>
          </div>
          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden md:flex" style={{ gap: 18, alignItems: 'center' }}>
            {['Map', 'Risk', 'News', 'Protect'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="font-mono"
                style={{ fontSize: 10, color: 'var(--fg-dim)', letterSpacing: 1, textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}>
                {l.toUpperCase()}
              </a>
            ))}
          </div>
          {/* GET ALERTS — always visible */}
          <a href="#alerts" style={{ background: 'var(--red)', color: '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textDecoration: 'none', fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>
            GET ALERTS
          </a>
        </nav>
      </div>

      {/* ── BREAKING BANNER ── */}
      <div style={{ maxWidth: 900, margin: '12px auto', padding: '0 16px' }}>
        <div className="hazard-stripe" style={{ border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="font-mono blink" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 1.5 }}>⚠ BREAKING</span>
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)' }}>Swiss passenger confirmed positive for Andes virus — May 7, 2026</span>
          </div>
          <a href="https://globalnews.ca/news/11836710/hantavirus-cruise-ship-andes-strain-new-case-confirmed-switzerland/" target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 9, color: 'var(--red)', whiteSpace: 'nowrap', textDecoration: 'none', letterSpacing: 1 }}>READ →</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 16px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="font-mono" style={{ fontSize: 10, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 14 }}>OUTBREAK · DAY 15 · WHO CONFIRMED</p>
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
            { label: 'CONFIRMED CASES', value: 8,  color: 'var(--red)', delay: 0 },
            { label: 'DEATHS',          value: 3,  color: 'var(--red)', delay: 80 },
            { label: 'COUNTRIES',       value: 23, color: 'var(--amber)', delay: 160 },
            { label: 'EXPOSED',         value: 62, suffix: '+', color: 'var(--amber)', delay: 240 },
          ].map(s => (
            <div key={s.label} className="card-corner fade-up" style={{ background: 'var(--bg-1)', padding: '20px 16px', position: 'relative', animationDelay: `${s.delay}ms` }}>
              <div className="font-display" style={{ fontSize: 44, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6, letterSpacing: -1 }}>
                <StatCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2 }}>{s.label}</div>
              <div className="font-mono" style={{ fontSize: 7, color: 'var(--fg-dim)', marginTop: 6, borderTop: '1px dashed var(--line-strong)', paddingTop: 6, opacity: 0.5 }}>SOURCE: WHO/ECDC</div>
            </div>
          ))}
        </div>

        {/* SECONDARY ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: 'var(--line)', marginTop: 1 }}>
          {[
            { label: 'CASE FATALITY RATE', value: '~40%', color: 'var(--red)' },
            { label: 'P2P TRANSMISSION',   value: 'CONFIRMED', color: 'var(--amber)' },
            { label: 'ACTIVE VESSEL',       value: 'MV HONDIUS', color: 'var(--blue)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1.5 }}>{s.label}</span>
              <span className="font-mono" style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHO RISK LEVEL ── */}
      <div style={{ maxWidth: 900, margin: '16px auto 0', padding: '0 16px' }}>
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2 }}>WHO ASSESSMENT</div>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--blue)', letterSpacing: 1, marginTop: 2 }}>OFFICIAL RISK LEVEL</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 5 }}>
              {[{ l:'LOW',c:'#4ade80',a:false},{l:'MODERATE',c:'#f59e0b',a:true},{l:'HIGH',c:'#ef4444',a:false},{l:'CRITICAL',c:'#7f1d1d',a:false}].map(lv => (
                <div key={lv.l} style={{ flex: 1, height: 6, borderRadius: 2, background: lv.a ? lv.c : 'rgba(148,163,184,0.1)', boxShadow: lv.a ? `0 0 8px ${lv.c}80` : 'none' }} />
              ))}
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
              <div className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', letterSpacing: 2 }}>MODERATE</div>
              <div className="font-mono" style={{ fontSize: 7, color: 'var(--fg-dim)', letterSpacing: 1, marginTop: 2 }}>P2P CONFIRMED</div>
            </div>
            <a href="https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599" target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 8, color: 'var(--blue)', letterSpacing: 1, textDecoration: 'none' }}>WHO →</a>
          </div>
        </div>
      </div>

      {/* ── GLOBE — full width on mobile ── */}
      <div id="map" style={{ margin: '48px 0 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1 }}>LIVE OUTBREAK MAP</h2>
              <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1, marginTop: 4 }}>14 ACTIVE SIGNALS · TAP EXPAND FOR FULLSCREEN</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} className="blink" />
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--green)', letterSpacing: 1.5 }}>AIS LIVE</span>
            </div>
          </div>
        </div>
        {/* Globe breaks out of max-width on mobile */}
        <div style={{ padding: '0 0 0 0' }} className="md:px-4">
          <div style={{ maxWidth: 932, margin: '0 auto' }}>
            <div style={{ border: '1px solid var(--line-strong)', borderRadius: 0, overflow: 'hidden' }} className="md:rounded-xl">
              <GlobeComponent />
            </div>
          </div>
        </div>
      </div>

      {/* ── EXPOSURE RISK CHECKER ── */}
      <div {...section('risk')}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>PERSONAL RISK ASSESSMENT</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 6 }}>ARE YOU AT RISK?</h2>
        <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 20 }}>Answer 3 questions to assess your personal exposure risk. Takes 30 seconds.</p>
        <ExposureChecker />
      </div>

      {/* ── SITUATION REPORT TABLE ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>SITUATION REPORT</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 20 }}>CASE DATA TIMELINE</h2>
        <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Desktop header — hidden on mobile */}
          <div className="hidden md:grid" style={{ gridTemplateColumns: '120px 1fr 60px 60px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', padding: '10px 16px' }}>
            {['DATE', 'EVENT', 'CASES', 'DEATHS'].map(h => (
              <div key={h} className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2 }}>{h}</div>
            ))}
          </div>
          {CASES.map((c, i) => (
            <div key={i} style={{ borderBottom: i < CASES.length - 1 ? '1px solid var(--line)' : 'none', background: 'var(--bg-1)' }}>
              {/* Desktop row */}
              <div className="hidden md:grid" style={{ gridTemplateColumns: '120px 1fr 60px 60px', padding: '12px 16px', alignItems: 'start' }}>
                <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', paddingTop: 2 }}>{c.date}</div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--fg)', lineHeight: 1.4, marginBottom: 4 }}>{c.event}</p>
                  <span className="font-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, border: `1px solid ${c.color}40`, color: c.color, background: `${c.color}12`, letterSpacing: 1 }}>{c.tag} · {c.source}</span>
                </div>
                <div className="font-mono" style={{ fontSize: 14, color: 'var(--amber)', fontWeight: 700 }}>{c.cases}</div>
                <div className="font-mono" style={{ fontSize: 14, color: c.deaths > 0 ? 'var(--red)' : 'var(--fg-dim)', fontWeight: 700 }}>{c.deaths}</div>
              </div>
              {/* Mobile card */}
              <div className="md:hidden" style={{ padding: '14px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)' }}>{c.date}</span>
                  <span className="font-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, border: `1px solid ${c.color}40`, color: c.color, background: `${c.color}12`, letterSpacing: 1 }}>{c.tag}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, marginBottom: 10 }}>{c.event}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 18, color: 'var(--amber)', fontWeight: 700 }}>{c.cases}</div>
                    <div className="font-mono" style={{ fontSize: 7, color: 'var(--fg-dim)', letterSpacing: 1.5, marginTop: 2 }}>CASES</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 18, color: c.deaths > 0 ? 'var(--red)' : 'var(--fg-dim)', fontWeight: 700 }}>{c.deaths}</div>
                    <div className="font-mono" style={{ fontSize: 7, color: 'var(--fg-dim)', letterSpacing: 1.5, marginTop: 2 }}>DEATHS</div>
                  </div>
                  <div style={{ flex: 2, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 1 }}>{c.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', marginTop: 10, opacity: 0.5 }}>DATA SOURCED FROM WHO, ECDC, AND CREDIBLE MEDIA REPORTS</p>
      </div>

      {/* ── INCUBATION CALCULATOR ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>EXPOSURE TIMELINE TOOL</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 6 }}>INCUBATION CALCULATOR</h2>
        <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 20 }}>If you were potentially exposed, calculate when symptoms could appear based on WHO-published incubation data.</p>
        <IncubationCalc />
      </div>

      {/* ── SYMPTOMS ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>CLINICAL PROFILE</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 20 }}>SYMPTOMS BY PHASE</h2>
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
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>INTELLIGENCE FEED</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 20 }}>LATEST UPDATES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, background: 'var(--line)' }}>
          {NEWS.map(n => (
            <a key={n.title} href={n.url} target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--bg-1)', padding: '16px', display: 'block', textDecoration: 'none', transition: 'background 120ms' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span className="font-mono" style={{ fontSize: 8, letterSpacing: 1.5, padding: '2px 6px', borderRadius: 4, border: `1px solid ${n.color}`, color: n.color, background: `${n.color}18` }}>{n.tag}</span>
                <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)' }}>{n.source}</span>
                <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, fontWeight: 500 }}>{n.title}</p>
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 1, display: 'block', marginTop: 8 }}>READ →</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── PROTECT YOURSELF ── */}
      <div {...section('protect')}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>PROTECTIVE EQUIPMENT</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 4 }}>PROTECT YOURSELF</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dim)', marginBottom: 20 }}>Affiliate links support this free tracker. Prices approximate.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: 1, background: 'var(--line)' }}>
          {GEAR.map(g => (
            <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--bg-1)', padding: '16px', display: 'block', textDecoration: 'none', transition: 'background 120ms' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: 1.5, marginBottom: 8 }}>AMAZON ↗</div>
              <p style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{g.name}</p>
              <p style={{ fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.5, marginBottom: 12 }}>{g.desc}</p>
              <div style={{ borderTop: '1px dashed var(--line-strong)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>{g.price}</span>
                <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1 }}>VIEW →</span>
              </div>
            </a>
          ))}
        </div>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 10, opacity: 0.5 }}>Amazon Associate · Prices vary · Not medical advice</p>
      </div>

      {/* ── FAQ ── */}
      <div {...section()}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>INTELLIGENCE · FAQ</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 20 }}>FREQUENTLY ASKED</h2>
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
              <div className="font-mono" style={{ color: 'var(--green)', fontSize: 13 }}>✅ SUBSCRIBED — WE&apos;LL ALERT YOU IMMEDIATELY</div>
            ) : (
              <div style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="font-mono" style={{ flex: 1, minWidth: 180, background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '10px 14px', color: 'var(--fg)', fontSize: 12, outline: 'none' }} />
                <button onClick={() => email && setSubscribed(true)} style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700, fontFamily: 'Space Mono, monospace', letterSpacing: 1, cursor: 'pointer' }}>
                  SUBSCRIBE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ maxWidth: 900, margin: '48px auto', padding: '24px 16px', borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="font-display" style={{ fontSize: 12, color: 'var(--fg-dim)', letterSpacing: 2 }}>ANDESVIRUSTRACKER.COM</span>
            <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 4, opacity: 0.5 }}>Data: WHO · CDC · ECDC · Not medical advice · Not affiliated with any government body</p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {['About', 'Privacy', 'Contact'].map(l => (
              <a key={l} href="#" className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1.5, textDecoration: 'none' }}>{l.toUpperCase()}</a>
            ))}
          </div>
        </div>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 16, opacity: 0.3 }}>© 2026 ANDESVIRUSTRACKER.COM · OPERATED BY WESAM VENTURES LLC</p>
        <div style={{ marginTop: 16, padding: '16px', background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 8 }}>
          <p className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', lineHeight: 1.8, opacity: 0.6 }}>
            LEGAL DISCLAIMER — AndesVirusTracker.com is operated by Wesam Ventures LLC. This website is provided for informational and educational purposes only. The information presented on this site is aggregated from publicly available sources including the World Health Organization (WHO), the Centers for Disease Control and Prevention (CDC), and the European Centre for Disease Prevention and Control (ECDC). This site is not affiliated with, endorsed by, or representing any government agency or health authority. Nothing on this site constitutes medical advice, diagnosis, or treatment. The risk assessment tool and incubation calculator are educational tools only and should not be used as a substitute for professional medical evaluation. If you believe you have been exposed to any infectious disease, contact a licensed healthcare provider immediately. Affiliate product links are provided as a convenience; Wesam Ventures LLC earns a commission from qualifying Amazon purchases. Wesam Ventures LLC makes no warranties regarding the accuracy, completeness, or timeliness of information on this site and assumes no liability for any decisions made based on content herein.
          </p>
        </div>
      </footer>

    </div>
  )
}
