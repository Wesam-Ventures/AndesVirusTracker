import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const STATIC_PAGES = [
  {
    loc: 'https://andesvirustracker.com/andes-virus-news',
    title: 'Andes Virus 2026 Outbreak — MV Hondius Case Timeline and Updates',
    keywords: 'Andes virus, hantavirus, MV Hondius, outbreak 2026, person to person',
  },
  {
    loc: 'https://andesvirustracker.com/andes-virus-transmission',
    title: 'Can Andes Virus Spread Person to Person? Transmission Guide 2026',
    keywords: 'Andes virus transmission, hantavirus person to person, MV Hondius spread',
  },
  {
    loc: 'https://andesvirustracker.com/andes-virus-symptoms',
    title: 'Andes Virus Symptoms — Full Clinical Timeline and Warning Signs 2026',
    keywords: 'Andes virus symptoms, hantavirus symptoms 2026, HPS symptoms',
  },
  {
    loc: 'https://andesvirustracker.com/andes-virus-incubation-period',
    title: 'Andes Virus Incubation Period — How Long Before Symptoms Appear',
    keywords: 'Andes virus incubation, hantavirus incubation period 2026',
  },
]

export async function GET() {
  const now = new Date().toISOString()

  let latestDate = now
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/andes_news?select=published_at&order=published_at.desc&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    if (res.ok) {
      const [row] = await res.json()
      if (row?.published_at) latestDate = row.published_at
    }
  } catch { /* fall through to now */ }

  const pageEntries = STATIC_PAGES.map((p, i) => `
  <url>
    <loc>${p.loc}</loc>
    <news:news>
      <news:publication>
        <news:name>AndesVirusTracker.com</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${i === 0 ? latestDate : '2026-05-07T12:00:00Z'}</news:publication_date>
      <news:title>${p.title}</news:title>
      <news:keywords>${p.keywords}</news:keywords>
    </news:news>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${pageEntries}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800',
    },
  })
}
