import type { MetadataRoute } from 'next'

// MARK: - Robots

export default function robots(): MetadataRoute.Robots {
  const host = 'https://andesvirustracker.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: [
      `${host}/sitemap.xml`,
      `${host}/news-sitemap.xml`,
    ],
    host,
  }
}
