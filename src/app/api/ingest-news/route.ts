import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-ingest-secret')
  if (secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { headline, summary, source_label, source_url, tag, tag_color } = body

  if (!headline || !summary || !source_label) {
    return NextResponse.json({ error: 'headline, summary, source_label required' }, { status: 400 })
  }

  // MARK: - Input length limits (defense in depth before Supabase insert)
  if (typeof headline !== 'string' || headline.length > 300) {
    return NextResponse.json({ error: 'headline must be a string of at most 300 characters' }, { status: 400 })
  }
  if (typeof summary !== 'string' || summary.length > 2000) {
    return NextResponse.json({ error: 'summary must be a string of at most 2000 characters' }, { status: 400 })
  }
  if (typeof source_label !== 'string' || source_label.length > 100) {
    return NextResponse.json({ error: 'source_label must be a string of at most 100 characters' }, { status: 400 })
  }
  if (source_url != null && (typeof source_url !== 'string' || source_url.length > 500)) {
    return NextResponse.json({ error: 'source_url must be a string of at most 500 characters' }, { status: 400 })
  }
  if (tag != null && (typeof tag !== 'string' || tag.length > 50)) {
    return NextResponse.json({ error: 'tag must be a string of at most 50 characters' }, { status: 400 })
  }

  // tag_color must be a valid hex color (#abc or #aabbcc); fall back to default
  const HEX_COLOR = /^#[0-9a-fA-F]{3,6}$/
  const safeTagColor =
    typeof tag_color === 'string' && HEX_COLOR.test(tag_color) ? tag_color : '#f59e0b'

  const res = await fetch(`${SUPABASE_URL}/rest/v1/andes_news`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      headline,
      body: summary,
      source_label,
      source_url: source_url || '#',
      tag: tag || 'UPDATE',
      tag_color: safeTagColor,
      published_at: new Date().toISOString(),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[ingest-news] Supabase insert failed:', res.status, err)
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 })
  }

  const [data] = await res.json()

  // Fire-and-forget stat sync — no await so response isn't delayed
  const host = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://andesvirustracker.com'
  fetch(`${host}/api/sync-stats`, {
    headers: { authorization: `Bearer ${process.env.SYNC_SECRET}` },
  }).catch(() => {})

  return NextResponse.json({ ok: true, id: data.id })
}
