import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// docs/ux-guidelines.md §3: every user-facing string lives in src/i18n/messages.ts.
const dir = new URL('../../src/components/', import.meta.url)
const files = [
  ...readdirSync(dir)
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => new URL(name, dir)),
  new URL('../../src/App.tsx', import.meta.url),
]

describe('inline copy', () => {
  it('no component picks copy with lang === "ro" ? "…"', () => {
    const offenders = files
      .filter((url) => /lang === ['"]ro['"]\s*\?\s*['"`]/.test(readFileSync(url, 'utf8')))
      .map((url) => url.pathname.split('/src/')[1])
    expect(offenders).toEqual([])
  })
})
