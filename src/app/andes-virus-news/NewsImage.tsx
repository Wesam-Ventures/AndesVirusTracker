'use client'

import { useState } from 'react'

// MARK: Grid-card image with onError fallback (hides on failure)
//       The parent server component can't use event handlers, so this
//       lives in its own client island.

type Props = {
  src: string
  height?: number
}

export default function NewsImage({ src, height = 200 }: Props) {
  const [failed, setFailed] = useState(false)
  console.log('[news-image] render', { src, height, failed })

  if (failed) return null

  const proxied =
    'https://images.weserv.nl/?url=' +
    encodeURIComponent(src) +
    '&w=800&h=' +
    height * 2 +
    '&fit=cover&output=webp'

  return (
    <div style={{ width: '100%', height, overflow: 'hidden', flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proxied}
        alt=""
        loading="lazy"
        onError={() => {
          console.log('[news-image] failed to load, hiding', src)
          setFailed(true)
        }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
