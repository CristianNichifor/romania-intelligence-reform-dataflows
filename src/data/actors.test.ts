import { describe, expect, it } from 'vitest'
import { currentActors, resolveActorColor, targetActors } from './actors'
import { currentFlows } from './flows'
import { edgeColor } from '../lib/graph'

describe('actor colours', () => {
  it('oversight nodes do not share a colour with any current-state edge', () => {
    const oversight = currentActors.find((actor) => actor.category === 'oversight')!
    const edges = new Set(currentFlows.map(edgeColor))
    expect(edges.has(resolveActorColor(oversight, 'current'))).toBe(false)
  })

  it('oversight is the same colour in both states', () => {
    const now = currentActors.find((actor) => actor.category === 'oversight')!
    const target = targetActors.find((actor) => actor.category === 'oversight')!
    expect(resolveActorColor(now, 'current')).toBe(resolveActorColor(target, 'target'))
  })
})
