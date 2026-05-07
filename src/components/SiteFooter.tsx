import Link from 'next/link'

const PAGES = [
  { href: '/andes-virus-transmission',      label: 'Transmission' },
  { href: '/andes-virus-symptoms',          label: 'Symptoms' },
  { href: '/andes-virus-incubation-period', label: 'Incubation Period' },
  { href: '/andes-virus-vs-hantavirus',     label: 'vs Hantavirus' },
  { href: '/andes-virus-news',              label: 'News Feed' },
]

export default function SiteFooter() {
  return (
    <footer style={{ maxWidth: 960, margin: '64px auto 0', padding: '24px 16px', borderTop: '1px solid var(--line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div>
          <div className="font-display" style={{ fontSize: 12, color: 'var(--fg)', letterSpacing: 2, marginBottom: 12 }}>ANDES VIRUS TRACKER</div>
          <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', lineHeight: 1.8, opacity: 0.6 }}>
            Real-time tracking of the 2026 Andes virus outbreak. Data from WHO, CDC, and ECDC.
          </p>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 12 }}>PAGES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PAGES.map(p => (
              <Link key={p.href} href={p.href} className="font-mono" style={{ fontSize: 10, color: 'var(--fg-dim)', textDecoration: 'none', letterSpacing: 0.5 }}>
                → {p.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 12 }}>SOURCES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'WHO Disease Outbreak Notice', url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599' },
              { label: 'CDC Hantavirus', url: 'https://www.cdc.gov/hantavirus' },
              { label: 'ECDC Assessment', url: 'https://www.ecdc.europa.eu' },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 9, color: 'var(--blue)', textDecoration: 'none', opacity: 0.8 }}>↗ {s.label}</a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <p className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', lineHeight: 1.9, opacity: 0.5 }}>
          LEGAL DISCLAIMER — AndesVirusTracker.com is operated by M&W Business Development LLC. This website is for informational and educational purposes only. Not affiliated with WHO, CDC, or any government agency. Nothing on this site constitutes medical advice, diagnosis, or treatment. If you believe you have been exposed to any infectious disease, contact a licensed healthcare provider immediately. Affiliate links earn commissions from qualifying Amazon purchases. © 2026 M&W Business Development LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
