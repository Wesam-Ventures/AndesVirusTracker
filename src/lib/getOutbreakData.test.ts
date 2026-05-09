import { afterEach, describe, expect, it, vi } from 'vitest'

const SUPABASE_URL = 'https://andes.example.supabase.co'
const SUPABASE_KEY = 'public-anon-key'

async function importOutbreakData() {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL)
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_KEY)

  return import('./getOutbreakData')
}

describe('getOutbreakData', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('falls back to default stats when Supabase returns an empty payload', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const { getOutbreakStats } = await importOutbreakData()

    await expect(getOutbreakStats()).resolves.toMatchObject({
      confirmed_cases: 8,
      deaths: 3,
      countries_monitoring: 23,
      exposed_passengers: 62,
    })
    expect(console.error).toHaveBeenCalledWith(
      '[getOutbreakStats] falling back to defaults:',
      expect.any(Error),
    )
  })

  it('falls back to default stats when Supabase returns a partial stats payload', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ confirmed_cases: 8 }]), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const { getOutbreakStats } = await importOutbreakData()

    await expect(getOutbreakStats()).resolves.toMatchObject({
      confirmed_cases: 8,
      deaths: 3,
      countries_monitoring: 23,
      exposed_passengers: 62,
    })
    expect(console.error).toHaveBeenCalledWith(
      '[getOutbreakStats] falling back to defaults:',
      expect.any(Error),
    )
  })

  it('fetches Supabase data without Next data-cache and with a 4s timeout', async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            confirmed_cases: 8,
            deaths: 3,
            countries_monitoring: 23,
            exposed_passengers: 62,
            who_risk_level: 'MODERATE',
            breaking_news: 'Latest update',
            breaking_news_url: 'https://example.com/news',
            day_count: 15,
            last_updated: '2026-05-09T00:00:00.000Z',
          },
        ]),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    )

    const { getOutbreakStats, getOutbreakNews, getOutbreakEvents } = await importOutbreakData()

    await getOutbreakStats()
    await getOutbreakNews()
    await getOutbreakEvents()

    expect(fetchMock).toHaveBeenCalledWith(
      `${SUPABASE_URL}/rest/v1/andes_stats?select=*&id=eq.1`,
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      }),
    )
    expect(fetchMock).toHaveBeenCalledWith(
      `${SUPABASE_URL}/rest/v1/andes_news?select=*&order=published_at.desc&limit=6`,
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      }),
    )
    expect(fetchMock).toHaveBeenCalledWith(
      `${SUPABASE_URL}/rest/v1/andes_events?select=*&order=event_date.desc`,
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      }),
    )
    expect(timeoutSpy).toHaveBeenCalledTimes(3)
    expect(timeoutSpy).toHaveBeenNthCalledWith(1, 4000)
    expect(timeoutSpy).toHaveBeenNthCalledWith(2, 4000)
    expect(timeoutSpy).toHaveBeenNthCalledWith(3, 4000)
  })

  it('logs when news and event fallbacks are used', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network timeout'))

    const { getOutbreakNews, getOutbreakEvents } = await importOutbreakData()

    await expect(getOutbreakNews()).resolves.toEqual([])
    await expect(getOutbreakEvents()).resolves.toEqual([])

    expect(errorSpy).toHaveBeenCalledWith(
      '[getOutbreakNews] falling back to defaults:',
      expect.any(Error),
    )
    expect(errorSpy).toHaveBeenCalledWith(
      '[getOutbreakEvents] falling back to defaults:',
      expect.any(Error),
    )
  })
})
