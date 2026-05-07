import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Andes Virus Tracker — Live Hantavirus Outbreak Map & Cases 2026',
  description: 'Live tracking of the Andes virus outbreak from MV Hondius. Case counter, interactive map, latest WHO/CDC news. The only hantavirus strain that spreads person-to-person.',
  keywords: ['Andes virus', 'hantavirus tracker', 'Andes virus tracker', 'MV Hondius hantavirus', 'hantavirus person to person', 'hantavirus outbreak 2026', 'Andes hantavirus cases'],
  openGraph: {
    title: 'Andes Virus Tracker — Live Outbreak Map & Cases 2026',
    description: '8 confirmed cases · 3 deaths · 23 countries monitoring.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0c0f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
