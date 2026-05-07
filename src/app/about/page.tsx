import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About AndesVirusTracker.com — Editorial Standards & Mission',
  description: 'AndesVirusTracker.com is operated by M&W Business Development LLC. Learn about our editorial standards, data sources, and mission to provide accurate public health information.',
  alternates: { canonical: 'https://andesvirustracker.com/about' },
  openGraph: {
    title: 'About AndesVirusTracker.com',
    description: 'Our mission, editorial standards, and data sourcing practices.',
    url: 'https://andesvirustracker.com/about',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About AndesVirusTracker.com',
    url: 'https://andesvirustracker.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'AndesVirusTracker.com',
      legalName: 'M&W Business Development LLC',
      url: 'https://andesvirustracker.com',
      foundingDate: '2026',
      description: 'AndesVirusTracker.com provides real-time tracking of the 2026 Andes virus outbreak, including case data, interactive maps, and public health guidance sourced from WHO, CDC, and ECDC.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'editorial',
        email: 'contact@andesvirustracker.com',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://andesvirustracker.com' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://andesvirustracker.com/about' },
    ],
  },
]

const SOURCES = [
  { name: 'World Health Organization (WHO)', role: 'Disease Outbreak Notices, official case counts', url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599', tag: 'PRIMARY' },
  { name: 'European Centre for Disease Prevention and Control (ECDC)', role: 'Rapid risk assessments and EU monitoring data', url: 'https://www.ecdc.europa.eu', tag: 'PRIMARY' },
  { name: 'US Centers for Disease Control (CDC)', role: 'Hantavirus clinical guidance and US passenger monitoring', url: 'https://www.cdc.gov/hantavirus', tag: 'PRIMARY' },
  { name: 'New England Journal of Medicine', role: 'Peer-reviewed research on Andes virus person-to-person transmission', url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2009040', tag: 'RESEARCH' },
  { name: 'CBC News, NPR, CNN, NBC News, Time, Live Science', role: 'Breaking news coverage verified against official sources', url: '#', tag: 'MEDIA' },
]

const EDITORIAL_STANDARDS = [
  { title: 'Primary source first', body: 'Every data point on this site is sourced directly from WHO, CDC, or ECDC official communications. We do not publish case counts from unverified sources.' },
  { title: 'Corrections policy', body: 'If a data point is updated by an official source, we update it within 24 hours and note the change. Historical data is never silently altered.' },
  { title: 'Medical disclaimer enforced', body: 'Nothing on this site constitutes medical advice. Every clinical page includes a clear disclaimer. Our risk tools are informational only.' },
  { title: 'No sensationalism', body: 'We present data as-is. We do not inflate severity or downplay risk. Our risk level (currently MODERATE) reflects WHO\'s own published assessment.' },
  { title: 'Affiliate disclosure', body: 'The Protect Yourself section contains Amazon affiliate links. These are clearly labeled. Affiliate revenue supports site operations and does not influence editorial content.' },
]

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {jsonLd.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <SiteNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 0' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 12 }}>ABOUT THIS SITE</p>

        <h1 className="font-display" style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 16 }}>
          About<br /><span style={{ color: 'var(--red)' }}>AndesVirusTracker.com</span>
        </h1>

        <p style={{ fontSize: 15, color: 'var(--fg-mute)', lineHeight: 1.8, marginBottom: 32 }}>
          AndesVirusTracker.com is a real-time public health information site tracking the 2026 Andes virus outbreak. We aggregate and present data from official health authorities — WHO, CDC, and ECDC — in a format that is accessible, accurate, and actionable for the public.
        </p>

        {/* Operator card */}
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px', marginBottom: 32 }}>
          <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 12 }}>OPERATED BY</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>M&W Business Development LLC</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--fg-dim)', lineHeight: 1.8 }}>
                Founded: 2026<br />
                Focus: Digital media and public information services<br />
                Contact: contact@andesvirustracker.com
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'LAUNCHED', value: 'May 7, 2026' },
                { label: 'PAGES', value: '6 active' },
                { label: 'DATA SOURCES', value: 'WHO · CDC · ECDC' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: 6, padding: '6px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 1.5 }}>{s.label}</span>
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--fg)', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>OUR MISSION</h2>
        <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.8, marginBottom: 12 }}>
          During a public health event, accurate information is a public good. Misinformation spreads faster than viruses. Our mission is to provide a single, reliable reference point that answers the questions people are actually asking — in plain language, sourced from official authorities.
        </p>
        <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.8, marginBottom: 32 }}>
          The Andes virus outbreak of 2026 is particularly significant because Andes virus is the only hantavirus strain confirmed to spread person-to-person. This makes accurate public communication especially important. We built this site to fill that gap.
        </p>

        {/* Editorial standards */}
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>EDITORIAL STANDARDS</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {EDITORIAL_STANDARDS.map(s => (
            <div key={s.title} style={{ background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12 }}>
              <div style={{ width: 3, flexShrink: 0, background: 'var(--red)', borderRadius: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{s.title}</div>
                <p style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Data sources */}
        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>DATA SOURCES</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line)', borderRadius: 10, overflow: 'hidden', marginBottom: 32 }}>
          {SOURCES.map(s => (
            <div key={s.name} style={{ background: 'var(--bg-1)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, border: `1px solid ${s.tag === 'PRIMARY' ? 'rgba(59,130,246,0.4)' : s.tag === 'RESEARCH' ? 'rgba(74,222,128,0.4)' : 'rgba(148,163,184,0.3)'}`, color: s.tag === 'PRIMARY' ? 'var(--blue)' : s.tag === 'RESEARCH' ? 'var(--green)' : 'var(--fg-dim)', letterSpacing: 1, flexShrink: 0, marginTop: 2 }}>{s.tag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginBottom: 2 }}>{s.name}</div>
                <p style={{ fontSize: 12, color: 'var(--fg-mute)' }}>{s.role}</p>
              </div>
              {s.url !== '#' && (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 9, color: 'var(--blue)', textDecoration: 'none', letterSpacing: 1, flexShrink: 0 }}>↗ VIEW</a>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/" style={{ flex: 1, minWidth: 160, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 2, marginBottom: 4 }}>LIVE →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Back to Live Tracker</div>
          </Link>
          <Link href="/andes-virus-news" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>LATEST →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Latest Updates</div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
