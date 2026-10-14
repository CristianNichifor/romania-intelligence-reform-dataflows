import { describe, expect, it } from 'vitest'
import { GOVERNANCE_DIAGRAMS } from './governanceDiagrams'
import { MESSAGES } from '../i18n/messages'

const english = import.meta.glob('../../diagrams/*.mmd', { query: '?raw', import: 'default', eager: true })
const romanian = import.meta.glob('../../diagrams/ro/*.mmd', { query: '?raw', import: 'default', eager: true })
const names = (files: Record<string, unknown>) => Object.keys(files).map((path) => path.split('/').pop()).sort()

// Everything but the words: node ids, arrows, classes. Both languages must draw the same graph.
const skeleton = (code: string) =>
  code
    .replace(/\[[^\]]*\]/g, '[]')
    .replace(/\{[^}]*\}/g, '{}')
    .replace(/\|[^|]*\|/g, '||')
    .replace(/"[^"]*"/g, '""')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

describe('governance diagrams', () => {
  it('has a Romanian counterpart for every English diagram', () => {
    expect(names(english)).toHaveLength(4)
    expect(names(romanian)).toEqual(names(english))
  })

  it('draws the same graph in both languages', () => {
    expect(GOVERNANCE_DIAGRAMS).toHaveLength(4)
    for (const diagram of GOVERNANCE_DIAGRAMS) {
      expect(skeleton(diagram.source.ro), diagram.id).toEqual(skeleton(diagram.source.en))
      expect(diagram.source.ro, diagram.id).not.toBe(diagram.source.en)
      expect(MESSAGES.ro[diagram.titleKey]).toBeTruthy()
    }
  })

  it('writes Romanian with comma-below ș and ț', () => {
    for (const diagram of GOVERNANCE_DIAGRAMS) {
      expect(diagram.source.ro).toMatch(/[șț]/)
      expect(diagram.source.ro).not.toMatch(/[şţŞŢ]/)
    }
  })
})
