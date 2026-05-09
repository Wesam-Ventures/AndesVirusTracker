const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
const URL = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : ''

const headers = {
  apikey: KEY ?? '',
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
}

export interface OutbreakStats {
  confirmed_cases: number
  deaths: number
  countries_monitoring: number
  exposed_passengers: number
  who_risk_level: string
  breaking_news: string
  breaking_news_url: string
  day_count: number
  last_updated: string
}

export interface OutbreakNews {
  id: number
  headline: string
  body: string
  source_label: string
  source_url: string
  tag: string
  tag_color: string
  published_at: string
  image_url?: string
}

export interface OutbreakEvent {
  id: number
  event_date: string
  event: string
  cases: number
  deaths: number
  source: string
  tag: string
  tag_color: string
}

function isOutbreakStats(value: unknown): value is OutbreakStats {
  if (!value || typeof value !== 'object') return false

  const stats = value as Partial<OutbreakStats>

  return (
    typeof stats.confirmed_cases === 'number' &&
    typeof stats.deaths === 'number' &&
    typeof stats.countries_monitoring === 'number' &&
    typeof stats.exposed_passengers === 'number' &&
    typeof stats.who_risk_level === 'string' &&
    typeof stats.breaking_news === 'string' &&
    typeof stats.breaking_news_url === 'string' &&
    typeof stats.day_count === 'number' &&
    typeof stats.last_updated === 'string'
  )
}

export async function getOutbreakStats(): Promise<OutbreakStats> {
  try {
    if (!URL || !KEY) throw new Error('Missing Supabase configuration')
    const res = await fetch(`${URL}/andes_stats?select=*&id=eq.1`, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error('Failed to fetch stats')
    const data = await res.json()
    if (
      !data ||
      !data[0] ||
      typeof data[0].confirmed_cases !== 'number' ||
      !isOutbreakStats(data[0])
    ) {
      throw new Error('Empty or malformed stats payload')
    }
    return data[0]
  } catch (err) {
    console.error('[getOutbreakStats] falling back to defaults:', err)
    // Fallback to hardcoded values if Supabase is unreachable
    return {
      confirmed_cases: 8,
      deaths: 3,
      countries_monitoring: 23,
      exposed_passengers: 62,
      who_risk_level: 'MODERATE',
      breaking_news: 'Swiss passenger confirmed positive for Andes virus post MV Hondius cruise — May 7, 2026',
      breaking_news_url: 'https://globalnews.ca/news/11836710/hantavirus-cruise-ship-andes-strain-new-case-confirmed-switzerland/',
      day_count: 15,
      last_updated: new Date().toISOString(),
    }
  }
}

export async function getOutbreakNews(): Promise<OutbreakNews[]> {
  try {
    if (!URL || !KEY) throw new Error('Missing Supabase configuration')
    const res = await fetch(`${URL}/andes_news?select=*&order=published_at.desc&limit=6`, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error('Failed to fetch news')
    return await res.json()
  } catch (err) {
    console.error('[getOutbreakNews] falling back to defaults:', err)
    return []
  }
}

export async function getOutbreakEvents(): Promise<OutbreakEvent[]> {
  try {
    if (!URL || !KEY) throw new Error('Missing Supabase configuration')
    const res = await fetch(`${URL}/andes_events?select=*&order=event_date.desc`, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error('Failed to fetch events')
    return await res.json()
  } catch (err) {
    console.error('[getOutbreakEvents] falling back to defaults:', err)
    return []
  }
}
