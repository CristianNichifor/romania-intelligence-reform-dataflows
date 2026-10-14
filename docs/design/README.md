# Design screens

Target-state mockups for the five screens that matter most, so an implementation
session can build them against `docs/ux-guidelines.md` and the fleet guideline in
civic-ui `docs/ux-guidelines.md`. Everything is static HTML with inline CSS that
copies the Civic UI 0.8 token values (colours, space, type scale, viz palette); no
scripts, no external requests. Each file renders a desktop layout and reflows at
390 px through media queries. Open them from the repo or from a file URL.

Sources live in `_src/` (`tokens.css`, `header.html`, `footer.html`, one body per
screen) and `_src/build.sh` assembles `screens/*.html`. Edit the sources, rebuild.

Romanian copy that is not already in `src/i18n/messages.ts` or `src/data/*` was
written by an agent: **needs human review**. All figures come from the data files
(13 current actors, 14 current flows, 15 target actors, 33 target flows, 6 current
flows with very low or no audit trail; sources checked 2026-10-14). Placeholders are
`—` or `…`.

Screenshots: the brief asked for Playwright captures at 1440 and 390. They were
not taken because the host had no memory headroom for a browser during this run.
The command, once there is room (from the repo root, after `npx playwright install chromium`):

```
for f in docs/design/screens/*.html; do
  n=$(basename "$f" .html)
  npx playwright screenshot --full-page --viewport-size=1440,900 "file://$PWD/$f" "docs/design/screens/$n-1440.png"
  npx playwright screenshot --full-page --viewport-size=390,844  "file://$PWD/$f" "docs/design/screens/$n-390.png"
done
```

"Before" state: the live site at
<https://projects.cristian-nichifor.com/romania-intelligence-reform-dataflows/>
(dark-only theme, no family bar, no provenance line; see D1–D11 in the guideline).

## Index

| # | Screen | User task | Guideline sections | What changes vs today | Spec |
|---|---|---|---|---|---|
| 01 | [Overview](screens/01-overview.html) | Understand in two sentences that this is a simulation and go to Current / Target | app §1, §2, §7; fleet §1, §2, §7 | Family bar with hub link, status badge "Date demonstrative" and RO/EN switch replaces the classification strip as the status carrier; H1 becomes the registry name "Fluxuri de date pentru reforma serviciilor de informații"; a purpose line and a `Date: sursă, an` provenance line sit above the tabs; stat tiles name their scope and source; three primary buttons form the route; a states card shows the staged loading and error+retry pattern for the Governance diagrams. | DS-1 |
| 02 | [Current vs target graph with legend](screens/02-graph.html) | See who sends what to whom, and read the audit trail without colour | app §4, §5; fleet §4, §5 | Light page chrome, dark graph canvas; one segmented control for Actual/Țintă and one for Graf/Listă; chips carry the category glyph; the legend lists node glyphs, the three line styles with their flow IDs and the target edge-colour clusters with their flow IDs (closes D3); "Afișează ca tabel" at every width; empty state with "Șterge filtrele" (closes D11); staged loading; the "Arată tot" hint for the target view. Node colours move to the civic viz palette (D4, D5). | DS-2 |
| 03 | [Mobile list view](screens/03-mobile-list.html) | On a phone, read the flows as a list and filter them | app §6; fleet §6 | Each item shows ID, source → destination, data type, legal basis, audit level with its line-style swatch, risk and sources; left border takes the destination's category colour, never alone; 44 px chips and toggles; empty and error states; count line "5 din 14". | DS-3 |
| 04 | [Flow detail with sources](screens/04-flow-detail.html) | Check one flow: legal basis, audit level, sources | app §3, §4; fleet §3 | Route row with glyphs; sources listed with host and checked date in `<time>`; target flows carry a "propunere" note; the no-verified-source state (C10) is a visible status block linking ERRATA.md; selected edge is thicker, others fade to 40 %. | DS-4 |
| 05 | [Handshake](screens/05-handshake.html) | Follow a warrant through T3–T6 and its audit trail | app §5, §6; fleet §5, §6 | 44 px controls; `progressbar` with values; step list with `aria-current="step"` and done/current/pending in text; map caption names the active hop; token parks on the edge under reduced motion; artifact, ledger entries (status as text badges), empty and error+retry states. | DS-5 |

## Shared rules the mockups follow

- Page anatomy: skip link → family bar → H1 → purpose → provenance → tabs → panel → footer (method, privacy, source, corrections, disclaimer).
- Status vocabulary: one badge, "Date demonstrative" (`warning`), in the family bar.
- Colour is never the only channel: glyphs on nodes, line style on current edges, flow-ID labels on every edge, text badges for status, a list/table for every graph.
- Contrast: body text `#182b2c` on `#f4f6f6` (≈13:1); canvas text `#f0f6f5` on `#142323`; viz slots 3, 4, 5 are only used with visible labels.
- Targets: every button, chip, tab and toggle is at least 44 px tall; footer links at least 24 px.
- Reduced motion and forced colours have rules in `tokens.css`.
- No dual axes, no 3-D; the only animation (token) has a still state.

## Implementation notes and acceptance criteria

Each DS item in `docs/specs/production-readiness.md` names the test file to extend.
Suggested order: DS-1 (family bar + provenance, two i18n keys and one component),
DS-2 (legend data in `src/lib/legend.ts` plus an empty state), DS-4, DS-3, DS-5.
Theme alignment (DS-6, light chrome) is a separate decision; every other item also
works on the current dark theme if the owner keeps it.

Open questions for the owner:
- Keep the classification strip `DEMO // NECLASIFICAT` above the family bar, or let the badge carry it alone? The mockups drop the strip.
- Adopt the civic viz palette for nodes (D4/D5) or keep the current hex table? The mockups use the civic values.
