import { describe, expect, it } from 'vitest'
import { canonicalize, hmacSign, SSC_SIGNING_KEY } from './crypto'
import { sscReview, type RequestObject } from './warrant'


const request: RequestObject = { caseId: 'test-case', predicate: 'foreign_state_espionage', subjects: ['fictional-1'], fields: ['travel_records'], justification: 'Fictional records needed for a scoped simulation.' }

describe('SSC handshake gate', () => {
  it('canonicalizes nested objects without reordering subject arrays', () => {
    expect(canonicalize({ b: { y: 2, x: 1 }, a: ['z', 'a'] })).toBe(canonicalize({ a: ['z', 'a'], b: { x: 1, y: 2 } }))
    expect(canonicalize({ subjects: ['z', 'a'] })).not.toBe(canonicalize({ subjects: ['a', 'z'] }))
  })
  it.each([
    { predicate: 'mass_surveillance' }, { subjects: [] }, { subjects: ['*'] },
    { subjects: Array.from({ length: 51 }, (_, i) => `subject-${i}`) },
    { caseId: '' }, { justification: 'too short' },
  ])('rejects an out-of-scope request %j', async patch => {
    const decision = await sscReview({ ...request, ...patch }, 'SIE', 'en')
    expect(decision.approved).toBe(false); expect(decision.token).toBeNull(); expect(decision.reason).not.toBe('')
  })
  it('binds the signature to every warrant field including the nested time window', async () => {
    const decision = await sscReview(request, 'SIE', 'en')
    if (!decision.approved) throw new Error(decision.reason)
    const { signature, ...unsigned } = decision.token
    expect(signature).toBe(await hmacSign(SSC_SIGNING_KEY, canonicalize(unsigned)))
    const changed = { ...unsigned, timeWindow: { ...unsigned.timeWindow, end: '2099-01-01T00:00:00Z' } }
    expect(await hmacSign(SSC_SIGNING_KEY, canonicalize(changed))).not.toBe(signature)
    expect(unsigned.receivingAgency).toBe('SIE'); expect(unsigned.subjects).toEqual(request.subjects)
  })
})

