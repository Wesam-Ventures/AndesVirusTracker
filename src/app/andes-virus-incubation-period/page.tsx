import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'
import IncubationCalcInline from '@/components/IncubationCalcInline'

export const metadata: Metadata = {
  title: 'Andes Virus Incubation Period: 9 to 33 Days | AndesVirusTracker.com',
  description: 'The Andes virus incubation period is 9–33 days (average 18 days). Use our free exposure date calculator to determine your symptom window based on WHO data.',
  keywords: ['Andes virus incubation period', 'hantavirus incubation period', 'Andes virus symptoms when', 'how long after exposure hantavirus', 'hantavirus incubation 2026'],
  openGraph: { title: 'Andes Virus Incubation Period: 9 to 33 Days', description: 'When do Andes virus symptoms appear? Use our calculator to find your exposure window.', url: 'https://andesvirustracker.com/andes-virus-incubation-period' },
  alternates: { canonical: 'https://andesvirustracker.com/andes-virus-incubation-period' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the incubation period for Andes virus?', acceptedAnswer: { '@type': 'Answer', text: 'The Andes virus incubation period is 9 to 33 days, with an average of approximately 18 days. This is the time between exposure and the appearance of first symptoms.' } },
    { '@type': 'Question', name: 'How long after exposure do Andes virus symptoms appear?', acceptedAnswer: { '@type': 'Answer', text: 'Symptoms typically appear 9 to 33 days after exposure. The average is 18 days. If you were potentially exposed, monitor for symptoms for at least 33 days.' } },
  ],
}

export default function IncubationPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 0' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 12 }}>INCUBATION DATA · SOURCE: WHO/CDC</p>

        {/* Direct answer — featured snippet target */}
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px', marginBottom: 32 }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 16 }}>
            Andes Virus Incubation Period:<br /><span style={{ color: 'var(--amber)' }}>9 to 33 Days</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.8, marginBottom: 16 }}>
            The <strong style={{ color: 'var(--fg)' }}>Andes virus incubation period is 9 to 33 days</strong>, with an average of approximately <strong style={{ color: 'var(--fg)' }}>18 days</strong>. This is the time between exposure and the first appearance of symptoms. If you were potentially exposed, you should monitor yourself for at least 33 days from the date of possible contact.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: 'SHORTEST', value: '9 days', color: 'var(--green)' },
              { label: 'AVERAGE', value: '18 days', color: 'var(--amber)' },
              { label: 'LONGEST', value: '33 days', color: 'var(--red)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                <div className="font-mono" style={{ fontSize: 20, color: s.color, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
                <div className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 12 }}>EXPOSURE DATE CALCULATOR</h2>
        <p style={{ fontSize: 13, color: 'var(--fg-mute)', marginBottom: 16 }}>Enter when you may have been exposed — we'll calculate your symptom window based on WHO-published incubation data.</p>
        <div style={{ marginBottom: 32 }}>
          <IncubationCalcInline />
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>WHAT TO DO DURING THE INCUBATION WINDOW</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {[
            { step: '01', title: 'Monitor daily for fever', desc: 'Take your temperature twice daily. A fever of 38°C (100.4°F) or higher after potential exposure should prompt immediate medical contact.' },
            { step: '02', title: 'Watch for muscle pain', desc: 'Severe muscle pain — especially in the lower back, thighs, or shoulders — appearing alongside fever is an early warning sign.' },
            { step: '03', title: 'Emergency if breathless', desc: 'Any sudden shortness of breath during the 33-day window should be treated as a medical emergency. Go to the ER immediately and mention potential exposure.' },
            { step: '04', title: 'Inform your doctor', desc: 'Tell your primary care physician about potential exposure. They can arrange monitoring and ensure rapid escalation if symptoms appear.' },
          ].map(s => (
            <div key={s.step} style={{ display: 'flex', gap: 16, background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 10, padding: '16px' }}>
              <div className="font-mono" style={{ fontSize: 24, color: 'var(--red)', fontWeight: 700, opacity: 0.4, flexShrink: 0, lineHeight: 1 }}>{s.step}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{s.title}</div>
                <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/andes-virus-symptoms" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>RELATED →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Andes Virus Symptoms</div>
          </Link>
          <Link href="/" style={{ flex: 1, minWidth: 160, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 2, marginBottom: 4 }}>LIVE →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Back to Live Tracker</div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
