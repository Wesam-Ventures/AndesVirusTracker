export interface TelegramStats {
  cases: number
  deaths: number
  countries: number
}

export interface TelegramArticle {
  headline: string
  body?: string | null
  url: string
}

interface NewsCaptionInput {
  title: string
  stats: TelegramStats
  countriesLine?: string
  article: TelegramArticle
}

interface DailyDigestCaptionInput {
  dayCount: number
  stats: TelegramStats
  riskLevel: string
  changeLine?: string | null
  article?: TelegramArticle | null
}

const FULL_REPORT_LABEL = '🔗 Full report:'
const TELEGRAM_PHOTO_CAPTION_LIMIT = 1024
const CAPTION_SAFETY_LIMIT = 1000

function cleanText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function trimAtWord(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value
  const sliced = value.slice(0, maxChars + 1)
  const lastSpace = sliced.lastIndexOf(' ')
  const trimmed = sliced.slice(0, lastSpace > maxChars * 0.6 ? lastSpace : maxChars).trim()
  return `${trimmed.replace(/[.,;:!?-]+$/, '')}...`
}

export function summarizeArticleBrief(article: Pick<TelegramArticle, 'headline' | 'body'>, maxChars = 500): string {
  const text = cleanText(article.body) || cleanText(article.headline)
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [text]
  const selected: string[] = []

  for (const sentence of sentences) {
    const next = cleanText(sentence)
    if (!next) continue
    const candidate = [...selected, next].join(' ')
    if (selected.length >= 3 || candidate.length > maxChars) break
    selected.push(next)
  }

  return trimAtWord(selected.length > 0 ? selected.join(' ') : text, maxChars)
}

export function formatDailyChangeLine(
  current: TelegramStats,
  previous?: Pick<TelegramStats, 'cases' | 'deaths'> | null,
): string | null {
  if (!previous) return null

  const caseDelta = current.cases - previous.cases
  const deathDelta = current.deaths - previous.deaths
  const caseText = caseDelta > 0 ? `+${caseDelta} cases` : 'no new cases'
  const deathText = deathDelta > 0 ? `+${deathDelta} deaths` : 'no new deaths'

  return `📈 24h change: ${caseText} · ${deathText}`
}

export function buildNewsTelegramCaption(input: NewsCaptionInput): string {
  const { title, stats, countriesLine, article } = input
  const countryText = countriesLine ?? `🌍 ${stats.countries} countries monitoring`
  const reportLink = `${FULL_REPORT_LABEL} ${article.url}`
  const fixedLength = [title, `📊 ${stats.cases} cases · 💀 ${stats.deaths} deaths`, countryText, reportLink].join('\n\n').length
  const briefBudget = Math.max(180, Math.min(500, CAPTION_SAFETY_LIMIT - fixedLength - 8))
  const brief = summarizeArticleBrief(article, briefBudget)

  return trimAtWord([
    title,
    `📊 ${stats.cases} cases · 💀 ${stats.deaths} deaths`,
    countryText,
    brief,
    reportLink,
  ].join('\n\n'), TELEGRAM_PHOTO_CAPTION_LIMIT)
}

export function buildDailyDigestCaption(input: DailyDigestCaptionInput): string {
  const { dayCount, stats, riskLevel, changeLine, article } = input
  const reportLink = `${FULL_REPORT_LABEL} ${article?.url ?? 'https://andesvirustracker.com'}`
  const lines = [
    `📊 ANDES VIRUS — DAILY UPDATE (Day ${dayCount})`,
    `🦠 ${stats.cases} confirmed cases · 💀 ${stats.deaths} deaths`,
    `🌍 ${stats.countries} countries monitoring`,
    `⚠️ WHO risk level: ${riskLevel}`,
  ]

  if (changeLine) lines.push(changeLine)
  if (article) {
    const fixedLength = [...lines, reportLink].join('\n\n').length
    const briefBudget = Math.max(180, Math.min(460, CAPTION_SAFETY_LIMIT - fixedLength - 20))
    lines.push(`📰 Top story: ${summarizeArticleBrief(article, briefBudget)}`)
  }
  lines.push(reportLink)

  return trimAtWord(lines.join('\n\n'), TELEGRAM_PHOTO_CAPTION_LIMIT)
}
