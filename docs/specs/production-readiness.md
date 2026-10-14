# Production readiness

Status of the work that makes the demo fit to publish under
`https://projects.cristian-nichifor.com/romania-intelligence-reform-dataflows/`.
Every item names the test that proves it. `npm run verify` runs all of them.

Status values: **todo**, **done**, **blocked**, **needs-human**.

## Theme A: baseline

### INT-1 Assets resolve under the base path — todo
- Given the production build under `/romania-intelligence-reform-dataflows/`,
  when `dist/index.html` is read, then no `href` or `src` starts with `/` unless
  it starts with the base path.
- Given the built site served under the base path, when the page loads, then every
  same-origin request answers 200 (the favicon included).
- Test: `tests/e2e/base-path.spec.ts`.

### INT-2 `<html lang>` follows the language — todo
- Given a browser whose stored language is `ro`, when the page first loads, then
  `document.documentElement.lang` is `ro`.
- Given the page in English, when the visitor picks RO, then `lang` becomes `ro`,
  and back to `en` when they pick EN.
- Test: `tests/e2e/i18n.spec.ts`.

### INT-6 Fonts are self-hosted — todo
- Given the app loads and every tab is opened, when network requests are
  recorded, then none goes to a third-party origin.
- Given the build, then IBM Plex Sans, IBM Plex Mono and Space Grotesk ship from
  `@fontsource/*` packages in `dist/assets`.
- Test: `tests/e2e/base-path.spec.ts` (no third-party origins).

### INT-9 Social and canonical metadata — todo
- Given `dist/index.html`, then it has `og:title`, `og:description`, `og:type`,
  `og:url`, `og:image` (absolute URL to `og.png`, 1200×630) and
  `<link rel="canonical" href="https://projects.cristian-nichifor.com/romania-intelligence-reform-dataflows/">`.
- Given the served site, then `og.png` answers 200 as `image/png`.
- Test: `tests/e2e/base-path.spec.ts`.

## Theme B: security and accessibility

### INT-8 Security headers and strict Mermaid — todo
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

### INT-7 Accessible navigation and graph controls — todo
- Given the main navigation, then it is a `tablist` whose items are `tab`s with
  `aria-selected` on the current view and `aria-controls` pointing at the
  `tabpanel`.
- Given the graph views, then the search box, category filters (with
  `aria-pressed`) and the legend toggle (with `aria-expanded`) have accessible names.
- Given each view in EN, when axe runs (WCAG 2 A/AA rules), then it reports 0
  violations.
- Test: `tests/e2e/a11y.spec.ts`.

## Theme C: provenance

### INT-4 Flow sources — todo
- Given every flow, then it has `sources: {title, url, accessed}[]` with at least
  one entry, each URL valid `https:`, `accessed` an ISO date; or it is listed as
  needs-human with the reason.
- Given the dataset, then it exports `asOf` (ISO date).
- Given a selected flow, when the detail panel opens, then it lists its sources as
  links.
- Tests: `src/data/flows.test.ts`, `tests/e2e/provenance.spec.ts`.

### INT-5 Errata — todo
- Given the repo, then `ERRATA.md` explains how to report a correction and logs
  corrections.
- Given the footer, then a "corrections" link points at `ERRATA.md` on GitHub.
- Test: `tests/e2e/provenance.spec.ts`.

## Theme D: Romanian governance docs

### INT-3 Romanian docs 14–19 — todo
- Given every English governance doc `docs/14-19`, then `docs/ro/` has a file
  with the same name.
- Given the Governance tab in RO, then the documents render from `docs/ro/`, their
  headings come from i18n keys, and `gov.langNote` no longer says "(în engleză)".
- Translations are machine-assisted: **needs human review**.
- Tests: `src/components/governanceDocs.test.ts`, `tests/e2e/i18n.spec.ts`.

## Out of scope here

### INT-10 Retire the GitHub Pages deploy — needs-human
Workflow-only. Open as PR #21 (`chore/retire-github-pages`, redirect stub). The
maintainer decides whether the github.io copy stays.
