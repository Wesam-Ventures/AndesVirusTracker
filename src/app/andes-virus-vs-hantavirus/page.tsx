import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Andes Virus vs Hantavirus — Key Differences | AndesVirusTracker.com',
  description: 'Andes virus IS a hantavirus — but with one critical difference: it spreads person-to-person. Full comparison of Andes virus vs all other hantavirus strains, including Sin Nombre virus.',
  keywords: ['Andes virus vs hantavirus', 'difference between Andes virus and hantavirus', 'hantavirus strains', 'Sin Nombre virus vs Andes virus', 'which hantavirus is most dangerous'],
  openGraph: { title: 'Andes Virus vs Hantavirus — What Is the Difference?', description: 'Andes virus is the only hantavirus that spreads person-to-person. Here is how it compares to all other strains.', url: 'https://andesvirustracker.com/andes-virus-vs-hantavirus' },
  alternates: { canonical: 'https://andesvirustracker.com/andes-virus-vs-hantavirus' },
}

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is Andes virus the same as hantavirus?', acceptedAnswer: { '@type': 'Answer', text: 'Andes virus is a strain of hantavirus. There are over 20 known hantavirus strains. Andes virus (ANDV) is uniquely dangerous because it is the only hantavirus confirmed to spread from person to person.' } },
    { '@type': 'Question', name: 'Which hantavirus is the most dangerous?', acceptedAnswer: { '@type': 'Answer', text: 'Andes virus has the highest combination of lethality and transmission risk. Its approximately 40% fatality rate is comparable to Sin Nombre virus, but its person-to-person transmission capability makes it uniquely dangerous during outbreaks.' } },
  ],
}

const STRAINS = [
  { name: 'Andes Virus (ANDV)', region: 'South America', p2p: true, cfr: '~40%', disease: 'HPS', reservoir: 'Long-tailed pygmy rice rat', highlight: true },
  { name: 'Sin Nombre Virus', region: 'North America', p2p: false, cfr: '~36%', disease: 'HPS', reservoir: 'Deer mouse (Peromyscus maniculatus)', highlight: false },
  { name: 'Hantaan Virus', region: 'Asia', p2p: false, cfr: '5–15%', disease: 'HFRS', reservoir: 'Striped field mouse', highlight: false },
  { name: 'Seoul Virus', region: 'Worldwide', p2p: false, cfr: '<1%', disease: 'HFRS (mild)', reservoir: 'Brown rat (Rattus norvegicus)', highlight: false },
  { name: 'Puumala Virus', region: 'Europe', p2p: false, cfr: '<0.1%', disease: 'NE (mild HFRS)', reservoir: 'Bank vole', highlight: false },
]

export default function VsHantavirusPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 0' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 12 }}>VIRUS COMPARISON · UPDATED MAY 7, 2026</p>

        <h1 className="font-display" style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 16 }}>
          Andes Virus vs Hantavirus:<br /><span style={{ color: 'var(--amber)' }}>What Is the Difference?</span>
        </h1>

        {/* Direct answer */}
        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, padding: '20px', marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.8, marginBottom: 12 }}>
            <strong>Andes virus IS a hantavirus</strong> — specifically, it is one strain within the hantavirus family. There are over 20 known hantavirus strains worldwide. What makes Andes virus uniquely dangerous is a single critical difference:
          </p>
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '14px 18px' }}>
            <p style={{ fontSize: 15, color: 'var(--fg)', fontWeight: 600, lineHeight: 1.6 }}>
              🔴 Andes virus is the <strong>only hantavirus in the world</strong> confirmed to spread from person to person. Every other hantavirus strain can only spread from infected rodents to humans — not between people.
            </p>
          </div>
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>HANTAVIRUS STRAIN COMPARISON</h2>
        <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', marginBottom: 32, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--line)' }}>
                {['STRAIN', 'REGION', 'P2P?', 'FATALITY', 'DISEASE'].map(h => (
                  <th key={h} className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2, padding: '10px 14px', textAlign: 'left', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRAINS.map((s, i) => (
                <tr key={s.name} style={{ borderBottom: i < STRAINS.length - 1 ? '1px solid var(--line)' : 'none', background: s.highlight ? 'rgba(239,68,68,0.05)' : 'var(--bg-1)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 13, color: s.highlight ? 'var(--red)' : 'var(--fg)', fontWeight: s.highlight ? 700 : 400 }}>{s.name}</span>
                    {s.highlight && <div className="font-mono" style={{ fontSize: 7, color: 'var(--red)', letterSpacing: 1, marginTop: 2 }}>← CURRENT OUTBREAK</div>}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--fg-mute)' }}>{s.region}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="font-mono" style={{ fontSize: 11, color: s.p2p ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{s.p2p ? 'YES ✓' : 'NO'}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="font-mono" style={{ fontSize: 11, color: s.highlight ? 'var(--red)' : 'var(--fg-mute)', fontWeight: s.highlight ? 700 : 400 }}>{s.cfr}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--fg-mute)' }}>{s.disease}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>WHY ANDES VIRUS MATTERS MORE IN 2026</h2>
        <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.8, marginBottom: 24 }}>
          The 2026 MV Hondius outbreak is the first documented multi-country Andes virus cluster involving person-to-person spread on a vessel. Most hantavirus outbreaks are isolated to people who have direct contact with infected rodents in endemic regions. The MV Hondius situation is different: passengers without any rodent contact became infected through close contact with other infected passengers. This is why public health authorities are treating this outbreak with heightened concern despite the WHO&apos;s current &quot;low risk to general public&quot; classification.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/andes-virus-transmission" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>DEEP DIVE →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>How It Spreads</div>
          </Link>
          <Link href="/andes-virus-symptoms" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>RELATED →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Symptoms Guide</div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
