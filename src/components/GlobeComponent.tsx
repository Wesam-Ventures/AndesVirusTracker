'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const POINTS = [
  { lat: -54.8, lng: -68.3, label: 'ARGENTINA\nOrigin · Endemic Region', color: '#ef4444', size: 0.6 },
  { lat: 14.9,  lng: -23.5, label: 'MV HONDIUS\nActive Vessel · Near Cape Verde', color: '#ef4444', size: 0.7 },
  { lat: 46.8,  lng: 8.2,   label: 'SWITZERLAND\nConfirmed Case', color: '#ef4444', size: 0.5 },
  { lat: 50.8,  lng: 4.4,   label: 'BELGIUM\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 46.2,  lng: 2.2,   label: 'FRANCE\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 51.2,  lng: 10.4,  label: 'GERMANY\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 39.1,  lng: 22.0,  label: 'GREECE\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 53.1,  lng: -8.2,  label: 'IRELAND\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 52.1,  lng: 5.3,   label: 'NETHERLANDS\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 52.0,  lng: 19.1,  label: 'POLAND\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 39.4,  lng: -8.2,  label: 'PORTUGAL\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 40.5,  lng: -3.7,  label: 'SPAIN\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 1.4,   lng: 103.8, label: 'SINGAPORE\nMonitoring', color: '#f59e0b', size: 0.35 },
  { lat: 37.1,  lng: -95.7, label: 'UNITED STATES\nCDC Monitoring', color: '#3b82f6', size: 0.4 },
]

const ARCS = [
  { startLat: -54.8, startLng: -68.3, endLat: 14.9,  endLng: -23.5, color: ['rgba(239,68,68,0)', 'rgba(239,68,68,0.7)', 'rgba(239,68,68,0)'] },
  { startLat: 14.9,  startLng: -23.5, endLat: 46.8,  endLng: 8.2,   color: ['rgba(239,68,68,0)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0)'] },
  { startLat: 14.9,  startLng: -23.5, endLat: 37.1,  endLng: -95.7, color: ['rgba(239,68,68,0)', 'rgba(59,130,246,0.5)', 'rgba(59,130,246,0)'] },
  { startLat: 14.9,  startLng: -23.5, endLat: 1.4,   endLng: 103.8, color: ['rgba(239,68,68,0)', 'rgba(245,158,11,0.5)', 'rgba(245,158,11,0)'] },
]

// ── Mobile 2D Fallback ────────────────────────────────────────────────────────
// Lightweight Leaflet map — no WebGL, no Three.js, works on all devices
const MobileMap = dynamic(() => import('./MobileMap'), { ssr: false })

// ── Desktop 3D Globe ─────────────────────────────────────────────────────────
function DesktopGlobe() {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pulse, setPulse] = useState(0.5)
  const [dims, setDims] = useState({ w: 800, h: 520 })
  const [fullscreen, setFullscreen] = useState(false)
  const [touching, setTouching] = useState(false)

  useEffect(() => {
    const update = () => {
      const el = containerRef.current
      if (!el) return
      const w = el.clientWidth
      const isMobileView = window.innerWidth < 768
      // Mobile: taller and more square for better interaction
      const h = isMobileView ? Math.min(w * 0.9, 480) : Math.min(w * 0.62, 560)
      setDims({ w, h })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [fullscreen])

  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden'
      const update = () => setDims({ w: window.innerWidth, h: window.innerHeight })
      update()
      window.addEventListener('resize', update)
      return () => { document.body.style.overflow = ''; window.removeEventListener('resize', update) }
    }
  }, [fullscreen])

  useEffect(() => {
    let id: number
    const tick = (t: number) => { setPulse(0.38 + 0.38 * Math.sin(t * 0.002)); id = requestAnimationFrame(tick) }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const g = globeRef.current
    if (!g) return
    g.controls().autoRotate = true
    g.controls().autoRotateSpeed = 0.4
    g.controls().enableZoom = true
    g.controls().minDistance = 180
    g.controls().maxDistance = 700
    g.controls().enableDamping = true
    g.controls().dampingFactor = 0.08
    g.pointOfView({ lat: 10, lng: -30, altitude: 2.4 }, 1200)
  }, [])

  useEffect(() => {
    const g = globeRef.current
    if (!g) return
    g.controls().autoRotate = !touching
  }, [touching])

  const pointRadius = useCallback((d: any) => d.size * pulse, [pulse])
  const pointColor  = useCallback((d: any) => d.color, [])
  const pointLabel  = useCallback((d: any) =>
    `<div style="font-family:Space Mono,monospace;font-size:11px;color:#e2e8f0;background:#0d1014;border:1px solid rgba(148,163,184,0.2);padding:8px 12px;border-radius:8px;white-space:pre;line-height:1.6">${d.label}</div>`, [])

  const wrapStyle: React.CSSProperties = fullscreen
    ? { position: 'fixed', inset: 0, zIndex: 9999, background: '#060810', touchAction: 'none' }
    : { position: 'relative', width: '100%', background: '#060810', borderRadius: 12, overflow: 'hidden', touchAction: 'none' }

  return (
    <div ref={containerRef} style={wrapStyle}
      onTouchStart={e => { e.stopPropagation(); setTouching(true) }}
      onTouchEnd={e => { e.stopPropagation(); setTouching(false) }}
      onTouchMove={e => e.stopPropagation()}
      onMouseDown={() => setTouching(true)} onMouseUp={() => setTouching(false)}>
      <Globe
        ref={globeRef} width={dims.w} height={dims.h}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere atmosphereColor="rgba(100,150,255,0.9)" atmosphereAltitude={0.2}
        backgroundColor="rgba(6,8,16,1)"
        pointsData={POINTS} pointLabel={pointLabel} pointColor={pointColor}
        pointRadius={pointRadius} pointAltitude={0.015} pointResolution={24}
        arcsData={ARCS} arcColor="color" arcDashLength={0.4} arcDashGap={0.15}
        arcDashAnimateTime={2000} arcStroke={0.6} arcAltitude={0.28}
      />
      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(13,16,20,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 10, padding: '10px 14px', fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#64748b' }}>
        {[{ color: '#ef4444', label: 'CONFIRMED' }, { color: '#f59e0b', label: 'MONITORING' }, { color: '#3b82f6', label: 'SURVEILLANCE' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color, boxShadow: `0 0 5px ${l.color}` }} />
            <span style={{ letterSpacing: 1.2 }}>{l.label}</span>
          </div>
        ))}
      </div>
      {/* Controls */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={() => setFullscreen(f => !f)} style={{ background: 'rgba(13,16,20,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: '#94a3b8', fontFamily: 'Space Mono,monospace', fontSize: 9, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
          {fullscreen
            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>EXIT</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>EXPAND</>}
        </button>
        <div style={{ background: 'rgba(13,16,20,0.8)', backdropFilter: 'blur(4px)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 6, padding: '5px 8px', fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#475569', letterSpacing: 1, textAlign: 'center' }}>
          DRAG · SCROLL
        </div>
      </div>
      <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(13,16,20,0.8)', backdropFilter: 'blur(6px)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'blink 1.4s infinite' }} />
        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: 1.2 }}>14 ACTIVE SIGNALS</span>
      </div>
      {fullscreen && (
        <button onClick={() => setFullscreen(false)} style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 20, padding: '6px 18px', cursor: 'pointer', fontFamily: 'Space Mono,monospace', fontSize: 10, color: '#ef4444', letterSpacing: 1.5 }}>
          ✕ CLOSE MAP
        </button>
      )}
    </div>
  )
}

// ── Main export — globe for all devices, 2D only if WebGL unavailable ────────
export default function GlobeComponent() {
  const [use2D, setUse2D] = useState(false)

  useEffect(() => {
    // Only fallback to 2D if WebGL genuinely not supported
    let webglOk = false
    try {
      const canvas = document.createElement('canvas')
      webglOk = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {}
    if (!webglOk) setUse2D(true)
  }, [])

  return use2D ? <MobileMap /> : <DesktopGlobe />
}
