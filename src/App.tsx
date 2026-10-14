import { useEffect, useState } from 'react'
import ComparisonPanel from './components/ComparisonPanel'
import FlowExplorer from './components/FlowExplorer'
import GlossedText from './components/GlossedText'
import GovernancePanel from './components/GovernancePanel'
import HandshakeSim from './components/HandshakeSim'
import LedgerViewer from './components/LedgerViewer'
import OversightDashboard from './components/OversightDashboard'
import RedTeamScenario from './components/RedTeamScenario'
import { currentActors, targetActors } from './data/actors'
import { currentFlows, targetFlows } from './data/flows'
import { useI18n } from './i18n/useI18n'
import type { MessageKey } from './i18n/messages'
import type { GraphMode } from './lib/graph'
import { seedLedger } from './lib/ledger'
import { DOCS_URL, ERRATA_URL, HUB_URL } from './lib/links'
import './familyBar.css'
import { provenanceLine } from './lib/provenance'
import { DATASET_AS_OF } from './data/sources'

type View =
  | 'overview'
  | 'current'
  | 'target'
  | 'handshake'
  | 'redteam'
  | 'dashboard'
  | 'ledger'
  | 'compare'
  | 'governance'

const NAV: Array<{ id: View; labelKey: MessageKey }> = [
  { id: 'overview', labelKey: 'nav.overview' },
  { id: 'current', labelKey: 'nav.current' },
  { id: 'target', labelKey: 'nav.target' },
  { id: 'handshake', labelKey: 'nav.handshake' },
  { id: 'redteam', labelKey: 'nav.redteam' },
  { id: 'dashboard', labelKey: 'nav.oversight' },
  { id: 'ledger', labelKey: 'nav.ledger' },
  { id: 'compare', labelKey: 'nav.compare' },
  { id: 'governance', labelKey: 'nav.governance' },
]

function parseHash(): View {
  const view = window.location.hash.replace(/^#\/?/, '') as View
  return NAV.some((item) => item.id === view) ? view : 'overview'
}

function Overview() {
  const { t } = useI18n()
  const principles = [1, 2, 3, 4, 5, 6].map((index) => ({
    title: t(`principles.p${index}.t` as MessageKey),
    implication: t(`principles.p${index}.i` as MessageKey),
  }))
  return (
    <div className="shell">
      <section className="card accent-left">
        <p className="section-label">{t('section.mission')}</p>
        <h2>{t('overview.mission.title')}</h2>
        <p>
          <GlossedText text={t('overview.mission.p1')} />
        </p>
        <p className="muted">
          <GlossedText text={t('overview.mission.p2')} /> {t('overview.mission.docs')}{' '}
          <a href={DOCS_URL} target="_blank" rel="noreferrer">
            <code>docs/</code>
          </a>
          .
        </p>
      </section>

      <div className="stat-row">
        <div className="stat">
          <div className="stat-value">{currentActors.length}</div>
          <div className="stat-label">{t('stat.currentActors')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{currentFlows.length}</div>
          <div className="stat-label">{t('stat.currentFlows')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{targetActors.length}</div>
          <div className="stat-label">{t('stat.targetActors')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{targetFlows.length}</div>
          <div className="stat-label">{t('stat.targetFlows')}</div>
        </div>
        <div className="stat">
          <div className="stat-value ok">
            {currentFlows.filter((flow) => flow.audit?.en === 'Very low' || flow.audit?.en === 'None').length}
          </div>
          <div className="stat-label">{t('stat.baselineRisky')}</div>
        </div>
      </div>

      <section className="card">
        <p className="section-label">{t('section.principles')}</p>
        <h3>{t('principles.title')}</h3>
        <div className="table-scroll">
          <table className="kv-table wide">
            <thead>
              <tr>
                <th>{t('principles.h.principle')}</th>
                <th>{t('principles.h.implication')}</th>
              </tr>
            </thead>
            <tbody>
              {principles.map((principle) => (
                <tr key={principle.title}>
                  <td><strong><GlossedText text={principle.title} /></strong></td>
                  <td><GlossedText text={principle.implication} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="dash-grid">
        <section className="card">
          <p className="section-label">{t('section.baseline')}</p>
          <h3>{t('overview.current.title')}</h3>
          <ul className="plain-list">
            {[1, 2, 3, 4, 5].map((index) => (
              <li key={index}>
                <GlossedText text={t(`overview.current.i${index}` as MessageKey)} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <p className="section-label">{t('section.reform')}</p>
          <h3>{t('overview.target.title')}</h3>
          <ul className="plain-list">
            {[1, 2, 3, 4, 5].map((index) => (
              <li key={index}>
                <GlossedText text={t(`overview.target.i${index}` as MessageKey)} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card">
        <p className="section-label">{t('section.tour')}</p>
        <h3>{t('overview.tour.title')}</h3>
        <ol className="plain-list">
          {[1, 2, 3, 4, 5].map((index) => (
            <li key={index}>
              <GlossedText text={t(`overview.tour.i${index}` as MessageKey)} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="lang-toggle" role="group" aria-label={t('lang.toggle')}>
      {(['en', 'ro'] as const).map((code) => (
        <button
          key={code}
          className={lang === code ? 'lang-btn active' : 'lang-btn'}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const { lang, t } = useI18n()
  const [view, setView] = useState<View>(parseHash)

  useEffect(() => {
    void seedLedger(lang)
  }, [lang])

  useEffect(() => {
    const onHash = () => setView(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function navigate(next: View) {
    window.location.assign(`#/${next}`)
    setView(next)
  }

  // Arrow keys, Home and End move between tabs and open the focused one.
  function onNavKey(event: React.KeyboardEvent<HTMLElement>) {
    const index = NAV.findIndex((item) => item.id === view)
    const moves: Record<string, number> = {
      ArrowRight: (index + 1) % NAV.length,
      ArrowLeft: (index - 1 + NAV.length) % NAV.length,
      Home: 0,
      End: NAV.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = NAV[moves[event.key]].id
    navigate(next)
    document.getElementById(`tab-${next}`)?.focus()
  }

  let content: React.ReactNode
  switch (view) {
    case 'current':
      content = <FlowExplorer mode={'current' satisfies GraphMode} key="current" />
      break
    case 'target':
      content = <FlowExplorer mode={'target' satisfies GraphMode} key="target" />
      break
    case 'handshake':
      content = <HandshakeSim />
      break
    case 'redteam':
      content = <RedTeamScenario />
      break
    case 'dashboard':
      content = <OversightDashboard />
      break
    case 'ledger':
      content = <LedgerViewer />
      break
    case 'compare':
      content = <ComparisonPanel />
      break
    case 'governance':
      content = <GovernancePanel />
      break
    default:
      content = <Overview />
  }

  return (
    <div className="app">
      <div className="class-strip">
        <div className="class-strip-inner">
          <nav className="family-bar" aria-label={t('family.label')}>
            <a href={HUB_URL}>
              <span aria-hidden="true">←</span> {t('family.home')}
            </a>
          </nav>
          <span className="live-dot" />
          <span>{t('class.demo')}</span>
          <span className="spacer" />
          <span>{t('class.simulated')}</span>
        </div>
      </div>
      <header className="app-header">
        <div className="header-row">
          <div className="app-title">
            <div className="kicker">{t('header.kicker')}</div>
            <h1>{t('header.title')}</h1>
            <div className="header-meta">{provenanceLine(lang, DATASET_AS_OF)}</div>
          </div>
          <div className="header-side">
            <span className="header-meta">{t('header.meta')}</span>
            <LanguageToggle />
          </div>
        </div>
        <nav className="app-nav" role="tablist" aria-label={t('nav.label')} onKeyDown={onNavKey}>
          {NAV.map((item, index) => (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={view === item.id}
              aria-controls="view-panel"
              tabIndex={view === item.id ? 0 : -1}
              className={view === item.id ? 'nav-btn active' : 'nav-btn'}
              onClick={() => navigate(item.id)}
            >
              <span className="idx" aria-hidden="true">{String(index).padStart(2, '0')}</span>
              {t(item.labelKey)}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <div id="view-panel" role="tabpanel" aria-labelledby={`tab-${view}`} tabIndex={0}>
          {content}
        </div>
      </main>
      <footer className="app-footer">
        <div className="app-footer-inner">
          <span>romania-intelligence-reform-dataflows</span>
          <a href="https://github.com/CristianNichifor/romania-intelligence-reform-dataflows" target="_blank" rel="noreferrer">
            source ↗
          </a>
          <a href={ERRATA_URL} target="_blank" rel="noreferrer">
            {t('footer.corrections')} ↗
          </a>
          <span>{t('footer.tag')}</span>
        </div>
      </footer>
    </div>
  )
}
