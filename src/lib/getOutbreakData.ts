const URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1'
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const headers = {
  apikey: KEY,
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

export async function getOutbreakStats(): Promise<OutbreakStats> {
  try {
    const res = await fetch(`${URL}/andes_stats?select=*&id=eq.1`, {
      headers,
      next: { revalidate: 60 }, // refresh every 60 seconds
    })
    if (!res.ok) throw new Error('Failed to fetch stats')
    const data = await res.json()
    return data[0]
  } catch {
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
    const res = await fetch(`${URL}/andes_news?select=*&order=published_at.desc&limit=6`, {
      headers,
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('Failed to fetch news')
    return await res.json()
  } catch {
    return []
  }
}

export async function getOutbreakEvents(): Promise<OutbreakEvent[]> {
  try {
    const res = await fetch(`${URL}/andes_events?select=*&order=event_date.desc`, {
      headers,
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('Failed to fetch events')
    return await res.json()
  } catch {
    return []
  }
}
