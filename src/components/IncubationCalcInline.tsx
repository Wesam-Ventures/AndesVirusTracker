'use client'
import { useState } from 'react'

export default function IncubationCalcInline() {
  const [date, setDate] = useState('')
  const [result, setResult] = useState<{ earliest: string; avg: string; latest: string } | null>(null)

  const calc = () => {
    if (!date) return
    const exp = new Date(date)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const add = (days: number) => { const d = new Date(exp); d.setDate(d.getDate() + days); return fmt(d) }
    setResult({ earliest: add(9), avg: add(18), latest: add(33) })
  }

  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px' }}>
      <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 14 }}>
        Enter your potential exposure date to calculate your symptom window (9–33 day range per WHO):
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ flex: 1, minWidth: 160, background: 'var(--bg)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '10px 14px', color: 'var(--fg)', fontSize: 13, fontFamily: 'Space Mono, monospace', outline: 'none', colorScheme: 'dark' }} />
        <button onClick={calc} style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700, fontFamily: 'Space Mono, monospace', letterSpacing: 1, cursor: 'pointer' }}>
          CALCULATE
        </button>
      </div>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
          {[
            { label: 'EARLIEST (Day 9)', value: result.earliest, color: '#f59e0b' },
            { label: 'AVERAGE (Day 18)', value: result.avg, color: '#ef4444' },
            { label: 'LATEST (Day 33)', value: result.latest, color: '#64748b' },
          ].map(r => (
            <div key={r.label} style={{ background: 'var(--bg)', border: `1px solid ${r.color}30`, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: 8, color: r.color, letterSpacing: 1.5, marginBottom: 6 }}>{r.label}</div>
              <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>{r.value}</div>
            </div>
          ))}
        </div>
      )}
      <p className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', marginTop: 12, opacity: 0.5 }}>NOT MEDICAL ADVICE · BASED ON WHO PUBLISHED INCUBATION RANGE</p>
    </div>
  )
}
