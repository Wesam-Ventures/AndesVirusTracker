import { afterEach, describe, expect, it, vi } from 'vitest'
import { lookup } from 'node:dns/promises'
import { fetchArticleMeta } from './articleMeta'

vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(),
}))

describe('fetchArticleMeta', () => {
  const lookupMock = vi.mocked(lookup)

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('fetches image and prefers og description over other description tags', async () => {
    lookupMock.mockResolvedValue([{ address: '93.184.216.34', family: 4 }])
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(
      `
        <html>
          <head>
            <meta name="description" content="Fallback description">
            <meta name="twitter:description" content="Twitter description">
            <meta property="og:description" content="&lt;b&gt;Officials&lt;/b&gt; are monitoring contacts after confirmed exposure.">
            <meta property="og:image" content="https://example.com/image.jpg">
          </head>
        </html>
      `,
      { headers: { 'content-type': 'text/html' } },
    ))

    await expect(fetchArticleMeta('https://www.npr.org/story')).resolves.toEqual({
      image: 'https://example.com/image.jpg',
      description: 'Officials are monitoring contacts after confirmed exposure.',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.npr.org/story',
      expect.objectContaining({
        headers: { 'User-Agent': 'AndesVirusTracker/1.0' },
        redirect: 'manual',
        signal: expect.any(AbortSignal),
      }),
    )
  })

  it('does not fetch unsafe local URLs', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(fetchArticleMeta('http://127.0.0.1/admin')).resolves.toEqual({
      image: null,
      description: null,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not fetch hostnames that resolve to private IP addresses', async () => {
    lookupMock.mockResolvedValue([{ address: '10.0.0.5', family: 4 }])
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(fetchArticleMeta('https://www.npr.org/story')).resolves.toEqual({
      image: null,
      description: null,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not fetch non-allowlisted article hosts', async () => {
    lookupMock.mockResolvedValue([{ address: '93.184.216.34', family: 4 }])
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(fetchArticleMeta('https://example.com/story')).resolves.toEqual({
      image: null,
      description: null,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
