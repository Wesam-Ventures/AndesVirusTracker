import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Andes Virus News & Updates 2026 — MV Hondius Outbreak',
  description: 'Latest Andes virus news, case updates, and WHO/CDC statements. Chronological timeline of the 2026 MV Hondius hantavirus outbreak. Updated daily.',
  keywords: ['Andes virus news', 'hantavirus news 2026', 'MV Hondius update', 'Andes virus outbreak updates', 'hantavirus cruise ship news'],
  openGraph: {
    title: 'Andes Virus News & Updates 2026 — MV Hondius Outbreak',
    description: 'Latest case updates, WHO statements, and outbreak news — updated daily.',
    url: 'https://andesvirustracker.com/andes-virus-news',
    type: 'article',
    publishedTime: '2026-05-07T00:00:00Z',
    modifiedTime: '2026-05-07T14:00:00Z',
    images: [{ url: '/og?title=Andes+Virus+News+2026&sub=Latest+WHO+%2F+CDC+outbreak+updates', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://andesvirustracker.com/andes-virus-news' },
}

const newsJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'Andes Virus 2026 Outbreak — MV Hondius Case Timeline',
    description: 'Chronological timeline of the 2026 Andes virus outbreak linked to the MV Hondius polar expedition cruise.',
    datePublished: '2026-05-07T00:00:00Z',
    dateModified: '2026-05-07T14:00:00Z',
    author: { '@type': 'Organization', name: 'AndesVirusTracker.com' },
    publisher: { '@type': 'Organization', name: 'AndesVirusTracker.com', logo: { '@type': 'ImageObject', url: 'https://andesvirustracker.com/og' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://andesvirustracker.com/andes-virus-news' },
    image: 'https://andesvirustracker.com/og?title=Andes+Virus+News+2026',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://andesvirustracker.com' },
      { '@type': 'ListItem', position: 2, name: 'Andes Virus News', item: 'https://andesvirustracker.com/andes-virus-news' },
    ],
  },
]

const TIMELINE = [
  {
    date: 'May 7, 2026', tag: 'CONFIRMED', color: '#ef4444',
    headline: 'Swiss passenger tests positive for Andes strain — cases spread to 23 nationalities',
    body: 'A flight attendant and a Swiss passenger returning from the MV Hondius voyage have both tested positive for Andes virus. The total confirmed case count rises to 8, with 3 confirmed deaths. Health authorities in 23 countries are actively monitoring returned passengers.',
    sources: [{ label: 'Global News', url: 'https://globalnews.ca/news/11836710/hantavirus-cruise-ship-andes-strain-new-case-confirmed-switzerland/' }],
  },
  {
    date: 'May 6, 2026', tag: 'WHO OFFICIAL', color: '#3b82f6',
    headline: 'WHO issues Disease Outbreak Notice — multi-country Andes virus cluster confirmed',
    body: 'The World Health Organization formally issued Disease Outbreak Notice DON-599 confirming a multi-country cluster of Andes virus disease linked to the MV Hondius polar expedition vessel. WHO Director-General Tedros stated "overall public health risk remains low" but called for active monitoring of all returned passengers.',
    sources: [{ label: 'WHO DON-599', url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599' }, { label: 'CNN', url: 'https://www.cnn.com/2026/05/06/health/andes-strain-hantavirus-explained' }],
  },
  {
    date: 'May 5, 2026', tag: 'CONFIRMED', color: '#ef4444',
    headline: 'Andes strain identified — first confirmed person-to-person hantavirus cluster on a vessel',
    body: 'CBC News reports that the Andes strain of hantavirus has been specifically confirmed. NPR and NBC News report that this is the first documented multi-country cluster involving person-to-person Andes virus transmission on a ship. Two additional cases confirmed, bringing total to 5 with 2 deaths.',
    sources: [{ label: 'NPR', url: 'https://www.npr.org/2026/05/05/g-s1-120234/cruise-ship-hantavirus' }, { label: 'CBC', url: 'https://www.cbc.ca/news/health/hondius-ship-hantavirus-andes-strain-9.7189281' }],
  },
  {
    date: 'May 4, 2026', tag: 'MEDIA', color: '#f59e0b',
    headline: 'US CDC confirms monitoring of American passengers from MV Hondius',
    body: 'The US Centers for Disease Control and Prevention confirmed it is actively monitoring American citizens who were passengers aboard the MV Hondius. Similar monitoring announcements were made by health authorities in the EU and Singapore.',
    sources: [{ label: 'NBC News', url: 'https://www.nbcnews.com/health/health-news/us-monitoring-hantavirus-cruise-passengers-new-case-flight-attendant-rcna343990' }],
  },
  {
    date: 'May 3, 2026', tag: 'BREAKING', color: '#ef4444',
    headline: 'First deaths reported — MV Hondius hantavirus cluster identified',
    body: 'The first fatalities from the MV Hondius outbreak are reported. The Antarctic expedition cruise ship is carrying passengers from over 23 nationalities. The vessel is near Cape Verde. Initial case count stands at 3, with 1 confirmed death. Hantavirus is suspected but strain not yet confirmed.',
    sources: [{ label: 'Reuters', url: 'https://www.reuters.com' }],
  },
  {
    date: 'Apr 28, 2026', tag: 'ORIGIN', color: '#64748b',
    headline: 'First cases appear aboard MV Hondius in Antarctic waters',
    body: 'The first cluster of illness is identified aboard the polar expedition vessel MV Hondius, operated by Oceanwide Expeditions. The ship has passengers from multiple countries who joined in Ushuaia, Argentina — an area where Andes virus is endemic. Initial symptoms resemble severe influenza.',
    sources: [{ label: 'Oceanwide Expeditions', url: 'https://oceanwide-expeditions.com' }],
  },
]

export default function NewsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {newsJsonLd.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <SiteNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 0' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 12 }}>OUTBREAK TIMELINE · UPDATED MAY 7, 2026</p>
        <h1 className="font-display" style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 8 }}>
          Andes Virus News<br /><span style={{ color: 'var(--red)' }}>2026 Outbreak Updates</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.7, marginBottom: 32 }}>
          Chronological timeline of the 2026 Andes virus outbreak linked to the MV Hondius polar expedition cruise. All updates sourced from WHO, CDC, ECDC, and credible news organizations.
        </p>

        {/* Status bar */}
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'CONFIRMED CASES', value: '8', color: 'var(--red)' },
            { label: 'DEATHS', value: '3', color: 'var(--red)' },
            { label: 'COUNTRIES', value: '23', color: 'var(--amber)' },
            { label: 'LAST UPDATE', value: 'May 7', color: 'var(--blue)' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-mono" style={{ fontSize: 18, color: s.color, fontWeight: 700 }}>{s.value}</div>
              <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 1, background: 'var(--line)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ paddingLeft: 28, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 6, width: 15, height: 15, borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}60`, zIndex: 1 }} />
                <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 10, padding: '16px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                    <span className="font-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, border: `1px solid ${item.color}50`, color: item.color, background: `${item.color}12`, letterSpacing: 1 }}>{item.tag}</span>
                    <span className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)' }}>{item.date}</span>
                  </div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', lineHeight: 1.4, marginBottom: 8 }}>{item.headline}</h2>
                  <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, marginBottom: 10 }}>{item.body}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {item.sources.map(s => (
                      <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 9, color: 'var(--blue)', textDecoration: 'none', letterSpacing: 1 }}>↗ {s.label}</a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 40, marginBottom: 32 }}>
          <Link href="/" style={{ flex: 1, minWidth: 160, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 2, marginBottom: 4 }}>LIVE →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Live Case Counter & Map</div>
          </Link>
          <Link href="/andes-virus-transmission" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>LEARN →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>How It Spreads</div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
