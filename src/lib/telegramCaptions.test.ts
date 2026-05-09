import { describe, expect, it } from 'vitest'
import {
  buildDailyDigestCaption,
  buildNewsTelegramCaption,
  formatDailyChangeLine,
  summarizeArticleBrief,
} from './telegramCaptions'

const stats = {
  cases: 10,
  deaths: 3,
  countries: 23,
}

describe('telegram caption helpers', () => {
  it('uses a substantive article brief and puts the full report link at the end', () => {
    const caption = buildNewsTelegramCaption({
      title: '🇺🇸 ANDES VIRUS — US UPDATE',
      stats,
      countriesLine: '🌍 23 countries monitoring · US is one of them',
      article: {
        headline: 'Cruise passenger monitoring expands in multiple US states',
        body:
          'State health departments are monitoring returned MV Hondius passengers after confirmed Andes virus exposure. Officials say close contacts should watch for fever, muscle pain, and breathing symptoms through the incubation window. No casual-airborne transmission has been reported.',
        url: 'https://example.com/report',
      },
    })

    expect(caption).toMatch(/^🇺🇸 ANDES VIRUS — US UPDATE\n\n📊 10 cases · 💀 3 deaths/)
    expect(caption).toContain('State health departments are monitoring returned MV Hondius passengers')
    expect(caption).toContain('No casual-airborne transmission has been reported.')
    expect(caption.endsWith('🔗 Full report: https://example.com/report')).toBe(true)
  })

  it('summarizes body text to a compact 2-3 sentence brief', () => {
    const brief = summarizeArticleBrief({
      headline: 'Fallback headline',
      body:
        'First sentence gives the core update. Second sentence adds public health context. Third sentence explains what readers should watch for. Fourth sentence should be dropped when three sentences are enough.',
    })

    expect(brief).toBe(
      'First sentence gives the core update. Second sentence adds public health context. Third sentence explains what readers should watch for.',
    )
  })

  it('formats daily change from the best available 24h Supabase snapshot', () => {
    expect(formatDailyChangeLine(stats, { cases: 8, deaths: 3 })).toBe('📈 24h change: +2 cases · no new deaths')
  })

  it('adds the top story and change line to daily digest captions', () => {
    const caption = buildDailyDigestCaption({
      dayCount: 15,
      stats,
      riskLevel: 'MODERATE',
      changeLine: '📈 24h change: +2 cases · no new deaths',
      article: {
        headline: 'New monitoring guidance issued',
        body:
          'Public health officials updated monitoring guidance for passengers and close contacts. The guidance keeps focus on early symptoms and rapid medical evaluation if respiratory distress appears.',
        url: 'https://example.com/digest',
      },
    })

    expect(caption).toContain('📈 24h change: +2 cases · no new deaths')
    expect(caption).toContain('Public health officials updated monitoring guidance')
    expect(caption.endsWith('🔗 Full report: https://example.com/digest')).toBe(true)
  })

  it('keeps photo captions within Telegram limits while preserving the final link', () => {
    const longBody = `${'This sentence contains important outbreak context. '.repeat(40)}Final sentence.`
    const caption = buildNewsTelegramCaption({
      title: '📰 ANDES VIRUS UPDATE',
      stats,
      article: {
        headline: 'Long update',
        body: longBody,
        url: 'https://example.com/full-report-with-a-reasonably-long-url-and-query?utm_source=telegram',
      },
    })

    expect(caption.length).toBeLessThanOrEqual(1024)
    expect(caption.endsWith('🔗 Full report: https://example.com/full-report-with-a-reasonably-long-url-and-query?utm_source=telegram')).toBe(true)
  })
})
