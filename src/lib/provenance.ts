import { translate, type Language } from '../i18n/messages'

const DATE_LOCALES: Record<Language, string> = { ro: 'ro-RO', en: 'en-GB' }

// The "Date: <sursă>, <an>" line under the H1; the date is when the source links were last
// checked (DATASET_AS_OF), not the build date.
export function provenanceLine(lang: Language, asOf: string): string {
  const date = new Date(`${asOf}T00:00:00Z`).toLocaleDateString(DATE_LOCALES[lang], {
    day: lang === 'ro' ? '2-digit' : 'numeric',
    month: lang === 'ro' ? '2-digit' : 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return translate('header.provenance', lang, { date })
}
