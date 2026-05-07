'use client'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

const MARKERS = [
  { lat: -54.8, lng: -68.3, name: 'Argentina (Origin)', status: 'Endemic Region', color: '#DC2626' },
  { lat: 14.9, lng: -23.5, name: 'MV Hondius — Last Position', status: 'Near Cape Verde — active ship', color: '#DC2626' },
  { lat: 46.8, lng: 8.2, name: 'Switzerland', status: '✅ Confirmed case — Andes strain', color: '#DC2626' },
  { lat: 50.8, lng: 4.4, name: 'Belgium', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 46.2, lng: 2.2, name: 'France', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 51.2, lng: 10.4, name: 'Germany', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 39.1, lng: 22.0, name: 'Greece', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 53.1, lng: -8.2, name: 'Ireland', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 52.1, lng: 5.3, name: 'Netherlands', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 52.0, lng: 19.1, name: 'Poland', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 39.4, lng: -8.2, name: 'Portugal', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 40.5, lng: -3.7, name: 'Spain', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 1.4, lng: 103.8, name: 'Singapore', status: '⚠️ Monitoring passengers', color: '#F59E0B' },
  { lat: 37.1, lng: -95.7, name: 'United States', status: '⚠️ CDC monitoring', color: '#F59E0B' },
]

export default function OutbreakMap() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      const mapEl = document.getElementById('outbreak-map')
      if (!mapEl || (mapEl as any)._leaflet_id) return

      const map = L.map('outbreak-map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles',
      }).addTo(map)

      MARKERS.forEach((m) => {
        const icon = L.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${m.color};border:2px solid white;box-shadow:0 0 6px ${m.color}"></div>`,
          className: '',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })

        L.marker([m.lat, m.lng], { icon })
          .bindPopup(`<b style="color:#111">${m.name}</b><br/><span style="color:#555;font-size:12px">${m.status}</span>`)
          .addTo(map)
      })
    })
  }, [])

  return (
    <div>
      <style>{`
        #outbreak-map { height: 480px; width: 100%; background: #0a0a0a; }
        .leaflet-tile { filter: brightness(0.7) saturate(0.6); }
        .leaflet-popup-content-wrapper { border-radius: 8px; }
      `}</style>
      <div id="outbreak-map" />
    </div>
  )
}
