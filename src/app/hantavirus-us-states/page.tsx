import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Hantavirus US State Monitoring 2026 — MV Hondius Outbreak by State',
  description: 'Texas, Virginia, Georgia, California, Arizona, and New Jersey are actively monitoring returned MV Hondius cruise ship passengers for Andes hantavirus. State-by-state tracking and guidance.',
  keywords: ['hantavirus Texas', 'hantavirus Virginia', 'hantavirus Georgia', 'hantavirus California', 'hantavirus Arizona', 'hantavirus New Jersey', 'MV Hondius passengers US states', 'hantavirus US monitoring 2026'],
  alternates: { canonical: 'https://andesvirustracker.com/hantavirus-us-states' },
  openGraph: {
    title: 'Hantavirus US State Monitoring 2026 — MV Hondius Outbreak',
    description: '6 US states monitoring returned MV Hondius cruise passengers for Andes hantavirus. State health department links and guidance.',
    url: 'https://andesvirustracker.com/hantavirus-us-states',
    images: [{ url: 'https://andesvirustracker.com/og', width: 1200, height: 630 }],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://andesvirustracker.com' },
    { '@type': 'ListItem', position: 2, name: 'US State Monitoring', item: 'https://andesvirustracker.com/hantavirus-us-states' },
  ],
}

const STATES = [
  { name: 'Virginia', abbr: 'VA', dept: 'Virginia Department of Health', url: 'https://www.vdh.virginia.gov', note: 'VDH confirmed monitoring returning passengers linked to MV Hondius' },
  { name: 'Texas', abbr: 'TX', dept: 'Texas DSHS', url: 'https://www.dshs.texas.gov', note: 'State health officials tracking passengers who returned through Texas' },
  { name: 'New Jersey', abbr: 'NJ', dept: 'NJ Department of Health', url: 'https://www.nj.gov/health', note: '2 NJ residents potentially exposed on MV Hondius flight' },
  { name: 'Georgia', abbr: 'GA', dept: 'Georgia DPH', url: 'https://dph.georgia.gov', note: 'Active monitoring of returned cruise passengers' },
  { name: 'California', abbr: 'CA', dept: 'California CDPH', url: 'https://www.cdph.ca.gov', note: 'CDPH coordinating with CDC on passenger monitoring' },
  { name: 'Arizona', abbr: 'AZ', dept: 'Arizona ADHS', url: 'https://azdhs.gov', note: 'ADHS monitoring passengers who returned through Arizona' },
]

export default function HantavirusUSStatesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteNav />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 16px 0' }}>

        {/* Breadcrumb */}
        <div className="font-mono" style={{ fontSize: 11, color: 'var(--fg-dim)', letterSpacing: 1, marginBottom: 24 }}>
          <Link href="/" style={{ color: 'var(--fg-dim)', textDecoration: 'none' }}>HOME</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--fg-mute)' }}>US STATE MONITORING</span>
        </div>

        {/* Header */}
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 3, marginBottom: 10 }}>UNITED STATES SURVEILLANCE</p>
        <h1 className="font-display" style={{ fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 900, color: 'var(--fg)', lineHeight: 0.95, letterSpacing: -1, marginBottom: 16 }}>
          Hantavirus<br /><span style={{ color: 'var(--red)' }}>US State Monitoring</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--fg-mute)', maxWidth: 600, lineHeight: 1.7, marginBottom: 8 }}>
          Following the MV Hondius Andes virus outbreak, health authorities in <strong style={{ color: 'var(--fg)' }}>6 US states</strong> are actively monitoring returned cruise passengers. The 33-day incubation window means new cases may still emerge through <strong style={{ color: 'var(--amber)' }}>May 31, 2026</strong>.
        </p>
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-dim)', letterSpacing: 1, marginBottom: 40 }}>SOURCE: CDC · ABC NEWS · NBC NEWS · STATE HEALTH DEPARTMENTS</p>

        {/* Alert banner */}
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="blink" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 10px #ef4444', flexShrink: 0 }} />
          <p className="font-mono" style={{ fontSize: 12, color: 'var(--fg)', margin: 0 }}>
            <strong style={{ color: 'var(--red)' }}>ACTIVE MONITORING</strong> — If you returned from the MV Hondius, contact your state health department immediately and monitor for fever, muscle pain, and shortness of breath.
          </p>
        </div>

        {/* States grid */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, background: 'var(--line)', marginBottom: 48, border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden' }}>
          {STATES.map(s => (
            <div key={s.abbr} style={{ background: 'var(--bg-1)', padding: '20px', borderLeft: '3px solid #3b82f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg)', letterSpacing: -0.5 }}>{s.name}</div>
                  <div className="font-mono" style={{ fontSize: 9, color: '#94a3b8', letterSpacing: 1.5 }}>{s.abbr}</div>
                </div>
                <span className="font-mono" style={{ fontSize: 9, letterSpacing: 1.5, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(59,130,246,0.4)', color: '#3b82f6', background: 'rgba(59,130,246,0.08)' }}>MONITORING</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.5, marginBottom: 12 }}>{s.note}</p>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-mono"
                style={{ fontSize: 10, color: '#3b82f6', letterSpacing: 1, textDecoration: 'none', display: 'inline-block' }}>
                {s.dept} →
              </a>
            </div>
          ))}
        </div>

        {/* What this means */}
        <div style={{ marginBottom: 48 }}>
          <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 10 }}>WHAT THIS MEANS FOR YOU</p>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.5, marginBottom: 20 }}>IF YOU WERE ON THE MV HONDIUS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { num: '01', title: 'Contact your state health department', desc: 'Notify your state\'s health department that you were aboard the MV Hondius. They will register you for monitoring and provide guidance.' },
              { num: '02', title: 'Monitor for 33 days from last exposure', desc: 'The Andes virus incubation period is 9–33 days. Monitor for fever, severe headache, muscle pain (especially lower back), fatigue, and nausea. Your window closes May 31, 2026.' },
              { num: '03', title: 'Seek emergency care immediately if symptomatic', desc: 'If you develop any symptoms, go to an emergency room immediately and explicitly tell doctors you were on the MV Hondius and may have been exposed to Andes hantavirus.' },
              { num: '04', title: 'Limit close contact during monitoring', desc: 'Andes virus is the only hantavirus that can spread person-to-person. During your monitoring period, avoid sharing food, bedding, or close prolonged contact with others.' },
            ].map(step => (
              <div key={step.num} style={{ display: 'flex', gap: 16, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '16px' }}>
                <div className="font-mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--red)', flexShrink: 0, lineHeight: 1 }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CDC link */}
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '20px', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p className="font-mono" style={{ fontSize: 10, color: '#3b82f6', letterSpacing: 1.5, marginBottom: 4 }}>CDC GUIDANCE</p>
            <p style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Official CDC hantavirus information and MV Hondius passenger guidance</p>
          </div>
          <a href="https://www.cdc.gov/hantavirus" target="_blank" rel="noopener noreferrer" className="font-mono"
            style={{ fontSize: 11, color: '#fff', background: '#3b82f6', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, letterSpacing: 1, flexShrink: 0 }}>
            CDC.GOV →
          </a>
        </div>

        {/* CTA back */}
        <div style={{ textAlign: 'center', paddingBottom: 64 }}>
          <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 2, marginBottom: 16 }}>LIVE OUTBREAK TRACKER</p>
          <Link href="/" style={{ display: 'inline-block', background: 'var(--red)', color: '#fff', borderRadius: 8, padding: '14px 32px', fontSize: 13, fontWeight: 700, fontFamily: 'Space Mono, monospace', letterSpacing: 1.5, textDecoration: 'none' }}>
            VIEW LIVE MAP & CASE DATA →
          </Link>
        </div>

      </div>
      <SiteFooter />
    </div>
  )
}
