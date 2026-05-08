import { NextRequest, NextResponse } from 'next/server'

// MARK: - Config

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX_LENGTH = 254

// MARK: - Rate limiting
// Max 5 requests per IP per 5 minutes. Stored as timestamps per IP in a
// module-level Map so it persists across requests within the same runtime.

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const RATE_LIMIT_MAX = 5
const ipHits: Map<string, number[]> = new Map()

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const cutoff = now - RATE_LIMIT_WINDOW_MS
  const recent = (ipHits.get(ip) ?? []).filter((t) => t > cutoff)

  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0]!
    const retryAfter = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000))
    ipHits.set(ip, recent)
    console.log('[subscribe] rate limit hit', { ip, count: recent.length, retryAfter })
    return { allowed: false, retryAfter }
  }

  recent.push(now)
  ipHits.set(ip, recent)
  return { allowed: true, retryAfter: 0 }
}

// MARK: - Handler

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { allowed, retryAfter } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const { email } = await req.json()

    if (
      !email ||
      typeof email !== 'string' ||
      email.length > EMAIL_MAX_LENGTH ||
      !EMAIL_REGEX.test(email)
    ) {
      console.log('[subscribe] invalid email rejected', { ip })
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    console.log('[subscribe] inserting subscriber', { ip })

    const res = await fetch(`${SUPABASE_URL}/rest/v1/andes_subscribers`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email: email.toLowerCase().trim(), source: 'homepage' }),
    })

    if (res.status === 409) {
      console.log('[subscribe] already subscribed')
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    if (!res.ok) {
      console.log('[subscribe] supabase insert failed', { status: res.status })
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    console.log('[subscribe] subscribed ok')
    return NextResponse.json({ success: true, message: 'Subscribed' })
  } catch (err) {
    console.log('[subscribe] server error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
