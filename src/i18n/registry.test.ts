import { describe, expect, it } from 'vitest'
import { translate } from './messages'
import html from '../../index.html?raw'

// civic-ui docs/ux-guidelines.md § 9: the hub card, <title> and H1 use one name.
const NAME = { ro: 'Fluxuri de date pentru reforma serviciilor de informații', en: 'Intelligence Reform Data Flows' }

describe('naming registry', () => {
  it('uses the hub name for the H1 and the document title', () => {
    for (const lang of ['ro', 'en'] as const) {
      expect(translate('header.title', lang)).toBe(NAME[lang])
      expect(translate('app.title', lang)).toBe(NAME[lang])
    }
  })

  it('ships the English name in the static page head', () => {
    expect(html).toContain(`<title>${NAME.en}</title>`)
    expect(html).toContain(`<meta property="og:title" content="${NAME.en}" />`)
  })
})
