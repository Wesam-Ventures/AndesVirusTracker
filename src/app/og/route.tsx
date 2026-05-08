import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// MARK: - Types

type AndesStats = {
  confirmed_cases: number
  deaths: number
  countries_monitoring: number
}

// MARK: - Route

export async function GET(req: NextRequest) {
  // MARK: Load live stats from Supabase (with fallback)
  let stats: AndesStats = {
    confirmed_cases: 8,
    deaths: 3,
    countries_monitoring: 23,
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/andes_stats?select=confirmed_cases,deaths,countries_monitoring&id=eq.1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase stats fetch failed: ${response.status}`)
    }

    const [row] = (await response.json()) as AndesStats[]

    if (row) {
      stats = row
      console.log('[og/route.tsx] loaded Andes stats', stats)
    }
  } catch (error) {
    console.log('[og/route.tsx] using fallback Andes stats', error)
  }

  // MARK: Read query params
  const { searchParams } = new URL(req.url)
  const sub =
    searchParams.get('sub') ||
    `${stats.confirmed_cases} cases · ${stats.deaths} deaths · ${stats.countries_monitoring} countries monitoring`

  console.log('[og/route.tsx] rendering OG image', { sub, stats })

  // MARK: Stat cards
  const statCards: Array<[string, string]> = [
    [String(stats.confirmed_cases), 'CASES'],
    [String(stats.deaths), 'DEATHS'],
    [String(stats.countries_monitoring), 'COUNTRIES'],
    ['40%', 'FATALITY RATE'],
  ]

  // MARK: Render
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(239,68,68,0.12) 0%, #0a0c0f 60%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '72px 88px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* MARK: Faded AV watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-40px',
            fontSize: '320px',
            fontWeight: 900,
            color: 'rgba(239,68,68,0.04)',
            fontFamily: 'monospace',
            lineHeight: 1,
            display: 'flex',
            letterSpacing: '-8px',
          }}
        >
          AV
        </div>

        {/* MARK: Vertical red accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '4px',
            background: '#ef4444',
            display: 'flex',
          }}
        />

        {/* MARK: Top row — LIVE badge + domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          {/* MARK: Triangle logo mark */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '18px solid #ef4444',
              display: 'flex',
              marginRight: '12px',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '20px',
              padding: '6px 14px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'rgba(239,68,68,1)',
                display: 'flex',
                boxShadow: '0 0 12px rgba(239,68,68,0.8)',
              }}
            />
            <span
              style={{
                color: '#ef4444',
                fontSize: '14px',
                letterSpacing: '2px',
                fontWeight: 700,
              }}
            >
              LIVE OUTBREAK
            </span>
          </div>
          <span
            style={{
              color: '#475569',
              fontSize: '14px',
              letterSpacing: '1px',
              display: 'flex',
            }}
          >
            andesvirustracker.com
          </span>
        </div>

        {/* MARK: Title — ANDES VIRUS / TRACKER */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            ANDES VIRUS
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#ef4444',
              letterSpacing: '-2px',
              lineHeight: 1,
              display: 'flex',
              marginTop: '4px',
            }}
          >
            TRACKER
          </span>
        </div>

        {/* MARK: Subtitle */}
        <div
          style={{
            fontSize: '18px',
            color: '#64748b',
            letterSpacing: '0.5px',
            marginBottom: '52px',
            display: 'flex',
            maxWidth: '900px',
          }}
        >
          {sub}
        </div>

        {/* MARK: Stats row — 4 cards */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {statCards.map(([value, label]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px',
                padding: '12px 20px',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: '#ef4444',
                  lineHeight: 1,
                  display: 'flex',
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: '#475569',
                  letterSpacing: '2px',
                  display: 'flex',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* MARK: Bottom-right domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            right: '88px',
            fontSize: '13px',
            color: '#334155',
            letterSpacing: '3px',
            display: 'flex',
          }}
        >
          andesvirustracker.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
