import { describe, expect, it } from 'vitest'

const english = import.meta.glob('../../diagrams/*.mmd', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const romanian = import.meta.glob('../../diagrams/ro/*.mmd', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const byName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, source]) => [path.split('/').pop()!, source]))

// The graph without its words: node ids, edges, classes and styles must match line for line.
const skeleton = (source: string) =>
  source
    .split('\n')
    .map((line) => line.replace(/\[[^\]]*\]|\{[^}]*\}|\|[^|]*\||"[^"]*"/g, '·').trimEnd())

describe('governance diagrams', () => {
  const en = byName(english)
  const ro = byName(romanian)

  it('has a Romanian counterpart for every diagram', () => {
    expect(Object.keys(en)).toHaveLength(4)
    expect(Object.keys(ro).sort()).toEqual(Object.keys(en).sort())
  })

  it('keeps the same graph and only translates labels', () => {
    for (const name of Object.keys(en)) {
      expect(skeleton(ro[name]), name).toEqual(skeleton(en[name]))
      expect(ro[name], name).not.toEqual(en[name])
    }
  })

  it('writes Romanian with comma-below ș and ț', () => {
    for (const source of Object.values(ro)) expect(source).not.toMatch(/[şţŞŢ]/)
  })
})
