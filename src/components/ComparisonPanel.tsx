import GlossedText from './GlossedText'
import ScrollTable from './ScrollTable'
import { institutionComparison, internationalSystems, swotComparison } from '../data/comparison'
import { useI18n } from '../i18n/useI18n'
import { pick } from '../i18n/messages'

export default function ComparisonPanel() {
  const { t, lang } = useI18n()

  return (
    <div className="shell">
      <section className="card accent-left">
        <p className="section-label">{t('section.comparison')}</p>
        <h2>{t('compare.title')}</h2>
        <p>
          <GlossedText text={t('compare.intro')} />
        </p>
      </section>

      <section className="card">
        <p className="section-label">{t('section.comparison')}</p>
        <h3>{t('nav.compare')}</h3>
        <ScrollTable label={t('nav.compare')}>
          <table className="kv-table wide compare-table stack">
            <thead>
              <tr>
                <th>{t('compare.h.institution')}</th>
                <th>{t('compare.h.today')}</th>
                <th>{t('compare.h.proposal')}</th>
              </tr>
            </thead>
            <tbody>
              {institutionComparison.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.id}</strong>
                    {row.isNew && <span className="pill-new">{t('compare.new')}</span>}
                    <div className="muted">{pick(row.full, lang)}</div>
                  </td>
                  <td data-label={t('compare.h.today')}><GlossedText text={pick(row.today, lang)} /></td>
                  <td data-label={t('compare.h.proposal')}><GlossedText text={pick(row.proposal, lang)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>
      </section>

      <section className="card">
        <p className="section-label">{t('section.comparison')}</p>
        <h3>{t('compare.swot.title')}</h3>
        <ScrollTable label={t('compare.swot.title')}>
          <table className="kv-table wide compare-table stack">
            <thead>
              <tr>
                <th>{t('compare.swot.h.dimension')}</th>
                <th>{t('compare.swot.h.current')}</th>
                <th>{t('compare.swot.h.proposal')}</th>
              </tr>
            </thead>
            <tbody>
              {swotComparison.map((row) => (
                <tr key={row.key}>
                  <td><strong>{t(`compare.swot.${row.key}` as const)}</strong></td>
                  <td data-label={t('compare.swot.h.current')}><GlossedText text={pick(row.current, lang)} /></td>
                  <td data-label={t('compare.swot.h.proposal')}><GlossedText text={pick(row.proposal, lang)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>
      </section>

      <section className="card">
        <p className="section-label">{t('section.comparison')}</p>
        <h3>{t('compare.intl.title')}</h3>
        <p className="muted">
          <GlossedText text={t('compare.intl.note')} />
        </p>
        <ScrollTable label={t('compare.intl.title')}>
          <table className="kv-table wide compare-table stack">
            <thead>
              <tr>
                <th>{t('compare.intl.h.country')}</th>
                <th>{t('compare.intl.h.model')}</th>
                <th>{t('compare.intl.h.lesson')}</th>
              </tr>
            </thead>
            <tbody>
              {internationalSystems.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.id}</strong>
                    <div className="muted">{pick(row.country, lang)}</div>
                  </td>
                  <td data-label={t('compare.intl.h.model')}><GlossedText text={pick(row.model, lang)} /></td>
                  <td data-label={t('compare.intl.h.lesson')}><GlossedText text={pick(row.lesson, lang)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>
      </section>
    </div>
  )
}
