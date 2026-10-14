import { describe, expect, it } from 'vitest'
import { parseHeaders } from './headers'
import file from '../../public/_headers?raw'

const rules = parseHeaders(file)
const all = rules.find((rule) => rule.path === '/*')?.headers ?? {}
const csp = Object.fromEntries(
  (all['Content-Security-Policy'] ?? '')
    .split(';')
    .map((part) => part.trim().split(/\s+/))
    .filter((parts) => parts[0])
    .map(([name, ...values]) => [name, values]),
)

describe('public/_headers', () => {
  it('parses cloudflare pages rules', () => {
    expect(parseHeaders('/a/*\n  X-One: 1\n  X-Two: a: b\n# note\n/b\n  X-Three: 3\n')).toEqual([
      { path: '/a/*', headers: { 'X-One': '1', 'X-Two': 'a: b' } },
      { path: '/b', headers: { 'X-Three': '3' } },
    ])
  })

  it('sets nosniff, a referrer policy and no framing on every path', () => {
    expect(all['X-Content-Type-Options']).toBe('nosniff')
    expect(all['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(csp['frame-ancestors']).toEqual(["'none'"])
  })

  it('limits every fetch directive to the own origin', () => {
    expect(csp['default-src']).toEqual(["'self'"])
    expect(csp['script-src']).toEqual(["'self'"])
    expect(csp['object-src']).toEqual(["'none'"])
    expect(csp['base-uri']).toEqual(["'self'"])
    const sources = Object.values(csp).flat()
    expect(sources.filter((source) => /^https?:|^\*$|unsafe-eval/.test(source))).toEqual([])
  })
})
