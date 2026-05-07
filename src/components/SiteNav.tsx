'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',                              label: 'TRACKER' },
  { href: '/andes-virus-transmission',      label: 'TRANSMISSION' },
  { href: '/andes-virus-symptoms',          label: 'SYMPTOMS' },
  { href: '/andes-virus-incubation-period', label: 'INCUBATION' },
  { href: '/andes-virus-vs-hantavirus',     label: 'VS HANTAVIRUS' },
  { href: '/andes-virus-news',              label: 'NEWS' },
]

export default function SiteNav() {
  const path = usePathname()

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '10px 12px 0' }}>
      <nav className="glass" style={{ maxWidth: 960, margin: '0 auto', borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link href="/" className="font-display" style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', letterSpacing: 0.5, whiteSpace: 'nowrap', textDecoration: 'none' }}>
            ANDES VIRUS
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '3px 7px', flexShrink: 0 }}>
            <div className="blink" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)' }} />
            <span className="font-mono" style={{ fontSize: 8, color: 'var(--red)', letterSpacing: 1.5 }}>LIVE</span>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: 14, alignItems: 'center', overflow: 'hidden' }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="font-mono" style={{
              fontSize: 9, letterSpacing: 1, textDecoration: 'none', whiteSpace: 'nowrap',
              color: path === l.href ? 'var(--red)' : 'var(--fg-dim)',
              borderBottom: path === l.href ? '1px solid var(--red)' : '1px solid transparent',
              paddingBottom: 1, transition: 'color 150ms',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/#alerts" style={{ background: 'var(--red)', color: '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textDecoration: 'none', fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>
          GET ALERTS
        </Link>
      </nav>
    </div>
  )
}
