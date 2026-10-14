import { useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Edge,
  type FitViewOptions,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ActorNode from './ActorNode'
import GlossedText from './GlossedText'
import { buildGraph, type GraphMode } from '../lib/graph'
import { currentActors, targetActors } from '../data/actors'
import { useI18n } from '../i18n/useI18n'
import { pick, type MessageKey } from '../i18n/messages'
import type { Actor, ActorCategory, Flow } from '../data/types'
import { DATASET_AS_OF } from '../data/sources'
import { ERRATA_URL } from '../lib/links'

const nodeTypes = { actor: ActorNode }

const CATEGORY_FILTERS: Array<{ id: ActorCategory; labelKey: MessageKey }> = [
  { id: 'agency', labelKey: 'cat.agency' },
  { id: 'executive', labelKey: 'cat.executive' },
  { id: 'oversight', labelKey: 'cat.oversight' },
  { id: 'justice', labelKey: 'cat.justice' },
  { id: 'judicial', labelKey: 'cat.judicial' },
  { id: 'civilian', labelKey: 'cat.civilian' },
  { id: 'broker', labelKey: 'cat.broker' },
  { id: 'public', labelKey: 'cat.public' },
]

// Keep nodes clear of the legend (top left) and the toolbar (top right) on wide screens.
function fitOptions(): FitViewOptions {
  const wide = typeof window !== 'undefined' && window.innerWidth > 920
  return {
    padding: wide ? { top: '120px', left: '330px', right: '40px', bottom: '40px' } : 0.1,
    minZoom: 0.6,
    maxZoom: 1,
  }
}

const TARGET_DEFAULT = new Set<ActorCategory>(['agency', 'broker'])

type Selection =
  | { kind: 'flow'; flow: Flow }
  | { kind: 'actor'; actor: Actor }
  | null

function DetailPanel({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  const { t, lang } = useI18n()
  if (!selection) return null
  if (selection.kind === 'flow') {
    const flow = selection.flow
    const rows: Array<[string, string]> = [
      [t('detail.flow'), flow.id],
      [t('detail.source'), flow.source],
      [t('detail.destination'), flow.target],
      [t('detail.dataType'), pick(flow.dataType, lang)],
      [t(flow.category === 'current' ? 'detail.legalBasis' : 'detail.legalGate'), pick(flow.legal, lang)],
      [t(flow.category === 'current' ? 'detail.auditability' : 'detail.auditEntry'), flow.audit ? pick(flow.audit, lang) : '—'],
    ]
    if (flow.category === 'current' && flow.risk) rows.push([t('detail.risk'), pick(flow.risk, lang)])
    if (flow.category === 'target' && flow.oversight) rows.push([t('detail.oversight'), pick(flow.oversight, lang)])
    return (
      <div className="detail-panel">
        <div className="detail-header">
          <h3>{t('detail.flow')} {flow.id}</h3>
          <button className="close-btn" onClick={onClose} aria-label={t('detail.close')}>
            ×
          </button>
        </div>
        <table className="kv-table">
          <tbody>
            {rows.map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td><GlossedText text={value} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {flow.description && (
          <p className="detail-desc">
            <GlossedText text={pick(flow.description, lang)} />
          </p>
        )}
        <div className="detail-sources">
          <h4 id={`sources-${flow.id}`}>{t('detail.sources')}</h4>
          {flow.sources.length > 0 ? (
            <ul aria-labelledby={`sources-${flow.id}`}>
              {flow.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {t('detail.sourceNeeded')} {flow.sourceNeeded ? pick(flow.sourceNeeded, lang) : ''}{' '}
              <a href={ERRATA_URL} target="_blank" rel="noreferrer">
                {t('footer.corrections')}
              </a>
            </p>
          )}
          <p className="muted">{t('detail.sourcesChecked', { date: DATASET_AS_OF })}</p>
        </div>
      </div>
    )
  }
  const actor = selection.actor
  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h3>{pick(actor.name, lang).toUpperCase()}</h3>
        <button className="close-btn" onClick={onClose} aria-label={t('detail.close')}>
          ×
        </button>
      </div>
      <table className="kv-table">
        <tbody>
          <tr>
            <td>{t('detail.role')}</td>
            <td><GlossedText text={pick(actor.role, lang)} /></td>
          </tr>
          <tr>
            <td>{t('detail.category')}</td>
            <td>{t(`cat.${actor.category}` as MessageKey)}</td>
          </tr>
        </tbody>
      </table>
      {actor.note && (
        <p className="detail-desc">
          <GlossedText text={pick(actor.note, lang)} />
        </p>
      )}
    </div>
  )
}

function Legend({ mode }: { mode: GraphMode }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(true)
  const keys =
    mode === 'current'
      ? (['legend.current.i1', 'legend.current.i2', 'legend.current.i3', 'legend.current.i4', 'legend.current.i5'] as MessageKey[])
      : (['legend.target.i1', 'legend.target.i2', 'legend.target.i3', 'legend.target.i4', 'legend.target.i5', 'legend.target.i6'] as MessageKey[])
  const colors =
    mode === 'current'
      ? ['#ef4444', '#facc15', '#c084fc', '#94a3b8', '#f59e0b']
      : ['#60a5fa', '#4ade80', '#f472b6', '#c084fc', '#2dd4bf', '#475569']
  return (
    <div className="legend">
      <button
        type="button"
        className="legend-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? '▾' : '▸'}</span> {t('explorer.legend')}
      </button>
      {open && (
        <div className="legend-items">
          {keys.map((key, index) => (
            <span key={key}>
              <i style={{ background: colors[index] }} />
              {t(key)}
            </span>
          ))}
          {mode === 'current' &&
            ([
              ['legend.lines.audited', undefined],
              ['legend.lines.weak', '7 4'],
              ['legend.lines.none', '2 4'],
            ] as Array<[MessageKey, string | undefined]>).map(([key, dash]) => (
              <span key={key}>
                <svg width="22" height="6" aria-hidden="true">
                  <line x1="0" y1="3" x2="22" y2="3" stroke="#cbd5e1" strokeWidth="2" strokeDasharray={dash} />
                </svg>
                {t(key)}
              </span>
            ))}
        </div>
      )}
    </div>
  )
}

export default function FlowExplorer({ mode }: { mode: GraphMode }) {
  const { t, lang } = useI18n()
  const graph = useMemo(() => buildGraph(mode, lang), [mode, lang])
  const actors = mode === 'current' ? currentActors : targetActors

  const [query, setQuery] = useState('')
  const [showLabels, setShowLabels] = useState(true)
  // 33 target flows at fit-to-screen zoom are unreadable, so the target view opens on the
  // agencies and the broker; the visitor adds the rest.
  const [hiddenCats, setHiddenCats] = useState<Set<ActorCategory>>(() =>
    mode === 'target'
      ? new Set(actors.map((actor) => actor.category).filter((category) => !TARGET_DEFAULT.has(category)))
      : new Set(),
  )
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selection, setSelection] = useState<Selection>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelection(null)
        setSelectedEdgeId(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const visibleActorIds = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return new Set(
      actors
        .filter((actor) => !hiddenCats.has(actor.category))
        .filter(
          (actor) =>
            !normalized ||
            pick(actor.name, lang).toLowerCase().includes(normalized) ||
            pick(actor.role, lang).toLowerCase().includes(normalized),
        )
        .map((actor) => actor.id),
    )
  }, [actors, hiddenCats, lang, query])

  const { nodes, edges } = useMemo(() => {
    const prefix = `${mode}:`
    const visibleNodes = graph.nodes.filter((node) =>
      visibleActorIds.has(node.id.slice(prefix.length)),
    )
    const visibleNodeIds = new Set(visibleNodes.map((node) => node.id))
    const visibleEdges = graph.edges
      .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
      .map((edge) => ({
        ...edge,
        label: showLabels ? (edge.label as string) : undefined,
        selected: edge.id === selectedEdgeId,
      }))

    if (hoveredId) {
      const neighbors = new Set<string>([hoveredId])
      for (const edge of visibleEdges) {
        if (edge.source === hoveredId) neighbors.add(edge.target)
        if (edge.target === hoveredId) neighbors.add(edge.source)
      }
      const dimmedNodes = visibleNodes.map((node) =>
        neighbors.has(node.id) ? node : { ...node, className: 'dimmed' },
      )
      const dimmedEdges = visibleEdges.map((edge) =>
        edge.source === hoveredId || edge.target === hoveredId
          ? edge
          : { ...edge, className: 'dimmed' },
      )
      return { nodes: dimmedNodes, edges: dimmedEdges }
    }
    return { nodes: visibleNodes, edges: visibleEdges }
  }, [graph, hoveredId, mode, selectedEdgeId, showLabels, visibleActorIds])

  const [instance, setInstance] = useState<ReactFlowInstance | null>(null)
  const visibleKey = nodes.map((node) => node.id).join(',')
  useEffect(() => {
    if (instance) void instance.fitView({ ...fitOptions(), duration: 200 })
  }, [instance, visibleKey])

  const onEdgeClick = (_event: React.MouseEvent, edge: Edge) => {
    const flow = (edge.data as { flow: Flow } | undefined)?.flow
    if (flow) {
      setSelection({ kind: 'flow', flow })
      setSelectedEdgeId(edge.id)
    }
  }

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    const actor = actors.find((candidate) => candidate.id === node.id.split(':')[1])
    if (actor) setSelection({ kind: 'actor', actor })
  }

  const toggleCategory = (category: ActorCategory) => {
    setHiddenCats((current) => {
      const next = new Set(current)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <div className="explorer">
      <Legend mode={mode} />
      <div className="explorer-toolbar">
        <div className="search-wrap">
          <svg aria-hidden="true" className="search-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" strokeWidth="2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" />
          </svg>
          <input
            className="explorer-search"
            type="search"
            placeholder={t('explorer.search')}
            aria-label={t('explorer.searchLabel')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setQuery('')
            }}
          />
        </div>
        <div className="filter-chips">
          {CATEGORY_FILTERS.filter((filter) =>
            actors.some((actor) => actor.category === filter.id),
          ).map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={!hiddenCats.has(filter.id)}
              className={`chip ${hiddenCats.has(filter.id) ? 'off' : 'on'}`}
              onClick={() => toggleCategory(filter.id)}
            >
              {t(filter.labelKey)}
            </button>
          ))}
          {hiddenCats.size > 0 && (
            <button type="button" className="chip on" onClick={() => setHiddenCats(new Set())}>
              {t('explorer.showAll')}
            </button>
          )}
          <button
            type="button"
            aria-pressed={showLabels}
            className={`chip ${showLabels ? 'on' : 'off'}`}
            onClick={() => setShowLabels((value) => !value)}
          >
            {t('explorer.labels')}
          </button>
        </div>
      </div>
      <div className="explorer-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
          onNodeMouseEnter={(_event, node) => setHoveredId(node.id)}
          onNodeMouseLeave={() => setHoveredId(null)}
          onPaneClick={() => {
            setSelection(null)
            setSelectedEdgeId(null)
          }}
          onInit={setInstance}
          fitView
          fitViewOptions={fitOptions()}
          minZoom={0.6}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#16233c" />
          <Controls />
        </ReactFlow>
      </div>
      <DetailPanel selection={selection} onClose={() => setSelection(null)} />
    </div>
  )
}
