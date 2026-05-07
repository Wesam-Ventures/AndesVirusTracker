import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://andesvirustracker.com/andes-virus-news</loc>
    <news:news>
      <news:publication>
        <news:name>AndesVirusTracker.com</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2026-05-07T14:00:00Z</news:publication_date>
      <news:title>Andes Virus 2026 Outbreak — MV Hondius Case Timeline and Updates</news:title>
      <news:keywords>Andes virus, hantavirus, MV Hondius, outbreak 2026, person to person</news:keywords>
    </news:news>
  </url>
  <url>
    <loc>https://andesvirustracker.com/andes-virus-transmission</loc>
    <news:news>
      <news:publication>
        <news:name>AndesVirusTracker.com</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2026-05-07T12:00:00Z</news:publication_date>
      <news:title>Can Andes Virus Spread Person to Person? Transmission Guide 2026</news:title>
      <news:keywords>Andes virus transmission, hantavirus person to person, MV Hondius spread</news:keywords>
    </news:news>
  </url>
  <url>
    <loc>https://andesvirustracker.com/andes-virus-symptoms</loc>
    <news:news>
      <news:publication>
        <news:name>AndesVirusTracker.com</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2026-05-07T12:00:00Z</news:publication_date>
      <news:title>Andes Virus Symptoms — Full Clinical Timeline and Warning Signs 2026</news:title>
      <news:keywords>Andes virus symptoms, hantavirus symptoms 2026, HPS symptoms</news:keywords>
    </news:news>
  </url>
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
