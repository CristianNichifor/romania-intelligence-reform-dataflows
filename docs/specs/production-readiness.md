# Production readiness

Status of the work that makes the demo fit to publish under
`https://projects.cristian-nichifor.com/romania-intelligence-reform-dataflows/`.
Every item names the test that proves it. `npm run verify` runs all of them.

Status values: **todo**, **done**, **blocked**, **needs-human**.

## Theme A: baseline

### INT-1 Assets resolve under the base path — done
- Given the production build under `/romania-intelligence-reform-dataflows/`,
  when `dist/index.html` is read, then no `href` or `src` starts with `/` unless
  it starts with the base path.
- Given the built site served under the base path, when the page loads, then every
  same-origin request answers 200 (the favicon included).
- Test: `tests/e2e/base-path.spec.ts`.

### INT-2 `<html lang>` follows the language — done
- Given a browser whose stored language is `ro`, when the page first loads, then
  `document.documentElement.lang` is `ro`.
- Given the page in English, when the visitor picks RO, then `lang` becomes `ro`,
  and back to `en` when they pick EN.
- Test: `tests/e2e/i18n.spec.ts`.

### INT-6 Fonts are self-hosted — done
- Given the app loads and every tab is opened, when network requests are
  recorded, then none goes to a third-party origin.
- Given the build, then IBM Plex Sans, IBM Plex Mono and Space Grotesk ship from
  `@fontsource/*` packages in `dist/assets`.
- Test: `tests/e2e/base-path.spec.ts` (no third-party origins).

### INT-9 Social and canonical metadata — done
- Given `dist/index.html`, then it has `og:title`, `og:description`, `og:type`,
  `og:url`, `og:image` (absolute URL to `og.png`, 1200×630) and
  `<link rel="canonical" href="https://projects.cristian-nichifor.com/romania-intelligence-reform-dataflows/">`.
- Given the served site, then `og.png` answers 200 as `image/png`.
- Test: `tests/e2e/base-path.spec.ts`.

## Theme B: security and accessibility

### INT-8 Security headers and strict Mermaid — done
- Given `public/_headers`, then it sets a `Content-Security-Policy` with
  `default-src 'self'`, no third-party origins and `object-src 'none'`,
  plus `X-Content-Type-Options: nosniff`, `Referrer-Policy` and `frame-ancestors`.
- Given the app served with that CSP (the e2e server applies the file), when every
  tab is opened, then the console reports no CSP violation.
- Given Mermaid, then `securityLevel` is `'strict'` and the four governance
  diagrams still render.
- Tests: `src/lib/headers.test.ts`, `tests/e2e/readiness.spec.ts`,
  `tests/e2e/a11y.spec.ts` (CSP violations).
- Deploy note: the Cloudflare workflow stages `dist/` under
  `site/<project>/`; Pages reads `_headers` only at the output root, so the
  workflow must move it (diff in the PR, **needs-human**).

### INT-7 Accessible navigation and graph controls — done
- Given the main navigation, then it is a `tablist` whose items are `tab`s with
  `aria-selected` on the current view and `aria-controls` pointing at the
  `tabpanel`.
- Given the graph views, then the search box, category filters (with
  `aria-pressed`) and the legend toggle (with `aria-expanded`) have accessible names.
- Given each view in EN, when axe runs (WCAG 2 A/AA rules), then it reports 0
  violations.
- Test: `tests/e2e/a11y.spec.ts`.

## Theme C: provenance

### INT-4 Flow sources — done (C10 needs-human)
- Given every flow, then it has `sources: {title, url, accessed}[]` with at least
  one entry, each URL valid `https:`, `accessed` an ISO date; or it is listed as
  needs-human with the reason.
- Given the dataset, then it exports `asOf` (ISO date).
- Given a selected flow, when the detail panel opens, then it lists its sources as
  links.
- Tests: `src/data/flows.test.ts`, `tests/e2e/provenance.spec.ts`.
- Sources live in `src/data/sources.ts`, all checked 2026-10-14. Romanian acts
  were matched to their legislatie.just.ro pages by the portal's own titles
  (the portal refuses scripted requests, so a person should open each once):
  **needs-human spot check**. C10 ("narratives" to the public) has no public
  source and is listed in `ERRATA.md`: **needs-human**.

### INT-5 Errata — done
- Given the repo, then `ERRATA.md` explains how to report a correction and logs
  corrections.
- Given the footer, then a "corrections" link points at `ERRATA.md` on GitHub.
- Test: `tests/e2e/provenance.spec.ts`.

## Theme D: Romanian governance docs

### INT-3 Romanian docs 14–19 — done (translation needs human review)
- Given every English governance doc `docs/14-19`, then `docs/ro/` has a file
  with the same name.
- Given the Governance tab in RO, then the documents render from `docs/ro/`, their
  headings come from i18n keys, and `gov.langNote` no longer says "(în engleză)".
- Translations are machine-assisted: **needs human review**. Diagram labels
  (`diagrams/*.mmd`) stay in English.
- Tests: `src/components/governanceDocs.test.ts`, `tests/e2e/i18n.spec.ts`.

## Theme E: graph usability (UX review)

### UX-1 Readable target graph — done
- Given the Target State view, when it opens, then only Agencies and Broker are
  shown, zoom is at least 0.6, and "Show all" reveals all 15 actors.
- Given either graph, then there is no minimap and no attribution badge.
- Test: `tests/e2e/graph-ux.spec.ts`.

### UX-2 Legend and non-colour edge encoding — done
- Given a graph view, then the legend starts open.
- Given current-state flows, then line style encodes the audit trail: solid
  (medium), dashed (low), dotted (very low or none).
- Test: `tests/e2e/graph-ux.spec.ts`.

### UX-3 Overview docs link and phone footer — done
- Given the Overview, then `docs/` links to the docs folder on GitHub.
- Given a 390 px wide screen, then the footer sits below the content, not pinned.
- Test: `tests/e2e/graph-ux.spec.ts`.

### UX-4 Mobile list view — done
- Given a screen narrower than 640 px, when a graph view opens, then the flows
  show as a list (source actor → destination actor, data type, legal basis,
  audit level, sources) and a "List/Graph" ("Listă/Graf") toggle switches to the
  graph and back.
- Given the list, then the search box and category chips filter it like the graph.
- Given the list at 390 px, then axe reports no WCAG 2.1 AA violations.
- Test: `tests/e2e/mobile-list.spec.ts`.
- New Romanian labels (Listă, Graf, Fluxuri, Vizualizare) are agent-written: **needs human review**.

### UX-5 Animated handshake token — todo
- Given the Handshake tab, then a map of the Target-graph actors on the T3–T6 path
  (SRI, IADE, SIE) sits beside the timeline.
- When a step runs a T3–T6 hop, then that edge is highlighted and a token chip
  moves along it.
- Given `prefers-reduced-motion: reduce`, then the edge is highlighted and the chip
  sits still on it, with no animation.
- Test: `tests/e2e/handshake-token.spec.ts`.

## Out of scope here

### INT-10 Retire the GitHub Pages deploy — needs-human
Workflow-only. Open as PR #21 (`chore/retire-github-pages`, redirect stub). The
maintainer decides whether the github.io copy stays.
