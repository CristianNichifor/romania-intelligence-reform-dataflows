import { describe, expect, it } from 'vitest'
import { scrollEdges } from './useScrollEdges'

describe('scrollEdges', () => {
  it('reports nothing hidden when the content fits', () => {
    expect(scrollEdges(0, 366, 366)).toEqual({ start: false, end: false })
  })

  it('reports more to the right at the start of a wide scroller', () => {
    expect(scrollEdges(0, 1052, 366)).toEqual({ start: false, end: true })
  })

  it('reports both sides in the middle and only the start at the end', () => {
    expect(scrollEdges(300, 1052, 366)).toEqual({ start: true, end: true })
    expect(scrollEdges(685.5, 1052, 366)).toEqual({ start: true, end: false })
  })
})
