import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Andes Virus Tracker'
  const sub = searchParams.get('sub') || '8 cases · 3 deaths · 23 countries monitoring'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px', height: '630px',
          background: '#0a0c0f',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: '64px 80px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Red accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#ef4444', display: 'flex' }} />

        {/* LIVE badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '20px', padding: '6px 14px', marginBottom: '28px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'flex' }} />
          <span style={{ color: '#ef4444', fontSize: '14px', letterSpacing: '2px' }}>LIVE OUTBREAK</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: title.length > 30 ? '52px' : '64px',
          fontWeight: 900, color: '#ffffff', lineHeight: 1.05,
          marginBottom: '20px', letterSpacing: '-1px',
          maxWidth: '900px', display: 'flex', flexWrap: 'wrap',
        }}>
          {title}
        </div>

        {/* Sub */}
        <div style={{ fontSize: '22px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '48px', display: 'flex' }}>
          {sub}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '40px' }}>
          {[['8', 'CASES'], ['3', 'DEATHS'], ['23', 'COUNTRIES'], ['40%', 'FATALITY RATE']].map(([v, l]) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: '#ef4444' }}>{v}</span>
              <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '2px' }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute', bottom: '32px', right: '80px',
          fontSize: '16px', color: '#475569', letterSpacing: '2px', display: 'flex',
        }}>
          ANDESVIRUSTRACKER.COM
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
