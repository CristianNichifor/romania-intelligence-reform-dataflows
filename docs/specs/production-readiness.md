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

### UX-5 Animated handshake token — done
- Given the Handshake tab, then a map of the Target-graph actors on the T3–T6 path
  (SRI, IADE, SIE) sits beside the timeline.
- When a step runs a T3–T6 hop, then that edge is highlighted and a token chip
  moves along it.
- Given `prefers-reduced-motion: reduce`, then the edge is highlighted and the chip
  sits still on it, with no animation.
- Test: `tests/e2e/handshake-token.spec.ts`.
- Romanian caption strings (`handshake.map.*`) are agent-written: **needs human review**.

### UX-6 UX guideline and legend semantics — done
- Given `docs/ux-guidelines.md`, then it states the users and top tasks, page
  anatomy, content, data-viz, states, mobile and accessibility rules, the status
  vocabulary, and a conformance checklist where every row names an existing test
  or is listed as a known deviation.
- Given the legend semantics table, then every node colour, glyph, edge colour and
  line style it lists matches `src/data/actors.ts`, `src/lib/graph.ts` and
  `src/components/ActorNode.tsx`.
- Test: docs-only; the checklist rows point at `tests/e2e/*.spec.ts` and
  `src/**/*.test.ts`. Known deviations are backlog, not regressions.

### UX-10 Forced colours (ux-guidelines D6) — done
- Given `forced-colors: active`, then actor nodes have a 2 px CanvasText border,
  edges stroke CanvasText with their audit dash patterns kept, the active tab has
  a 3 px Highlight underline, pressed chips a 2 px Highlight border, and the
  active handshake hop a Highlight stroke at least 4 px wide.
- Test: `tests/e2e/forced-colors.spec.ts` (runs in CI).
- `docs/ux-guidelines.md` D6 can be closed once PR #32, which edits that file, lands.

### UX-7 Distinct audit edge colour (ux-guidelines D4) — done
- Given the current-state graph, then no medium-audit edge shares a colour with
  any current-state node (medium audit is green, not the oversight yellow), and
  the legend's line samples use the edge colours.
- Test: `src/lib/graph.test.ts`.
- `docs/ux-guidelines.md` D4 can be closed once PR #32, which edits that file, lands.

### UX-11 Empty filter message (ux-guidelines D11) — done
- Given a search or chip filter that leaves no actors, then the graph or list
  shows a status message saying nothing matches and how to widen the filter.
- Given a phone list whose shown actors have no flows between them, then it says
  so instead of showing an empty list.
- Romanian copy is agent-written: **needs human review**.
- Test: `tests/e2e/empty-filter.spec.ts` (runs in CI).

### UX-9 Romanian diagram labels (ux-guidelines D10) — done
- Given every `diagrams/*.mmd`, then `diagrams/ro/` has a file with the same
  name whose graph (node ids, edges, classes) matches line for line and whose
  labels are Romanian with comma-below ș and ț.
- Given the Governance tab in RO, then the diagrams render from `diagrams/ro/`.
- Translations are agent-written: **needs human review**. The English edge
  "AG supervises CSAT" reads inverted; the Romanian says "supravegheat de"
  (supervised by): **needs human check**.
- Test: `src/components/diagrams.test.ts`.

### UX-12 Governance diagram states in the app language — done
- Given the Governance tab, while a diagram renders, then its card shows a
  `role="status"` "Se pregătește diagrama…" that goes away once the SVG is in.
- Given a diagram that fails to render, then its card keeps the title and shows a
  `role="alert"` message that the document text is still below, with "Reîncercați".
- Given RO, then the zoom controls are labelled "Mărește", "Micșorează" and
  "Resetează vederea".
- Copy is agent-written (from the DS-1 states card): **needs human review**.
- Test: `tests/e2e/governance-states.spec.ts` (the failure case blocks Mermaid's
  flowchart chunk).

### UX-13 Copy rules enforced in tests — done
- Given any UI message (EN or RO), then it has no `TODO`/`TBD`/`lorem` and no
  internal spec ID (`INT-n`, `UX-n`, `DS-n`); flow IDs stay allowed.
- Given any Romanian text in messages, `src/data`, `diagrams/ro` or `docs/ro`,
  then it uses comma-below ș ț, never cedilla ş ţ.
- Test: `src/i18n/copyRules.test.ts`, `tests/unit/diacritics.test.mjs`.

## Theme F: design screens (target state for implementation)

Static mockups under `docs/design/screens/`, indexed by `docs/design/README.md`.
Each item below is an acceptance criterion an implementation PR turns into a test.
Romanian copy in the mockups is agent-written: **needs human review**.

### DS-1 Overview first screen — done (status badge: owner decision)
- Given the Overview, then a family bar (hub link "Proiecte civice", tool name
  "Fluxuri de date", badge "Date demonstrative", language switch) sits above the
  H1; the H1 is the registry name; a one-line purpose and a `Date: sursă, an`
  provenance line with `DATASET_AS_OF` follow before any control.
- Given the stat row, then the counts come from the data (13/14/15/33/6) and each
  tile names its scope.
- Mockup: `docs/design/screens/01-overview.html`. Test to add: `tests/e2e/names.spec.ts`
  (H1, title, family bar, provenance line); closes D1, D2.
- Landed: hub link (#44), registry H1 and title (#48), provenance line (#35),
  tool name "Fluxuri de date" in the family bar, the purpose line, and stat
  tiles that name their scope (`tests/e2e/names.spec.ts`). Open: the badge
  "Date demonstrative" waits on the owner's call on the classification strip.
  Purpose line and tile labels are agent-written: **needs human review**.

### DS-2 Graph legend explains every channel — done
- Given either graph, then the legend lists node glyph + category, the three line
  styles (current) and the edge-colour clusters (target), each with the flow IDs it
  covers; an "Afișează ca tabel" link opens the list view at any width.
- Given a filter with no match, then an empty state names the filter and offers
  "Șterge filtrele".
- Mockup: `02-graph.html`. Test: extend `tests/e2e/graph-ux.spec.ts`; closes D3, D11.
- Landed: legend glyphs, line-style and edge-colour flow IDs (`src/lib/legend.ts`,
  `tests/e2e/graph-ux.spec.ts`); the Graf/Listă toggle at every width and a
  "Șterge filtrele" button in the empty state that clears the search and shows
  every category; the empty state repeats the search text
  (`tests/e2e/empty-filter.spec.ts`); the target view says it opens on agencies
  and the broker and how many actors are hidden (`tests/e2e/graph-ux.spec.ts`). "Șterge filtrele" and
  `explorer.emptyQuery` are agent-written: **needs human review**.

### DS-3 Mobile list is the table alternative — done
- Given 390 px, then each list item shows ID, source → destination, data type,
  legal basis, audit level with its line-style swatch, risk, and sources; no
  horizontal overflow; chips and toggles ≥ 44 px.
- Mockup: `03-mobile-list.html`. Test: extend `tests/e2e/mobile-list.spec.ts`.
- Landed: risk and audit line swatch per row (#45), 44 px chips, the empty
  states (UX-11, DS-2), a count line "5 din 14 fluxuri" and a left edge in
  the destination's category colour beside its name
  (`tests/e2e/mobile-list.spec.ts`, `src/i18n/count.test.ts`). No error state:
  the list reads bundled data and cannot fail to load.

### DS-4 Flow detail with sources — done
- Given a selected flow, then the panel shows the route with glyphs, the key/value
  table, the description, every source with host and checked date, and the
  no-verified-source state (C10) with a link to `ERRATA.md`; target flows carry
  the "propunere" note.
- Mockup: `04-flow-detail.html`. Test: extend `tests/e2e/provenance.spec.ts`.
- Landed: sources with host and checked date (`src/lib/sourceMeta.ts`); the
  no-verified-source state as a `role="status"` block linking `ERRATA.md`; a
  proposal note on target flows only; the selected edge stays at full weight
  while the others fade to 40 %; a route row with each end's category glyph
  (`tests/e2e/provenance.spec.ts`).

### DS-5 Handshake controls and states — done
- Given the Handshake, then controls are ≥ 44 px, the progress bar is a
  `progressbar` with values, the current step has `aria-current="step"`, the map
  caption names the active hop, and reduced motion parks the token.
- Mockup: `05-handshake.html`. Test: extend `tests/e2e/handshake-token.spec.ts`.
- Landed in #42 and UX-5: 44 px controls, `progressbar` with values,
  `aria-current="step"`, the map caption names the active hop, and reduced
  motion parks the token (`tests/e2e/handshake-token.spec.ts`).

### DS-6 Theme alignment — needs-human
- The mockups use light civic-ui page chrome with a dark graph canvas (fleet
  default, D5). Whether the app moves from dark-only to this is the owner's call.

## Out of scope here

### INT-10 Retire the GitHub Pages deploy — needs-human
Workflow-only. Open as PR #21 (`chore/retire-github-pages`, redirect stub). The
maintainer decides whether the github.io copy stays.
