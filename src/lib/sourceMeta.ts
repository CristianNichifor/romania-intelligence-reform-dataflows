import type { Source } from '../data/types'

/** "legislatie.just.ro · 2026-10-14": where a source lives and when it was last checked. */
export function sourceMeta(source: Source): string {
  return `${new URL(source.url).hostname.replace(/^www\./, '')} · ${source.accessed}`
}
