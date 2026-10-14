# Contributing

Use Node 22. Local setup needs no secrets, 1Password or private handbook:

```sh
npm ci
npx playwright install chromium
npm run verify
```

Verify runs oxlint, Vitest graph/warrant/audit tests, TypeScript and Vite build,
the real browser handshake and governance diagrams, then npm audit at high.
CI exposes aggregate `verify`; the scheduled security audit remains enabled.

## Source and simulation invariants

- Update bilingual actor/flow tables in src/data/ and related docs/ and docs/ro/.
  Keep graph IDs unique and every endpoint in its current/target actor set.
- Warrant requests require a case, a permitted predicate, specific subjects and
  justification. Signatures must include nested fields and preserve array order.
- Audit records include accepted/rejected metadata; appends must retain sequence
  and previous hashes under concurrency. Integrity checks recompute metadata.
- No operational data or live intelligence systems: only fictional fixtures.
  The HMAC demo key is deliberately public, not a production trust boundary.
- Governance renders docs/14–19 and diagrams/*.mmd directly. Keep schemas and
  documents consistent with the simulation; do not edit generated dist/ output.

## Dependency audit repair

Run 36421803823 failed because Mermaid 12's Chevrotain dependencies pin
lodash-es 4.17.23. A compatible npm update alone cannot lift that exact pin.
The narrow lodash-es 4.18.1 override avoids npm audit fix --force's Mermaid
major downgrade. Remove it when upstream allows a patched version. Verify the
four actual Mermaid diagrams in Chromium whenever changing this dependency.
The lockfile also updates DOMPurify within its existing compatible range.

## Review

Target dev with scoped Conventional Commits. Agents never merge PRs or deploy.
Use `wt new chore/my-change origin/dev` under `<repo>/.worktrees/`; without wt,
use a separate clone and a topic branch from origin/dev. State acceptance
criteria, relevant flow IDs/spec sections, positive and rejection cases, and
actual command results in each issue/PR. Publishing is maintainer-operated.
