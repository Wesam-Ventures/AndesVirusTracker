import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import StatCounter from './StatCounter'

describe('StatCounter', () => {
  it('server-renders the target value instead of a zero placeholder', () => {
    const html = renderToString(<StatCounter target={8} />)

    expect(html).toContain('8')
    expect(html).not.toContain('>0<')
  })
})
