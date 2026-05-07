'use client'
// MARK: - Imports
import { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

// MARK: - Client-only Globe (no SSR — Three.js needs window)
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

// MARK: - Outbreak Points (lat/lng + label + color + size)
const POINTS = [
  { lat: -54.8, lng: -68.3, label: 'ARGENTINA\nOrigin · Endemic Region', color: '#ef4444', size: 0.6 },
  { lat: 14.9,  lng: -23.5, label: 'MV HONDIUS\nActive Vessel · Near Cape Verde', color: '#ef4444', size: 0.7 },
  { lat: 46.8,  lng: 8.2,   label: 'SWITZERLAND\nConfirmed Case', color: '#ef4444', size: 0.5 },
  { lat: 50.8,  lng: 4.4,   label: 'BELGIUM\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 46.2,  lng: 2.2,   label: 'FRANCE\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 51.2,  lng: 10.4,  label: 'GERMANY\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 39.1,  lng: 22.0,  label: 'GREECE\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 53.1,  lng: -8.2,  label: 'IRELAND\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 52.1,  lng: 5.3,   label: 'NETHERLANDS\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 52.0,  lng: 19.1,  label: 'POLAND\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 39.4,  lng: -8.2,  label: 'PORTUGAL\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 40.5,  lng: -3.7,  label: 'SPAIN\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 1.4,   lng: 103.8, label: 'SINGAPORE\nActive Monitoring', color: '#f59e0b', size: 0.35 },
  { lat: 37.1,  lng: -95.7, label: 'UNITED STATES\nCDC Monitoring', color: '#3b82f6', size: 0.4 },
]

// MARK: - Spread Arcs (origin → vessel → impacted regions)
const ARCS = [
  { startLat: -54.8, startLng: -68.3, endLat: 14.9,  endLng: -23.5, color: ['rgba(239,68,68,0)', 'rgba(239,68,68,0.6)', 'rgba(239,68,68,0)'] },
  { startLat: 14.9,  startLng: -23.5, endLat: 46.8,  endLng: 8.2,   color: ['rgba(239,68,68,0)', 'rgba(239,68,68,0.4)', 'rgba(239,68,68,0)'] },
  { startLat: 14.9,  startLng: -23.5, endLat: 37.1,  endLng: -95.7, color: ['rgba(239,68,68,0)', 'rgba(59,130,246,0.4)', 'rgba(59,130,246,0)'] },
  { startLat: 14.9,  startLng: -23.5, endLat: 1.4,   endLng: 103.8, color: ['rgba(239,68,68,0)', 'rgba(245,158,11,0.4)', 'rgba(245,158,11,0)'] },
]

// MARK: - GlobeComponent
export default function GlobeComponent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const [pulse, setPulse] = useState(0.5)
  const [dimensions, setDimensions] = useState({ width: 600, height: 520 })

  // MARK: - Responsive sizing — tracks the container width
  useEffect(() => {
    const update = () => {
      const el = document.getElementById('globe-container')
      if (el) {
        const w = el.clientWidth
        setDimensions({ width: w, height: Math.min(w * 0.75, 560) })
        console.log('[Globe] resize →', { width: w, height: Math.min(w * 0.75, 560) })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // MARK: - Pulse animation for outbreak points
  useEffect(() => {
    let id: number
    const tick = (t: number) => {
      setPulse(0.4 + 0.35 * Math.sin(t * 0.0022))
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  // MARK: - Auto-rotate + initial camera position
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    console.log('[Globe] mount → configuring controls + initial POV')
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.35
    globe.controls().enableZoom = true
    globe.controls().minDistance = 200
    globe.controls().maxDistance = 600
    globe.pointOfView({ lat: 10, lng: -30, altitude: 2.2 }, 1000)
  }, [])

  // MARK: - Globe data accessors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pointRadius = useCallback((d: any) => d.size * pulse, [pulse])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pointColor = useCallback((d: any) => d.color, [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pointLabel = useCallback(
    (d: any) =>
      `<div style="font-family:Space Mono,monospace;font-size:10px;color:#e2e8f0;background:#0d1014;border:1px solid rgba(148,163,184,0.2);padding:6px 10px;border-radius:6px;white-space:pre">${d.label}</div>`,
    []
  )

  // MARK: - Render
  return (
    <div
      id="globe-container"
      style={{
        width: '100%',
        background: '#060810',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere={true}
        atmosphereColor="rgba(100,150,255,0.8)"
        atmosphereAltitude={0.18}
        backgroundColor="rgba(6,8,16,1)"
        pointsData={POINTS}
        pointLabel={pointLabel}
        pointColor={pointColor}
        pointRadius={pointRadius}
        pointAltitude={0.015}
        pointResolution={20}
        arcsData={ARCS}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.15}
        arcDashAnimateTime={2200}
        arcStroke={0.5}
        arcAltitude={0.25}
      />

      {/* MARK: - Legend overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(13,16,20,0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(148,163,184,0.15)',
          borderRadius: 8,
          padding: '8px 12px',
          fontFamily: 'Space Mono,monospace',
          fontSize: 9,
          color: '#64748b',
        }}
      >
        {[
          { color: '#ef4444', label: 'CONFIRMED' },
          { color: '#f59e0b', label: 'MONITORING' },
          { color: '#3b82f6', label: 'SURVEILLANCE' },
        ].map((l) => (
          <div
            key={l.label}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
            <span style={{ letterSpacing: 1 }}>{l.label}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: '1px solid rgba(148,163,184,0.1)',
            marginTop: 4,
            paddingTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="16" height="4">
            <line x1="0" y1="2" x2="16" y2="2" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          <span style={{ letterSpacing: 1 }}>SPREAD ARC</span>
        </div>
      </div>

      {/* MARK: - Drag hint */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(13,16,20,0.7)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(148,163,184,0.1)',
          borderRadius: 6,
          padding: '4px 8px',
          fontFamily: 'Space Mono,monospace',
          fontSize: 8,
          color: '#64748b',
          letterSpacing: 1,
        }}
      >
        DRAG TO ROTATE
      </div>
    </div>
  )
}
