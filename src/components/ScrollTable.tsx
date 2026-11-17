import { useRef, type ReactNode } from 'react'
import { useI18n } from '../i18n/useI18n'
import { useScrollEdges } from '../lib/useScrollEdges'

/**
 * A table that may be wider than its card. While columns are hidden it says so, fades the
 * cut-off side, and is reachable by keyboard so the arrow keys can scroll it.
 */
export default function ScrollTable({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { start, end } = useScrollEdges(ref)
  const overflowing = start || end
  return (
    <div className="scroll-wrap" data-more-start={start || undefined} data-more-end={end || undefined}>
      <div
        ref={ref}
        className="table-scroll"
        role={overflowing ? 'region' : undefined}
        aria-label={overflowing ? label : undefined}
        tabIndex={overflowing ? 0 : undefined}
      >
        {children}
      </div>
      {overflowing && (
        <p className="scroll-hint">
          {t('table.scrollHint')} <span aria-hidden="true">{end ? '→' : '←'}</span>
        </p>
      )}
    </div>
  )
}
