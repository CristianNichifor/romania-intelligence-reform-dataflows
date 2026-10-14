# RO Intel Reform · Demo fluxuri de date

Demo interactivă a fluxurilor de date informaționale din **starea actuală** și **starea țintă**
între instituțiile de informații, supraveghere, judiciare și civile din România — însoțitorul
tehnic al Planului de reformă a serviciilor de informații din România.

> Totul în acest repo este o simulare. Fără date reale, fără sisteme reale.

[README în engleză](README.md) · [Documentația în română](docs/ro/) · [Documentația în engleză](docs/)

## Ce conține

| Filă | Ce arată |
| --- | --- |
| **Prezentare** | Principiile de proiectare și modul în care demo-ul se mapează pe specificație |
| **Starea actuală** | Graf interactiv al fluxurilor pre-reformă (C1–C10) cu noduri/muchii clicabile |
| **Starea țintă** | Arhitectura interactivă hub-and-spoke (T1–T18 + tokenuri de mandat) |
| **Handshake T3–T6** | Simulare pas cu pas a unei cereri legale de date interinstituționale |
| **Red Team** | O interogare masivă neautorizată este blocată de două ori și înregistrată |
| **Supraveghere** | Metrici agregate + integritatea lanțului hash al registrului de audit |
| **Registru audit** | Registrul append-only live (lanț hash SHA-256 real, în browser) |
| **Comparație** | Acum vs propunere în detaliu: instituție cu instituție, puncte slabe/beneficii/riscuri, repere din UE și din lume |

Aplicația este bilingvă (RO/EN) — comutatorul se află în antetul paginii.

## Pornire rapidă

```bash
npm install
npm run dev      # server de dezvoltare
npm run build    # typecheck + build de producție
npm run lint     # oxlint
```

## Cum funcționează

- **Grafurile** — [React Flow](https://reactflow.dev/) redate din tabelele de fluxuri din `src/data/`.
- **Tokenurile de mandat** — simularea SSC emite tokenuri legate de ID caz, temei, subiecți,
  fereastră de timp și agenție destinatară. Semnăturile folosesc HMAC-SHA-256 (Web Crypto) ca
  substitut pentru Ed25519 din specificație.
- **Registrul de audit** — fiecare tranzacție este adăugată la un registru real înlănțuit prin
  hash-uri (`SHA-256` via Web Crypto). Integritatea este verificabilă în fila Supraveghere.
- **Totul rulează în browser** — fără backend, fără persistență.

## Structura repo-ului

```
romania-intelligence-reform-dataflows/
├── docs/                       # specificația arhitecturii, împărțită pe secțiuni (EN)
│   ├── 00-design-principles.md
│   ├── 01-actor-map.md
│   ├── 02-current-state-flows.md
│   ├── 03-target-state-flows.md
│   ├── 04-flow-specifications.md
│   ├── 05-data-flow-matrix.md
│   ├── 06-glossary.md
│   └── 07-now-vs-proposal.md
├── docs/ro/                    # aceleași secțiuni în limba română
├── schemas/                    # JSON Schema pentru obiectele de bază
│   ├── warrant-token.schema.json
│   ├── request-object.schema.json
│   ├── response-package.schema.json
│   ├── audit-ledger-entry.schema.json
│   └── indicator-sharing.schema.json
└── src/
    ├── data/                   # actori + tabele de fluxuri (C1–C10, T1–T18), bilingv
    ├── i18n/                   # dicționarele RO/EN + contextul de limbă
    ├── lib/                    # construirea grafului, logica mandatelor, cripto, registrul
    └── components/             # explorer, simulări, dashboard, vizualizator registru
```

## Principiile de proiectare (pe scurt)

1. **Fără bază de date masivă unică** — datele rămân la sursă; partajarea este bazată pe evenimente.
2. **Limitarea scopului** — fiecare flux este legat de un temei legal + ID de mandat.
3. **Handshake de la caz la caz** — tranzacții auditate și înregistrate cerere–aprobare.
4. **Poartă judiciară** — conținutul circulă doar prin tokenuri de mandat SSC.
5. **Vizibilitate de supraveghere ≠ acces operațional** — metadate și jurnale de audit, nu conținut brut.
6. **Agenții civile demilitarizate** — fluxurile se termină în lanțuri de autoritate civile.

Specificația completă: vezi `docs/` (EN) și `docs/ro/` (RO).

## Licență

MIT — vezi [LICENSE](LICENSE).
