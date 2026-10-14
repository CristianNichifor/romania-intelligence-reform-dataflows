import { describe, expect, it } from 'vitest'
import { buildGraph } from './graph'
import { currentActors, targetActors } from '../data/actors'
import { currentFlows, targetFlows } from '../data/flows'

describe('graph data and rendering model', () => {
  for (const [mode, actors, flows] of [['current', currentActors, currentFlows], ['target', targetActors, targetFlows]] as const) {
    it(`${mode} keeps unique bilingual nodes and valid flow endpoints`, () => {
      for (const lang of ['en', 'ro'] as const) {
        const { nodes, edges } = buildGraph(mode, lang)
        expect(nodes).toHaveLength(actors.length); expect(edges).toHaveLength(flows.length)
        const ids = new Set(nodes.map(n => n.id)); expect(ids.size).toBe(nodes.length)
        expect(new Set(edges.map(e => e.id)).size).toBe(edges.length)
        for (const node of nodes) { expect(node.data.label.trim()).not.toBe(''); expect(node.data.role.trim()).not.toBe('') }
        for (const edge of edges) { expect(ids.has(edge.source)).toBe(true); expect(ids.has(edge.target)).toBe(true) }
      }
    })
  }

})

