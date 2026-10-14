import { describe, expect, it } from 'vitest'
import { edgeClusterSwatches, legendSwatches, lineStyleFlowIds } from './legend'
import { CATEGORY_GLYPHS } from './glyphs'
import { currentActors, resolveActorColor, targetActors } from '../data/actors'
import { currentFlows, targetFlows } from '../data/flows'
import { edgeColor, edgeDash } from './graph'

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

describe('target edge clusters', () => {
  it('lists every target flow under exactly one edge colour', () => {
    const clusters = edgeClusterSwatches()
    const all = clusters.flatMap((cluster) => cluster.ids).sort()
    expect(all).toEqual(targetFlows.map((flow) => flow.id).sort())
  })

  it('uses the colour each edge is drawn with', () => {
    for (const cluster of edgeClusterSwatches()) {
      for (const id of cluster.ids) {
        const flow = targetFlows.find((candidate) => candidate.id === id)!
        expect(edgeColor(flow), id).toBe(cluster.color)
      }
    }
  })

  it('names the warrant edges judicial and the broker edges broker', () => {
    const clusters = edgeClusterSwatches()
    expect(clusters.find((cluster) => cluster.key === 'cat.judicial')?.ids).toEqual(['W1', 'W2'])
    expect(clusters.find((cluster) => cluster.key === 'cat.broker')?.ids).toEqual(expect.arrayContaining(['T3', 'T4', 'T5', 'T6']))
  })

  it('gives the target legend an executive swatch', () => {
    const executive = legendSwatches('target').find((swatch) => swatch.category === 'executive')
    expect(executive?.key).toBe('cat.executive')
    expect(executive?.color).toBe('#94a3b8')
  })
})
