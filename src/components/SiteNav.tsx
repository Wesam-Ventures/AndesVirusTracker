'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const TELEGRAM_CHANNEL_URL = 'https://t.me/+vcbJYZ-5Ws1iOTUx'

const NAV_LINKS = [
  { href: '/',                              label: 'Live Tracker' },
  { href: '/andes-virus-transmission',      label: 'Transmission' },
  { href: '/andes-virus-symptoms',          label: 'Symptoms' },
  { href: '/andes-virus-incubation-period', label: 'Incubation' },
  { href: '/andes-virus-vs-hantavirus',     label: 'vs Hantavirus' },
  { href: '/andes-virus-news',              label: 'News' },
  { href: '/about',                         label: 'About' },
]

export default function SiteNav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(true)

  useEffect(() => {
    setBannerDismissed(localStorage.getItem('avt_tg_banner_dismissed') === '1')
  }, [])

  const dismissBanner = () => {
    localStorage.setItem('avt_tg_banner_dismissed', '1')
    setBannerDismissed(true)
  }

  return (
    <>
      {!bannerDismissed && (
        <div style={{ position: 'sticky', top: 0, zIndex: 101, background: 'linear-gradient(90deg, #2AABEE 0%, #229ED9 100%)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="font-mono" style={{ fontSize: 11, color: '#fff', letterSpacing: 0.5, fontWeight: 600 }}>
            ✈️ Get instant alerts when new cases hit —
          </span>
          <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
            className="font-mono"
            style={{ background: '#fff', color: '#2AABEE', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            JOIN TELEGRAM →
          </a>
          <button onClick={dismissBanner}
            aria-label="Dismiss"
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 4px', position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
            ✕
          </button>
        </div>
      )}
      <div style={{ position: 'sticky', top: bannerDismissed ? 0 : 'auto', zIndex: 100, padding: '10px 12px 0' }}>
        <nav className="glass" style={{ maxWidth: 960, margin: '0 auto', borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>

          {/* Logo + LIVE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link href="/" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '13px solid #ef4444', marginRight: '8px', display: 'flex', alignSelf: 'center' }} />
              <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 1.5 }}>
                ANDES VIRUS
              </span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '3px 8px', flexShrink: 0 }}>
              <div className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--red)', letterSpacing: 1.5 }}>LIVE</span>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ gap: 16, alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="font-mono" style={{
                fontSize: 11, letterSpacing: 0.5, textDecoration: 'none', whiteSpace: 'nowrap',
                color: path === l.href ? 'var(--red)' : 'var(--fg-mute)',
                paddingBottom: 2,
                borderBottom: path === l.href ? '1px solid var(--red)' : '1px solid transparent',
                transition: 'color 0.15s',
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
                <span style={{ fontFamily: 'Space Mono', fontSize: 13, color: 'var(--fg)', lineHeight: 1 }}>✕</span>
              ) : (
                <>
                  <div style={{ width: 16, height: 2, background: 'var(--fg)', borderRadius: 1 }} />
                  <div style={{ width: 12, height: 2, background: 'var(--fg)', borderRadius: 1 }} />
                  <div style={{ width: 16, height: 2, background: 'var(--fg)', borderRadius: 1 }} />
                </>
              )}
            </button>

            <Link href="/#alerts" style={{ background: 'var(--red)', color: '#fff', borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textDecoration: 'none', fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap' }}>
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
