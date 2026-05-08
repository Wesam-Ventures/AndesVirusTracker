import { ImageResponse } from 'next/og'

// MARK: Config
export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 180, height: 180 }

// MARK: Route
export async function GET() {
  console.log('[apple-icon] generating triangle logo 180x180')

  return new ImageResponse(
    (
      <div
        style={{
          width: '180px',
          height: '180px',
          background: '#0a0c0f',
          display: 'flex',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* MARK: Outer red triangle */}
          <polygon points="90,30 155,140 25,140" fill="#ef4444" />

          {/* MARK: Inner dark cutout for depth */}
          <polygon points="90,52 135,132 45,132" fill="#0a0c0f" />

          {/* MARK: Live indicator dot — soft halo + solid core */}
          <circle cx="148" cy="32" r="16" fill="rgba(239,68,68,0.2)" />
          <circle cx="148" cy="32" r="10" fill="#ef4444" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
