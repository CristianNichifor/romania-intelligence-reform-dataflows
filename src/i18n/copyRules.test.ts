import { describe, expect, it } from 'vitest'
import { MESSAGES } from './messages'

// docs/ux-guidelines.md §3: banned in UI copy. Flow IDs (C6, T3, W1) stay allowed.
const BANNED: Array<[string, RegExp]> = [
  ['placeholder', /\b(TODO|TBD|lorem)\b/i],
  ['internal spec ID', /\b(INT|UX|DS)-\d+\b/],
]

const entries = Object.entries(MESSAGES).flatMap(([lang, messages]) =>
  Object.entries(messages).map(([key, text]) => ({ lang, key, text })),
)

describe('UI copy rules', () => {
  it.each(BANNED)('no %s in any message', (_label, pattern) => {
    expect(entries.filter(({ text }) => pattern.test(text)).map(({ lang, key }) => `${lang}:${key}`)).toEqual([])
  })

  it('Romanian uses comma-below ș ț, never cedilla ş ţ', () => {
    expect(entries.filter(({ text }) => /[şţŞŢ]/.test(text)).map(({ lang, key }) => `${lang}:${key}`)).toEqual([])
  })
})
