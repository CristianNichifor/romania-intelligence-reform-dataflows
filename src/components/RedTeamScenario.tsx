import { useRef, useState } from 'react'
import { appendLedger, getLedgerEntries } from '../lib/ledger'
import { sscReview, type RequestObject } from '../lib/warrant'
import GlossedText from './GlossedText'
import { useI18n } from '../i18n/useI18n'
import type { MessageKey } from '../i18n/messages'

interface Artifact {
  label: string
  json: unknown
}

const MASS_QUERY: RequestObject = {
  caseId: '',
  predicate: 'national_security_broad',
  subjects: ['*'],
  fields: ['all'],
  justification: 'dragnet sweep',
}

const STEP_KEYS = [1, 2, 3, 4, 5, 6]

const FAILED_STEPS = new Set([2, 4])

export default function RedTeamScenario() {
  const { t, lang } = useI18n()
  const [stepIndex, setStepIndex] = useState(0)
  const stepRef = useRef(0)
  const busyRef = useRef(false)
  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  const done = stepIndex >= STEP_KEYS.length
  const blocked = stepIndex >= STEP_KEYS.length

  async function runStep(index: number) {
    switch (index) {
      case 0:
        setArtifact({ label: t('redteam.artifact.massQuery'), json: MASS_QUERY })
        break
      case 2: {
        const decision = await sscReview(MASS_QUERY, 'SIE', lang)
        setArtifact({ label: t('redteam.artifact.sscDecision'), json: { approved: decision.approved, reason: decision.reason } })
        await appendLedger({
          flowType: 'SSC',
          initiator: 'SSC',
          receiver: 'SRI',
          status: 'rejected',
          note: t('redteam.ledger.denied'),
        })
        break
      }
      case 4: {
        await appendLedger({
          flowType: 'T3',
          initiator: 'SRI',
          receiver: 'IADE',
          status: 'rejected',
          note: t('redteam.ledger.denied403'),
        })
        setArtifact({ label: t('redteam.artifact.iade'), json: { status: 403, error: 'invalid_or_missing_warrant_token', logged: true } })
        break
      }
      case 5: {
        const rejected = getLedgerEntries().filter((entry) => entry.status === 'rejected')
        setArtifact({ label: t('redteam.artifact.oversight'), json: rejected.map(({ entryHash: _entryHash, ...rest }) => rest) })
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
    }, 1300)
  }

  function reset() {
    stopTimer()
    stepRef.current = 0
    setStepIndex(0)
    setArtifact(null)
  }

  return (
    <div className="sim redteam shell">
      <div className="sim-head">
        <div>
          <p className="section-label">{t('section.sim')}</p>
          <h2>{t('redteam.title')}</h2>
        </div>
        <div className="sim-actions">
          <span className="sim-progress" id="redteam-progress">
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
        aria-labelledby="redteam-progress"
        aria-valuemin={0}
        aria-valuemax={STEP_KEYS.length}
        aria-valuenow={stepIndex}
      >
        <div className="progress-fill" style={{ width: `${(stepIndex / STEP_KEYS.length) * 100}%` }} />
      </div>
      {blocked && (
        <div className="outcome-banner">{t('redteam.banner')}</div>
      )}
      <div className="sim-body">
        <ol className="timeline">
          {STEP_KEYS.map((key, index) => (
            <li
              key={key}
              aria-current={index === stepIndex ? 'step' : undefined}
              className={
                index < stepIndex
                  ? FAILED_STEPS.has(index)
                    ? 'failed'
                    : 'done'
                  : index === stepIndex
                    ? 'current'
                    : 'pending'
              }
            >
              <div className="timeline-actor">{t(`redteam.s${key}.a` as MessageKey)}</div>
              <div className="timeline-title">
                <GlossedText text={t(`redteam.s${key}.t` as MessageKey)} />
              </div>
              {index <= stepIndex && (
                <div className="timeline-detail">
                  <GlossedText text={t(`redteam.s${key}.d` as MessageKey)} />
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="sim-side">
          <div className="artifact-panel">
            <h3>{artifact ? artifact.label : t('redteam.artifact.pending')}</h3>
            {artifact && <pre className="artifact-json">{JSON.stringify(artifact.json, null, 2)}</pre>}
            {!artifact && <p className="muted">{t('redteam.artifact.pendingHint')}</p>}
          </div>
          <div className="sim-note">
            <GlossedText text={t('redteam.note')} />
          </div>
        </div>
      </div>
    </div>
  )
}
