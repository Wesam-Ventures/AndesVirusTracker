import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Can Andes Virus Spread Person to Person? | AndesVirusTracker.com',
  description: 'Yes — Andes virus is the only hantavirus confirmed to spread human-to-human. Learn how it transmits, the risk factors, and how the 2026 MV Hondius outbreak happened.',
  keywords: ['Andes virus person to person', 'can hantavirus spread between humans', 'Andes virus transmission', 'hantavirus human to human', 'Andes virus contact'],
  openGraph: { title: 'Can Andes Virus Spread Person to Person?', description: 'Andes virus is the ONLY hantavirus that spreads human-to-human. Here is exactly how it transmits.', url: 'https://andesvirustracker.com/andes-virus-transmission', images: [{ url: '/og?title=andes+virus+transmission', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://andesvirustracker.com/andes-virus-transmission' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Can Andes virus spread person to person?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Andes virus (ANDV) is the only hantavirus strain with confirmed human-to-human transmission. It requires prolonged close contact, such as sharing a bed or food with an infected person.' } },
    { '@type': 'Question', name: 'How does Andes virus spread between people?', acceptedAnswer: { '@type': 'Answer', text: 'Andes virus spreads through prolonged close contact with an infected person, likely via respiratory secretions. It is not airborne like COVID-19 and does not spread through casual contact.' } },
    { '@type': 'Question', name: 'Can you catch Andes virus from a stranger?', acceptedAnswer: { '@type': 'Answer', text: 'Extremely unlikely. Andes virus requires sustained close contact. Casual exposure — sitting near someone on a plane, brief conversations — has not been documented as a transmission route.' } },
  ],
}

export default function TransmissionPage() {
  const card = (title: string, body: string, color = 'var(--line-strong)') => (
    <div style={{ background: 'var(--bg-1)', border: `1px solid ${color}`, borderRadius: 10, padding: '18px' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7 }}>{body}</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 0' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 12 }}>TRANSMISSION GUIDE · UPDATED MAY 7, 2026</p>

        {/* Direct answer in first 100 words — critical for Google featured snippet */}
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '20px', marginBottom: 32 }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 12 }}>
            Can Andes Virus Spread<br /><span style={{ color: 'var(--red)' }}>Person to Person?</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fg)', lineHeight: 1.7, fontWeight: 500 }}>
            <strong style={{ color: 'var(--red)' }}>Yes.</strong> Andes virus is the <strong>only hantavirus strain in the world</strong> confirmed to spread from person to person. All other hantavirus strains only spread from infected rodents to humans — not between people. This is why the 2026 MV Hondius outbreak is uniquely dangerous.
          </p>
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>HOW IT SPREADS</h2>
        <div style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
          {card('Prolonged Close Contact', 'The primary route. Documented cases have involved sleeping in the same bed as an infected person or sharing food. The transmission mechanism is believed to involve respiratory secretions during extended close contact.', 'rgba(239,68,68,0.3)')}
          {card('NOT Airborne (Like COVID)', 'Andes virus does not spread through the air at a distance. Brief encounters — sitting near someone on a plane, being in the same room — have not been documented as transmission routes.', 'rgba(148,163,184,0.2)')}
          {card('NOT via Rodent on This Ship', 'The MV Hondius outbreak is confirmed person-to-person spread, not rodent exposure. This distinguishes it from typical hantavirus cases which require direct contact with infected rodent droppings.', 'rgba(245,158,11,0.2)')}
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>THE MV HONDIUS OUTBREAK — 2026</h2>
        <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.8, marginBottom: 24 }}>
          In April–May 2026, the polar expedition cruise ship MV Hondius experienced a confirmed Andes virus cluster. At least 8 passengers were infected, 3 died, and 62+ are under active monitoring across 23 countries. WHO confirmed the strain as Andes virus on May 6, 2026 — the first multi-country person-to-person outbreak of Andes virus ever documented on a vessel.
        </p>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>WHO IS AT RISK?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 32 }}>
          {[
            { label: 'HIGH RISK', desc: 'MV Hondius passengers (April–May 2026)', color: '#ef4444' },
            { label: 'MODERATE RISK', desc: 'Close contacts of confirmed cases — household members, caregivers', color: '#f59e0b' },
            { label: 'LOW RISK', desc: 'General public with no link to the outbreak', color: '#4ade80' },
          ].map(r => (
            <div key={r.label} style={{ background: 'var(--bg-1)', border: `1px solid ${r.color}30`, borderRadius: 10, padding: '16px' }}>
              <div className="font-mono" style={{ fontSize: 9, color: r.color, letterSpacing: 2, marginBottom: 6 }}>{r.label}</div>
              <p style={{ fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.5 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>FREQUENTLY ASKED</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--line)', marginBottom: 32 }}>
          {[
            { q: 'Can I catch it from someone on the same cruise?', a: 'Only through prolonged close contact. Being on the same ship is not sufficient — documented person-to-person spread required extended close exposure (sleeping together, prolonged shared space).' },
            { q: 'Can it spread on an airplane?', a: 'No documented cases of airborne transmission. Andes virus is not known to spread through ventilation systems or brief casual contact. This is distinct from COVID-19.' },
            { q: 'Is it safe to travel to Argentina or Patagonia?', a: 'The WHO rates general public risk as low. The outbreak is linked to a specific vessel, not community spread in Argentina. Exercise normal precautions in endemic regions — avoid rodent contact, do not handle dead rodents.' },
            { q: 'How long is someone contagious?', a: 'This is not fully established for Andes virus. Patients should be considered potentially infectious during the acute phase of illness. Healthcare workers treating confirmed cases should use appropriate PPE.' },
          ].map(faq => (
            <details key={faq.q} style={{ background: 'var(--bg-1)' }}>
              <summary style={{ padding: '14px 16px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
                {faq.q} <span style={{ color: 'var(--red)', marginLeft: 12 }}>+</span>
              </summary>
              <div style={{ padding: '0 16px 14px', fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.7, borderTop: '1px solid var(--line)' }}>
                <div style={{ paddingTop: 12 }}>{faq.a}</div>
              </div>
            </details>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/andes-virus-symptoms" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>NEXT →</div>
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
