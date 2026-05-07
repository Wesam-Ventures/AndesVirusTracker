'use client'
import dynamic from 'next/dynamic'
import StatCounter from '@/components/StatCounter'

const GlobeComponent = dynamic(() => import('@/components/GlobeComponent'), { ssr: false })

const NEWS = [
  { source: 'WHO', tag: 'OFFICIAL', color: '#3b82f6', title: 'Multi-country cluster of Andes virus disease — Disease Outbreak Notice', date: 'May 6, 2026', url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599' },
  { source: 'CNN', tag: 'MEDIA', color: '#ef4444', title: 'Andes virus: What doctors know about how the hantavirus spreads person-to-person', date: 'May 6, 2026', url: 'https://www.cnn.com/2026/05/06/health/andes-strain-hantavirus-explained' },
  { source: 'NPR', tag: 'MEDIA', color: '#ef4444', title: 'Cruise ship hantavirus confirmed as rare type that can spread human-to-human', date: 'May 5, 2026', url: 'https://www.npr.org/2026/05/05/g-s1-120234/cruise-ship-hantavirus' },
  { source: 'NBC NEWS', tag: 'MEDIA', color: '#ef4444', title: 'US monitoring hantavirus cruise passengers as new case confirmed in Switzerland', date: 'May 6, 2026', url: 'https://www.nbcnews.com/health/health-news/us-monitoring-hantavirus-cruise-passengers-new-case-flight-attendant-rcna343990' },
  { source: 'LIVE SCIENCE', tag: 'SCIENCE', color: '#4ade80', title: 'Andes virus — the only hantavirus that can spread between people — identified on cruise ship', date: 'May 6, 2026', url: 'https://www.livescience.com/health/viruses-infections-disease/andes-virus-the-only-hantavirus-strain-that-can-spread-between-people-identified-as-culprit-on-cruise-ship' },
  { source: 'TIME', tag: 'MEDIA', color: '#ef4444', title: 'What Countries Are Linked to the Hantavirus Outbreak? A Complete Guide', date: 'May 7, 2026', url: 'https://time.com/article/2026/05/07/countries-hantavirus-hondius-cruise-ship/' },
]

const GEAR = [
  { name: '3M P100 Half-Face Respirator', desc: 'Maximum respiratory protection against airborne particles', price: '$45–65', url: 'https://www.amazon.com/s?k=3M+P100+respirator&tag=YOURTAG-20' },
  { name: 'N95 Respirator Masks (50-pack)', desc: 'CDC-recommended respiratory protection, NIOSH approved', price: '$25–40', url: 'https://www.amazon.com/s?k=N95+respirator+masks+50+pack&tag=YOURTAG-20' },
  { name: 'Tyvek Protective Coverall Suit', desc: 'Full-body barrier protection for rodent cleanup', price: '$15–25', url: 'https://www.amazon.com/s?k=tyvek+coverall+suit&tag=YOURTAG-20' },
  { name: 'Victor Snap Trap (12-pack)', desc: 'Eliminate rodent vectors in and around your home', price: '$15–20', url: 'https://www.amazon.com/s?k=victor+snap+trap+rodent&tag=YOURTAG-20' },
  { name: 'Nitrile Gloves (100-pack)', desc: 'Barrier protection for high-risk cleanup operations', price: '$12–18', url: 'https://www.amazon.com/s?k=nitrile+gloves+100+pack&tag=YOURTAG-20' },
  { name: 'Lysol Disinfectant Spray (4-pack)', desc: 'EPA-registered disinfectant for rodent-contaminated surfaces', price: '$20–30', url: 'https://www.amazon.com/s?k=lysol+disinfectant+spray&tag=YOURTAG-20' },
]

const FAQS = [
  { q: 'Can Andes virus spread between humans?', a: 'Yes — Andes virus is the only hantavirus confirmed to spread person-to-person. Transmission requires prolonged close contact such as sharing a bed or food. It does not travel through the air like COVID-19 or measles.' },
  { q: 'Is Andes virus the same as hantavirus?', a: 'Andes virus (ANDV) is a specific strain of hantavirus, and the most dangerous one because it uniquely transmits human-to-human. All other hantavirus strains only spread from infected rodents to humans.' },
  { q: 'What happened on the MV Hondius?', a: 'In April–May 2026, 8 passengers on the Antarctic expedition cruise ship MV Hondius were confirmed infected with Andes virus. 3 died. Over 62 passengers from 23 nationalities are being actively monitored by health authorities.' },
  { q: 'How deadly is Andes virus?', a: 'The case fatality rate is approximately 40%, making it one of the deadliest respiratory pathogens outside classified agents. It causes hantavirus pulmonary syndrome (HPS) with rapid respiratory failure. Early ICU admission improves outcomes.' },
  { q: 'Is there a vaccine or treatment?', a: 'No approved vaccine or antiviral exists for hantavirus. Supportive care in an intensive care unit is the primary treatment. Early hospitalization at the first sign of symptoms is critical.' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* FLOATING PILL NAV — Conflictly style */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '12px 16px 0' }}>
        <nav className="glass" style={{
          maxWidth: 900, margin: '0 auto',
          borderRadius: 14, padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1 }}>
              ANDES VIRUS
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 20, padding: '3px 8px',
            }}>
              <div className="blink" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)' }} />
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 1.5 }}>LIVE</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="hidden md:flex" style={{ gap: 20, alignItems: 'center' }}>
              {['Map', 'News', 'Protect'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="font-mono"
                  style={{ fontSize: 10, color: 'var(--fg-dim)', letterSpacing: 1, textDecoration: 'none', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}>
                  {l.toUpperCase()}
                </a>
              ))}
            </div>
            <a href="#alerts" style={{
              background: 'var(--red)', color: '#fff',
              borderRadius: 8, padding: '5px 10px', fontSize: 9, fontWeight: 700,
              letterSpacing: 0.5, textDecoration: 'none', fontFamily: 'Space Mono, monospace',
              transition: 'opacity 150ms', whiteSpace: 'nowrap',
            }}>GET ALERTS</a>
          </div>
        </nav>
      </div>

      {/* HAZARD ALERT BANNER */}
      <div style={{ maxWidth: 900, margin: '12px auto', padding: '0 16px' }}>
        <div className="hazard-stripe" style={{
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10, padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="font-mono blink" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 1.5 }}>⚠ BREAKING</span>
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)' }}>
              Swiss passenger confirmed positive for Andes virus post MV Hondius cruise — May 7, 2026
            </span>
          </div>
          <a href="https://globalnews.ca/news/11836710/hantavirus-cruise-ship-andes-strain-new-case-confirmed-switzerland/"
            target="_blank" rel="noopener noreferrer"
            className="font-mono" style={{ fontSize: 9, color: 'var(--red)', whiteSpace: 'nowrap', textDecoration: 'none', letterSpacing: 1 }}>
            READ →
          </a>
        </div>
      </div>

      {/* HERO HEADLINE */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="font-mono" style={{ fontSize: 10, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 16 }}>
            OUTBREAK · DAY 15 · WHO CONFIRMED
          </p>
          <h1 className="font-display" style={{
            fontSize: 'clamp(28px, 7vw, 72px)', fontWeight: 900,
            lineHeight: 0.95, letterSpacing: -1, color: 'var(--fg)',
            marginBottom: 20,
          }}>
            ANDES VIRUS<br />
            <span style={{ color: 'var(--red)' }}>TRACKER</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fg-mute)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            The only hantavirus strain confirmed to spread person-to-person — now active across multiple continents.
          </p>
        </div>

        {/* STAT CARDS — corner bracket style with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line)]">
          {[
            { label: 'CONFIRMED CASES', value: 8, color: 'var(--red)', delay: 0 },
            { label: 'DEATHS',          value: 3, color: 'var(--red)', delay: 100 },
            { label: 'COUNTRIES',       value: 23, color: 'var(--amber)', delay: 200 },
            { label: 'EXPOSED',         value: 62, suffix: '+', color: 'var(--amber)', delay: 300 },
          ].map((s) => (
            <div key={s.label} className="card-corner fade-up" style={{
              background: 'var(--bg-1)', padding: '24px 20px',
              position: 'relative', animationDelay: `${s.delay}ms`,
            }}>
              <div className="font-display" style={{
                fontSize: 48, fontWeight: 800, color: s.color,
                lineHeight: 1, marginBottom: 8, letterSpacing: -1,
              }}>
                <StatCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2 }}>
                {s.label}
              </div>
              <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', marginTop: 8, borderTop: '1px dashed var(--line-strong)', paddingTop: 8, opacity: 0.6 }}>
                SOURCE: WHO / ECDC
              </div>
            </div>
          ))}
        </div>

        {/* SECONDARY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)]" style={{ marginTop: 1 }}>
          {[
            { label: 'CASE FATALITY RATE', value: '~40%', color: 'var(--red)' },
            { label: 'P2P TRANSMISSION', value: 'CONFIRMED', color: 'var(--amber)' },
            { label: 'VESSEL', value: 'MV HONDIUS', color: 'var(--blue)' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1.5 }}>{s.label}</span>
              <span className="font-mono" style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WHO RISK LEVEL PANEL */}
      <div style={{ maxWidth: 900, margin: '16px auto 0', padding: '0 16px' }}>
        <div style={{
          background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
          borderRadius: 10, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          {/* WHO logo block */}
          <div style={{ display: 'flex', flex: '0 0 auto', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2 }}>WHO ASSESSMENT</div>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--blue)', letterSpacing: 1, marginTop: 2 }}>OFFICIAL RISK LEVEL</div>
            </div>
          </div>

          {/* Risk level bar */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
              {[
                { label: 'LOW',      active: false, color: '#4ade80' },
                { label: 'MODERATE', active: true,  color: '#f59e0b' },
                { label: 'HIGH',     active: false, color: '#ef4444' },
                { label: 'CRITICAL', active: false, color: '#7f1d1d' },
              ].map(level => (
                <div key={level.label} style={{
                  flex: 1, height: 6, borderRadius: 2,
                  background: level.active ? level.color : 'rgba(148,163,184,0.1)',
                  boxShadow: level.active ? `0 0 8px ${level.color}80` : 'none',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map((label, i) => (
                <div key={label} style={{ flex: 1 }}>
                  <span className="font-mono" style={{
                    fontSize: 7, letterSpacing: 1,
                    color: i === 1 ? '#f59e0b' : 'var(--fg-dim)',
                    fontWeight: i === 1 ? 700 : 400,
                  }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current level badge */}
          <div style={{ display: 'flex', flex: '0 0 auto', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8, padding: '6px 14px', textAlign: 'center',
            }}>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b', letterSpacing: 2 }}>MODERATE</div>
              <div className="font-mono" style={{ fontSize: 7, color: 'var(--fg-dim)', letterSpacing: 1, marginTop: 2 }}>P2P CONFIRMED</div>
            </div>
            <a href="https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599"
              target="_blank" rel="noopener noreferrer"
              className="font-mono"
              style={{ fontSize: 8, color: 'var(--blue)', letterSpacing: 1, textDecoration: 'none' }}>
              WHO SOURCE →
            </a>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div id="map" style={{ maxWidth: 900, margin: '48px auto 0', padding: '0 16px' }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1 }}>
              LIVE OUTBREAK MAP
            </h2>
            <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1, marginTop: 4 }}>
              {MARKERS_COUNT} ACTIVE SIGNALS · UPDATED MAY 7 2026
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} className="blink" />
            <span className="font-mono" style={{ fontSize: 9, color: 'var(--green)', letterSpacing: 1.5 }}>AIS LIVE</span>
          </div>
        </div>
        <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
          <GlobeComponent />
        </div>
      </div>

      {/* WHY ANDES IS DIFFERENT */}
      <div style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 16px' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>THREAT ASSESSMENT</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 24 }}>
          WHY ANDES VIRUS IS DIFFERENT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ marginBottom: 32 }}>
          {[
            { icon: '👥', label: 'P2P TRANSMISSION', desc: 'Only hantavirus with confirmed human-to-human spread. Requires prolonged close contact — not airborne.', color: 'var(--red)' },
            { icon: '💀', label: '~40% FATALITY RATE', desc: 'Among the highest CFRs for respiratory pathogens outside classified agents. Causes rapid HPS.', color: 'var(--amber)' },
            { icon: '🌎', label: 'SOUTH AMERICAN ORIGIN', desc: 'Endemic to Argentina and Chile. Reservoir: Oligoryzomys longicaudatus (long-tailed pygmy rice rat).', color: 'var(--blue)' },
          ].map((c) => (
            <div key={c.label} className="card-corner" style={{
              background: 'var(--bg-1)', border: '1px solid var(--line)',
              borderRadius: 10, padding: '20px', position: 'relative',
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{c.icon}</div>
              <div className="font-mono" style={{ fontSize: 9, color: c.color, letterSpacing: 2, marginBottom: 8 }}>{c.label}</div>
              <p style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQS */}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24 }}>
          <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 16 }}>INTELLIGENCE · FAQ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line)' }}>
            {FAQS.map((faq) => (
              <details key={faq.q} style={{ background: 'var(--bg-1)' }}>
                <summary style={{
                  padding: '14px 16px', cursor: 'pointer', listStyle: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--fg)',
                }}>
                  {faq.q}
                  <span style={{ color: 'var(--red)', fontSize: 16, marginLeft: 12, flexShrink: 0 }}>+</span>
                </summary>
                <div style={{
                  padding: '0 16px 16px', fontSize: 13, color: 'var(--fg-mute)',
                  lineHeight: 1.7, borderTop: '1px solid var(--line)',
                }}>
                  <div style={{ paddingTop: 12 }}>{faq.a}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* NEWS */}
      <div id="news" style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 16px' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>INTELLIGENCE FEED</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 24 }}>
          LATEST UPDATES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--line)]">
          {NEWS.map((n) => (
            <a key={n.title} href={n.url} target="_blank" rel="noopener noreferrer"
              style={{
                background: 'var(--bg-1)', padding: '16px', display: 'block',
                textDecoration: 'none', transition: 'background 120ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span className="font-mono" style={{
                  fontSize: 8, letterSpacing: 1.5, padding: '2px 6px', borderRadius: 4,
                  border: `1px solid ${n.color}`, color: n.color, background: `${n.color}18`,
                }}>
                  {n.tag}
                </span>
                <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)' }}>{n.source}</span>
                <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, fontWeight: 500 }}>{n.title}</p>
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 1, display: 'block', marginTop: 8 }}>
                READ ARTICLE →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* PROTECT YOURSELF */}
      <div id="protect" style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 16px' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 8 }}>PROTECTIVE EQUIPMENT</p>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 4 }}>
          PROTECT YOURSELF
        </h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dim)', marginBottom: 24 }}>Affiliate links support this free tracker. Prices approximate.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[var(--line)]">
          {GEAR.map((g) => (
            <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer"
              style={{
                background: 'var(--bg-1)', padding: '16px', display: 'block',
                textDecoration: 'none', transition: 'background 120ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-1)')}>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: 1.5, marginBottom: 8 }}>
                AMAZON ↗
              </div>
              <p style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{g.name}</p>
              <p style={{ fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.5, marginBottom: 12 }}>{g.desc}</p>
              <div style={{
                borderTop: '1px dashed var(--line-strong)', paddingTop: 10,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>{g.price}</span>
                <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1 }}>VIEW →</span>
              </div>
            </a>
          ))}
        </div>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 12, opacity: 0.5 }}>
          Amazon Associate · Prices vary · Not medical advice
        </p>
      </div>

      {/* EMAIL ALERT CAPTURE */}
      <div id="alerts" style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 16px' }}>
        <div style={{
          background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
          borderRadius: 12, padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div className="hazard-stripe" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 3, marginBottom: 12 }}>
              OUTBREAK ALERTS
            </p>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--fg)', letterSpacing: 1, marginBottom: 8 }}>
              STAY INFORMED
            </h2>
            <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
              Immediate alerts when new Andes virus cases are confirmed. No spam.
            </p>
            <div style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto' }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="font-mono"
                style={{
                  flex: 1, background: 'var(--bg)', border: '1px solid var(--line-strong)',
                  borderRadius: 8, padding: '10px 14px', color: 'var(--fg)', fontSize: 12,
                  outline: 'none',
                }}
              />
              <button style={{
                background: 'var(--red)', color: '#fff', border: 'none',
                borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700,
                fontFamily: 'Space Mono, monospace', letterSpacing: 1, cursor: 'pointer',
                transition: 'opacity 150ms',
              }}>
                SUBSCRIBE
              </button>
            </div>
            <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 12, opacity: 0.6 }}>
              JOIN THOUSANDS MONITORING THE ANDES VIRUS OUTBREAK
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ maxWidth: 900, margin: '48px auto', padding: '24px 16px', borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="font-display" style={{ fontSize: 12, color: 'var(--fg-dim)', letterSpacing: 2 }}>
              ANDESVIRUSTRACKER.COM
            </span>
            <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 4, opacity: 0.5 }}>
              Data: WHO · CDC · ECDC · Not medical advice · Not affiliated with any government body
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {['About', 'Privacy', 'Contact'].map(l => (
              <a key={l} className="font-mono" href="#"
                style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 1.5, textDecoration: 'none' }}>
                {l.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', marginTop: 16, opacity: 0.3 }}>
          © 2026 ANDESVIRUSTRACKER.COM
        </p>
      </footer>

    </div>
  )
}

const MARKERS_COUNT = 14
