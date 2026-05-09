import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

export interface ArticleMeta {
  image: string | null
  description: string | null
}

const ARTICLE_META_TIMEOUT_MS = 4000
const ARTICLE_META_USER_AGENT = 'AndesVirusTracker/1.0'
const ARTICLE_META_MAX_BYTES = 1_000_000
const ARTICLE_META_MAX_REDIRECTS = 2
const ALLOWED_ARTICLE_HOST_SUFFIXES = [
  'abcnews.go.com',
  'apnews.com',
  'bbc.co.uk',
  'bbc.com',
  'cbsnews.com',
  'cdc.gov',
  'cnn.com',
  'ecdc.europa.eu',
  'foxnews.com',
  'globalnews.ca',
  'livescience.com',
  'nbcnews.com',
  'newsweek.com',
  'npr.org',
  'nytimes.com',
  'reuters.com',
  'theguardian.com',
  'time.com',
  'washingtonpost.com',
  'who.int',
]

function isPrivateIPv4(address: string): boolean {
  const parts = address.split('.').map(part => Number(part))
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return false

  const [a, b] = parts
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  )
}

function isPrivateIP(address: string): boolean {
  const normalized = address.toLowerCase().replace(/^\[|\]$/g, '')
  const mappedIPv4 = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1]
  if (mappedIPv4) return isPrivateIPv4(mappedIPv4)
  if (normalized.startsWith('::ffff:')) return true

  if (isIP(normalized) === 4) return isPrivateIPv4(normalized)
  if (isIP(normalized) !== 6) return false

  return (
    normalized === '::' ||
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80') ||
    normalized.startsWith('ff')
  )
}

function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '')

  return (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    normalized === 'metadata.google.internal' ||
    isPrivateIP(normalized)
  )
}

function isAllowedArticleHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^www\./, '')

  return ALLOWED_ARTICLE_HOST_SUFFIXES.some(suffix => normalized === suffix || normalized.endsWith(`.${suffix}`))
}

async function toSafeArticleUrl(value: string, baseUrl?: string): Promise<string | null> {
  try {
    const url = new URL(value, baseUrl)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    if (isBlockedHostname(url.hostname)) return null
    if (!isAllowedArticleHostname(url.hostname)) return null

    const normalizedHostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    const addresses = isIP(normalizedHostname)
      ? [{ address: normalizedHostname }]
      : await lookup(normalizedHostname, { all: true })

    if (addresses.length === 0 || addresses.some(({ address }) => isPrivateIP(address))) return null
    return url.toString()
  } catch {
    return null
  }
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function cleanMetaText(value: string | null): string | null {
  if (!value) return null

  const cleaned = decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned ? cleaned.substring(0, 800) : null
}

function getAttribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))
  return match ? decodeHtmlEntities(match[1]).trim() : null
}

function findMetaContent(html: string, attrName: 'property' | 'name', attrValue: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []

  for (const tag of tags) {
    if (getAttribute(tag, attrName)?.toLowerCase() === attrValue.toLowerCase()) {
      return getAttribute(tag, 'content')
    }
  }

  return null
}

async function readTextWithLimit(res: Response): Promise<string> {
  const contentLength = Number(res.headers.get('content-length') ?? 0)
  if (contentLength > ARTICLE_META_MAX_BYTES) {
    throw new Error(`article meta response too large: ${contentLength}`)
  }

  if (!res.body) return res.text()

  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue

    total += value.byteLength
    if (total > ARTICLE_META_MAX_BYTES) {
      await reader.cancel()
      throw new Error(`article meta response exceeded ${ARTICLE_META_MAX_BYTES} bytes`)
    }
    chunks.push(value)
  }

  const body = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  return new TextDecoder().decode(body)
}

export async function fetchArticleMeta(url: string): Promise<ArticleMeta> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ARTICLE_META_TIMEOUT_MS)

  try {
    const initialSafeUrl = await toSafeArticleUrl(url)
    if (!initialSafeUrl) {
      console.log('[sync-stats] article meta fetch blocked unsafe URL', url)
      return { image: null, description: null }
    }
    let safeUrl = initialSafeUrl

    let res: Response | null = null
    for (let redirectCount = 0; redirectCount <= ARTICLE_META_MAX_REDIRECTS; redirectCount++) {
      res = await fetch(safeUrl, {
        signal: controller.signal,
        redirect: 'manual',
        headers: { 'User-Agent': ARTICLE_META_USER_AGENT },
      })

      if (res.status < 300 || res.status >= 400) break

      const location = res.headers.get('location')
      const nextUrl = location ? await toSafeArticleUrl(location, safeUrl) : null
      if (!nextUrl) {
        console.log('[sync-stats] article meta fetch blocked unsafe redirect', safeUrl, location)
        return { image: null, description: null }
      }
      safeUrl = nextUrl
    }

    if (!res) return { image: null, description: null }

    if (!res.ok) {
      console.log('[sync-stats] article meta fetch non-OK', res.status, url)
      return { image: null, description: null }
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!/(text\/html|application\/xhtml\+xml)/i.test(contentType)) {
      console.log('[sync-stats] article meta fetch skipped non-HTML', contentType, url)
      return { image: null, description: null }
    }

    const html = await readTextWithLimit(res)
    const image = findMetaContent(html, 'property', 'og:image')
    const description =
      cleanMetaText(findMetaContent(html, 'property', 'og:description')) ??
      cleanMetaText(findMetaContent(html, 'name', 'twitter:description')) ??
      cleanMetaText(findMetaContent(html, 'name', 'description'))

    return { image, description }
  } catch (err) {
    console.log('[sync-stats] article meta fetch error', url, err instanceof Error ? err.message : err)
    return { image: null, description: null }
  } finally {
    clearTimeout(timeout)
  }
}
