import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Andes Virus Symptoms — Full Clinical Timeline 2026 | AndesVirusTracker.com',
  description: 'Complete guide to Andes virus symptoms: prodromal phase (days 1-5), cardiopulmonary phase (days 5-10), and what to do if you were exposed. Includes emergency warning signs.',
  keywords: ['Andes virus symptoms', 'hantavirus symptoms 2026', 'Andes virus signs', 'hantavirus pulmonary syndrome symptoms', 'HPS symptoms', 'Andes hantavirus clinical presentation'],
  openGraph: { title: 'Andes Virus Symptoms — Full Clinical Timeline', description: 'What does Andes virus feel like? Phase-by-phase symptom guide with emergency warning signs.', url: 'https://andesvirustracker.com/andes-virus-symptoms' },
  alternates: { canonical: 'https://andesvirustracker.com/andes-virus-symptoms' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalCondition',
  name: 'Andes Virus Disease (Hantavirus Pulmonary Syndrome)',
  description: 'Andes virus causes hantavirus pulmonary syndrome (HPS), a severe respiratory illness with approximately 40% case fatality rate.',
  signOrSymptom: [
    { '@type': 'MedicalSymptom', name: 'Fever (38–40°C)' },
    { '@type': 'MedicalSymptom', name: 'Severe headache' },
    { '@type': 'MedicalSymptom', name: 'Muscle pain (myalgia), especially lower back' },
    { '@type': 'MedicalSymptom', name: 'Sudden shortness of breath' },
    { '@type': 'MedicalSymptom', name: 'Pulmonary edema (fluid in lungs)' },
  ],
}

const PHASES = [
  {
    phase: 'Days 1–5', label: 'PRODROMAL PHASE', color: '#f59e0b',
    desc: 'Early symptoms resemble severe flu. Many patients and clinicians initially misdiagnose this phase.',
    items: ['Fever (38–40°C / 100–104°F)', 'Severe headache', 'Muscle pain, especially lower back and thighs', 'Chills and sweating', 'Nausea, vomiting, diarrhea', 'Fatigue, general malaise'],
    warning: null,
  },
  {
    phase: 'Days 5–10', label: 'CARDIOPULMONARY PHASE', color: '#ef4444',
    desc: 'This is the critical and often fatal phase. Respiratory failure can develop within hours.',
    items: ['Sudden shortness of breath (hallmark symptom)', 'Rapid heart rate (tachycardia)', 'Fluid accumulation in lungs (pulmonary edema)', 'Low blood pressure', 'Oxygen saturation drops rapidly', 'Cyanosis (bluish skin) in severe cases'],
    warning: 'EMERGENCY: If shortness of breath develops after fever, call emergency services immediately. This phase can become life-threatening within 4–6 hours.',
  },
  {
    phase: 'Days 10+', label: 'DIURETIC/RECOVERY PHASE', color: '#4ade80',
    desc: 'Survivors who make it past the cardiopulmonary phase typically begin to improve. ICU care is usually required.',
    items: ['Gradual improvement in breathing', 'Fluid clearance from lungs', 'Weeks to months of recovery', 'Mechanical ventilation may be required before improvement', 'Approximately 40% fatality rate — survivors recover fully', 'No vaccine or antiviral exists'],
    warning: null,
  },
]

export default function SymptomsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 0' }}>
        <p className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 3, marginBottom: 12 }}>CLINICAL GUIDE · UPDATED MAY 7, 2026</p>

        <h1 className="font-display" style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 16 }}>
          Andes Virus Symptoms:<br /><span style={{ color: 'var(--red)' }}>What to Watch For</span>
        </h1>

        <p style={{ fontSize: 14, color: 'var(--fg-mute)', lineHeight: 1.8, marginBottom: 32 }}>
          Andes virus causes <strong style={{ color: 'var(--fg)' }}>hantavirus pulmonary syndrome (HPS)</strong> — a severe respiratory illness with approximately 40% case fatality rate. Symptoms progress through distinct phases. Early detection and ICU admission significantly improves survival. There is no approved vaccine or antiviral treatment.
        </p>

        {/* Emergency callout */}
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
          <div className="font-mono" style={{ fontSize: 9, color: 'var(--red)', letterSpacing: 2, marginBottom: 8 }}>⚠ EMERGENCY SIGNS — CALL 911 IMMEDIATELY</div>
          <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.6 }}>
            If you were potentially exposed to Andes virus and develop <strong>sudden shortness of breath</strong>, go to an emergency room immediately. Tell the treating team about potential Andes virus exposure. Time is critical during the cardiopulmonary phase.
          </p>
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 20 }}>SYMPTOM PROGRESSION BY PHASE</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {PHASES.map(ph => (
            <div key={ph.phase} style={{ background: 'var(--bg-1)', border: `1px solid ${ph.color}30`, borderRadius: 12, padding: '20px', borderLeft: `3px solid ${ph.color}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 10 }}>
                <div>
                  <div className="font-mono" style={{ fontSize: 8, color: ph.color, letterSpacing: 2, marginBottom: 2 }}>{ph.phase} · {ph.label}</div>
                  <p style={{ fontSize: 12, color: 'var(--fg-mute)', lineHeight: 1.5 }}>{ph.desc}</p>
                </div>
              </div>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px 16px', marginBottom: ph.warning ? 14 : 0 }}>
                {ph.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--fg)', lineHeight: 1.4 }}>
                    <span style={{ color: ph.color, flexShrink: 0, marginTop: 2 }}>›</span>{item}
                  </li>
                ))}
              </ul>
              {ph.warning && (
                <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
                  <p className="font-mono" style={{ fontSize: 10, color: 'var(--red)', lineHeight: 1.6 }}>{ph.warning}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', letterSpacing: 1, marginBottom: 16 }}>HOW ANDES VIRUS SYMPTOMS DIFFER FROM FLU</h2>
        <div style={{ border: '1px solid var(--line-strong)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--bg-2)', padding: '10px 16px', borderBottom: '1px solid var(--line)' }}>
            {['SYMPTOM', 'ANDES VIRUS', 'INFLUENZA'].map(h => (
              <div key={h} className="font-mono" style={{ fontSize: 8, color: 'var(--fg-dim)', letterSpacing: 2 }}>{h}</div>
            ))}
          </div>
          {[
            ['Sudden shortness of breath', '✓ Key feature', '✗ Rare'],
            ['Severe muscle pain', '✓ Prominent', '✓ Common'],
            ['Respiratory failure', '✓ Common (40% fatal)', '✗ Uncommon'],
            ['Runny nose / sore throat', '✗ Uncommon', '✓ Common'],
            ['Gradual onset', '✗ Abrupt', '✓ 1–4 days'],
            ['ICU admission needed', '✓ Often required', '✗ Rarely'],
          ].map(([s, av, fv], i) => (
            <div key={s} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 16px', borderBottom: i < 5 ? '1px solid var(--line)' : 'none', background: 'var(--bg-1)' }}>
              <div style={{ fontSize: 12, color: 'var(--fg)' }}>{s}</div>
              <div className="font-mono" style={{ fontSize: 11, color: av.includes('✓') ? 'var(--red)' : 'var(--fg-dim)' }}>{av}</div>
              <div className="font-mono" style={{ fontSize: 11, color: fv.includes('✓') ? 'var(--amber)' : 'var(--fg-dim)' }}>{fv}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/andes-virus-incubation-period" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>NEXT →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>Incubation Period</div>
          </Link>
          <Link href="/andes-virus-transmission" style={{ flex: 1, minWidth: 160, background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '14px', textDecoration: 'none', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--fg-dim)', letterSpacing: 2, marginBottom: 4 }}>RELATED →</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>How It Spreads</div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
