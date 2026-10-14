import { describe, expect, it } from 'vitest'
import { sourceHost } from './links'

describe('sourceHost', () => {
  it('names the site a source comes from', () => {
    expect(sourceHost('https://legislatie.just.ro/Public/DetaliiDocument/1517')).toBe('legislatie.just.ro')
    expect(sourceHost('https://eur-lex.europa.eu/eli/reg/2016/679/oj')).toBe('eur-lex.europa.eu')
    expect(sourceHost('https://www.dcaf.ch/sites/default/files/x.pdf')).toBe('dcaf.ch')
  })

  it('returns an empty string for a malformed URL instead of throwing', () => {
    expect(sourceHost('not a url')).toBe('')
  })
})
