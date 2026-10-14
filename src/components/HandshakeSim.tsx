import { useRef, useState } from 'react'
import { appendLedger, getLedgerEntries } from '../lib/ledger'
import { shortHash } from '../lib/crypto'
import { sscReview, type RequestObject, type WarrantToken } from '../lib/warrant'
import GlossedText from './GlossedText'
import HandshakeMap from './HandshakeMap'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/messages'

interface Artifact {
  label: string
  json: unknown
}

const REQUEST: RequestObject = {
  caseId: 'C-2026-0417',
  predicate: 'foreign_state_espionage',
  subjects: ['SUBJ-8812', 'SUBJ-8813'],
  fields: ['travel_records', 'comms_metadata', 'financial_links'],
  justification:
    'SIE holds foreign travel records relevant to an ongoing domestic espionage case.',
}

const STEP_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

// Step indexes whose ledger append is a T3–T6 hop.
const HOP_AT_STEP: Record<number, string> = { 4: 'T3', 5: 'T4', 7: 'T5', 8: 'T6' }

export default function HandshakeSim() {
  const { t, lang } = useI18n()
  const [stepIndex, setStepIndex] = useState(0)
  const stepRef = useRef(0)
  const busyRef = useRef(false)
  const tokenRef = useRef<WarrantToken | null>(null)
  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  const done = stepIndex >= STEP_KEYS.length

  async function runStep(index: number) {
    switch (index) {
      case 0:
        setArtifact({ label: t('handshake.artifact.request'), json: REQUEST })
        break
      case 2: {
        const decision = await sscReview(REQUEST, 'SIE', lang)
        if (decision.approved) {
          tokenRef.current = decision.token
          setArtifact({ label: t('handshake.artifact.token'), json: decision.token })
        }
        break
      }
      case 3:
        await appendLedger({
          flowType: 'SSC',
          initiator: 'SSC',
          receiver: 'SRI',
          tokenId: tokenRef.current?.tokenId ?? null,
          note: t('handshake.ledger.sscIssued'),
        })
        break
      case 4:
        await appendLedger({
          flowType: 'T3',
          initiator: 'SRI',
          receiver: 'IADE',
          tokenId: tokenRef.current?.tokenId ?? null,
          note: t('handshake.ledger.t3'),
        })
        break
      case 5:
        await appendLedger({
          flowType: 'T4',
          initiator: 'IADE',
          receiver: 'SIE',
          tokenId: tokenRef.current?.tokenId ?? null,
          note: t('handshake.ledger.t4'),
        })
        break
      case 7:
        await appendLedger({
          flowType: 'T5',
          initiator: 'SIE',
          receiver: 'IADE',
          tokenId: tokenRef.current?.tokenId ?? null,
          note: t('handshake.ledger.t5'),
        })
        break
      case 8:
        await appendLedger({
          flowType: 'T6',
          initiator: 'IADE',
          receiver: 'SRI',
          tokenId: tokenRef.current?.tokenId ?? null,
          note: t('handshake.ledger.t6'),
        })
        break
      case 10: {
        const caseEntries = getLedgerEntries().filter(
          (entry) => entry.tokenId === tokenRef.current?.tokenId,
        )
        setArtifact({ label: t('handshake.artifact.ig'), json: caseEntries.map(({ entryHash, ...rest }) => ({ ...rest, entryHash: shortHash(entryHash) })) })
        break
      }
      default:
        break
    }
  }

  async function next() {
    if (done || busyRef.current) return
    busyRef.current = true
    await runStep(stepRef.current)
    stepRef.current += 1
    setStepIndex(stepRef.current)
    busyRef.current = false
  }

  function stopTimer() {
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
  }

  function autoRun() {
    if (running) {
      stopTimer()
      return
    }
    setRunning(true)
    timerRef.current = window.setInterval(() => {
      if (busyRef.current) return
      if (stepRef.current >= STEP_KEYS.length) {
        stopTimer()
        return
      }
      busyRef.current = true
      void runStep(stepRef.current).then(() => {
        stepRef.current += 1
        setStepIndex(stepRef.current)
        busyRef.current = false
        if (stepRef.current >= STEP_KEYS.length) stopTimer()
      })
    }, 1100)
  }

  function reset() {
    stopTimer()
    stepRef.current = 0
    setStepIndex(0)
    tokenRef.current = null
    setArtifact(null)
  }

  return (
    <div className="sim shell">
      <div className="sim-head">
        <div>
          <p className="section-label">{t('section.sim')}</p>
          <h2>{t('handshake.title')}</h2>
        </div>
        <div className="sim-actions">
          <span className="sim-progress" id="handshake-progress">
            {t('sim.step', { a: String(Math.min(stepIndex + 1, STEP_KEYS.length)).padStart(2, '0'), b: String(STEP_KEYS.length).padStart(2, '0') })}
          </span>
          <button className="btn" onClick={next} disabled={done || running}>
            <span aria-hidden>▶</span> {t('sim.next')}
          </button>
          <button className="btn" onClick={autoRun} disabled={done && !running}>
            <span aria-hidden>{running ? '■' : '▶▶'}</span> {t(running ? 'sim.stop' : 'sim.auto')}
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            <span aria-hidden>↺</span> {t('sim.reset')}
          </button>
        </div>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-labelledby="handshake-progress"
        aria-valuemin={0}
        aria-valuemax={STEP_KEYS.length}
        aria-valuenow={stepIndex}
      >
        <div className="progress-fill" style={{ width: `${(stepIndex / STEP_KEYS.length) * 100}%` }} />
      </div>
      <div className="sim-body">
        <ol className="timeline">
          {STEP_KEYS.map((key, index) => (
            <li
              key={key}
              aria-current={index === stepIndex ? 'step' : undefined}
              className={
                index < stepIndex ? 'done' : index === stepIndex ? 'current' : 'pending'
              }
            >
              <div className="timeline-actor">{t(`handshake.s${key}.a` as MessageKey)}</div>
              <div className="timeline-title">
                <GlossedText text={t(`handshake.s${key}.t` as MessageKey)} />
              </div>
              {index <= stepIndex && (
                <div className="timeline-detail">
                  <GlossedText text={t(`handshake.s${key}.d` as MessageKey)} />
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="sim-side">
          <HandshakeMap activeHop={HOP_AT_STEP[stepIndex - 1] ?? null} />
          <div className="artifact-panel">
            <h3>{artifact ? artifact.label : t('handshake.artifact.pending')}</h3>
            {artifact && <pre className="artifact-json">{JSON.stringify(artifact.json, null, 2)}</pre>}
            {!artifact && <p className="muted">{t('handshake.artifact.pendingHint')}</p>}
          </div>
          <div className="sim-note">
            <GlossedText text={t('handshake.note')} />
          </div>
        </div>
      </div>
    </div>
  )
}
