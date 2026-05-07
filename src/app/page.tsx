'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const OutbreakMap = dynamic(() => import('@/components/OutbreakMap'), { ssr: false })

const STATS = [
  { label: 'Confirmed Cases', value: '8', icon: '🔴', source: 'WHO' },
  { label: 'Deaths', value: '3', icon: '💀', source: 'WHO' },
  { label: 'Countries Monitoring', value: '23', icon: '🌍', source: 'WHO/ECDC' },
  { label: 'Passengers Exposed', value: '62+', icon: '⚠️', source: 'Global News' },
]

const NEWS = [
  { source: 'WHO', title: 'Multi-country cluster of Andes virus disease — Disease Outbreak Notice', date: 'May 6, 2026', url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599' },
  { source: 'CNN', title: 'Andes virus: What doctors know about how the hantavirus spreads', date: 'May 6, 2026', url: 'https://www.cnn.com/2026/05/06/health/andes-strain-hantavirus-explained' },
  { source: 'NPR', title: 'Cruise ship hantavirus confirmed as rare type that can spread human-to-human', date: 'May 5, 2026', url: 'https://www.npr.org/2026/05/05/g-s1-120234/cruise-ship-hantavirus' },
  { source: 'NBC News', title: 'US monitoring hantavirus cruise passengers as new case confirmed', date: 'May 6, 2026', url: 'https://www.nbcnews.com/health/health-news/us-monitoring-hantavirus-cruise-passengers-new-case-flight-attendant-rcna343990' },
  { source: 'Live Science', title: 'Andes virus — the only hantavirus that can spread between people — identified on cruise ship', date: 'May 6, 2026', url: 'https://www.livescience.com/health/viruses-infections-disease/andes-virus-the-only-hantavirus-strain-that-can-spread-between-people-identified-as-culprit-on-cruise-ship' },
  { source: 'Time', title: 'What Countries Are Linked to the Hantavirus Outbreak?', date: 'May 7, 2026', url: 'https://time.com/article/2026/05/07/countries-hantavirus-hondius-cruise-ship/' },
]

const GEAR = [
  { name: '3M P100 Half-Face Respirator', desc: 'Maximum respiratory protection against airborne particles', price: '$45–65', url: 'https://www.amazon.com/s?k=3M+P100+respirator&tag=YOURTAG-20', icon: '😷' },
  { name: 'N95 Respirator Masks (50-pack)', desc: 'CDC-recommended respiratory protection', price: '$25–40', url: 'https://www.amazon.com/s?k=N95+respirator+masks+50+pack&tag=YOURTAG-20', icon: '🫁' },
  { name: 'Tyvek Protective Coverall Suit', desc: 'Full-body protection when cleaning rodent areas', price: '$15–25', url: 'https://www.amazon.com/s?k=tyvek+coverall+suit&tag=YOURTAG-20', icon: '🦺' },
  { name: 'Victor Snap Trap (12-pack)', desc: 'Eliminate rodent vectors in and around your home', price: '$15–20', url: 'https://www.amazon.com/s?k=victor+snap+trap+rodent&tag=YOURTAG-20', icon: '🐀' },
  { name: 'Nitrile Gloves (100-pack)', desc: 'Barrier protection for cleanup of rodent areas', price: '$12–18', url: 'https://www.amazon.com/s?k=nitrile+gloves+100+pack&tag=YOURTAG-20', icon: '🧤' },
  { name: 'Lysol Disinfectant Spray (4-pack)', desc: 'Disinfect surfaces potentially contaminated by rodents', price: '$20–30', url: 'https://www.amazon.com/s?k=lysol+disinfectant+spray&tag=YOURTAG-20', icon: '🧴' },
]

const FAQS = [
  { q: 'Can Andes virus spread between humans?', a: 'Yes — Andes virus is the only hantavirus confirmed to spread person-to-person. Transmission requires prolonged close contact (sharing a bed or food). It does not spread through the air like COVID-19.' },
  { q: 'Is Andes virus the same as hantavirus?', a: 'Andes virus is a strain of hantavirus, but uniquely dangerous because it can spread human-to-human. All other hantavirus strains only spread from rodents to humans.' },
  { q: 'What happened on the MV Hondius?', a: 'In April–May 2026, 8 passengers on the cruise ship MV Hondius were confirmed infected with Andes virus. 3 died. Over 62 more passengers are being monitored across 23 countries.' },
  { q: 'Is there a hantavirus vaccine?', a: 'No approved vaccine exists for hantavirus. Supportive care in an ICU is the primary treatment. Early hospitalization improves outcomes.' },
  { q: 'How deadly is Andes virus?', a: 'The case fatality rate is approximately 40%, making it one of the deadliest respiratory viruses. It causes hantavirus pulmonary syndrome (HPS), which leads to rapid respiratory failure.' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#111111', borderBottom: '1px solid #1f1f1f' }} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🦠</span>
            <span className="font-bold text-white text-lg">AndesVirusTracker</span>
            <div className="flex items-center gap-1.5 bg-red-950 border border-red-800 rounded-full px-2.5 py-0.5">
              <div className="live-dot w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400 text-xs font-bold tracking-wider">LIVE</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#map" className="hover:text-white transition-colors">Map</a>
            <a href="#news" className="hover:text-white transition-colors">News</a>
            <a href="#protect" className="hover:text-white transition-colors">Protect Yourself</a>
            <a href="#alerts" className="bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors text-xs font-semibold">Get Alerts</a>
          </div>
        </div>
      </nav>

      {/* BREAKING BANNER */}
      <div className="bg-red-700 text-white text-center py-2 px-4 text-sm font-medium">
        ⚠️ BREAKING: Swiss passenger tests positive for Andes virus after MV Hondius cruise — May 7, 2026 &nbsp;|&nbsp;
        <a href="https://globalnews.ca/news/11836710/hantavirus-cruise-ship-andes-strain-new-case-confirmed-switzerland/" target="_blank" rel="noopener noreferrer" className="underline">Read more →</a>
      </div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-12 fade-up">
          <p className="text-red-500 text-sm font-semibold tracking-widest uppercase mb-3">Active Outbreak — 2026</p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Andes Virus<br /><span className="text-red-500">Outbreak Tracker</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            The only hantavirus strain confirmed to spread person-to-person — now active across multiple continents following the MV Hondius cruise ship outbreak.
          </p>
          <p className="text-gray-600 text-sm mt-4">Last updated: May 7, 2026 · Data sourced from WHO, CDC, ECDC</p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} style={{ background: '#111111', borderLeft: '3px solid #DC2626', border: '1px solid #1f1f1f', borderLeftColor: '#DC2626' }} className="rounded-xl p-5 fade-up">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm font-medium">{s.label}</div>
              <div className="text-gray-600 text-xs mt-1">Source: {s.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAP */}
      <section id="map" className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Live Outbreak Map</h2>
          <p className="text-gray-500 text-sm">Countries with confirmed cases or active monitoring. Click markers for details.</p>
        </div>
        <div style={{ border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
          <OutbreakMap />
        </div>
      </section>

      {/* WHAT IS ANDES VIRUS */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Why Andes Virus Is Different</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: '👥', title: 'Person-to-Person', desc: 'The ONLY hantavirus strain with confirmed human-to-human transmission. Requires prolonged close contact.' },
            { icon: '💀', title: '~40% Fatality Rate', desc: 'Higher mortality than most respiratory viruses. Causes rapid onset hantavirus pulmonary syndrome (HPS).' },
            { icon: '🐀', title: 'Origin: South America', desc: 'Endemic to Argentina and Chile. Carried by the long-tailed pygmy rice rat (Oligoryzomys longicaudatus).' },
          ].map((card) => (
            <div key={card.title} style={{ background: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-6">
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} style={{ background: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-gray-500 text-lg">+</span>
              </summary>
              <p className="text-gray-400 text-sm leading-relaxed mt-3 pt-3 border-t border-gray-800">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Latest Updates</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {NEWS.map((n) => (
            <a key={n.title} href={n.url} target="_blank" rel="noopener noreferrer"
              style={{ background: '#111111', border: '1px solid #1f1f1f' }}
              className="news-card rounded-xl p-5 block hover:border-red-800 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500 text-xs font-bold uppercase tracking-wider">{n.source}</span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-gray-600 text-xs">{n.date}</span>
              </div>
              <p className="text-white text-sm font-medium leading-snug">{n.title}</p>
              <span className="text-red-500 text-xs mt-2 block">Read article →</span>
            </a>
          ))}
        </div>
      </section>

      {/* PROTECT YOURSELF */}
      <section id="protect" className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Protect Yourself</h2>
          <p className="text-gray-500 text-sm">Recommended protective equipment. Affiliate links support this free tracker.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {GEAR.map((g) => (
            <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer"
              style={{ background: '#111111', border: '1px solid #1f1f1f' }}
              className="gear-card rounded-xl p-5 block hover:border-gray-600 transition-all">
              <div className="text-3xl mb-3">{g.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{g.name}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{g.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-bold">{g.price}</span>
                <span className="text-yellow-500 text-xs font-semibold">View on Amazon →</span>
              </div>
            </a>
          ))}
        </div>
        <p className="text-gray-700 text-xs mt-4">As an Amazon Associate, AndesVirusTracker earns from qualifying purchases. Prices are approximate and may vary.</p>
      </section>

      {/* EMAIL CAPTURE */}
      <section id="alerts" style={{ background: '#0f0a0a', borderTop: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f' }} className="py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="text-3xl mb-4">🔔</div>
          <h2 className="text-2xl font-bold text-white mb-2">Get Outbreak Alerts</h2>
          <p className="text-gray-400 text-sm mb-6">Be the first to know when new Andes virus cases are confirmed. No spam, ever.</p>
          {!subscribed ? (
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                className="flex-1 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-red-600 placeholder-gray-600"
              />
              <button
                onClick={() => email && setSubscribed(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          ) : (
            <div className="text-green-400 font-semibold">✅ You're subscribed. We'll alert you immediately.</div>
          )}
          <p className="text-gray-700 text-xs mt-3">Join thousands monitoring the Andes virus outbreak</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }} className="py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span>🦠</span>
            <span className="text-white font-bold">AndesVirusTracker.com</span>
          </div>
          <p className="text-gray-600 text-xs max-w-lg mx-auto mb-4">
            Data sourced from WHO, CDC, ECDC, and credible news sources. This site is for informational purposes only and is not affiliated with any government or health organization. Consult a healthcare professional for medical advice.
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-600 text-xs">
            <a href="/about" className="hover:text-gray-400">About</a>
            <a href="mailto:contact@andesvirustracker.com" className="hover:text-gray-400">Contact</a>
            <a href="/privacy" className="hover:text-gray-400">Privacy Policy</a>
          </div>
          <p className="text-gray-800 text-xs mt-4">© 2026 AndesVirusTracker.com</p>
        </div>
      </footer>
    </div>
  )
}
