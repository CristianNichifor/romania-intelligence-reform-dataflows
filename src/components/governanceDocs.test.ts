import { describe, expect, it } from 'vitest'
import { GOVERNANCE_DOCS } from './governanceDocs'
import { MESSAGES } from '../i18n/messages'

const english = import.meta.glob('../../docs/1[4-9]-*.md', { query: '?raw', import: 'default', eager: true })
const romanian = import.meta.glob('../../docs/ro/1[4-9]-*.md', { query: '?raw', import: 'default', eager: true })
const names = (files: Record<string, unknown>) => Object.keys(files).map((path) => path.split('/').pop()).sort()

describe('governance documents', () => {
  it('has a Romanian counterpart for every English document', () => {
    expect(names(english)).toHaveLength(6)
    expect(names(romanian)).toEqual(names(english))
  })

  it('renders every document in both languages', () => {
    expect(GOVERNANCE_DOCS.map((doc) => doc.id)).toEqual(['14', '15', '16', '17', '18', '19'])
    for (const doc of GOVERNANCE_DOCS) {
      expect(doc.source.en).toMatch(new RegExp(`^# ${doc.id} · `))
      expect(doc.source.ro).toMatch(new RegExp(`^# ${doc.id} · `))
      expect(MESSAGES.en[doc.titleKey]).toBeTruthy()
      expect(MESSAGES.ro[doc.titleKey]).toBeTruthy()
      expect(MESSAGES.ro[doc.titleKey]).not.toBe(MESSAGES.en[doc.titleKey])
    }
  })

  it('writes Romanian with comma-below ș and ț', () => {
    for (const doc of GOVERNANCE_DOCS) expect(doc.source.ro).not.toMatch(/[şţŞŢ]/)
  })

  it('no longer says the governance documents are only in English', () => {
    expect(MESSAGES.ro['gov.langNote']).not.toContain('engleză')
  })
})
