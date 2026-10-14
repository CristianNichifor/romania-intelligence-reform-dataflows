import { useEffect, useState } from 'react'
import { shortHash } from '../lib/crypto'
import { clearLedger, useLedger, verifyLedgerIntegrity } from '../lib/ledger'
import { useI18n } from '../i18n/useI18n'
import { formatTime } from '../lib/time'

export default function LedgerViewer() {
  const { lang, t } = useI18n()
  const ledger = useLedger()
  const [integrity, setIntegrity] = useState<{ valid: boolean; brokenAt: number | null } | null>(null)

  useEffect(() => {
    void verifyLedgerIntegrity().then(setIntegrity)
  }, [ledger])

  return (
    <div className="ledger-viewer shell">
      <div className="sim-head">
        <div>
          <p className="section-label">{t('section.record')}</p>
          <h2>{t('ledger.title')}</h2>
        </div>
        <div className="sim-actions">
          <span className={`integrity-pill ${integrity?.valid === false ? 'bad' : 'ok'}`}>
            {integrity
              ? integrity.valid
                ? t('ledger.intact')
                : t('ledger.broken', { n: integrity.brokenAt ?? 0 })
              : t('ledger.verifying')}
          </span>
          <button className="btn btn-ghost" onClick={clearLedger}>
            {t('ledger.clear')}
          </button>
        </div>
      </div>
      {ledger.length === 0 && <p className="muted">{t('ledger.empty')}</p>}
      {ledger.length > 0 && (
        <div className="table-scroll">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('ledger.h.time')}</th>
                <th>{t('ledger.h.flow')}</th>
                <th>{t('ledger.h.from')}</th>
                <th>{t('ledger.h.to')}</th>
                <th>{t('ledger.h.token')}</th>
                <th>{t('ledger.h.status')}</th>
                <th>{t('ledger.h.note')}</th>
                <th>{t('ledger.h.hash')}</th>
              </tr>
            </thead>
            <tbody>
              {[...ledger].reverse().map((entry) => (
                <tr key={entry.id} className={entry.status === 'rejected' ? 'row-rejected' : undefined}>
                  <td>{entry.seq}</td>
                  <td>{formatTime(entry.timestamp, lang)}</td>
                  <td><strong>{entry.flowType}</strong></td>
                  <td>{entry.initiator}</td>
                  <td>{entry.receiver}</td>
                  <td className="mono">{entry.tokenId ?? '—'}</td>
                  <td>
                    <span className={`status-pill ${entry.status}`}>
                      {t(entry.status === 'accepted' ? 'status.accepted' : 'status.rejected')}
                    </span>
                  </td>
                  <td>{entry.note}</td>
                  <td className="mono">{shortHash(entry.entryHash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
