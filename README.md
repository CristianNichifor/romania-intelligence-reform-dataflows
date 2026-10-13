# RO Intel Reform · Data Flows Demo

Interactive demo of the **current** and **target-state** information data flows between
Romania's intelligence, oversight, judicial and civilian institutions — the technical companion
to the Romanian Intelligence Reform Policy Blueprint.

> Everything in this repo is a simulation. No real data, no real systems.

[Romanian README](README.ro.md) · [Docs in Romanian](docs/ro/) · The app UI itself is bilingual (EN/RO).

## What's inside

| Tab | What it shows |
| --- | --- |
| **Overview** | Design principles and how the demo maps to the spec |
| **Current State** | Interactive graph of the pre-reform flows (C1–C10) with clickable nodes/edges |
| **Target State** | Interactive hub-and-spoke architecture (T1–T18 + warrant tokens) |
| **Handshake T3–T6** | Step-through simulation of a legal cross-agency data request |
| **Red Team** | An unauthorized mass query gets blocked twice and logged |
| **Oversight** | Aggregated metrics + hash-chain integrity of the audit ledger |
| **Audit Ledger** | The live append-only ledger (real SHA-256 hash chain, in-browser) |
| **Compare** | Detailed now-vs-proposal: institution by institution, weaknesses/benefits/risks, EU & world benchmarks |

## Two layers

The repo now covers both halves of the reform blueprint:

1. **Data-flow architecture** (`docs/00`–`docs/07`) — *how information moves*: flows C1–C10 and
   T1–T20, warrant tokens, IADE, audit ledger.
2. **Governance & personnel-integrity architecture** (`docs/14`–`docs/19`, `schemas/*.json`,
   `diagrams/*.mmd`) — *who controls the system*: DCAF-based rules for leadership appointment,
   conflict of interest, cooling-off, civil-society oversight and internal control.

Together they form a complete democratic intelligence reform blueprint: the data-flow layer defines
what the system does; the governance layer defines who may run it, under what constraints, and who
checks them.

## Quick start

```bash
npm ci
npm run dev      # dev server
npm run build    # typecheck + production build
npm run lint     # oxlint
# Full contributor gate: see CONTRIBUTING.md
```

## How it works

- **Graphs** — [React Flow](https://reactflow.dev/) rendered from the flow tables in `src/data/`.
- **Warrant tokens** — the SSC mock issues tokens bound to case ID, predicate, subjects, time
  window and receiving agency. Signatures use HMAC-SHA-256 (Web Crypto) as a stand-in for the
  spec's Ed25519.
- **Audit ledger** — every transaction is appended to a real hash-chained ledger
  (`SHA-256` via Web Crypto). Integrity is verifiable on the Oversight tab.
- **Everything is in-browser** — no backend, no persistence.

## Repo structure

```
romania-intelligence-reform-dataflows/
├── docs/                       # the architecture specification, split into sections
│   ├── 00-design-principles.md
│   ├── 01-actor-map.md
│   ├── 02-current-state-flows.md
│   ├── 03-target-state-flows.md
│   ├── 04-flow-specifications.md
│   ├── 05-data-flow-matrix.md
│   ├── 06-glossary.md
│   └── 07-now-vs-proposal.md
├── docs/ro/                    # the same sections in Romanian
├── schemas/                    # JSON Schemas for the core objects
│   ├── warrant-token.schema.json
│   ├── request-object.schema.json
│   ├── response-package.schema.json
│   ├── audit-ledger-entry.schema.json
│   └── indicator-sharing.schema.json
└── src/
    ├── data/                   # actors + flow tables (C1–C10, T1–T18), bilingual
    ├── i18n/                   # EN/RO dictionaries + language context
    ├── lib/                    # graph builder, warrant logic, crypto, ledger store
    └── components/             # explorer, sims, dashboard, ledger viewer
```

## Design principles (abridged)

1. **No single mass database** — data stays at source; sharing is event-driven.
2. **Purpose limitation** — every flow is bound to a legal predicate + warrant ID.
3. **Case-by-case handshake** — audited, logged request–approval transactions.
4. **Judicial gate** — content flows only through SSC warrant tokens.
5. **Oversight visibility ≠ operational access** — metadata and audit logs, not raw content.
6. **De-militarized civilian agencies** — flows terminate in civilian authority chains.

Full specification: see `docs/`.

## License

MIT — see [LICENSE](LICENSE).
