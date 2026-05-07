import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andes Virus Tracker — Live Hantavirus Outbreak Map & Cases 2026',
  description: 'Live tracking of the Andes virus outbreak from MV Hondius. Case counter, interactive map, latest WHO/CDC news. The only hantavirus strain that spreads person-to-person.',
  keywords: ['Andes virus', 'hantavirus tracker', 'Andes virus tracker', 'MV Hondius hantavirus', 'hantavirus person to person', 'hantavirus outbreak 2026', 'Andes hantavirus cases'],
  openGraph: {
    title: 'Andes Virus Tracker — Live Outbreak Map & Cases 2026',
    description: '8 confirmed cases · 3 deaths · 23 countries monitoring. Live Andes virus outbreak tracker.',
    url: 'https://andesvirustracker.com',
    siteName: 'AndesVirusTracker.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andes Virus Tracker — Live 2026',
    description: '8 confirmed cases · 3 deaths · 23 countries. Real-time Andes hantavirus tracker.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://andesvirustracker.com' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Andes Virus Tracker',
  url: 'https://andesvirustracker.com',
  description: 'Live tracking of the Andes virus hantavirus outbreak.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦠</text></svg>" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
