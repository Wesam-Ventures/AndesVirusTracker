'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/',                              label: 'Live Tracker' },
  { href: '/andes-virus-transmission',      label: 'Transmission' },
  { href: '/andes-virus-symptoms',          label: 'Symptoms' },
  { href: '/andes-virus-incubation-period', label: 'Incubation' },
  { href: '/andes-virus-vs-hantavirus',     label: 'vs Hantavirus' },
  { href: '/andes-virus-news',              label: 'News' },
]

export default function SiteNav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '10px 12px 0' }}>
        <nav className="glass" style={{ maxWidth: 960, margin: '0 auto', borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>

          {/* Logo + LIVE */}
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
          <div className="hidden md:flex" style={{ gap: 14, alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="font-mono" style={{
                fontSize: 9, letterSpacing: 1, textDecoration: 'none', whiteSpace: 'nowrap',
                color: path === l.href ? 'var(--red)' : 'var(--fg-dim)',
                paddingBottom: 1,
                borderBottom: path === l.href ? '1px solid var(--red)' : '1px solid transparent',
              }}>
                {l.label.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Right side: hamburger (mobile) + GET ALERTS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden"
              onClick={() => setOpen(o => !o)}
              style={{ background: 'var(--bg-2)', border: '1px solid var(--line-strong)', borderRadius: 7, padding: '6px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}
              aria-label="Menu"
            >
              {open ? (
                <span style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1 }}>✕</span>
              ) : (
                <>
                  <div style={{ width: 16, height: 1.5, background: 'var(--fg-mute)', borderRadius: 1 }} />
                  <div style={{ width: 12, height: 1.5, background: 'var(--fg-mute)', borderRadius: 1 }} />
                  <div style={{ width: 16, height: 1.5, background: 'var(--fg-mute)', borderRadius: 1 }} />
                </>
              )}
            </button>

            <Link href="/#alerts" style={{ background: 'var(--red)', color: '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textDecoration: 'none', fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap' }}>
              GET ALERTS
            </Link>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {open && (
          <div className="glass md:hidden" style={{
            maxWidth: 960, margin: '4px auto 0', borderRadius: 12,
            display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden',
          }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: '14px 20px', textDecoration: 'none', fontFamily: 'Space Mono, monospace',
                  fontSize: 11, letterSpacing: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: path === l.href ? 'rgba(239,68,68,0.08)' : 'transparent',
                  color: path === l.href ? 'var(--red)' : 'var(--fg)',
                  borderBottom: '1px solid var(--line)',
                }}>
                {l.label}
                <span style={{ color: 'var(--fg-dim)', fontSize: 10 }}>→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
