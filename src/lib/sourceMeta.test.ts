import { describe, expect, it } from 'vitest'
import { sourceMeta } from './sourceMeta'
import { currentFlows } from '../data/flows'

describe('sourceMeta', () => {
  it('names the host without www and the checked date', () => {
    expect(sourceMeta({ title: 'Lege', url: 'https://www.legislatie.just.ro/Public/x', accessed: '2026-10-14' })).toBe(
      'legislatie.just.ro · 2026-10-14',
    )
  })

  it('covers every bundled source', () => {
    for (const flow of currentFlows)
      for (const source of flow.sources) expect(sourceMeta(source)).toMatch(/^[a-z0-9.-]+ · \d{4}-\d{2}-\d{2}$/)
  })
})
