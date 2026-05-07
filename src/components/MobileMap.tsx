'use client'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

const MARKERS = [
  { lat: -54.8, lng: -68.3, name: 'ARGENTINA', sub: 'Origin · Endemic Region', color: '#ef4444' },
  { lat: 14.9,  lng: -23.5, name: 'MV HONDIUS', sub: 'Active Vessel · Cape Verde', color: '#ef4444' },
  { lat: 46.8,  lng: 8.2,   name: 'SWITZERLAND', sub: 'Confirmed Case', color: '#ef4444' },
  { lat: 50.8,  lng: 4.4,   name: 'BELGIUM',     sub: 'Monitoring', color: '#f59e0b' },
  { lat: 46.2,  lng: 2.2,   name: 'FRANCE',      sub: 'Monitoring', color: '#f59e0b' },
  { lat: 51.2,  lng: 10.4,  name: 'GERMANY',     sub: 'Monitoring', color: '#f59e0b' },
  { lat: 1.4,   lng: 103.8, name: 'SINGAPORE',   sub: 'Monitoring', color: '#f59e0b' },
  { lat: 37.1,  lng: -95.7, name: 'UNITED STATES', sub: 'CDC Monitoring', color: '#3b82f6' },
]

export default function MobileMap() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    import('leaflet').then((L) => {
      const el = document.getElementById('mobile-map')
      if (!el || (el as any)._leaflet_id) return

      const map = L.map('mobile-map', {
        center: [20, 5], zoom: 1,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 8 }).addTo(map)

      MARKERS.forEach(m => {
        const icon = L.divIcon({
          html: `<div style="width:12px;height:12px;border-radius:50%;background:${m.color};border:2px solid rgba(255,255,255,0.5);box-shadow:0 0 8px ${m.color}"></div>`,
          className: '', iconSize: [12, 12], iconAnchor: [6, 6],
        })
        L.marker([m.lat, m.lng], { icon })
          .bindPopup(`<b style="font-family:monospace;color:#111;font-size:11px">${m.name}</b><br><span style="color:#555;font-size:10px">${m.sub}</span>`)
          .addTo(map)
      })

      // Ship route
      L.polyline([[-54.8,-68.3],[-30,-40],[-10,-25],[14.9,-23.5]], { color: '#ef4444', weight: 1.5, opacity: 0.5, dashArray: '4 6' }).addTo(map)
    })
  }, [])

  return (
    <div style={{ position: 'relative', background: '#0a0c0f' }}>
      <style>{`
        #mobile-map { height: 320px; width: 100%; }
        .leaflet-tile { filter: brightness(0.6) saturate(0.5); }
        .leaflet-container { background: #0a0c0f !important; }
        .leaflet-popup-content-wrapper { background: #0d1014 !important; border: 1px solid rgba(148,163,184,0.2) !important; border-radius: 8px !important; color: #e2e8f0 !important; font-size: 11px !important; }
        .leaflet-popup-tip { background: #0d1014 !important; }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-zoom a { background: #0d1014 !important; border-color: rgba(148,163,184,0.2) !important; color: #94a3b8 !important; }
      `}</style>
      <div id="mobile-map" />
      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(13,16,20,0.92)', backdropFilter: 'blur(6px)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, padding: '8px 12px', zIndex: 1000, fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#64748b' }}>
        {[{ color: '#ef4444', label: 'CONFIRMED' }, { color: '#f59e0b', label: 'MONITORING' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
            <span style={{ letterSpacing: 1 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(13,16,20,0.85)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 6, padding: '4px 8px', zIndex: 1000, fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#475569', letterSpacing: 1 }}>
        TAP MARKERS FOR INFO
      </div>
    </div>
  )
}
