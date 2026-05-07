import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

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
      // Already subscribed — treat as success
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Subscribed' })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
