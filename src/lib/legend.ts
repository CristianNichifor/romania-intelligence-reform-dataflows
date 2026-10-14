import type { ActorCategory } from '../data/types'
import { categoryColors, currentStateOverrides } from '../data/actors'
import type { MessageKey } from '../i18n/messages'
import type { GraphMode } from './graph'
import { CATEGORY_GLYPHS } from './glyphs'

export interface LegendSwatch {
  key: MessageKey
  color: string
  // The node category the swatch stands for; absent for edge entries.
  category?: ActorCategory
  glyph?: string
}

const nodeColor = (category: ActorCategory, mode: GraphMode): string =>
  (mode === 'current' && currentStateOverrides[category]) || categoryColors[category]

const node = (key: MessageKey, category: ActorCategory, mode: GraphMode): LegendSwatch => ({
  key,
  category,
  color: nodeColor(category, mode),
  glyph: CATEGORY_GLYPHS[category],
})

// Node swatches read their colour from the same table the nodes are drawn from, so the legend
// cannot drift from the graph again.
export function legendSwatches(mode: GraphMode): LegendSwatch[] {
  return mode === 'current'
    ? [
        node('legend.current.i1', 'agency', mode),
        node('legend.current.i2', 'oversight', mode),
        node('legend.current.i3', 'judicial', mode),
        node('legend.current.i4', 'executive', mode),
        { key: 'legend.current.i5', color: '#f59e0b' },
      ]
    : [
        node('legend.target.i1', 'broker', mode),
        node('legend.target.i2', 'judicial', mode),
        node('legend.target.i3', 'oversight', mode),
        node('legend.target.i4', 'justice', mode),
        node('legend.target.i5', 'civilian', mode),
        node('legend.target.i6', 'agency', mode),
      ]
}
