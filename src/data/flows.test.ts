import { describe, expect, it } from 'vitest'
import { currentFlows, targetFlows } from './flows'
import { DATASET_AS_OF } from './sources'

const flows = [...currentFlows, ...targetFlows]
const isoDate = /^\d{4}-\d{2}-\d{2}$/

describe('flow provenance', () => {
  it('dates the dataset', () => {
    expect(DATASET_AS_OF).toMatch(isoDate)
  })

  it.each(flows.map((flow) => [flow.id, flow] as const))('%s cites a source or says why not', (_id, flow) => {
    if (flow.sources.length === 0) {
      expect(flow.sourceNeeded?.en, 'a flow without sources must say why').toBeTruthy()
      expect(flow.sourceNeeded?.ro).toBeTruthy()
      return
    }
    expect(flow.sourceNeeded).toBeUndefined()
    for (const source of flow.sources) {
      expect(source.title.trim()).not.toBe('')
      expect(new URL(source.url).protocol).toBe('https:')
      expect(source.accessed).toMatch(isoDate)
      expect(source.accessed <= DATASET_AS_OF).toBe(true)
    }
  })

  it('leaves at most a few flows without a source', () => {
    expect(flows.filter((flow) => flow.sources.length === 0).map((flow) => flow.id)).toEqual(['C10'])
  })
})
