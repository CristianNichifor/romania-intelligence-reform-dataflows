export const REPO_URL = 'https://github.com/CristianNichifor/romania-intelligence-reform-dataflows'
export const ERRATA_URL = `${REPO_URL}/blob/main/ERRATA.md`
export const DOCS_URL = `${REPO_URL}/tree/main/docs`

/** The site a source link points at, without "www.", so the panel can show where a reader will land. */
export function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
