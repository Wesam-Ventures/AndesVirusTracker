import { NextRequest, NextResponse } from 'next/server'
import {
  buildWeeklyDigestCaption,
  buildNewsTelegramCaption,
  formatDailyChangeLine,
  type TelegramArticle,
  type TelegramStats,
} from '@/lib/telegramCaptions'
import { fetchArticleMeta, type ArticleMeta } from '@/lib/articleMeta'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Service role key bypasses RLS — required for andes_events inserts
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_KEY

const RSS_FEEDS = [
  'https://www.google.com/alerts/feeds/05208475767620682448/16790464954089800949',
  'https://www.google.com/alerts/feeds/05208475767620682448/2344984621188625173',
  'https://www.google.com/alerts/feeds/05208475767620682448/12897857962816603385',
]

type FeedItem = { title: string; summary: string; url: string; date: string }
type BreakingItem = { text: string; url: string; summary?: string } | null
type NewsRow = {
  headline: string
  body: string | null
  source_url: string
  image_url?: string | null
  published_at?: string | null
}
type BackfillNewsRow = NewsRow & { id: number | string }

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

function extractLatestBreaking(items: FeedItem[]): BreakingItem {
  // Pick the most recent item that looks like a case update
  const keywords = /case|death|confirm|outbreak|victim|infect|kill|spread/i
  const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  for (const item of sorted) {
    if (keywords.test(item.title)) {
      return { text: item.title.replace(/ - [^-]+$/, '').trim(), url: item.url, summary: item.summary }
    }
  }
  return sorted[0]
    ? { text: sorted[0].title.replace(/ - [^-]+$/, '').trim(), url: sorted[0].url, summary: sorted[0].summary }
    : null
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

async function fetchFeed(url: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'AndesVirusTracker/1.0' }, next: { revalidate: 0 } })
    if (!res.ok) return []
    const xml = await res.text()
    const items: FeedItem[] = []
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    let match
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1]
      // Decode entities first, THEN strip tags so encoded tags like &lt;b&gt; get cleaned too
      const rawTitle = (entry.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || ''
      const title = rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]+>/g, '').trim()
      const summary = (entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || [])[1]?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').trim() || ''
      // Extract real URL from Google redirect (url= param) or use href directly
      const rawLink = ((entry.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '').replace(/&amp;/g, '&')
      const urlParam = rawLink.match(/[?&]url=([^&]+)/)
      const link = urlParam ? decodeURIComponent(urlParam[1]) : rawLink
      const updated = (entry.match(/<updated>([\s\S]*?)<\/updated>/) || [])[1]?.trim() || ''
      if (title) items.push({ title, summary, url: link, date: updated })
    }
    return items
  } catch { return [] }
}

// MARK: - Telegram alert
type TelegramResult = { ok: boolean; status: number; body: string; paused?: boolean; missingEnv?: boolean }

async function postTelegramAlert(text: string, imageUrl?: string | null): Promise<TelegramResult> {
  if (process.env.TELEGRAM_PAUSED === 'true') return { ok: false, status: 0, body: 'paused', paused: true }
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHANNEL_ID
  if (!token || !chatId) return { ok: false, status: 0, body: `missing env: token=${!!token} chatId=${!!chatId}`, missingEnv: true }
  try {
    let res: Response
    if (imageUrl) {
      res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, photo: imageUrl, caption: text }),
      })
    } else {
      res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false }),
      })
    }
    const body = await res.text().catch(() => '')
    if (!res.ok) console.log('[sync-stats] telegram post failed', res.status, body)
    return { ok: res.ok, status: res.status, body }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log('[sync-stats] telegram post error', msg)
    return { ok: false, status: 0, body: msg }
  }
}

// MARK: - Telegram caption data helpers
async function fetchNewsRowByUrl(sourceUrl: string | undefined): Promise<NewsRow | null> {
  if (!sourceUrl) return null
  try {
    const encoded = encodeURIComponent(sourceUrl)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/andes_news?select=headline,body,source_url,image_url,published_at&source_url=eq.${encoded}&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    )
    if (!res.ok) {
      console.log('[sync-stats] news brief lookup failed', res.status, sourceUrl)
      return null
    }
    const rows = await res.json()
    return Array.isArray(rows) ? rows[0] ?? null : null
  } catch (err) {
    console.log('[sync-stats] news brief lookup error', err)
    return null
  }
}

async function fetchLatestNewsRow(): Promise<NewsRow | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/andes_news?select=headline,body,source_url,image_url,published_at&order=published_at.desc&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    )
    if (!res.ok) {
      console.log('[sync-stats] latest news lookup failed', res.status)
      return null
    }
    const rows = await res.json()
    return Array.isArray(rows) ? rows[0] ?? null : null
  } catch (err) {
    console.log('[sync-stats] latest news lookup error', err)
    return null
  }
}

async function fetchStatsSnapshot24hAgo(): Promise<Pick<TelegramStats, 'cases' | 'deaths'> | null> {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/andes_events?select=cases,deaths,event_date&event_date=eq.${cutoffDate}&order=event_date.desc&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    )
    if (!res.ok) {
      console.log('[sync-stats] 24h stats snapshot lookup failed', res.status)
      return null
    }
    const rows = await res.json()
    const row = Array.isArray(rows) ? rows[0] : null
    if (!row || typeof row.cases !== 'number' || typeof row.deaths !== 'number') return null
    return { cases: row.cases, deaths: row.deaths }
  } catch (err) {
    console.log('[sync-stats] 24h stats snapshot lookup error', err)
    return null
  }
}

function toTelegramArticle(item: FeedItem | BreakingItem, row?: NewsRow | null): TelegramArticle | null {
  if (!item && !row) return null
  const itemHeadline = item && 'text' in item ? item.text : item?.title
  const itemSummary = item?.summary ?? null
  const itemUrl = item?.url

  return {
    headline: row?.headline ?? itemHeadline ?? 'Andes virus update',
    body: row?.body ?? itemSummary,
    url: row?.source_url ?? itemUrl ?? 'https://andesvirustracker.com',
  }
}

export async function GET(req: NextRequest) {
  // Allow Vercel cron or manual call with INGEST_SECRET header
  const secret = req.headers.get('x-ingest-secret')
  const cronHeader = req.headers.get('x-vercel-cron')
  if (!cronHeader && secret !== process.env.INGEST_SECRET) {
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
  // Deaths can't exceed confirmed cases — guards against scrapers pulling historical hantavirus death counts
  const confirmedCases = cases ?? current?.confirmed_cases ?? 99
  if (deaths !== null && deaths > (current?.deaths ?? 0) && deaths <= confirmedCases) updates.deaths = deaths
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

  if (patchRes.ok) {
    await patchRes.json().catch(() => null)
  }

  // MARK: - Auto-insert andes_events on stat increases
  const eventsInserted = await insertEventsForIncreases({
    cases,
    deaths,
    countries,
    current,
    breaking,
  })

  // MARK: - Auto-ingest top RSS items into andes_news
  const newsInserted = await ingestRssIntoNews(allItems)
  const newsBackfilled = await backfillNewsDescriptions()

  // MARK: - Telegram auto-post
  const currentCases = current?.confirmed_cases ?? 0
  const currentDeaths = current?.deaths ?? 0
  const currentCountries = current?.countries_monitoring ?? 0
  const telegramAlerts: Promise<TelegramResult>[] = []

  // USA detection — flag any item mentioning US states, federal agencies, or country names
  const US_PATTERNS = /\b(USA?|United\s+States|U\.S\.|americans?|CDC|FDA|HHS|White\s+House|Texas|California|New\s+York|Florida|Georgia|Virginia|New\s+Jersey|Arizona|Pennsylvania|Illinois|Ohio|Michigan|Washington|Massachusetts|Colorado|Oregon|Nevada|Hawaii|Alaska|Maryland|Tennessee|Missouri|Indiana|Wisconsin|Minnesota|Louisiana|Kentucky|Alabama|Mississippi|Arkansas|Iowa|Kansas|Oklahoma|Nebraska|Idaho|Montana|Utah|Maine|Vermont|Connecticut|Rhode\s+Island|Delaware|North\s+Carolina|South\s+Carolina|North\s+Dakota|South\s+Dakota|West\s+Virginia|New\s+Hampshire|New\s+Mexico|Puerto\s+Rico)\b/i

  const isUSAItem = (item: { title: string; summary?: string }) =>
    US_PATTERNS.test(item.title) || US_PATTERNS.test(item.summary || '')

  // Find the latest USA-related article (priority over generic breaking)
  const sortedByDate = [...allItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latestUSA = sortedByDate.find(isUSAItem)

  // Grab latest image from news for photo posts
  const newsImage = newsInserted > 0
    ? (await fetch(`${SUPABASE_URL}/rest/v1/andes_news?select=image_url&order=published_at.desc&limit=1`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }).then(r => r.ok ? r.json() : []).then((rows: {image_url: string|null}[]) => rows[0]?.image_url ?? null).catch(() => null))
    : null

  const finalTelegramStats: TelegramStats = {
    cases: typeof updates.confirmed_cases === 'number' ? updates.confirmed_cases : cases ?? currentCases,
    deaths: typeof updates.deaths === 'number' ? updates.deaths : deaths ?? currentDeaths,
    countries: typeof updates.countries_monitoring === 'number' ? updates.countries_monitoring : countries ?? currentCountries,
  }

  const [, breakingNewsRow] = await Promise.all([
    latestUSA ? fetchNewsRowByUrl(latestUSA.url) : Promise.resolve(null),
    breaking ? fetchNewsRowByUrl(breaking.url) : Promise.resolve(null),
  ])

  if (cases !== null && cases > currentCases) {
    // Immediate alert on new confirmed case — always fires, includes summary
    const article = toTelegramArticle(breaking, breakingNewsRow)
    const summaryLine = article ? `\n\n${buildNewsTelegramCaption({ title: '', stats: finalTelegramStats, article }).split('\n\n').slice(3).join('\n\n')}` : ''
    const usaTag = breaking && US_PATTERNS.test(breaking.text) ? '🇺🇸 ' : ''
    const msg = buildNewsTelegramCaption({
      title: `🔴 ${usaTag}NEW CASE CONFIRMED — ANDES VIRUS`,
      stats: { ...finalTelegramStats, cases },
      article: article ?? { headline: 'MV Hondius outbreak update', body: null, url: 'https://andesvirustracker.com' },
    })
    telegramAlerts.push(postTelegramAlert(msg, breakingNewsRow?.image_url ?? newsImage))
  } else if (deaths !== null && deaths > currentDeaths) {
    // Immediate alert on new death
    const article = toTelegramArticle(breaking, breakingNewsRow)
    const msg = buildNewsTelegramCaption({
      title: '💀 DEATH TOLL UPDATE — ANDES VIRUS',
      stats: { ...finalTelegramStats, deaths },
      article: article ?? { headline: 'MV Hondius outbreak update', body: null, url: 'https://andesvirustracker.com' },
    })
    telegramAlerts.push(postTelegramAlert(msg, breakingNewsRow?.image_url ?? newsImage))
  }

  // MARK: - Weekly digest
  // Fires once per week when no case/death alert was queued. Manual override via ?digest=1.
  const url = new URL(req.url)
  const forceDigest = url.searchParams.get('digest') === '1'
  let digestSent = false

  if (telegramAlerts.length === 0) {
    const lastDigestAt = current?.last_telegram_digest_at ? new Date(current.last_telegram_digest_at) : null
    const hoursSince = lastDigestAt ? (Date.now() - lastDigestAt.getTime()) / (1000 * 60 * 60) : Infinity
    const shouldSendDigest = forceDigest || hoursSince >= 168

    if (shouldSendDigest) {
      const finalCases = updates.confirmed_cases ?? currentCases
      const finalDeaths = updates.deaths ?? currentDeaths
      const finalCountries = updates.countries_monitoring ?? currentCountries
      const riskLevel = updates.who_risk_level ?? current?.who_risk_level ?? 'MODERATE'
      const digestStats: TelegramStats = {
        cases: typeof finalCases === 'number' ? finalCases : currentCases,
        deaths: typeof finalDeaths === 'number' ? finalDeaths : currentDeaths,
        countries: typeof finalCountries === 'number' ? finalCountries : currentCountries,
      }
      const [previousStats, latestNewsRow] = await Promise.all([
        fetchStatsSnapshot24hAgo(),
        breaking ? Promise.resolve(breakingNewsRow) : fetchLatestNewsRow(),
      ])
      const digestArticle = toTelegramArticle(breaking, latestNewsRow)
      const digestMsg = buildWeeklyDigestCaption({
        dayCount,
        stats: digestStats,
        riskLevel: String(riskLevel),
        changeLine: formatDailyChangeLine(digestStats, previousStats),
        article: digestArticle,
      })
      const nowUtc = new Date()
      telegramAlerts.push(postTelegramAlert(digestMsg, latestNewsRow?.image_url ?? newsImage))
      digestSent = true

      // Persist digest timestamp so we don't re-fire within 7 days
      await fetch(`${SUPABASE_URL}/rest/v1/andes_stats?id=eq.1`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ last_telegram_digest_at: nowUtc.toISOString() }),
      }).catch(() => {})
    }
  }

  const telegramResults = await Promise.allSettled(telegramAlerts)
  const telegramDebug = telegramResults.map(r => r.status === 'fulfilled' ? r.value : { ok: false, status: 0, body: String((r as PromiseRejectedResult).reason) })

  return NextResponse.json({
    ok: true,
    extracted: { cases, deaths, countries, exposed, whoRiskLevel },
    updates,
    articlesScanned: allItems.length,
    newsInserted,
    newsBackfilled,
    eventsInserted,
    telegramAlertsSent: telegramAlerts.length,
    telegramDebug,
    digestSent,
  })
}

// MARK: - Events ingestion helpers

type CurrentStats = {
  confirmed_cases?: number | null
  deaths?: number | null
  countries_monitoring?: number | null
} | null | undefined

async function postEvent(payload: Record<string, unknown>): Promise<boolean> {
  console.log('[sync-stats] inserting event', payload.tag, payload.event)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/andes_events`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.log('[sync-stats] event insert failed', res.status, errText)
      return false
    }
    return true
  } catch (err) {
    console.log('[sync-stats] event insert error', err)
    return false
  }
}

async function insertEventsForIncreases(args: {
  cases: number | null
  deaths: number | null
  countries: number | null
  current: CurrentStats
  breaking: BreakingItem
}): Promise<number> {
  const { cases, deaths, countries, current, breaking } = args
  const today = new Date().toISOString().split('T')[0]
  const currentCases = current?.confirmed_cases ?? 0
  const currentDeaths = current?.deaths ?? 0
  const currentCountries = current?.countries_monitoring ?? 0

  const inserts: Promise<boolean>[] = []

  if (cases !== null && cases > currentCases) {
    const headline = breaking?.text?.substring(0, 80) || 'new case confirmed'
    inserts.push(
      postEvent({
        event_date: today,
        event: `Confirmed case count rises to ${cases} — ${headline}`,
        cases: cases,
        deaths: deaths ?? current?.deaths ?? 0,
        source: 'WHO / RSS Feeds',
        tag: 'CONFIRMED',
        tag_color: '#ef4444',
      }),
    )
  }

  if (deaths !== null && deaths > currentDeaths) {
    inserts.push(
      postEvent({
        event_date: today,
        event: `Death toll rises to ${deaths}`,
        cases: cases ?? current?.confirmed_cases ?? 0,
        deaths: deaths,
        source: 'WHO / RSS Feeds',
        tag: 'CONFIRMED',
        tag_color: '#ef4444',
      }),
    )
  }

  if (countries !== null && countries > currentCountries) {
    inserts.push(
      postEvent({
        event_date: today,
        event: `${countries} countries now monitoring returned passengers`,
        cases: cases ?? current?.confirmed_cases ?? 0,
        deaths: deaths ?? current?.deaths ?? 0,
        source: 'WHO / ECDC',
        tag: 'UPDATE',
        tag_color: '#f59e0b',
      }),
    )
  }

  if (inserts.length === 0) {
    console.log('[sync-stats] no event-worthy increases detected')
    return 0
  }

  const results = await Promise.allSettled(inserts)
  const inserted = results.filter(r => r.status === 'fulfilled' && r.value === true).length
  console.log('[sync-stats] events inserted total:', inserted, 'of', inserts.length)
  return inserted
}

// MARK: - News ingestion helpers

const SOURCE_LABEL_MAP: Record<string, string> = {
  'cnn.com': 'CNN',
  'bbc.com': 'BBC',
  'bbc.co.uk': 'BBC',
  'nytimes.com': 'NY TIMES',
  'reuters.com': 'REUTERS',
  'apnews.com': 'AP NEWS',
  'theguardian.com': 'THE GUARDIAN',
  'washingtonpost.com': 'WASHINGTON POST',
  'nbcnews.com': 'NBC NEWS',
  'abcnews.go.com': 'ABC NEWS',
  'cbsnews.com': 'CBS NEWS',
  'foxnews.com': 'FOX NEWS',
  'npr.org': 'NPR',
  'time.com': 'TIME',
  'newsweek.com': 'NEWSWEEK',
  'who.int': 'WHO',
  'cdc.gov': 'CDC',
  'ecdc.europa.eu': 'ECDC',
  'globalnews.ca': 'GLOBAL NEWS',
  'instagram.com': 'INSTAGRAM',
  'facebook.com': 'FACEBOOK',
  'twitter.com': 'X / TWITTER',
  'x.com': 'X / TWITTER',
  'wikipedia.org': 'WIKIPEDIA',
}

// MARK: - Source label extraction
function deriveSourceLabel(url: string, title?: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase()

    // Exact host match
    if (SOURCE_LABEL_MAP[host]) return SOURCE_LABEL_MAP[host]

    // Parent domain match (e.g. "edition.cnn.com" -> "cnn.com",
    // "en.wikipedia.org" -> "wikipedia.org")
    for (const key of Object.keys(SOURCE_LABEL_MAP)) {
      if (host.endsWith(`.${key}`)) return SOURCE_LABEL_MAP[key]
    }

    // Google search/news URLs — try to pull outlet from " - Outlet" suffix
    // in the title (Google Alerts titles look like "Headline - CNN")
    if (host === 'google.com' || host.endsWith('.google.com')) {
      if (title) {
        const m = title.match(/\s-\s([^-]+)$/)
        if (m) {
          const outlet = m[1].trim().toUpperCase()
          if (outlet) return outlet.substring(0, 20)
        }
      }
      return 'NEWS'
    }

    // Default: hostname without www, uppercased, capped at 20 chars
    return host.toUpperCase().substring(0, 20)
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

  // MARK: - Pre-fetch article metadata in parallel (Promise.allSettled so one failure
  // doesn't block others). Concurrency is naturally capped at 5 because `top`
  // is sliced to 5 above.
  const metaResults = await Promise.allSettled(
    top.map(item => (item.url ? fetchArticleMeta(item.url) : Promise.resolve({ image: null, description: null }))),
  )
  const metaByUrl = new Map<string, ArticleMeta>()
  top.forEach((item, idx) => {
    const r = metaResults[idx]
    const value = r.status === 'fulfilled' ? r.value : { image: null, description: null }
    metaByUrl.set(item.url, value)
    console.log('[sync-stats] article meta resolved', item.url, 'image:', value.image, 'description:', value.description)
  })

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
    const meta = metaByUrl.get(item.url) ?? { image: null, description: null }
    const body = (meta.description || summaryText || headline).substring(0, 500)
    const publishedAt = item.date ? new Date(item.date).toISOString() : new Date().toISOString()
    const imageUrl = meta.image ?? null

    const payload = {
      headline,
      body,
      source_label: deriveSourceLabel(item.url, item.title),
      source_url: item.url,
      image_url: imageUrl,
      tag: 'UPDATE',
      tag_color: '#94a3b8',
      published_at: publishedAt,
    }

    console.log('[sync-stats] inserting news', payload.source_label, headline, 'image:', imageUrl)

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

async function backfillNewsDescriptions(): Promise<number> {
  console.log('[sync-stats] loading news description backfill candidates')

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/andes_news?select=id,headline,body,source_url,image_url,published_at&order=published_at.desc&limit=25`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    )

    if (!res.ok) {
      console.log('[sync-stats] news backfill candidate load failed', res.status)
      return 0
    }

    const rows = await res.json()
    const candidates = (Array.isArray(rows) ? (rows as BackfillNewsRow[]) : [])
      .filter(row => row.source_url && (row.body ?? '').trim() === row.headline.trim())
      .slice(0, 5)

    if (candidates.length === 0) {
      console.log('[sync-stats] no news descriptions need backfill')
      return 0
    }

    console.log('[sync-stats] news description backfill candidates:', candidates.length)

    const updates = await Promise.all(candidates.map(async row => {
      const { description } = await fetchArticleMeta(row.source_url)
      const body = description?.substring(0, 500)

      if (!body || body === row.body) {
        console.log('[sync-stats] skip news backfill without usable description', row.id, row.source_url)
        return false
      }

      console.log('[sync-stats] updating news description backfill', row.id, row.source_url)
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/andes_news?id=eq.${encodeURIComponent(String(row.id))}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ body }),
      })

      if (patchRes.ok) {
        return true
      } else {
        const errText = await patchRes.text().catch(() => '')
        console.log('[sync-stats] news description backfill failed', patchRes.status, errText)
        return false
      }
    }))

    const updated = updates.filter(Boolean).length
    console.log('[sync-stats] news descriptions backfilled total:', updated)
    return updated
  } catch (err) {
    console.log('[sync-stats] news description backfill error', err)
    return 0
  }
}
