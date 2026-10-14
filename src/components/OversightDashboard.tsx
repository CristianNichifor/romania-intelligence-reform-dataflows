import { useEffect, useMemo, useState } from 'react'
import { shortHash } from '../lib/crypto'
import { useLedger, verifyLedgerIntegrity } from '../lib/ledger'
import { useI18n } from '../i18n/useI18n'
import { formatTime } from '../lib/time'
import type { MessageKey } from '../i18n/messages'

export default function OversightDashboard() {
  const { lang, t } = useI18n()
  const ledger = useLedger()
  const [integrity, setIntegrity] = useState<{ valid: boolean; brokenAt: number | null } | null>(null)

  useEffect(() => {
    let cancelled = false
    void verifyLedgerIntegrity().then((result) => {
      if (!cancelled) setIntegrity(result)
    })
    return () => {
      cancelled = true
    }
  }, [ledger])

  const metrics = useMemo(() => {
    const byFlow = new Map<string, number>()
    let accepted = 0
    let rejected = 0
    const tokens = new Set<string>()
    for (const entry of ledger) {
      byFlow.set(entry.flowType, (byFlow.get(entry.flowType) ?? 0) + 1)
      if (entry.status === 'accepted') accepted += 1
      else rejected += 1
      if (entry.tokenId) tokens.add(entry.tokenId)
    }
    const flowBars = [...byFlow.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    return { byFlow, accepted, rejected, tokenCount: tokens.size, flowBars, max: Math.max(1, ...byFlow.values()) }
  }, [ledger])

  const rejectedEntries = ledger.filter((entry) => entry.status === 'rejected')
  const accessRows = [1, 2, 3, 4, 5]

  return (
    <div className="dashboard shell">
      <div className="sim-head">
        <div>
          <p className="section-label">{t('section.oversight')}</p>
          <h2>{t('dashboard.title')}</h2>
        </div>
      </div>
      <div className="stat-row">
        <div className="stat">
          <div className="stat-value">{ledger.length}</div>
          <div className="stat-label">{t('dashboard.entries')}</div>
        </div>
        <div className="stat">
          <div className="stat-value ok">{metrics.accepted}</div>
          <div className="stat-label">{t('dashboard.accepted')}</div>
        </div>
        <div className="stat">
          <div className="stat-value bad">{metrics.rejected}</div>
          <div className="stat-label">{t('dashboard.rejected')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{metrics.tokenCount}</div>
          <div className="stat-label">{t('dashboard.tokens')}</div>
        </div>
        <div className="stat">
          <div className={`stat-value ${integrity?.valid === false ? 'bad' : 'ok'}`}>
            {integrity
              ? integrity.valid
                ? t('dashboard.intact')
                : t('dashboard.broken', { n: integrity.brokenAt ?? 0 })
              : '…'}
          </div>
          <div className="stat-label">{t('dashboard.integrity')}</div>
        </div>
      </div>

      <div className="dash-grid">
        <section className="card">
          <p className="section-label">{t('section.volume')}</p>
          <h3>{t('dashboard.volume')}</h3>
          {metrics.flowBars.map(([flow, count]) => (
            <div className="bar-row" key={flow}>
              <span className="bar-label">{flow}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(count / metrics.max) * 100}%` }} />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          ))}
        </section>

        <section className="card">
          <p className="section-label">{t('section.anomalies')}</p>
          <h3>{t('dashboard.rejections')}</h3>
          {rejectedEntries.length === 0 && <p className="muted">{t('dashboard.rejections.none')}</p>}
          {rejectedEntries.map((entry) => (
            <div className="rejection" key={entry.id}>
              <div>
                <strong>{entry.flowType}</strong> · {entry.initiator} → {entry.receiver}
              </div>
              <div className="muted">{entry.note}</div>
              <div className="mono">{t('ledger.entry')} {shortHash(entry.entryHash)} · {formatTime(entry.timestamp, lang)}</div>
            </div>
          ))}
        </section>
      </div>

      <section className="card">
        <p className="section-label">{t('section.accessModel')}</p>
        <h3>{t('dashboard.access.title')}</h3>
        <div className="table-scroll">
          <table className="kv-table wide">
            <thead>
              <tr>
                <th>{t('dashboard.access.body')}</th>
                <th>{t('dashboard.access.sees')}</th>
                <th>{t('dashboard.access.notSees')}</th>
              </tr>
            </thead>
            <tbody>
              {accessRows.map((row) => (
                <tr key={row}>
                  <td>{t(`dashboard.access.r${row}.b` as MessageKey)}</td>
                  <td>{t(`dashboard.access.r${row}.s` as MessageKey)}</td>
                  <td>{t(`dashboard.access.r${row}.n` as MessageKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
