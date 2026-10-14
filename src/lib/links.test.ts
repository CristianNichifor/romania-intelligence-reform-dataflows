import { describe, expect, it } from 'vitest'
import { HUB_URL } from './links'
import { translate } from '../i18n/messages'

describe('family bar', () => {
  it('points at the hub root with its registry name', () => {
    expect(HUB_URL).toBe('https://projects.cristian-nichifor.com/')
    expect(translate('family.home', 'ro')).toBe('Proiecte civice')
    expect(translate('family.home', 'en')).toBe('Civic projects')
  })
})
