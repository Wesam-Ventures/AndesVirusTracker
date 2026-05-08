import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #0a0c0f)', display: 'flex', flexDirection: 'column' }}>
      <SiteNav />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 16px 32px' }}>
        <section className="glass hazard-stripe" style={{ width: '100%', maxWidth: 720, background: 'rgba(13,16,20,0.92)', borderRadius: 18, padding: '56px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="scan-line" />

          <p className="font-mono" style={{ color: 'var(--fg-dim)', fontSize: 11, letterSpacing: 3, marginBottom: 18 }}>
            ERROR · 404
          </p>

          <div className="font-display" style={{ color: '#ef4444', fontSize: 'clamp(88px, 18vw, 180px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: 4, marginBottom: 20 }}>
            404
          </div>

          <h1 className="font-display" style={{ color: 'var(--fg)', fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 800, letterSpacing: 2, marginBottom: 14 }}>
            PAGE NOT FOUND
          </h1>

          <p className="font-mono" style={{ color: 'var(--fg-mute)', fontSize: 12, lineHeight: 1.8, margin: '0 auto 30px', maxWidth: 420 }}>
            This page does not exist or has been moved.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/" style={{ background: 'var(--red)', color: '#fff', borderRadius: 8, padding: '12px 18px', fontSize: 11, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', fontFamily: 'Space Mono, monospace', minWidth: 150 }}>
              GO TO TRACKER
            </Link>
            <Link href="/andes-virus-news" style={{ background: 'var(--bg-2)', color: 'var(--fg)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '12px 18px', fontSize: 11, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', fontFamily: 'Space Mono, monospace', minWidth: 150 }}>
              LATEST NEWS
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
