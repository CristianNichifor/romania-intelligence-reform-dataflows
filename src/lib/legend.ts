import type { ActorCategory } from '../data/types'
import { categoryColors, currentStateOverrides } from '../data/actors'
import type { MessageKey } from '../i18n/messages'
import { CATEGORY_GLYPHS } from './glyphs'
import { currentFlows, targetFlows } from '../data/flows'
import { edgeColor, edgeDash, type GraphMode } from './graph'

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
        node('cat.executive', 'executive', mode),
      ]
}

export type LineStyle = 'solid' | 'dashed' | 'dotted'

// The current-state legend names the flows each line style covers, so a reader
// can check the graph against the list without relying on colour.
export function lineStyleFlowIds(): Record<LineStyle, string[]> {
  const buckets: Record<LineStyle, string[]> = { solid: [], dashed: [], dotted: [] }
  for (const flow of currentFlows) {
    const dash = edgeDash(flow)
    const style: LineStyle = dash === '2 4' ? 'dotted' : dash === '7 4' ? 'dashed' : 'solid'
    buckets[style].push(flow.id)
  }
  return buckets
}

export interface EdgeClusterSwatch {
  key: MessageKey
  color: string
  ids: string[]
}

// Target-state edge colours name the counterpart cluster (src/lib/graph.ts edgeColor).
// The legend reuses the category labels and lists the flows behind each colour.
const EDGE_CLUSTER_KEYS: Array<[string, MessageKey]> = [
  ['#4ade80', 'cat.judicial'],
  ['#60a5fa', 'cat.broker'],
  ['#f472b6', 'cat.oversight'],
  ['#2dd4bf', 'cat.civilian'],
  ['#c084fc', 'cat.justice'],
  ['#94a3b8', 'cat.executive'],
]

export function edgeClusterSwatches(): EdgeClusterSwatch[] {
  return EDGE_CLUSTER_KEYS.map(([color, key]) => ({
    key,
    color,
    ids: targetFlows.filter((flow) => edgeColor(flow) === color).map((flow) => flow.id),
  })).filter((cluster) => cluster.ids.length > 0)
}
