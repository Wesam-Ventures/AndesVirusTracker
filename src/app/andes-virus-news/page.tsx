import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'
import NewsImage from './NewsImage'

// MARK: Local helper — extract a clean domain (used for source favicons)
const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return ''
  }
}

// MARK: ISR — revalidate every 60s
export const revalidate = 60

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
    modifiedTime: new Date().toISOString(),
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
    dateModified: new Date().toISOString(),
    author: { '@type': 'Organization', name: 'AndesVirusTracker.com' },
    publisher: { '@type': 'Organization', name: 'AndesVirusTracker.com', logo: { '@type': 'ImageObject', url: 'https://andesvirustracker.com/og' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://andesvirustracker.com/andes-virus-news' },
    image: 'https://andesvirustracker.com/og?title=Andes+Virus+News+2026',
  },
]

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://andesvirustracker.com' },
    { '@type': 'ListItem', position: 2, name: 'News', item: 'https://andesvirustracker.com/andes-virus-news' },
  ],
}

// MARK: Live news fetcher (Supabase REST)
type Article = {
  id?: string | number
  published_at: string
  tag: string
  tag_color: string
  headline: string
  body: string
  source_label: string
  source_url: string
  image_url?: string
}

async function getNews(): Promise<Article[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!supabaseUrl || !key) {
    console.log('[andes-virus-news] getNews: missing Supabase config, falling back to TIMELINE')
    return []
  }

  const url = `${supabaseUrl}/rest/v1/andes_news?select=*&order=published_at.desc&limit=30`
  console.log('[andes-virus-news] getNews: fetching live articles', { url })
  try {
    const res = await fetch(url, { headers: { apikey: key, Authorization: 'Bearer ' + key }, next: { revalidate: 60 } })
    if (!res.ok) {
      console.log('[andes-virus-news] getNews: non-OK response, falling back', { status: res.status })
      return []
    }
    const data = (await res.json()) as Article[]
    console.log('[andes-virus-news] getNews: loaded articles', { count: Array.isArray(data) ? data.length : 0 })
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.log('[andes-virus-news] getNews: fetch failed, falling back to TIMELINE', err)
    return []
  }
}

// MARK: Hardcoded fallback timeline (used when live fetch returns nothing)
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

export default async function AndesVirusNewsPage() {
  const articles = await getNews()
  console.log('[andes-virus-news] render: using source', { source: articles.length > 0 ? 'live' : 'fallback', count: articles.length })

  // MARK: Normalize live articles into the same shape as TIMELINE so the JSX stays untouched
  const items = articles.length > 0
    ? articles.map((a) => ({
        date: new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tag: a.tag,
        color: a.tag_color,
        headline: a.headline,
        body: a.body,
        sources: [{ label: a.source_label, url: a.source_url }],
        image_url: a.image_url,
      }))
    : TIMELINE.map((t) => ({ ...t, image_url: undefined as string | undefined }))

  const updatedLabel = articles[0]?.published_at
    ? new Date(articles[0].published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'MAY 7, 2026'

  // MARK: Hero is the first article; the rest go into the grid
  const hero = items[0]
  const rest = items.slice(1)
  const heroUrl = hero?.sources[0]?.url || '#'
  const heroDomain = hero ? getDomain(heroUrl) : ''
  console.log('[andes-virus-news] hero & grid split', { hasHero: !!hero, gridCount: rest.length, heroHasImage: !!hero?.image_url })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {newsJsonLd.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <SiteNav />

      {/* Local responsive sizing for the hero card */}
      <style dangerouslySetInnerHTML={{ __html: `
        .news-hero-card { height: 280px; }
        @media (min-width: 768px) { .news-hero-card { height: 420px; } }
        .news-grid-card { transition: background 150ms ease, transform 150ms ease; }
        .news-grid-card:hover { background: var(--bg-2) !important; }
      ` }} />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 64px' }}>

        {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
        <nav className="font-mono" style={{ marginBottom: 28, fontSize: 10, letterSpacing: 1.5 }}>
          <Link href="/" style={{ color: 'var(--fg-mute)', textDecoration: 'none' }}>HOME</Link>
          <span style={{ color: 'var(--fg-dim)', margin: '0 10px' }}>/</span>
          <span style={{ color: 'var(--fg)' }}>NEWS</span>
        </nav>

        {/* ── PAGE HEADER ────────────────────────────────────────────── */}
        <p className="font-mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: 3, marginBottom: 14 }}>
          INTELLIGENCE FEED
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, color: 'var(--fg)', lineHeight: 1, letterSpacing: -1, marginBottom: 14 }}>
          Andes Virus News
          <br />
          <span style={{ color: 'var(--red)' }}>2026 Outbreak Updates</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.7, marginBottom: 28, maxWidth: 680 }}>
          Chronological timeline of the 2026 Andes virus outbreak linked to the MV Hondius polar expedition cruise. All updates sourced from WHO, CDC, ECDC, and credible news organizations.
        </p>

        {/* ── STATS BAR ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 36, padding: '16px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginBottom: 36, flexWrap: 'wrap' }}>
          <div>
            <div className="font-mono" style={{ fontSize: 22, color: 'var(--fg)', fontWeight: 700, lineHeight: 1 }}>{items.length}</div>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginTop: 6 }}>ARTICLES</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: 22, color: 'var(--blue)', fontWeight: 700, lineHeight: 1 }}>{updatedLabel}</div>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginTop: 6 }}>LAST UPDATED</div>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: 22, color: 'var(--green)', fontWeight: 700, lineHeight: 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="blink" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px #4ade80', display: 'inline-block' }} />
              LIVE
            </div>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginTop: 6 }}>FEED STATUS</div>
          </div>
        </div>

        {/* ── EMPTY STATE ────────────────────────────────────────────── */}
        {items.length === 0 && (
          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 12, padding: '80px 24px', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 12 }}>NO SIGNAL</div>
            <p style={{ fontSize: 16, color: 'var(--fg-mute)' }}>No articles yet — check back soon</p>
          </div>
        )}

        {/* ── HERO ARTICLE ───────────────────────────────────────────── */}
        {hero && (
          <a
            href={heroUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={'news-hero-card' + (!hero.image_url ? ' hazard-stripe' : '')}
            style={{
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 14,
              marginBottom: 32,
              textDecoration: 'none',
              border: '1px solid var(--line-strong)',
              background: hero.image_url
                ? `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 100%), url("${hero.image_url}") center/cover no-repeat`
                : 'var(--bg-1)',
            }}
          >
            {/* Top-left meta strip */}
            <div style={{ position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ fontSize: 9, padding: '4px 8px', borderRadius: 4, border: `1px solid ${hero.color}80`, color: hero.color, background: `${hero.color}25`, letterSpacing: 1.5, fontWeight: 700, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                {hero.tag}
              </span>
              <span className="font-mono" style={{ fontSize: 10, color: '#fff', letterSpacing: 1, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.55)', padding: '4px 8px', borderRadius: 4, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                {heroDomain && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${heroDomain}&sz=32`}
                    alt=""
                    style={{ width: 12, height: 12, borderRadius: 2, objectFit: 'cover' }}
                  />
                )}
                {hero.sources[0]?.label}
              </span>
              <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 1, background: 'rgba(0,0,0,0.55)', padding: '4px 8px', borderRadius: 4, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                {hero.date}
              </span>
            </div>

            {/* Bottom content */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px 26px' }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 12, textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}>
                {hero.headline}
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, marginBottom: 14, maxWidth: 720, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {hero.body}
              </p>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--red)', letterSpacing: 2, fontWeight: 700 }}>
                READ FULL ARTICLE →
              </span>
            </div>
          </a>
        )}

        {/* ── ARTICLE GRID ───────────────────────────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 14 }}>
            {rest.map((item, i) => {
              const url = item.sources[0]?.url || '#'
              const domain = getDomain(url)
              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-grid-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--bg-1)',
                    border: '1px solid var(--line)',
                    borderLeft: `3px solid ${item.color}`,
                    borderRadius: 10,
                    overflow: 'hidden',
                    textDecoration: 'none',
                  }}
                >
                  {item.image_url && <NewsImage src={item.image_url} height={200} />}
                  <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                      <span className="font-mono" style={{ fontSize: 9, padding: '3px 9px', borderRadius: 999, border: `1px solid ${item.color}55`, color: item.color, background: `${item.color}15`, letterSpacing: 1.5, fontWeight: 700 }}>
                        {item.tag}
                      </span>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, marginLeft: 'auto' }}>
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)', lineHeight: 1.3, marginBottom: 8, letterSpacing: -0.2 }}>
                      {item.headline}
                    </h3>
                    <p style={{ fontSize: 12.5, color: 'var(--fg-mute)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.body}
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px dashed var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {domain && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                            alt=""
                            style={{ width: 14, height: 14, borderRadius: 2, objectFit: 'cover' }}
                          />
                        )}
                        {item.sources[0]?.label}
                      </span>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--red)', letterSpacing: 1.5, fontWeight: 700 }}>
                        READ →
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* ── BOTTOM NAV CTAs ────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 40 }}>
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
