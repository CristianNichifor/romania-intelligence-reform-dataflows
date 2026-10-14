import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Read from disk: vitest hands CSS imports back empty, even with ?raw.
const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

// Windows High Contrast drops author colours; state has to survive through system
// colours and borders (ux-guidelines, deviation D6). The block sits at the end of
// index.css so this slice is the whole rule set.
const start = css.indexOf('@media (forced-colors: active)')
const block = start >= 0 ? css.slice(start) : ''

describe('forced-colours styles', () => {
  it('declares a forced-colors block', () => {
    expect(start).toBeGreaterThan(-1)
  })

  it('keeps node borders and edge strokes visible', () => {
    expect(block).toMatch(/\.actor-node\s*{[^}]*border-color:\s*CanvasText/)
    expect(block).toMatch(/\.react-flow__edge-path\s*{[^}]*stroke:\s*CanvasText\s*!important/)
  })

  it('keeps the selected tab, pressed chips and the selected edge visible', () => {
    expect(block).toMatch(/\.nav-btn\.active\s*{[^}]*Highlight/)
    expect(block).toMatch(/\.chip\.on[^{]*{[^}]*Highlight/)
    expect(block).toMatch(/\.react-flow__edge\.selected \.react-flow__edge-path[^{]*{[^}]*Highlight/)
  })

  it('does not hide the line style that carries the audit trail', () => {
    expect(block).not.toMatch(/stroke-dasharray/)
  })
})
