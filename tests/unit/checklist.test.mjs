import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// docs/ux-guidelines.md §8 maps each rule to the test that enforces it.
const root = new URL('../../', import.meta.url)
const guide = readFileSync(new URL('docs/ux-guidelines.md', root), 'utf8')
const checklist = guide.split('## 8. Conformance checklist')[1]?.split('\n## ')[0] ?? ''

describe('conformance checklist', () => {
  it('exists', () => {
    expect(checklist).not.toBe('')
  })

  it('cites only test files that exist', () => {
    const cited = [...checklist.matchAll(/`((?:tests|src)\/[^`]+\.(?:ts|mjs))`/g)].map(([, path]) => path)
    expect(cited.length).toBeGreaterThan(10)
    expect(cited.filter((path) => !existsSync(new URL(path, root)))).toEqual([])
  })

  it('leaves no rule untested', () => {
    expect(checklist).not.toMatch(/none yet|no test yet/i)
  })

  it('lists every e2e spec against a rule', () => {
    const specs = readdirSync(new URL('tests/e2e/', root)).filter((name) => name.endsWith('.spec.ts'))
    expect(specs.filter((spec) => !checklist.includes(`tests/e2e/${spec}`))).toEqual([])
  })
})
