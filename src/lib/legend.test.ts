import { describe, expect, it } from 'vitest'
import { legendSwatches, lineStyleFlowIds } from './legend'
import { CATEGORY_GLYPHS } from './glyphs'
import { currentActors, resolveActorColor, targetActors } from '../data/actors'
import { currentFlows } from '../data/flows'
import { edgeDash } from './graph'

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

describe('legend glyphs', () => {
  it.each(['current', 'target'] as const)('every %s category swatch carries the glyph its nodes show', (mode) => {
    for (const swatch of legendSwatches(mode)) {
      if (!swatch.category) continue
      expect(swatch.glyph, `${mode}: ${swatch.key}`).toBe(CATEGORY_GLYPHS[swatch.category])
    }
  })
describe('line-style flow ids', () => {
  it('lists every current flow under exactly one line style', () => {
    const buckets = lineStyleFlowIds()
    const all = [...buckets.solid, ...buckets.dashed, ...buckets.dotted].sort()
    expect(all).toEqual(currentFlows.map((flow) => flow.id).sort())
  })

  it('puts each flow under the style its edge is drawn with', () => {
    const buckets = lineStyleFlowIds()
    for (const flow of currentFlows) {
      const dash = edgeDash(flow)
      const expected = dash === '2 4' ? 'dotted' : dash === '7 4' ? 'dashed' : 'solid'
      expect(buckets[expected], flow.id).toContain(flow.id)
    }
  })

  it('names the weakest-audit flows under the dotted style', () => {
    const { dotted, solid } = lineStyleFlowIds()
    expect(dotted).toEqual(expect.arrayContaining(['C10', 'C13']))
    expect(solid).toContain('C7')
  })
})
