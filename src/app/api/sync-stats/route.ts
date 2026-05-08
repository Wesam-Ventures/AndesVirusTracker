import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const RSS_FEEDS = [
  'https://www.google.com/alerts/feeds/05208475767620682448/16790464954089800949',
  'https://www.google.com/alerts/feeds/05208475767620682448/2344984621188625173',
  'https://www.google.com/alerts/feeds/05208475767620682448/12897857962816603385',
]

// Extract the highest number matching a pattern across all text
function extractMax(texts: string[], patterns: RegExp[]): number | null {
  let max: number | null = null
  for (const text of texts) {
    for (const pat of patterns) {
      const m = text.match(pat)
      if (m) {
        const n = parseInt(m[1].replace(/,/g, ''), 10)
        if (!isNaN(n) && (max === null || n > max)) max = n
      }
    }
  }
  return max
}

function extractLatestBreaking(items: { title: string; url: string; date: string }[]): { text: string; url: string } | null {
  // Pick the most recent item that looks like a case update
  const keywords = /case|death|confirm|outbreak|victim|infect|kill|spread/i
  const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  for (const item of sorted) {
    if (keywords.test(item.title)) {
      return { text: item.title.replace(/ - [^-]+$/, '').trim(), url: item.url }
    }
  }
  return sorted[0] ? { text: sorted[0].title.replace(/ - [^-]+$/, '').trim(), url: sorted[0].url } : null
}

// WHO sources to scrape for official risk level
const WHO_SOURCES = [
  'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599',
  'https://www.who.int/emergencies/disease-outbreak-news',
]

async function fetchWHORiskLevel(): Promise<string | null> {
  for (const url of WHO_SOURCES) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'AndesVirusTracker/1.0' },
        next: { revalidate: 0 },
      })
      if (!res.ok) continue
      const html = await res.text()
      // Strip tags for clean text matching
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

      // WHO uses specific language around risk assessment
      const patterns: [RegExp, string][] = [
        [/overall\s+(?:public\s+health\s+)?risk[^.]{0,80}very\s+high/i, 'CRITICAL'],
        [/overall\s+(?:public\s+health\s+)?risk[^.]{0,80}high/i, 'HIGH'],
        [/overall\s+(?:public\s+health\s+)?risk[^.]{0,80}moderate/i, 'MODERATE'],
        [/overall\s+(?:public\s+health\s+)?risk[^.]{0,80}low/i, 'LOW'],
        [/risk\s+(?:to\s+the\s+general\s+public\s+)?(?:is|remains)\s+very\s+high/i, 'CRITICAL'],
        [/risk\s+(?:to\s+the\s+general\s+public\s+)?(?:is|remains)\s+high/i, 'HIGH'],
        [/risk\s+(?:to\s+the\s+general\s+public\s+)?(?:is|remains)\s+moderate/i, 'MODERATE'],
        [/risk\s+(?:to\s+the\s+general\s+public\s+)?(?:is|remains)\s+low/i, 'LOW'],
      ]
      for (const [pattern, level] of patterns) {
        if (pattern.test(text)) return level
      }
    } catch { continue }
  }
  return null
}

async function fetchFeed(url: string): Promise<{ title: string; summary: string; url: string; date: string }[]> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'AndesVirusTracker/1.0' }, next: { revalidate: 0 } })
    if (!res.ok) return []
    const xml = await res.text()
    const items: { title: string; summary: string; url: string; date: string }[] = []
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    let match
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1]
      // Decode entities first, THEN strip tags so encoded tags like &lt;b&gt; get cleaned too
      const rawTitle = (entry.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || ''
      const title = rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]+>/g, '').trim()
      const summary = (entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || [])[1]?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').trim() || ''
      // Extract real URL from Google redirect (url= param) or use href directly
      const rawLink = (entry.match(/<link[^>]+href="([^"]+)"/) || [])[1] || ''
      const urlParam = rawLink.match(/[?&]url=([^&]+)/)
      const link = urlParam ? decodeURIComponent(urlParam[1]) : rawLink
      const updated = (entry.match(/<updated>([\s\S]*?)<\/updated>/) || [])[1]?.trim() || ''
      if (title) items.push({ title, summary, url: link, date: updated })
    }
    return items
  } catch { return [] }
}

export async function GET(req: NextRequest) {
  // Allow Vercel cron (no auth header) or manual call with secret
  const auth = req.headers.get('authorization')
  const cronHeader = req.headers.get('x-vercel-cron')
  if (!cronHeader && auth !== `Bearer ${process.env.SYNC_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Fetch RSS feeds + WHO page in parallel
  const [feedResults, whoRiskLevel] = await Promise.all([
    Promise.all(RSS_FEEDS.map(fetchFeed)),
    fetchWHORiskLevel(),
  ])
  const allItems = feedResults.flat()

  if (allItems.length === 0) {
    return NextResponse.json({ ok: false, reason: 'no feed items' })
  }

  const texts = allItems.map(i => `${i.title} ${i.summary}`)

  // Extract stats using multiple pattern variants
  const cases = extractMax(texts, [
    /(\d[\d,]*)\s+confirmed cases?/i,
    /(\d[\d,]*)\s+cases?\s+(?:of\s+)?(?:Andes|hantavirus)/i,
    /(\d[\d,]*)\s+(?:Andes|hantavirus)\s+cases?/i,
    /cases?\s+(?:rise|rises|total|reach|reaches|now)\s+(?:to\s+)?(\d[\d,]*)/i,
    /total\s+(?:of\s+)?(\d[\d,]*)\s+cases?/i,
  ])

  const deaths = extractMax(texts, [
    /(\d[\d,]*)\s+deaths?/i,
    /(\d[\d,]*)\s+(?:people\s+)?(?:have\s+)?died/i,
    /killed?\s+(\d[\d,]*)/i,
    /(\d[\d,]*)\s+fatalities/i,
    /(\d[\d,]*)\s+dead/i,
  ])

  const countries = extractMax(texts, [
    /(\d[\d,]*)\s+countries/i,
    /(\d[\d,]*)\s+nations/i,
    /spread(?:ing)?\s+to\s+(\d[\d,]*)/i,
    /(\d[\d,]*)\s+nationalities/i,
  ])

  const exposed = extractMax(texts, [
    /(\d[\d,]*)\s+passengers/i,
    /(\d[\d,]*)\+?\s+(?:people\s+)?(?:on\s+)?(?:board|aboard)/i,
    /(\d[\d,]*)\s+(?:people\s+)?exposed/i,
  ])

  // Get current stats to avoid regressing numbers
  const currentRes = await fetch(`${SUPABASE_URL}/rest/v1/andes_stats?id=eq.1&select=*`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  })
  const [current] = currentRes.ok ? await currentRes.json() : [{}]

  // Only update if we found higher numbers (cases don't go down)
  const updates: Record<string, number | string> = {
    last_updated: new Date().toISOString(),
  }

  if (cases !== null && cases > (current?.confirmed_cases ?? 0)) updates.confirmed_cases = cases
  if (deaths !== null && deaths > (current?.deaths ?? 0)) updates.deaths = deaths
  if (countries !== null && countries > (current?.countries_monitoring ?? 0)) updates.countries_monitoring = countries
  if (exposed !== null && exposed > (current?.exposed_passengers ?? 0)) updates.exposed_passengers = exposed

  // WHO risk level — only escalate, never de-escalate automatically
  const RISK_ORDER = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']
  if (whoRiskLevel) {
    const currentLevel = current?.who_risk_level ?? 'LOW'
    if (RISK_ORDER.indexOf(whoRiskLevel) >= RISK_ORDER.indexOf(currentLevel)) {
      updates.who_risk_level = whoRiskLevel
    }
  }

  // Update breaking news from latest article
  const breaking = extractLatestBreaking(allItems)
  if (breaking) {
    updates.breaking_news = breaking.text.substring(0, 200)
    updates.breaking_news_url = breaking.url
  }

  // Calculate day count from April 28, 2026 (first outbreak date)
  const outbreakStart = new Date('2026-04-28')
  const dayCount = Math.floor((Date.now() - outbreakStart.getTime()) / (1000 * 60 * 60 * 24))
  updates.day_count = dayCount

  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/andes_stats?id=eq.1`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(updates),
  })

  const updated = patchRes.ok ? await patchRes.json() : null

  // MARK: - Auto-ingest top RSS items into andes_news
  const newsInserted = await ingestRssIntoNews(allItems)

  return NextResponse.json({
    ok: true,
    extracted: { cases, deaths, countries, exposed, whoRiskLevel },
    updates,
    articlesScanned: allItems.length,
    newsInserted,
  })
}

// MARK: - News ingestion helpers

const SOURCE_LABEL_MAP: Record<string, string> = {
  'who.int': 'WHO',
  'cnn.com': 'CNN',
  'nytimes.com': 'NY TIMES',
  'bbc.com': 'BBC',
  'bbc.co.uk': 'BBC',
  'reuters.com': 'REUTERS',
  'apnews.com': 'AP',
  'theguardian.com': 'GUARDIAN',
  'washingtonpost.com': 'WASHINGTON POST',
  'bloomberg.com': 'BLOOMBERG',
}

function deriveSourceLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase()
    if (SOURCE_LABEL_MAP[host]) return SOURCE_LABEL_MAP[host]
    // Match parent domain (e.g. "edition.cnn.com" -> "cnn.com")
    for (const key of Object.keys(SOURCE_LABEL_MAP)) {
      if (host.endsWith(`.${key}`)) return SOURCE_LABEL_MAP[key]
    }
    return host.toUpperCase()
  } catch {
    return 'NEWS'
  }
}

async function newsRowExists(sourceUrl: string): Promise<boolean> {
  try {
    const encoded = encodeURIComponent(sourceUrl)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/andes_news?select=id&source_url=eq.${encoded}&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    )
    if (!res.ok) {
      console.log('[sync-stats] news lookup failed', res.status, sourceUrl)
      return false
    }
    const rows = await res.json()
    return Array.isArray(rows) && rows.length > 0
  } catch (err) {
    console.log('[sync-stats] news lookup error', err)
    return false
  }
}

async function ingestRssIntoNews(
  items: { title: string; summary: string; url: string; date: string }[],
): Promise<number> {
  // Deduplicate by title (first occurrence wins)
  const seen = new Set<string>()
  const unique = items.filter(i => {
    const key = i.title.trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Sort by date desc and take top 5
  const top = [...unique]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  console.log('[sync-stats] candidate news items:', top.length, 'of', unique.length, 'unique')

  let inserted = 0
  for (const item of top) {
    if (!item.url) continue

    const exists = await newsRowExists(item.url)
    if (exists) {
      console.log('[sync-stats] skip existing news', item.url)
      continue
    }

    const headline = item.title.substring(0, 300)
    const summaryText = (item.summary || '').trim()
    const body = (summaryText ? summaryText : headline).substring(0, 500)
    const publishedAt = item.date ? new Date(item.date).toISOString() : new Date().toISOString()

    const payload = {
      headline,
      body,
      source_label: deriveSourceLabel(item.url),
      source_url: item.url,
      tag: 'UPDATE',
      tag_color: '#94a3b8',
      published_at: publishedAt,
    }

    console.log('[sync-stats] inserting news', payload.source_label, headline)

    const res = await fetch(`${SUPABASE_URL}/rest/v1/andes_news`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      inserted++
    } else {
      const errText = await res.text().catch(() => '')
      console.log('[sync-stats] news insert failed', res.status, errText)
    }
  }

  console.log('[sync-stats] news inserted total:', inserted)
  return inserted
}
