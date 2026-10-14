import { describe, expect, it } from 'vitest'
import { translate } from './messages'

describe('flow count line', () => {
  it('reads "shown of total" in both languages', () => {
    expect(translate('explorer.count', 'ro', { shown: 5, total: 14 })).toBe('5 din 14 fluxuri')
    expect(translate('explorer.count', 'en', { shown: 5, total: 14 })).toBe('5 of 14 flows')
  })
})
