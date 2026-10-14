import { useEffect, useRef, useState } from 'react'
import { targetActors } from '../data/actors'
import { targetFlows } from '../data/flows'
import { useI18n } from '../i18n/useI18n'
import { pick } from '../i18n/messages'

type Point = [number, number]

const NODES: Record<string, Point> = { SRI: [48, 118], IADE: [160, 34], SIE: [272, 118] }

// Each hop is a quadratic curve; the control point bows the two directions of a pair apart.
const HOPS: Array<{ id: string; control: Point }> = [
  { id: 'T3', control: [76, 52] },
  { id: 'T4', control: [244, 52] },
  { id: 'T5', control: [200, 100] },
  { id: 'T6', control: [120, 100] },
]

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches)
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

const NODE_RADIUS = 20

// Pull an endpoint back toward the control point so the curve and its arrow stop at the node's rim.
function rim(point: Point, control: Point, gap: number): Point {
  const dx = control[0] - point[0]
  const dy = control[1] - point[1]
  const length = Math.hypot(dx, dy)
  return [point[0] + (dx / length) * gap, point[1] + (dy / length) * gap]
}

function hopPath(from: Point, control: Point, to: Point): string {
  const source = rim(from, control, NODE_RADIUS)
  const target = rim(to, control, NODE_RADIUS + 4)
  return `M${source[0]},${source[1]} Q${control[0]},${control[1]} ${target[0]},${target[1]}`
}

function midpoint(source: Point, control: Point, target: Point): Point {
  return [
    0.25 * source[0] + 0.5 * control[0] + 0.25 * target[0],
    0.25 * source[1] + 0.5 * control[1] + 0.25 * target[1],
  ]
}

export default function HandshakeMap({ activeHop }: { activeHop: string | null }) {
  const { t, lang } = useI18n()
  const reduced = usePrefersReducedMotion()
  const motionRef = useRef<SVGAnimateMotionElement>(null)
  const hops = HOPS.map((hop) => {
    const flow = targetFlows.find((candidate) => candidate.id === hop.id)!
    return { ...hop, flow, source: NODES[flow.source], target: NODES[flow.target] }
  })
  const active = hops.find((hop) => hop.id === activeHop) ?? null
  const name = (id: string) => pick(targetActors.find((actor) => actor.id === id)!.name, lang)

  useEffect(() => {
    motionRef.current?.beginElement()
  }, [activeHop, reduced])

  const parked = active ? midpoint(active.source, active.control, active.target) : null

  return (
    <figure className="handshake-map" aria-labelledby="handshake-map-caption">
      <svg viewBox="0 0 320 150" aria-hidden="true">
        <defs>
          <marker id="hop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" />
          </marker>
        </defs>
        {hops.map((hop) => (
          <path
            key={hop.id}
            data-hop={hop.id}
            className={`hop${hop.id === activeHop ? ' active' : ''}`}
            d={hopPath(hop.source, hop.control, hop.target)}
            markerEnd="url(#hop-arrow)"
          />
        ))}
        {Object.entries(NODES).map(([id, [x, y]]) => (
          <g key={id} className="hop-node" transform={`translate(${x},${y})`}>
            <circle r={NODE_RADIUS} />
            <text textAnchor="middle" dy="4">{id}</text>
          </g>
        ))}
        {active && (
          <g
            key={active.id}
            className="token-chip"
            transform={reduced && parked ? `translate(${parked[0]},${parked[1]})` : undefined}
          >
            <rect x="-22" y="-9" width="44" height="18" rx="9" />
            <text textAnchor="middle" dy="3.5">token</text>
            {!reduced && (
              <animateMotion
                ref={motionRef}
                begin="indefinite"
                dur="1s"
                fill="freeze"
                path={hopPath(active.source, active.control, active.target)}
              />
            )}
          </g>
        )}
      </svg>
      <figcaption id="handshake-map-caption">
        {t('handshake.map.title')}
        <span className="handshake-map-hop" aria-live="polite">
          {active
            ? `${active.id} · ${name(active.flow.source)} → ${name(active.flow.target)}: ${pick(active.flow.label, lang)}`
            : t('handshake.map.idle')}
        </span>
      </figcaption>
    </figure>
  )
}
