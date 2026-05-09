'use client'

interface Props {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
}

export default function StatCounter({ target, prefix = '', suffix = '' }: Props) {
  console.log('[StatCounter] display target loaded →', target)

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{target.toLocaleString()}{suffix}
    </span>
  )
}
