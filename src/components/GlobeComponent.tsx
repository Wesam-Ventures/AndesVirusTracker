'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { feature } from 'topojson-client'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

// ── Outbreak Data ─────────────────────────────────────────────────────────────
const POINTS = [
  { lat: -54.8, lng: -68.3, label: 'ARGENTINA\nOrigin · Endemic Region', color: '#ef4444', size: 1.1 },
  { lat: 14.9,  lng: -23.5, label: 'MV HONDIUS\nActive Vessel · Atlantic', color: '#ef4444', size: 1.4 },
  { lat: 46.8,  lng: 8.2,   label: 'SWITZERLAND\nConfirmed Case', color: '#ef4444', size: 0.95 },
  { lat: 51.5,  lng: -0.1,  label: 'UNITED KINGDOM\nMonitoring', color: '#f59e0b', size: 0.65 },
  { lat: 50.8,  lng: 4.4,   label: 'BELGIUM\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 46.2,  lng: 2.2,   label: 'FRANCE\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 51.2,  lng: 10.4,  label: 'GERMANY\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 39.1,  lng: 22.0,  label: 'GREECE\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 53.1,  lng: -8.2,  label: 'IRELAND\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 52.1,  lng: 5.3,   label: 'NETHERLANDS\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 52.0,  lng: 19.1,  label: 'POLAND\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 39.4,  lng: -8.2,  label: 'PORTUGAL\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 40.5,  lng: -3.7,  label: 'SPAIN\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 1.4,   lng: 103.8, label: 'SINGAPORE\nMonitoring', color: '#f59e0b', size: 0.6 },
  { lat: 37.1,  lng: -95.7, label: 'UNITED STATES\nCDC Monitoring', color: '#3b82f6', size: 0.75 },
  { lat: -33.9, lng: 151.2, label: 'AUSTRALIA\nSurveillance', color: '#3b82f6', size: 0.6 },
  { lat: 56.1,  lng: 9.5,   label: 'DENMARK\nMonitoring', color: '#f59e0b', size: 0.55 },
  { lat: 60.5,  lng: 8.5,   label: 'NORWAY\nMonitoring', color: '#f59e0b', size: 0.55 },
  { lat: 56.7,  lng: 16.2,  label: 'SWEDEN\nMonitoring', color: '#f59e0b', size: 0.55 },
  { lat: 45.5,  lng: 14.5,  label: 'CROATIA\nMonitoring', color: '#f59e0b', size: 0.55 },
]

// Confirmed + ship pulsing rings
const RINGS = [
  { lat: -54.8, lng: -68.3, color: '#ef4444', maxR: 8, speed: 1.2, period: 1800 },
  { lat: 14.9,  lng: -23.5, color: '#ef4444', maxR: 10, speed: 1.4, period: 1500 },
  { lat: 46.8,  lng: 8.2,   color: '#ef4444', maxR: 7,  speed: 1.0, period: 2000 },
  { lat: 37.1,  lng: -95.7, color: '#3b82f6', maxR: 6,  speed: 0.9, period: 2800 },
]

const ARCS = [
  // Ship ↔ origin
  { startLat: -54.8, startLng: -68.3, endLat: 14.9,  endLng: -23.5, color: ['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.95)', 'rgba(239,68,68,0.1)'], stroke: 1.6, alt: 0.40 },
  // Ship → confirmed Switzerland
  { startLat: 14.9,  startLng: -23.5, endLat: 46.8,  endLng: 8.2,   color: ['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.9)', 'rgba(239,68,68,0.1)'],  stroke: 1.4, alt: 0.38 },
  // Ship → USA
  { startLat: 14.9,  startLng: -23.5, endLat: 37.1,  endLng: -95.7, color: ['rgba(59,130,246,0.1)', 'rgba(59,130,246,0.9)', 'rgba(59,130,246,0.1)'], stroke: 1.2, alt: 0.42 },
  // Ship → Singapore
  { startLat: 14.9,  startLng: -23.5, endLat: 1.4,   endLng: 103.8, color: ['rgba(245,158,11,0.1)', 'rgba(245,158,11,0.9)', 'rgba(245,158,11,0.1)'], stroke: 1.2, alt: 0.48 },
  // Ship → UK
  { startLat: 14.9,  startLng: -23.5, endLat: 51.5,  endLng: -0.1,  color: ['rgba(245,158,11,0.1)', 'rgba(245,158,11,0.65)', 'rgba(245,158,11,0.1)'], stroke: 0.9, alt: 0.32 },
  // Ship → France
  { startLat: 14.9,  startLng: -23.5, endLat: 46.2,  endLng: 2.2,   color: ['rgba(245,158,11,0.1)', 'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.1)'],  stroke: 0.9, alt: 0.30 },
  // Ship → Germany
  { startLat: 14.9,  startLng: -23.5, endLat: 51.2,  endLng: 10.4,  color: ['rgba(245,158,11,0.08)', 'rgba(245,158,11,0.55)', 'rgba(245,158,11,0.08)'], stroke: 0.9, alt: 0.30 },
  // Ship → Australia
  { startLat: 14.9,  startLng: -23.5, endLat: -33.9, endLng: 151.2, color: ['rgba(59,130,246,0.08)', 'rgba(59,130,246,0.6)', 'rgba(59,130,246,0.08)'], stroke: 1.0, alt: 0.55 },
  // Ship → Spain
  { startLat: 14.9,  startLng: -23.5, endLat: 40.5,  endLng: -3.7,  color: ['rgba(245,158,11,0.08)', 'rgba(245,158,11,0.5)', 'rgba(245,158,11,0.08)'], stroke: 0.8, alt: 0.25 },
  // Ship → Norway
  { startLat: 14.9,  startLng: -23.5, endLat: 60.5,  endLng: 8.5,   color: ['rgba(245,158,11,0.08)', 'rgba(245,158,11,0.5)', 'rgba(245,158,11,0.08)'], stroke: 0.8, alt: 0.33 },
  // Switzerland → Europe cluster
  { startLat: 46.8,  startLng: 8.2,   endLat: 50.8,  endLng: 4.4,   color: ['rgba(245,158,11,0.06)', 'rgba(245,158,11,0.45)', 'rgba(245,158,11,0.06)'], stroke: 0.7, alt: 0.14 },
  { startLat: 46.8,  startLng: 8.2,   endLat: 51.2,  endLng: 10.4,  color: ['rgba(245,158,11,0.06)', 'rgba(245,158,11,0.45)', 'rgba(245,158,11,0.06)'], stroke: 0.7, alt: 0.12 },
  { startLat: 46.8,  startLng: 8.2,   endLat: 39.1,  endLng: 22.0,  color: ['rgba(245,158,11,0.06)', 'rgba(245,158,11,0.4)', 'rgba(245,158,11,0.06)'],  stroke: 0.7, alt: 0.18 },
]

// Custom HTML pins for the 3 main sites
const HTML_PINS = [
  {
    lat: 14.9, lng: -23.5,
    html: `<div style="transform:translate(-50%,-50%);pointer-events:none">
      <div style="background:#ef4444;color:#fff;font-family:Space Mono,monospace;font-size:9px;font-weight:700;letter-spacing:1.5px;padding:4px 8px;border-radius:4px;white-space:nowrap;box-shadow:0 0 20px rgba(239,68,68,0.8),0 0 40px rgba(239,68,68,0.4)">
        ⚓ MV HONDIUS
      </div>
      <div style="width:1px;height:14px;background:rgba(239,68,68,0.7);margin:0 auto"></div>
    </div>`
  },
  {
    lat: -54.8, lng: -68.3,
    html: `<div style="transform:translate(-50%,-50%);pointer-events:none">
      <div style="background:#ef4444;color:#fff;font-family:Space Mono,monospace;font-size:9px;font-weight:700;letter-spacing:1.5px;padding:4px 8px;border-radius:4px;white-space:nowrap;box-shadow:0 0 16px rgba(239,68,68,0.7),0 0 30px rgba(239,68,68,0.3)">
        🦠 ORIGIN
      </div>
      <div style="width:1px;height:14px;background:rgba(239,68,68,0.7);margin:0 auto"></div>
    </div>`
  },
  {
    lat: 46.8, lng: 8.2,
    html: `<div style="transform:translate(-50%,-50%);pointer-events:none">
      <div style="background:#ef4444;color:#fff;font-family:Space Mono,monospace;font-size:9px;font-weight:700;letter-spacing:1.5px;padding:4px 8px;border-radius:4px;white-space:nowrap;box-shadow:0 0 14px rgba(239,68,68,0.6)">
        🔴 CONFIRMED
      </div>
      <div style="width:1px;height:14px;background:rgba(239,68,68,0.7);margin:0 auto"></div>
    </div>`
  },
]

// ── Mobile 2D Fallback ────────────────────────────────────────────────────────
const MobileMap = dynamic(() => import('./MobileMap'), { ssr: false })

// ── Country Outbreak Status (ISO 3166-1 numeric codes) ───────────────────────
const COUNTRY_STATUS: Record<string, 'confirmed' | 'monitoring'> = {
  '32':  'confirmed',
  '756': 'confirmed',
  '132': 'confirmed',
  '56':  'monitoring',
  '250': 'monitoring',
  '276': 'monitoring',
  '300': 'monitoring',
  '372': 'monitoring',
  '528': 'monitoring',
  '616': 'monitoring',
  '620': 'monitoring',
  '724': 'monitoring',
  '702': 'monitoring',
  '840': 'monitoring',
  '826': 'monitoring',
  '36':  'monitoring',
  '124': 'monitoring',
  '578': 'monitoring',
  '208': 'monitoring',
  '752': 'monitoring',
  '191': 'monitoring',
}

const getCountryColor = (numericId: string) => {
  const status = COUNTRY_STATUS[numericId]
  if (status === 'confirmed')  return 'rgba(239,68,68,0.88)'
  if (status === 'monitoring') return 'rgba(245,158,11,0.52)'
  return 'rgba(15,22,42,0.08)'
}

const getCountryAltitude = (d: any) => {
  const status = COUNTRY_STATUS[String(d.id)]
  if (status === 'confirmed')  return 0.022
  if (status === 'monitoring') return 0.010
  return 0.002
}

// ── Desktop 3D Globe ─────────────────────────────────────────────────────────
function DesktopGlobe() {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pulse, setPulse] = useState(0.7)
  const [dims, setDims] = useState({ w: 800, h: 520 })
  const [fullscreen, setFullscreen] = useState(false)
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] })

  useEffect(() => {
    // Use 50m (higher detail) for crisper country borders
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/world-atlas/countries-50m.json')
      .then(r => r.json())
      .then(data => {
        const geo = feature(data, data.objects.countries) as any
        setCountries(geo)
      })
      .catch(() => {
        // fallback to 110m if 50m fails
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/world-atlas/countries-110m.json')
          .then(r => r.json())
          .then(data => setCountries(feature(data, data.objects.countries) as any))
          .catch(() => {})
      })
  }, [])

  useEffect(() => {
    const update = () => {
      const el = containerRef.current
      if (!el) return
      const w = el.clientWidth
      const isMobileView = window.innerWidth < 768
      const h = isMobileView ? Math.min(w * 0.9, window.innerHeight * 0.65) : Math.min(w * 0.82, 760)
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

  // Pulsing size for points
  useEffect(() => {
    let id: number
    const tick = (t: number) => { setPulse(0.55 + 0.45 * Math.sin(t * 0.0025)); id = requestAnimationFrame(tick) }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const g = globeRef.current
    if (!g) return
    g.controls().autoRotate = true
    g.controls().autoRotateSpeed = 0.4
    g.controls().enableZoom = true
    g.controls().minDistance = 110
    g.controls().maxDistance = 850
    g.controls().enableDamping = true
    g.controls().dampingFactor = 0.12
    g.controls().rotateSpeed = 0.4
    g.controls().touches = { ONE: 1, TWO: 2 }
    g.pointOfView({ lat: 20, lng: -20, altitude: 2.2 }, 1500)
  }, [])

  const pointRadius = useCallback((d: any) => d.size * pulse, [pulse])
  const pointColor  = useCallback((d: any) => d.color, [])
  const pointLabel  = useCallback((d: any) =>
    `<div style="font-family:Space Mono,monospace;font-size:11px;color:#e2e8f0;background:#0d1014;border:1px solid rgba(148,163,184,0.2);padding:8px 12px;border-radius:8px;white-space:pre;line-height:1.6">${d.label}</div>`, [])

  const ringColor       = useCallback((d: any) => (t: number) => `rgba(${d.color === '#ef4444' ? '239,68,68' : d.color === '#3b82f6' ? '59,130,246' : '245,158,11'},${Math.max(0, 1 - t)})`, [])
  const ringMaxRadius   = useCallback((d: any) => d.maxR, [])
  const ringPropSpeed   = useCallback((d: any) => d.speed, [])
  const ringRepeat      = useCallback((d: any) => d.period, [])

  const htmlEl = useCallback((d: any) => {
    const el = document.createElement('div')
    el.innerHTML = d.html
    return el
  }, [])

  const wrapStyle: React.CSSProperties = fullscreen
    ? { position: 'fixed', inset: 0, zIndex: 9999, background: '#050810', touchAction: 'none' }
    : { position: 'relative', width: '100%', background: '#050810', borderRadius: 12, overflow: 'hidden', touchAction: 'none' }

  return (
    <div ref={containerRef} style={wrapStyle}>
      <Globe
        ref={globeRef}
        width={dims.w}
        height={dims.h}

        // NASA nighttime earth — shows city lights, terrain, and ocean depth
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        showAtmosphere
        atmosphereColor="rgba(239,68,68,0.45)"
        atmosphereAltitude={0.28}
        backgroundColor="rgba(3,5,12,1)"

        // High-detail country polygons (50m resolution)
        polygonsData={countries.features}
        polygonCapColor={(d: any) => getCountryColor(String(d.id))}
        polygonSideColor={() => 'rgba(0,0,0,0.15)'}
        polygonStrokeColor={() => '#a8c4ff'}
        polygonAltitude={getCountryAltitude}
        polygonLabel={(d: any) => {
          const status = COUNTRY_STATUS[String(d.id)]
          if (!status) return ''
          const icon = status === 'confirmed' ? '🔴 CONFIRMED CASE' : '🟡 MONITORING'
          const color = status === 'confirmed' ? '#ef4444' : '#f59e0b'
          return `<div style="font-family:Space Mono,monospace;font-size:12px;color:#f1f5f9;background:#080c14;border:1px solid ${color}60;padding:8px 12px;border-radius:8px;font-weight:700">${icon}</div>`
        }}

        // Points
        pointsData={POINTS}
        pointLabel={pointLabel}
        pointColor={pointColor}
        pointRadius={pointRadius}
        pointAltitude={0.025}
        pointResolution={36}

        // Pulsing outbreak rings
        ringsData={RINGS}
        ringColor={ringColor}
        ringMaxRadius={ringMaxRadius}
        ringPropagationSpeed={ringPropSpeed}
        ringRepeatPeriod={ringRepeat}

        // Transmission arcs
        arcsData={ARCS}
        arcColor="color"
        arcDashLength={0.25}
        arcDashGap={0.30}
        arcDashAnimateTime={5000}
        arcStroke={(d: any) => d.stroke}
        arcAltitude={(d: any) => d.alt}

        // HTML pin labels
        htmlElementsData={HTML_PINS}
        htmlElement={htmlEl}
        htmlAltitude={0.04}
      />

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(3,5,12,0.94)', backdropFilter: 'blur(14px)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 12, padding: '12px 16px', fontFamily: 'Space Mono,monospace', fontSize: 11, color: '#94a3b8' }}>
        {[
          { color: '#ef4444', label: 'CONFIRMED', glow: true },
          { color: '#f59e0b', label: 'MONITORING', glow: false },
          { color: '#3b82f6', label: 'SURVEILLANCE', glow: false },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: l.color, boxShadow: l.glow ? `0 0 10px ${l.color}, 0 0 20px ${l.color}60` : `0 0 6px ${l.color}80` }} />
            <span style={{ letterSpacing: 1.5, color: '#e2e8f0', fontWeight: 700 }}>{l.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(148,163,184,0.15)', fontSize: 9, color: '#64748b', letterSpacing: 1 }}>
          {POINTS.length} SIGNALS · {Object.keys(COUNTRY_STATUS).length} TERRITORIES
        </div>
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={() => setFullscreen(f => !f)} style={{ background: 'rgba(3,5,12,0.92)', backdropFilter: 'blur(10px)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#e2e8f0', fontFamily: 'Space Mono,monospace', fontSize: 11, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          {fullscreen
            ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>EXIT</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>EXPAND</>}
        </button>
        <div style={{ background: 'rgba(3,5,12,0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 8, padding: '6px 10px', fontFamily: 'Space Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: 1, textAlign: 'center' }}>
          DRAG · ZOOM
        </div>
      </div>

      {/* Live signal badge */}
      <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(3,5,12,0.90)', backdropFilter: 'blur(8px)', border: '1px solid rgba(74,222,128,0.35)', borderRadius: 10, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 12px #4ade80, 0 0 24px #4ade8060', animation: 'blink 1.4s infinite' }} />
        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, color: '#e2e8f0', letterSpacing: 1, fontWeight: 700 }}>{POINTS.length} ACTIVE SIGNALS</span>
      </div>

      {fullscreen && (
        <button onClick={() => setFullscreen(false)} style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 20, padding: '6px 18px', cursor: 'pointer', fontFamily: 'Space Mono,monospace', fontSize: 10, color: '#ef4444', letterSpacing: 1.5 }}>
          ✕ CLOSE MAP
        </button>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function GlobeComponent() {
  const [use2D, setUse2D] = useState(false)

  useEffect(() => {
    let webglOk = false
    try {
      const canvas = document.createElement('canvas')
      webglOk = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {}
    if (!webglOk) setUse2D(true)
  }, [])

  return use2D ? <MobileMap /> : <DesktopGlobe />
}
