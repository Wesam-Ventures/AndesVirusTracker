import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '180px', height: '180px',
          background: '#0a0c0f',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          fontFamily: 'monospace', position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ef4444', display: 'flex' }} />
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', marginBottom: '8px', display: 'flex', boxShadow: '0 0 12px rgba(239,68,68,0.9)' }} />
        <div style={{ fontSize: '68px', fontWeight: 900, color: '#ffffff', letterSpacing: '-3px', display: 'flex', lineHeight: 1 }}>AV</div>
      </div>
    ),
    { width: 180, height: 180 }
  )
}
