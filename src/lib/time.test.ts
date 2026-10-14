import { describe, expect, it } from 'vitest'
import { formatTime } from './time'
import { translate } from '../i18n/messages'

describe('formatTime', () => {
  const iso = '2026-10-14T21:05:09Z'

  it('formats in the app language, not the browser default', () => {
    expect(formatTime(iso, 'ro', 'UTC')).toBe('21:05:09')
    expect(formatTime(iso, 'en', 'UTC')).toBe('21:05:09')
  })
})

describe('footer and ledger words follow the language', () => {
  it('has Romanian for the source link and the ledger entry label', () => {
    expect(translate('footer.source', 'ro')).toBe('sursă')
    expect(translate('footer.source', 'en')).toBe('source')
    expect(translate('ledger.entry', 'ro')).toBe('intrarea')
    expect(translate('ledger.entry', 'en')).toBe('entry')
  })
})
