import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const dir = new URL('../../src/', import.meta.url)
const sheets = readdirSync(dir).filter((name) => name.endsWith('.css'))

describe('stylesheets', () => {
  it('finds the app sheets', () => {
    expect(sheets).toEqual(expect.arrayContaining(['index.css', 'familyBar.css']))
  })

  // Vite concatenates the sheets, so one unclosed block swallows every rule after it.
  it.each(sheets)('%s closes every block it opens', (name) => {
    const css = readFileSync(new URL(name, dir), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    let depth = 0
    for (const char of css) {
      if (char === '{') depth++
      if (char === '}') depth--
      expect(depth).toBeGreaterThanOrEqual(0)
    }
    expect(depth).toBe(0)
  })
})
