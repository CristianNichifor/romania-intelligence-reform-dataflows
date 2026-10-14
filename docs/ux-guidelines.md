# UX guidelines

The rules every screen of this demo follows. They refine the fleet guideline in
civic-ui `docs/ux-guidelines.md` for one product: a dark, in-browser simulation of
data flows between Romanian intelligence, oversight, judicial and civilian
institutions. Where this file and `docs/00-design-principles.md` overlap, the
design principles govern the reform; this file governs the interface.

## 1. Users and top tasks

| User | Top task |
|---|---|
| Journalist, student, interested citizen | See who sends what data to whom today, and what the reform changes |
| Legislator or adviser | Check one flow: legal basis, audit level, sources |
| Oversight or civil-society reviewer | Follow a warrant through the target-state handshake and its audit trail |
| Technical reviewer | Inspect the ledger, the red-team scenario and the governance documents |

The one job of the first screen (Overview): say in two sentences that this is a
**simulation, not real systems**, and send the visitor to *Current state* and
*Target state*. The stat row (actors, flows, baseline high-risk flows) is the
evidence; the suggested route is the call to action.

## 2. Page anatomy

Top to bottom, on every tab:

1. Classification strip — `DEMO // UNCLASSIFIED` · `SIMULATED DATA — NO REAL SYSTEMS`
   (`class.demo`, `class.simulated`). It is the status badge; never remove it.
2. Family bar — "← Proiecte civice" / "← Civic projects" to the hub root, at the start of
   the classification strip (`src/familyBar.css`); civic-ui `FamilyBar` once adopted.
3. Header: kicker, H1 (`header.title`), language toggle EN/RO.
4. Provenance line under the H1: `Date: <sursă>, <an>` / `Data: <source>, <year>`
   built from `DATASET_AS_OF` in `src/data/sources.ts` by `src/lib/provenance.ts`.
5. Tab list (`role="tablist"`, arrow keys, Home/End) → one tab panel.
6. Primary task of the tab (graph, handshake timeline, ledger table…), then
   secondary views (detail panel, legend, filters).
7. Footer: repository (source), corrections log (`ERRATA.md`), and the disclaimer
   `no real data · no real systems · no legal advice`.

## 3. Content rules

- Romanian uses comma-below **ș ț** (never cedilla ş ţ). Every user-facing string
  lives in `src/i18n/messages.ts` with both `en` and `ro`; no literals in
  components.
- Dates: ISO `YYYY-MM-DD` for source-checked dates (they are audit data); times
  and human dates use the active app language (`ro-RO` / `en-GB`), not the
  browser default.
- Numbers: counts only; `ro-RO` grouping if counts ever exceed 999.
- Abbreviations: institution acronyms (SRI, SIE, SPP, STS, CSAT, DIICOT, ICCJ,
  ANSPDCP, DNSC, IADE, SSC, IG, JPC, ITAP) are wrapped by `GlossedText` /
  `Term` so each has a glossary tooltip (`src/data/glossary.ts`).
- Tone: neutral, descriptive, no accusation of real people or services. Target
  state is always "proposal", never "the law".
- Banned in UI copy: internal IDs as prose (`INT-…`, `UX-…`), `TODO`, `lorem`,
  "production", "real-time", "secure" without qualification, "legal advice".
  Flow IDs (C6, T3, W1) are allowed: they are labels the docs share.

## 4. Data-viz rules

### Legend semantics (source of truth: the code)

Nodes (`src/components/ActorNode.tsx`, `src/data/actors.ts`): colour bar + border
+ glyph. The **glyph** carries the category without colour.

| Category | Glyph | Target-state colour | Current-state colour |
|---|---|---|---|
| executive | ▲ | slate `#94a3b8` | same |
| agency | ◆ | red `#f87171` | red `#ef4444` |
| judicial | § | green `#4ade80` | purple `#c084fc` |
| oversight | ● | pink `#f472b6` | yellow `#facc15` |
| civilian | ◇ | teal `#2dd4bf` | same |
| broker (IADE) | ▦ | blue `#60a5fa` | — (absent today) |
| justice | ¶ | purple `#c084fc` | same |
| public | ◎ | slate `#94a3b8` | same |

Edges (`src/lib/graph.ts`):

- **Current state** — colour and line style both encode the audit trail:
  solid yellow `#facc15` = medium/audited; dashed (`7 4`) amber `#f59e0b` = low;
  dotted (`2 4`) red `#ef4444` = very low or none. Line style alone must be
  enough to read it.
- **Target state** — all lines solid; colour names the counterpart cluster:
  green `#4ade80` = warrant request/return (W1, W2); blue `#60a5fa` = via the IADE
  broker; pink `#f472b6` = oversight (IG, JPC, ITAP, OMB, ANSPDCP); teal
  `#2dd4bf` = DNSC; purple `#c084fc` = DIICOT/ICCJ (justice); slate `#94a3b8` =
  CSAT/President. Every edge also carries its flow ID label, and the detail panel
  names both endpoints, so colour is never the only channel.

### General rules

- Colour is never the only channel: glyphs on nodes, dash on edges, text labels
  (flow ID) on every edge, and the list view (`< 640 px`) as the table
  alternative.
- Prefer the civic-ui colour-blind-safe viz palette when the theme is aligned
  (backlog D5); until then keep the hex values above in one place per concept.
- No dual axes, no 3-D, no animation that carries meaning on its own (the
  handshake token has a reduced-motion still state).
- Every flow shows its sources with the checked date; a flow without a verified
  source says "No verified source yet" — never hide the gap.
- Status badge: the classification strip marks the whole app as **Demo data**.

## 5. States

- Loading: the app is static and in-memory; Mermaid diagrams on Governance render
  client-side — show the card frame immediately, diagram fills in. Anything over
  2 s needs a staged message.
- Empty: a filter with no matching flows must say so and offer to clear filters
  (backlog D11); an empty ledger already says how to fill it (`ledger.empty`).
- Error: a diagram or ledger verification failure shows a readable message in
  place, never a blank card; ledger verification states are text, not colour.
- Demo data: always — see the classification strip and footer disclaimer.

## 6. Mobile, touch and accessibility

- 390 px: graphs open as the flow list with a List/Graph toggle
  (`tests/e2e/mobile-list.spec.ts`); the tab list scrolls horizontally; the footer
  scrolls with the page; no horizontal page scroll.
- Touch targets ≥ 24 px, 44 px preferred (tab buttons, chips, legend toggle,
  language toggle).
- WCAG 2.1 AA: axe reports 0 violations on every tab (desktop and 390 px list).
- Keyboard: the tab list follows the ARIA tabs pattern; graph controls are buttons
  with names and `aria-pressed` / `aria-expanded`.
- `prefers-reduced-motion: reduce`: no transitions; the handshake token parks on
  the highlighted edge.
- Forced colours (Windows High Contrast): node borders and edge strokes must stay
  visible — not yet verified (backlog D6).
- `<html lang>` follows the language toggle.

## 7. Status vocabulary

Use exactly one of: **Live data** / **Demo data** / **Prototype** / **Archived**
(RO: **Date reale** / **Date demonstrative** / **Prototip** / **Arhivat** —
needs human review). This app is **Demo data**: it simulates institutions and
never connects to real systems.

## 8. Conformance checklist

| Rule | Test |
|---|---|
| Tabs follow the ARIA tabs pattern | `tests/e2e/a11y.spec.ts` (tab list bound to its panel) |
| Graph controls have names and states | `tests/e2e/a11y.spec.ts` |
| Axe 0 violations, no CSP violations, every tab | `tests/e2e/a11y.spec.ts` |
| Axe 0 violations at 390 px (list view) | `tests/e2e/mobile-list.spec.ts` |
| Phone opens the list; List/Graph toggle; RO labels | `tests/e2e/mobile-list.spec.ts` |
| Legend starts open; line style encodes audit | `tests/e2e/graph-ux.spec.ts` |
| Target graph readable, no minimap | `tests/e2e/graph-ux.spec.ts` |
| Footer scrolls on a phone | `tests/e2e/graph-ux.spec.ts` |
| Flow detail lists sources and checked date | `tests/e2e/provenance.spec.ts` |
| Missing source is stated | `tests/e2e/provenance.spec.ts` |
| Footer links the corrections log | `tests/e2e/provenance.spec.ts` |
| `<html lang>` follows language; RO governance docs | `tests/e2e/i18n.spec.ts` |
| Reduced motion parks the handshake token | `tests/e2e/handshake-token.spec.ts` |
| Assets under base path, no third-party requests | `tests/e2e/base-path.spec.ts` |
| Unique bilingual nodes, valid flow endpoints | `src/lib/graph.test.ts`, `src/data/flows.test.ts` |
| Ledger empty state | `ledger.empty` message; no test yet |
| Edge colour per cluster (target) | none yet — legend table above is the reference |
| Provenance line under H1 | `src/lib/provenance.test.ts` |
| Family bar | `src/lib/links.test.ts`, `tests/e2e/family-bar.spec.ts` |
| Forced colours | none yet — D6 |

## 9. Known deviations (backlog)

| ID | Deviation | Where |
|---|---|---|
| D1 | Mostly fixed (`tests/e2e/family-bar.spec.ts`, `tests/e2e/names.spec.ts`): hub back link, tool name, H1 and title from the naming registry, purpose line. Still open: civic-ui `FamilyBar` styling and the status badge (owner decision on the classification strip) | `src/App.tsx` header |
| D2 | Fixed (`src/lib/provenance.ts`): no `Date: sursă, an` line under the H1 (as-of only inside the flow panel) | `src/App.tsx`, `DATASET_AS_OF` |
| D3 | Fixed (`src/lib/legend.ts`, `src/lib/legend.test.ts`): legend node swatches come from the node colour table; line styles and target edge colours list their flow IDs, and the target legend has the executive entry | `src/components/FlowExplorer.tsx` `Legend` |
| D4 | Current state uses yellow `#facc15` for both oversight nodes and medium-audit edges; reads as one concept | `src/data/actors.ts`, `src/lib/graph.ts` |
| D5 | Dark-only theme with its own tokens; fleet default is light civic-ui tokens (dark canvases allowed for graphs) | `src/index.css` |
| D6 | No `forced-colors` styles; node borders/edges unverified in High Contrast | `src/index.css` |
| D7 | Fixed (`src/lib/time.ts`, `src/lib/time.test.ts`): ledger and oversight times used `toLocaleTimeString()` without the app language; "entry" is a hard-coded English literal | `src/components/LedgerViewer.tsx`, `src/components/OversightDashboard.tsx` |
| D8 | Fixed (`footer.source`): footer link text "source ↗" was a hard-coded English literal | `src/App.tsx` footer |
| D9 | Fixed (`min-height: 44px`, `tests/e2e/mobile-list.spec.ts`): tab buttons were ~33 px tall (`padding: 8px 12px 10px`, 12.5 px text): above 24 px, below the 44 px preference | `src/index.css` `.nav-btn` |
| D10 | Diagram labels (`diagrams/*.mmd`) stay English in RO mode | `diagrams/` |
| D11 | Fixed (`tests/e2e/empty-filter.spec.ts`): a search/chip filter with no matches says so and offers "Șterge filtrele" | `src/components/FlowExplorer.tsx` |
