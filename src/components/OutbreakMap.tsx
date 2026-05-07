'use client'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

const MARKERS = [
  { lat: -54.8, lng: -68.3, name: 'ARGENTINA', sub: 'Origin · Endemic Region', color: '#ef4444', type: 'confirmed' },
  { lat: 14.9,  lng: -23.5, name: 'MV HONDIUS', sub: 'Active Ship · Near Cape Verde', color: '#ef4444', type: 'confirmed' },
  { lat: 46.8,  lng: 8.2,   name: 'SWITZERLAND', sub: 'Confirmed Case', color: '#ef4444', type: 'confirmed' },
  { lat: 50.8,  lng: 4.4,   name: 'BELGIUM',     sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 46.2,  lng: 2.2,   name: 'FRANCE',      sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 51.2,  lng: 10.4,  name: 'GERMANY',     sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 39.1,  lng: 22.0,  name: 'GREECE',      sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 53.1,  lng: -8.2,  name: 'IRELAND',     sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 52.1,  lng: 5.3,   name: 'NETHERLANDS', sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 52.0,  lng: 19.1,  name: 'POLAND',      sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 39.4,  lng: -8.2,  name: 'PORTUGAL',    sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 40.5,  lng: -3.7,  name: 'SPAIN',       sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 1.4,   lng: 103.8, name: 'SINGAPORE',   sub: 'Active Monitoring', color: '#f59e0b', type: 'monitoring' },
  { lat: 37.1,  lng: -95.7, name: 'UNITED STATES', sub: 'CDC Monitoring', color: '#3b82f6', type: 'monitoring' },
]

export default function OutbreakMap() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    import('leaflet').then((L) => {
      const el = document.getElementById('outbreak-map')
      if (!el || (el as any)._leaflet_id) return

      const map = L.map('outbreak-map', {
        center: [20, 5],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
      }).addTo(map)

      MARKERS.forEach((m, i) => {
        const isConfirmed = m.type === 'confirmed'
        const icon = L.divIcon({
          html: `
            <div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center">
              <div style="position:absolute;width:20px;height:20px;border-radius:50%;background:${m.color};opacity:0.15;animation:ping-slow ${1.8 + i * 0.1}s ease-out infinite"></div>
              <div style="position:absolute;width:10px;height:10px;border-radius:50%;background:${m.color};opacity:0.3;animation:ping-slow ${1.8 + i * 0.1}s ease-out infinite 0.4s"></div>
              <div style="width:${isConfirmed ? 8 : 6}px;height:${isConfirmed ? 8 : 6}px;border-radius:50%;background:${m.color};border:1.5px solid rgba(255,255,255,0.3);position:relative;z-index:1;box-shadow:0 0 8px ${m.color}"></div>
            </div>`,
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        L.marker([m.lat, m.lng], { icon })
          .bindPopup(`
            <div style="font-family:'Space Mono',monospace;padding:2px">
              <div style="color:#ef4444;font-size:9px;letter-spacing:1.5px;margin-bottom:4px">${m.type === 'confirmed' ? '● CONFIRMED' : '◎ MONITORING'}</div>
              <div style="color:#e2e8f0;font-size:11px;font-weight:700;margin-bottom:2px">${m.name}</div>
              <div style="color:#64748b;font-size:10px">${m.sub}</div>
            </div>`)
          .addTo(map)
      })

      // Ship route line
      const route: [number, number][] = [
        [-54.8, -68.3], [-45.0, -60.0], [-30.0, -40.0],
        [-10.0, -25.0], [5.0, -18.0], [14.9, -23.5]
      ]
      L.polyline(route, {
        color: '#ef4444',
        weight: 1.5,
        opacity: 0.4,
        dashArray: '4 6',
      }).addTo(map)
    })
  }, [])

  return (
    <div style={{ position: 'relative', height: '520px', background: 'var(--bg)' }}>
      <div className="scan-line" />
      <div id="outbreak-map" style={{ height: '100%', width: '100%' }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
        background: 'rgba(13,16,20,0.9)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--line-strong)', borderRadius: 8, padding: '8px 12px',
        fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--fg-dim)',
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            CONFIRMED
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            MONITORING
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="16" height="4" viewBox="0 0 16 4"><line x1="0" y1="2" x2="16" y2="2" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 4" /></svg>
            SHIP ROUTE
          </span>
        </div>
      </div>
    </div>
  )
}
