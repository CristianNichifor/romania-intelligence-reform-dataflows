import type { ActorCategory } from '../data/types'

/** Category shapes drawn on the nodes and in the legend, so category reads without colour. */
export const CATEGORY_GLYPHS: Record<ActorCategory, string> = {
  executive: '▲',
  agency: '◆',
  judicial: '§',
  oversight: '●',
  civilian: '◇',
  broker: '▦',
  justice: '¶',
  public: '◎',
}
