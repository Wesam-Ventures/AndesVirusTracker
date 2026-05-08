import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Andes Virus Tracker — Live Hantavirus Outbreak Map & Cases 2026',
    template: '%s | AndesVirusTracker.com',
  },
  description: 'Live tracking of the Andes virus outbreak from MV Hondius. Case counter, interactive map, latest WHO/CDC news. The only hantavirus strain confirmed to spread person-to-person.',
  keywords: ['Andes virus', 'hantavirus tracker', 'Andes virus tracker', 'MV Hondius hantavirus', 'hantavirus person to person', 'hantavirus outbreak 2026', 'Andes hantavirus cases', 'hantavirus 2026', 'MV Hondius cruise ship', 'andes virus map', 'hantavirus outbreak map', 'andes virus deaths', 'andes virus switzerland', 'hantavirus pulmonary syndrome 2026', 'cruise ship virus 2026'],
  authors: [{ name: 'AndesVirusTracker Editorial Team', url: 'https://andesvirustracker.com' }],
  creator: 'M&W Business Development LLC',
  publisher: 'AndesVirusTracker.com',
  metadataBase: new URL('https://andesvirustracker.com'),
  icons: {
    icon: '/favicon.ico',
    apple: '/api/apple-icon',
    shortcut: '/favicon.ico',
    other: [{ rel: 'mask-icon', url: '/logo.svg', color: '#ef4444' }],
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Andes Tracker' },
  openGraph: {
    title: 'Andes Virus Tracker — Live Outbreak Map & Cases 2026',
    description: '8 confirmed cases · 3 deaths · 23 countries monitoring. The only hantavirus strain that spreads person-to-person.',
    url: 'https://andesvirustracker.com',
    siteName: 'AndesVirusTracker.com',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: 'https://andesvirustracker.com/og',
      width: 1200, height: 630,
      alt: 'Andes Virus Tracker — Live Outbreak Map 2026',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andes Virus Tracker — Live 2026',
    description: '8 confirmed cases · 3 deaths · 23 countries. The only hantavirus that spreads person-to-person.',
    images: ['https://andesvirustracker.com/og'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://andesvirustracker.com' },
  category: 'health',
}

const globalSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AndesVirusTracker.com',
    url: 'https://andesvirustracker.com',
    legalName: 'M&W Business Development LLC',
    description: 'Real-time Andes virus outbreak tracking, case data, and public health information.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Andes Virus Tracker',
    url: 'https://andesvirustracker.com',
    description: 'Live tracking of the 2026 Andes virus outbreak — cases, deaths, map, and public health guidance.',
    publisher: { '@type': 'Organization', name: 'AndesVirusTracker.com' },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://andesvirustracker.com/andes-virus-news?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can Andes virus spread between humans?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes — Andes virus is the only hantavirus confirmed to spread person-to-person. Transmission requires prolonged close contact such as sharing a bed or food. It does not spread through the air like COVID-19.' },
      },
      {
        '@type': 'Question',
        name: 'What is Andes virus?',
        acceptedAnswer: { '@type': 'Answer', text: 'Andes virus (ANDV) is a hantavirus strain endemic to South America. It is uniquely dangerous because it is the only hantavirus capable of human-to-human transmission, causing Hantavirus Pulmonary Syndrome (HPS) with a case fatality rate of approximately 40%.' },
      },
      {
        '@type': 'Question',
        name: 'What happened on the MV Hondius cruise ship?',
        acceptedAnswer: { '@type': 'Answer', text: 'In April–May 2026, 8 passengers aboard the MV Hondius Antarctic expedition ship were confirmed infected with Andes virus. 3 deaths were reported. Over 62 passengers from 23 nationalities are being actively monitored by health authorities across multiple countries.' },
      },
      {
        '@type': 'Question',
        name: 'How deadly is Andes virus?',
        acceptedAnswer: { '@type': 'Answer', text: 'The case fatality rate for Andes virus disease is approximately 40%. It progresses rapidly from flu-like symptoms to severe respiratory failure requiring ICU admission. Early hospitalization significantly improves outcomes.' },
      },
      {
        '@type': 'Question',
        name: 'Is there a vaccine or treatment for Andes virus?',
        acceptedAnswer: { '@type': 'Answer', text: 'No approved vaccine or antiviral treatment exists for Andes virus or hantavirus. Treatment is supportive — ICU care, oxygen therapy, and mechanical ventilation if needed. Early medical attention is critical.' },
      },
      {
        '@type': 'Question',
        name: 'What is the incubation period for Andes virus?',
        acceptedAnswer: { '@type': 'Answer', text: 'The incubation period for Andes virus is 9 to 33 days after exposure, with an average of approximately 18 days. Anyone potentially exposed should monitor for symptoms for at least 33 days.' },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: 'Andes Virus Disease',
    alternateName: ['Hantavirus Pulmonary Syndrome', 'ANDV Infection', 'Andes Hantavirus'],
    description: 'Andes virus (ANDV) is a hantavirus strain endemic to Argentina and Chile. It is the only hantavirus confirmed capable of human-to-human transmission, causing Hantavirus Pulmonary Syndrome.',
    code: { '@type': 'MedicalCode', code: 'B33.4', codingSystem: 'ICD-10' },
    infectiousAgentClass: 'Virus',
    transmissionMethod: 'Contact with infected rodent excreta; human-to-human via prolonged close contact',
    possibleTreatment: { '@type': 'MedicalTherapy', name: 'Supportive ICU care and mechanical ventilation' },
    typicalTest: { '@type': 'MedicalTest', name: 'RT-PCR and serology (IgM/IgG antibody testing)' },
    recognizingAuthority: { '@type': 'Organization', name: 'World Health Organization', url: 'https://www.who.int' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    name: 'Active Andes Virus Outbreak — MV Hondius 2026',
    text: '8 confirmed Andes virus cases and 3 deaths linked to the MV Hondius cruise ship outbreak. WHO has issued Disease Outbreak Notice DON-599. The outbreak spans passengers from 23 nationalities across 4 continents.',
    datePosted: '2026-05-06',
    expires: '2026-12-31',
    category: 'https://www.wikidata.org/wiki/Q81068910',
    diseaseSpreadStatistics: [
      { '@type': 'Observation', measuredValue: 8, measurementTechnique: 'PCR confirmed', name: 'Confirmed cases' },
      { '@type': 'Observation', measuredValue: 3, name: 'Deaths' },
    ],
    announcementLocation: { '@type': 'Place', name: 'Global — Multiple Countries' },
    spatialCoverage: { '@type': 'Place', name: 'Europe, North America, South America, Asia-Pacific' },
    about: { '@type': 'MedicalCondition', name: 'Andes Virus Disease' },
    url: 'https://andesvirustracker.com',
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0c0f" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {globalSchema.map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
        ))}
      </head>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  )
}
