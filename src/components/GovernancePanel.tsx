import { useEffect, useRef, useState } from 'react'
import MarkdownIt from 'markdown-it'
import mermaid from 'mermaid'
import { useI18n } from '../i18n/useI18n'
import { MERMAID_CONFIG } from '../lib/mermaidConfig'
import { pick } from '../i18n/messages'
import { GOVERNANCE_DOCS } from './governanceDocs'
import { GOVERNANCE_DIAGRAMS } from './governanceDiagrams'

const md = new MarkdownIt({ html: false, linkify: true })

mermaid.initialize(MERMAID_CONFIG)

const MIN_ZOOM = 0.4
const MAX_ZOOM = 4

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

function MermaidDiagram({ id, code, title }: { id: string; code: string; title: string }) {
  const [svg, setSvg] = useState('')
  const [failed, setFailed] = useState(false)
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [boxSize, setBoxSize] = useState<{ w: number; h: number } | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const pinchRef = useRef<{
    dist: number
    midX: number
    midY: number
    zoom: number
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => setBoxSize({ w: box.clientWidth, h: box.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const host = hostRef.current
    const box = boxRef.current
    const svgEl = host?.querySelector('svg')
    if (!host || !svgEl || !box) return
    const vb = svgEl.getAttribute('viewBox')?.split(' ').map(Number) ?? []
    const aspect = vb.length === 4 && vb[3] > 0 ? vb[3] / vb[2] : 0.5
    const width = box.clientWidth
    const optimalH = Math.min(720, Math.max(260, Math.round(width * aspect)))
    svgEl.removeAttribute('style')
    svgEl.setAttribute('width', String(width))
    svgEl.setAttribute('height', String(optimalH))
    box.style.height = `${optimalH}px`
  }, [svg, boxSize])

  useEffect(() => {
    let cancelled = false
    mermaid
      .render(id, code)
      .then((result) => {
        if (!cancelled) setSvg(result.svg)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [id, code])

  function clampPan(zoom: number, size: number, value: number): number {
    const min = size * (1 - zoom)
    return Math.min(0, Math.max(min, value))
  }

  function zoomAt(cx: number, cy: number, factor: number) {
    setView((prev) => {
      const box = boxRef.current
      const w = box?.clientWidth ?? 1000
      const h = box?.clientHeight ?? 600
      const zoom = clampZoom(prev.zoom * factor)
      const px = (cx - prev.x) / prev.zoom
      const py = (cy - prev.y) / prev.zoom
      return {
        zoom,
        x: clampPan(zoom, w, cx - px * zoom),
        y: clampPan(zoom, h, cy - py * zoom),
      }
    })
  }

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = box.getBoundingClientRect()
      zoomAt(event.clientX - rect.left, event.clientY - rect.top, event.deltaY < 0 ? 1.12 : 0.89)
    }
    box.addEventListener('wheel', onWheel, { passive: false })
    return () => box.removeEventListener('wheel', onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function zoomButtons(factor: number) {
    const box = boxRef.current
    if (!box) {
      setView((prev) => ({ ...prev, zoom: clampZoom(prev.zoom * factor) }))
      return
    }
    const rect = box.getBoundingClientRect()
    zoomAt(rect.width / 2, rect.height / 2, factor)
  }

  function reset() {
    setView({ zoom: 1, x: 0, y: 0 })
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const touch = event.pointerType === 'touch'
    const shouldCapture = !touch || view.zoom > 1 || pointersRef.current.size > 0
    if (shouldCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // pointer capture can be unavailable (synthetic events, some webviews)
      }
    }
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointersRef.current.size === 2) {
      if (touch) {
        try {
          event.currentTarget.setPointerCapture([...pointersRef.current.keys()][0])
        } catch {
          // ignore
        }
      }
      const [p1, p2] = [...pointersRef.current.values()]
      pinchRef.current = {
        dist: Math.hypot(p2.x - p1.x, p2.y - p1.y),
        midX: (p1.x + p2.x) / 2,
        midY: (p1.y + p2.y) / 2,
        zoom: view.zoom,
        x: view.x,
        y: view.y,
      }
      dragRef.current = null
      setDragging(true)
    } else if (touch && view.zoom <= 1) {
      dragRef.current = null
    } else {
      dragRef.current = { startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y }
      setDragging(true)
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const pinch = pinchRef.current
    if (pointersRef.current.size === 2 && pinch) {
      const [p1, p2] = [...pointersRef.current.values()]
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y)
      const midX = (p1.x + p2.x) / 2
      const midY = (p1.y + p2.y) / 2
      const box = boxRef.current
      if (!box || pinch.dist <= 0) return
      const rect = box.getBoundingClientRect()
      const bx = pinch.midX - rect.left
      const by = pinch.midY - rect.top
      setView(() => {
        const zoom = clampZoom(pinch.zoom * (dist / pinch.dist))
        const px = (bx - pinch.x) / pinch.zoom
        const py = (by - pinch.y) / pinch.zoom
        return {
          zoom,
          x: clampPan(zoom, rect.width, bx - px * zoom + (midX - pinch.midX)),
          y: clampPan(zoom, rect.height, by - py * zoom + (midY - pinch.midY)),
        }
      })
      return
    }
    const drag = dragRef.current
    if (!drag) return
    setView((prev) => {
      const box = boxRef.current
      const w = box?.clientWidth ?? 1000
      const h = box?.clientHeight ?? 600
      return {
        ...prev,
        x: clampPan(prev.zoom, w, drag.originX + event.clientX - drag.startX),
        y: clampPan(prev.zoom, h, drag.originY + event.clientY - drag.startY),
      }
    })
  }

  function onPointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId)
    if (pointersRef.current.size === 0) {
      dragRef.current = null
      pinchRef.current = null
      setDragging(false)
    } else if (pointersRef.current.size === 1) {
      const [p] = [...pointersRef.current.values()]
      pinchRef.current = null
      dragRef.current = { startX: p.x, startY: p.y, originX: view.x, originY: view.y }
    }
  }

  if (failed) return <div className="mermaid-error">diagram failed to render</div>

  return (
    <div className="gov-diagram-card">
      <div className="gov-diagram-head">
        <div className="gov-diagram-title">{title}</div>
        <div className="gov-diagram-controls">
          <button type="button" onClick={() => zoomButtons(1 / 1.25)} aria-label="zoom out">
            −
          </button>
          <span className="gov-zoom-value">{Math.round(view.zoom * 100)}%</span>
          <button type="button" onClick={() => zoomButtons(1.25)} aria-label="zoom in">
            +
          </button>
          <button type="button" onClick={reset} aria-label="reset view">
            ⤢
          </button>
        </div>
      </div>
      <div
        ref={boxRef}
        className="mermaid-box"
        style={{
          cursor: view.zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
          touchAction: view.zoom > 1 ? 'none' : 'pan-y',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div
          className="mermaid-zoomable"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }}
        >
          <div ref={hostRef} className="mermaid-svg-host" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </div>
    </div>
  )
}

export default function GovernancePanel() {
  const { t, lang } = useI18n()

  return (
    <div className="shell">
      <section className="card accent-left">
        <p className="section-label">{t('nav.governance')}</p>
        <h2>{t('gov.title')}</h2>
        <p>{t('gov.subtitle')}</p>
        <p className="muted">{t('gov.intro')}</p>
        <p className="muted">{t('gov.langNote')}</p>
      </section>

      <section className="card">
        <p className="section-label">{t('gov.section.diagrams')}</p>
        <h3>{t('gov.section.diagrams')}</h3>
        <p className="muted">{t('gov.hint')}</p>
        <div className="gov-grid">
          {GOVERNANCE_DIAGRAMS.map((diagram) => (
            <MermaidDiagram
              key={`${diagram.id}-${lang}`}
              id={diagram.id}
              code={pick(diagram.source, lang)}
              title={t(diagram.titleKey)}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <p className="section-label">{t('gov.section.docs')}</p>
        <h3>{t('gov.section.docs')}</h3>
        <div className="gov-docs">
          {GOVERNANCE_DOCS.map((doc) => (
            <article className="gov-md" key={doc.id} lang={lang}>
              <div className="gov-doc-key">{`${doc.id} · ${t(doc.titleKey)}`}</div>
              <div dangerouslySetInnerHTML={{ __html: md.render(pick(doc.source, lang)) }} />
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
