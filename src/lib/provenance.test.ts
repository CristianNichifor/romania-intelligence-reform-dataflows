import { describe, expect, it } from 'vitest'
import { provenanceLine } from './provenance'

describe('provenanceLine', () => {
  it('names the sources and the date they were checked, in the app language', () => {
    expect(provenanceLine('ro', '2026-10-14')).toBe('Date: legi și surse publice, verificate la 14.10.2026')
    expect(provenanceLine('en', '2026-10-14')).toBe('Data: laws and public sources, checked 14 Oct 2026')
  })
})
