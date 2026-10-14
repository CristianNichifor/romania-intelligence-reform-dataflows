import { describe, expect, it } from 'vitest'

const english = import.meta.glob('../../diagrams/*.mmd', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const romanian = import.meta.glob('../../diagrams/ro/*.mmd', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const byName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, text]) => [path.split('/').pop()!, text]))

// Everything except the words a reader sees: node ids, arrows, subgraph ids and styling.
const skeleton = (text: string) =>
  text
    .replace(/\[[^\]]*\]/g, '[]')
    .replace(/\{[^}]*\}/g, (m) => (m.includes(':') ? m : '{}'))
    .replace(/\|[^|]*\|/g, '||')

describe('governance diagrams', () => {
  const en = byName(english)
  const ro = byName(romanian)

  it('has a Romanian diagram for every English one', () => {
    expect(Object.keys(en)).toHaveLength(4)
    expect(Object.keys(ro).sort()).toEqual(Object.keys(en).sort())
  })

  it.each(Object.keys(en))('%s keeps the same nodes, arrows and styles in Romanian', (name) => {
    expect(skeleton(ro[name])).toBe(skeleton(en[name]))
    expect(ro[name]).not.toBe(en[name])
    expect(ro[name]).not.toMatch(/[şţŞŢ]/)
  })
})
