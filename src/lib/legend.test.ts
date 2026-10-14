import { describe, expect, it } from 'vitest'
import { legendSwatches } from './legend'
import { currentActors, resolveActorColor, targetActors } from '../data/actors'

describe('legend swatches', () => {
  it.each([
    ['current', currentActors],
    ['target', targetActors],
  ] as const)('every %s category swatch is the colour its nodes are drawn in', (mode, actors) => {
    for (const swatch of legendSwatches(mode)) {
      if (!swatch.category) continue
      const actor = actors.find((a) => a.category === swatch.category)
      expect(actor, `${mode}: no ${swatch.category} node`).toBeDefined()
      expect(swatch.color, `${mode}: ${swatch.key}`).toBe(resolveActorColor(actor!, mode))
    }
  })

  it('the civilianized agencies swatch matches the agency nodes', () => {
    const agency = legendSwatches('target').find((s) => s.key === 'legend.target.i6')
    expect(agency?.color).toBe('#f87171')
  })
})
