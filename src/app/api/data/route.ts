import { NextResponse } from 'next/server'

export const revalidate = 60

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` }

async function fetchAll() {
  const [statsRes, newsRes, eventsRes] = await Promise.all([
    fetch(`${URL}/rest/v1/andes_stats?id=eq.1&select=*`, { headers }),
    fetch(`${URL}/rest/v1/andes_news?select=*&order=published_at.desc&limit=10`, { headers }),
    fetch(`${URL}/rest/v1/andes_events?select=*&order=event_date.desc`, { headers }),
  ])
  const [statsArr, news, events] = await Promise.all([
    statsRes.ok ? statsRes.json() : [{}],
    newsRes.ok ? newsRes.json() : [],
    eventsRes.ok ? eventsRes.json() : [],
  ])
  return { stats: statsArr[0] ?? {}, news, events }
}

export async function GET() {
  const { stats, news, events } = await fetchAll()

  const data = {
    meta: {
      name: 'Andes Virus Tracker',
      url: 'https://andesvirustracker.com',
      description: 'Real-time Andes virus outbreak tracker. Updated every 15 minutes from WHO, CDC, ECDC, and Reuters RSS feeds.',
      last_updated: stats.last_updated ?? new Date().toISOString(),
      data_sources: ['WHO', 'CDC', 'ECDC', 'PAHO', 'Reuters', 'AP News'],
      update_frequency: 'Every 15 minutes via automated RSS monitoring',
      llms_txt: 'https://andesvirustracker.com/llms.txt',
    },
    outbreak: {
      name: 'Andes Virus (ANDV) — MV Hondius 2026',
      status: 'ACTIVE',
      origin: 'MV Hondius cruise ship, Antarctica, April 28 2026',
      who_notice: 'DON-599',
      who_url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599',
      who_risk_level: stats.who_risk_level ?? 'MODERATE',
      day_count: stats.day_count ?? 10,
      breaking_news: stats.breaking_news ?? '',
      breaking_news_url: stats.breaking_news_url ?? '',
    },
    statistics: {
      confirmed_cases: stats.confirmed_cases ?? 8,
      deaths: stats.deaths ?? 3,
      countries_monitoring: stats.countries_monitoring ?? 23,
      exposed_passengers: stats.exposed_passengers ?? 62,
      case_fatality_rate: '~40%',
      p2p_transmission_confirmed: true,
      vaccine_available: false,
      antiviral_available: false,
    },
    timeline: events.map((e: Record<string, unknown>) => ({
      date: e.event_date,
      event: e.event,
      cases: e.cases,
      deaths: e.deaths,
      source: e.source,
      tag: e.tag,
    })),
    recent_news: news.map((n: Record<string, unknown>) => ({
      headline: n.headline,
      source: n.source_label,
      url: n.source_url,
      published_at: n.published_at,
      tag: n.tag,
      image_url: n.image_url ?? null,
    })),
    clinical: {
      incubation_days: { min: 9, max: 33, average: 18 },
      transmission: 'Person-to-person via prolonged close contact; also rodent excreta. Does NOT spread airborne.',
      treatment: 'Supportive ICU care only. No approved vaccine or antiviral exists.',
      phases: [
        'Prodromal (days 1-5): fever 38-40C, severe headache, muscle pain especially lower back, chills, fatigue, nausea',
        'Cardiopulmonary (days 5-10): sudden shortness of breath, rapid heart rate, pulmonary edema, low blood pressure, dropping oxygen',
        'Critical/Recovery (days 10+): ICU admission required, possible mechanical ventilation, CFR ~40%, survivors improve over weeks',
      ],
    },
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  })
}
