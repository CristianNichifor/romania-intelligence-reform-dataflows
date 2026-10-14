import { afterEach, describe, expect, it } from 'vitest'
import { appendLedger, clearLedger, getLedgerEntries, verifyLedgerIntegrity } from './ledger'

afterEach(clearLedger)

describe('audit ledger', () => {
  const draft = { flowType: 'T3', initiator: 'SRI', receiver: 'IADE', note: 'fictional request' }
  it('chains concurrent accepted and rejected events in sequence', async () => {
    await Promise.all([appendLedger(draft), appendLedger({ ...draft, status: 'rejected' })])
    expect(getLedgerEntries().map(e => e.seq)).toEqual([1, 2])
    expect(getLedgerEntries()[1].prevHash).toBe(getLedgerEntries()[0].entryHash)
    expect(await verifyLedgerIntegrity()).toEqual({ valid: true, brokenAt: null })
  })
  it('does not resurrect pending entries after clearing the ledger', async () => {
    const pending = appendLedger(draft)
    clearLedger()
    await expect(pending).rejects.toThrow('Ledger cleared during append')
    await appendLedger(draft)
    expect(getLedgerEntries()).toHaveLength(1)
    expect(getLedgerEntries()[0].seq).toBe(1)
    expect(await verifyLedgerIntegrity()).toEqual({ valid: true, brokenAt: null })
  })
  it('rejects a removed middle event', async () => {
    await appendLedger(draft); await appendLedger(draft); await appendLedger(draft)
    getLedgerEntries().splice(1, 1)
    expect(await verifyLedgerIntegrity()).toEqual({ valid: false, brokenAt: 3 })
  })
  it.each(['note', 'receiver', 'entryHash', 'prevHash'] as const)('detects tampering with %s', async field => {
    await appendLedger(draft)
    getLedgerEntries()[0][field] = 'tampered'
    expect(await verifyLedgerIntegrity()).toEqual({ valid: false, brokenAt: 1 })
  })
})
