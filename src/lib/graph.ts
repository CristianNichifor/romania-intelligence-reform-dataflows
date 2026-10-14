import { MarkerType, type Edge, type Node, type XYPosition } from '@xyflow/react'
import { currentActors, resolveActorColor, targetActors } from '../data/actors'
import { currentFlows, targetFlows } from '../data/flows'
import type { ActorNodeData, Flow } from '../data/types'
import { pick, type Language } from '../i18n/messages'

export type GraphMode = 'current' | 'target'

const CURRENT_POSITIONS: Record<string, XYPosition> = {
  PRES: { x: 440, y: 0 },
  CSAT: { x: 180, y: 0 },
  SPP: { x: 660, y: 0 },
  STS: { x: 20, y: 170 },
  SRI: { x: 330, y: 170 },
  SIE: { x: 640, y: 170 },
  JPC: { x: 180, y: 360 },
  DIICOT: { x: 640, y: 360 },
  ICCJ: { x: 880, y: 360 },
  ANSPDCP: { x: 20, y: 540 },
  OMB: { x: 280, y: 540 },
  DNSC: { x: 640, y: 540 },
  PUB: { x: 880, y: 540 },
}

// Bowtie layout: SRI/SIE hubs on the left/right, shared counterparts stacked in a
// central column. Handles are chosen per edge so fan edges stay in the side
// corridors and reverse pairs run on separate sides (see TARGET_HANDLES).
// SPP sits at the bottom of the column, adjacent to the oversight cluster;
// its long edges to SSC/ANSPDCP curve around the column (T21, W3).
const TARGET_POSITIONS: Record<string, XYPosition> = {
  CSAT: { x: 520, y: 0 },
  DIICOT: { x: 520, y: 160 },
  ANSPDCP: { x: 520, y: 320 },
  DNSC: { x: 520, y: 480 },
  SSC: { x: 520, y: 640 },
  IADE: { x: 520, y: 800 },
  IG: { x: 520, y: 960 },
  SPP: { x: 520, y: 1120 },
  SRI: { x: 200, y: 800 },
  SIE: { x: 840, y: 800 },
  PRES: { x: 760, y: 0 },
  ICCJ: { x: 760, y: 160 },
  JPC: { x: 520, y: 1280 },
  ITAP: { x: 60, y: 1280 },
  OMB: { x: 60, y: 960 },
}

type HandleSide = 'left' | 'right' | 'top' | 'bottom'

const TARGET_HANDLES: Record<string, [HandleSide, HandleSide]> = {
  T3: ['right', 'left'],
  T4: ['right', 'left'],
  T5: ['bottom', 'bottom'],
  T6: ['bottom', 'bottom'],
  T7: ['right', 'left'],
  T8: ['bottom', 'bottom'],
  T7b: ['left', 'right'],
  T8b: ['top', 'top'],
  T9: ['right', 'left'],
  T9b: ['left', 'right'],
  T10: ['bottom', 'left'],
  T11: ['right', 'left'],
  T11b: ['left', 'right'],
  T11c: ['bottom', 'top'],
  T12: ['left', 'left'],
  T13: ['right', 'left'],
  T14: ['right', 'left'],
  T14b: ['left', 'right'],
  T15: ['right', 'left'],
  T15b: ['left', 'right'],
  T16: ['right', 'left'],
  T17: ['right', 'left'],
  T18: ['left', 'bottom'],
  T18b: ['right', 'bottom'],
  W1: ['left', 'right'],
  W2: ['right', 'left'],
  W3: ['right', 'right'],
  T20: ['top', 'bottom'],
  T21: ['left', 'left'],
  T18c: ['top', 'bottom'],
}

interface EdgeRouting {
  type?: 'straight'
  sourceHandle?: string
  targetHandle?: string
}

// Top/bottom reverse arcs bow into the dense central column with bezier
// control points, so these are drawn as straight lines instead.
const TARGET_STRAIGHT = new Set(['T8'])

function targetEdgeRouting(flow: Flow): EdgeRouting {
  const sides = TARGET_HANDLES[flow.id]
  if (!sides) return {}
  return {
    type: TARGET_STRAIGHT.has(flow.id) ? 'straight' : undefined,
    sourceHandle: `source-${sides[0]}`,
    targetHandle: `target-${sides[1]}`,
  }
}

export function edgeColor(flow: Flow): string {
  if (flow.category === 'current') {
    const audit = flow.audit ? pick(flow.audit, 'en') : 'Low'
    if (audit === 'Very low' || audit === 'None') return '#ef4444'
    if (audit === 'Low') return '#f59e0b'
    return '#facc15'
  }
  if (flow.id === 'W1' || flow.id === 'W2') return '#4ade80'
  if (flow.source === 'IADE' || flow.target === 'IADE') return '#60a5fa'
  if (
    flow.source === 'IG' ||
    flow.source === 'JPC' ||
    flow.source === 'ITAP' ||
    flow.source === 'OMB' ||
    flow.target === 'IG' ||
    flow.target === 'JPC' ||
    flow.target === 'ANSPDCP'
  ) {
    return '#f472b6'
  }
  if (flow.source === 'DNSC' || flow.target === 'DNSC') return '#2dd4bf'
  if (flow.source === 'DIICOT' || flow.target === 'DIICOT' || flow.target === 'ICCJ') return '#c084fc'
  if (
    flow.source === 'CSAT' ||
    flow.target === 'CSAT' ||
    flow.target === 'PRES' ||
    flow.source === 'PRES'
  ) {
    return '#94a3b8'
  }
  return '#60a5fa'
}

/** Line style carries the audit trail, so it reads without colour: solid, dashed, dotted. */
export function edgeDash(flow: Flow): string | undefined {
  if (flow.category === 'target') return undefined
  const audit = flow.audit ? pick(flow.audit, 'en') : 'Low'
  if (audit === 'Very low' || audit === 'None') return '2 4'
  if (audit === 'Low') return '7 4'
  return undefined
}

export function buildGraph(
  mode: GraphMode,
  lang: Language,
): { nodes: Node<ActorNodeData>[]; edges: Edge[] } {
  const actors = mode === 'current' ? currentActors : targetActors
  const flows = mode === 'current' ? currentFlows : targetFlows
  const positions = mode === 'current' ? CURRENT_POSITIONS : TARGET_POSITIONS

  const nodes: Node<ActorNodeData>[] = actors.map((actor) => ({
    id: `${mode}:${actor.id}`,
    type: 'actor',
    position: positions[actor.id] ?? { x: 0, y: 0 },
    data: {
      label: pick(actor.name, lang),
      role: pick(actor.role, lang),
      category: actor.category,
      color: resolveActorColor(actor, mode),
      note: actor.note ? pick(actor.note, lang) : undefined,
    },
  }))

  const edges: Edge[] = flows.map((flow) => {
    const color = edgeColor(flow)
    const routing = mode === 'target' ? targetEdgeRouting(flow) : {}
    return {
      id: `${mode}:${flow.id}`,
      source: `${mode}:${flow.source}`,
      target: `${mode}:${flow.target}`,
      label: flow.id,
      data: { flow },
      type: routing.type,
      sourceHandle: routing.sourceHandle,
      targetHandle: routing.targetHandle,
      style: { stroke: color, strokeWidth: 1.5, strokeDasharray: edgeDash(flow) },
      markerEnd: { type: MarkerType.ArrowClosed, color },
      labelStyle: { fill: '#cbd5e1', fontSize: 9, fontWeight: 700 },
      labelBgStyle: { fill: '#0b1220', fillOpacity: 0.92 },
      labelBgPadding: [4, 2] as [number, number],
      labelBgBorderRadius: 3,
    }
  })

  return { nodes, edges }
}
