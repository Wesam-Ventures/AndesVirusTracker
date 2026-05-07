import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Andes Virus Tracker — Live Hantavirus Outbreak Map & Cases 2026',
    template: '%s | AndesVirusTracker.com',
  },
  description: 'Live tracking of the Andes virus outbreak from MV Hondius. Case counter, interactive map, latest WHO/CDC news. The only hantavirus strain confirmed to spread person-to-person.',
  keywords: ['Andes virus', 'hantavirus tracker', 'Andes virus tracker', 'MV Hondius hantavirus', 'hantavirus person to person', 'hantavirus outbreak 2026', 'Andes hantavirus cases'],
  authors: [{ name: 'AndesVirusTracker Editorial Team', url: 'https://andesvirustracker.com' }],
  creator: 'M&W Business Development LLC',
  publisher: 'AndesVirusTracker.com',
  metadataBase: new URL('https://andesvirustracker.com'),
  openGraph: {
    title: 'Andes Virus Tracker — Live Outbreak Map & Cases 2026',
    description: '8 confirmed cases · 3 deaths · 23 countries monitoring. The only hantavirus strain that spreads person-to-person.',
    url: 'https://andesvirustracker.com',
    siteName: 'AndesVirusTracker.com',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: '/og?title=Andes+Virus+Tracker&sub=8+cases+%C2%B7+3+deaths+%C2%B7+23+countries',
      width: 1200, height: 630,
      alt: 'Andes Virus Tracker — Live Outbreak Map 2026',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andes Virus Tracker — Live 2026',
    description: '8 confirmed cases · 3 deaths · 23 countries. The only hantavirus that spreads person-to-person.',
    images: ['/og?title=Andes+Virus+Tracker&sub=8+cases+%C2%B7+3+deaths+%C2%B7+23+countries'],
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
      <body>{children}</body>
    </html>
  )
}
